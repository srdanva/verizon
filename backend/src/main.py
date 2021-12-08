from fastapi import FastAPI, Depends, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
import time
import numpy as np

from .schemas import Region, TransitPair, Alert, AuthDetails
from .auth import AuthHandler
from .area import area

tags_metadata = [
    {
        "name": "login",
        "description": "Simple username and password login, \
                        defaults saved at build time as 'test_user' \
                        and 'secret_password_123'.",
    },
    {
        "name": "register_poi",
        "description": "Registers an area of interest. Each POI is a polygon and needs \
                       a unique name (str) and a list of coordinates (list[list[int, int]])."
    },
    {
        "name": "get_poi",
        "description": "Gets all registered POIs."
    },
    {
        "name": "register_transit",
        "description": "Register a pair of POIs to track, reference them by their unique names."
    },
    {
        "name": "get_transit",
        "description": "Gets all registered transit pairs."
    },
    {
        "name": "register_alert",
        "description": "Register an alert to be notified of if exceeded. alert_type needs to be \
        of [\"volume\", \"dwell\", \"congestion\", \"transit\"]. Level needs to be of int in range 1-3 \
        (1: info, 2: warning, 3: major alert). Secondary_poi is optional and use for transit based alert where 2 POIs \
        specify the transit route."

    },
    {
        "name": "get_alert",
        "description": "Gets all registered alerts."
    },
]

app = FastAPI(openapi_tags=tags_metadata)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_handler = AuthHandler()
users = []

pois = []
transits = []
alerts = []


# Register default user
def register(username, password):
    if any(x['username'] == username for x in users):
        raise HTTPException(status_code=400, detail='Username is taken')
    hashed_password = auth_handler.get_password_hash(password)
    users.append({
        'username': username,
        'password': hashed_password
    })
    return


register("test_user", "secret_password_123")

@app.post("/login", tags=["login"])
def login(auth_details: AuthDetails):
    user = None
    for x in users:
        if x['username'] == auth_details.username:
            user = x
            break

    if (user is None) or (not auth_handler.verify_password(auth_details.password, user['password'])):
        raise HTTPException(status_code=401, detail='Invalid username and/or password')
    token = auth_handler.encode_token(user['username'])
    return {'token': token}


@app.post("/register/poi", tags=["register_poi"])
def register_poi(area: Region, username=Depends(auth_handler.auth_wrapper)):
    for area_x in pois:
        if area.name == area_x.name:
            raise HTTPException(status_code=401, detail='POI area name not unique.')

    for locs in area.points:
        if len(locs) != 2:
            raise HTTPException(status_code=401,
                                detail='At least one location pair has the wrong number \
                                of points (should be 2: [lat, long]).')

    pois.append(area)
    return {"status": "success"}


@app.get("/get/poi", tags=["get_poi"])
def get_poi(username=Depends(auth_handler.auth_wrapper)):
    return json.dumps(pois)


@app.post("/register/transit", tags=["register_transit"])
def register_transit(pair: TransitPair, username=Depends(auth_handler.auth_wrapper)):
    if (pair.A not in [p.name for p in pois]) or (pair.B not in [p.name for p in pois]):
        raise HTTPException(status_code=401, detail='One or more of the transit names not known POI.')

    pois.append(pair)
    return {"status": "success"}


@app.get("/get/transit", tags=["get_transit"])
def get_transit(username=Depends(auth_handler.auth_wrapper)):
    return json.dumps(transits)


@app.post("/register/alert", tags=["register_alert"])
def register_alert(alert: Alert, username=Depends(auth_handler.auth_wrapper)):
    for alert_x in alerts:
        if alert_x.name == alert.name:
            raise HTTPException(status_code=401, detail='Alert with that name already taken.')

    alerts.append(alert)
    return {"status": "success"}


@app.get("/get/alert", tags=["get_alert"])
def get_alert(username=Depends(auth_handler.auth_wrapper)):
    return json.dumps(alerts)


def random_snapshot():
    data = {}

    data["poi"] = {}
    for poi in pois:
        geo = {'type':'Polygon','coordinates':poi.points}
        data["poi"][poi.name] = {}
        data["poi"][poi.name]["volume"] = area(geo)*np.abs(np.random.randn() + 1)
        data["poi"][poi.name]["dwell"] = np.abs(np.random.randn() + 1)*5

    data["transit"] = {}
    get_center = lambda x: np.array(x).mean(0)
    for trans in transits:
        for poi in pois:
            if poi.name == trans.A:
                a = poi.points
            if poi.name == trans.B:
                b = poi.points

        a = get_center(a)
        b = get_center(b)

        data["transit"][trans.A] = {}
        data["transit"][trans.A][trans.B] = {}
        data["transit"][trans.A][trans.B]["transit"] = np.sum(np.abs(a - b))*np.abs(np.random.randn() + 5)
        data["transit"][trans.A][trans.B]["congestion"] = (np.random.uniform()**4)*data["poi"][trans.A]["volume"]

    return data


def needs_alert(alert: Alert, data):
    if alert.alert_type in ["volume", "dwell"]:
        poi_data = data["poi"][alert.primary_poi]
        if (alert.alert_type == "volume") and (poi_data["volume"] > alert.limit):
            return True
        elif (alert.alert_type == "dwell") and (poi_data["dwell"] > alert.limit):
            return True
    elif alert.alert_type in ["congestion", "transit"]:
        transit_data = data["transit"][alert.primary_poi][alert.secondary_poi]
        if (alert.alert_type == "congestion") and (transit_data["congestion"] > alert.limit):
            return True
        elif (alert.alert_type == "transit") and (transit_data["transit"] > alert.limit):
            return True

    return False


def response_data():
    # json parsed data for websocket output
    ret = random_snapshot()

    ret["alerts"]
    for a in alerts:
        if needs_alert(a, ret):
            ret["alerts"][a.name] = {
                "alert_type": a.alert_type,
                "comment": a.break_comment,
                "level_of_importance": a.level,
                "limit_exceeded": a.limit
            }

    return json.dumps(ret)

@app.websocket("/live")
async def live(websocket: WebSocket ):
    await websocket.accept()
    while True:
        time.sleep(0.02)
        await websocket.send_text(response_data())

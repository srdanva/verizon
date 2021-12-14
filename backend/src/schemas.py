from pydantic import BaseModel , validator
from typing import List


class AuthDetails(BaseModel):
    username: str
    password: str


class Alert(BaseModel):
    alert_type: str
    name: str
    primary_poi: str
    secondary_poi: str = None
    break_comment: str
    level: int  # 1-3: info, warning, major alert
    limit: int

    @validator('alert_type')
    def valid_alert_type(cls, v):
        if v not in ["volume", "dwell", "congestion", "transit"]:
            raise ValueError(f'{v} not a valid alert type.')
        return v

    @validator('level')
    def valid_level(cls, v):
        if v < 1 or v > 3:
            raise ValueError(f'{v} not a level (1: info, 2: warning, 3: major alert).')
        return v


class TransitPair(BaseModel):
    A: str
    B: str

    def asDict(self):
        return { 'A': self.A, 'B': self.B }


class Region(BaseModel):
    name: str
    points: List[List[float]]

    @validator('points')
    def at_least_a_triangle(cls, v):
        if len(v) < 3:
            raise ValueError('Region must contain at least 3 points.')
        return v

    def asDict(self):
        return { 'name': self.name, 'points': self.points }

/* eslint-disable */
import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { Box, Typography, Button, Popover } from '@mui/material';
import ReactMapGL, { Source, Layer, Popup } from 'react-map-gl';
import { makeStyles } from '@mui/styles';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw';
import poiJson from './poi.geojson';
import heatmapJson from './heatmap.geojson';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import { getFeatureStyle, getEditHandleStyle, heatmapLayer } from './style';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '390px',
  },
  button: {
    marginTop: theme.spacing(1) + '!important',
  },
}));

const poiStyle = {
  id: 'poi',
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-radius': 5,
    'circle-color': '#EB5757',
    'circle-opacity': 1,
  },
};
const poiBorderStyle = {
  id: 'poiBorder',
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-radius': 10,
    'circle-color': '#fff',
    'circle-opacity': 0.7,
  },
};

const poiClusterStyle = {
  id: 'poiCluster',
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-radius': 14,
    'circle-color': '#fff',
    'circle-opacity': 1,
  },
};

const poiBorderClusterStyle = {
  id: 'poiBorderCluster',
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-radius': 20,
    'circle-color': '#fff',
    'circle-opacity': 0.7,
  },
};

const clusterText = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 14,
  },
  paint: {
    'text-color': '#EB5757',
  },
};

const MapBox = function ({ isSettingPoi, setNewPoiPolygon }) {
  const classes = useStyles();
  const mapRef = useRef();
  const [poiData, setPoiData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [viewport, setViewport] = React.useState({
    longitude: -74.0922,
    latitude: 40.6769,
    zoom: 9,
  });
  const [mode, setMode] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [hoverPopupInfo, setHoverPopupInfo] = useState(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
  const editorRef = useRef(null);

  const onSelect = useCallback((options) => {
    setSelectedFeatureIndex(options && options.selectedFeatureIndex);
  }, []);

  const onDelete = useCallback(() => {
    if (selectedFeatureIndex !== null && selectedFeatureIndex >= 0) {
      editorRef.current.deleteFeatures(selectedFeatureIndex);
      setNewPoiPolygon(null);
    }
  }, [selectedFeatureIndex]);

  const onUpdate = useCallback(({ editType, data }) => {
    if (editType === 'addFeature') {
      setMode(new EditingMode());
      if (data.length > 1) {
        editorRef.current.deleteFeatures(0);
        setNewPoiPolygon(data[1]);
      } else {
        setNewPoiPolygon(data[0]);
      }
    }
  }, []);

  const onHover = useCallback(({ features }) => {
    if(features && features[0]){
      const { layer, geometry } = features[0];
      if(layer.id === 'poi' || layer.id === 'poiBorder'){
        setHoverPopupInfo({
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        });
      } else {
        setHoverPopupInfo(null);
      }
    } else {
      setHoverPopupInfo(null);
    }
  },[]);

  const onMapClick = useCallback(({ features }) => {
    if(features && features[0]){
      const { layer, geometry } = features[0];
      if(layer.id === 'poi' || layer.id === 'poiBorder'){
        setPopupInfo({
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        });
      }
    }
  },[]);

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal;

    fetch(poiJson, { signal: signal }).then((response) => response.json()).then((data) => {
      setPoiData(data);
    });
    fetch(heatmapJson, { signal: signal }).then((response) => response.json()).then((data) => {
      setHeatmapData(data);
    });

    return () => {
      controller.abort();
    };
  }, []);

  const drawTools = (
    <div className="mapboxgl-ctrl-top-right">
      <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
        <button
          className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
          title="Polygon tool (p)"
          onClick={() => setMode(new DrawPolygonMode())}
        />
        <button
          className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
          title="Delete"
          onClick={onDelete}
        />
      </div>
    </div>
  );

  return (
    <Box className={classes.root}>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxApiAccessToken="pk.eyJ1Ijoib2JsaXZpb3VzLW1hcHMiLCJhIjoiY2t3b3Y1aW14MDZxcDJ2cDY4cWhpbnIzMCJ9.iiLQpVrQhCO2CXQGveaCeA"
        width="100%"
        height="100%"
        onViewportChange={setViewport}
        onClick={onMapClick}
        onHover={onHover}
      >
        {isSettingPoi &&
          <Editor
            ref={editorRef}
            style={{ width: '100%', height: '100%' }}
            clickRadius={12}
            mode={mode}
            onSelect={onSelect}
            onUpdate={onUpdate}
            editHandleShape="circle"
            featureStyle={getFeatureStyle}
            editHandleStyle={getEditHandleStyle}
          />
        }
        {isSettingPoi && drawTools}
        <Source
          id="poi-data"
          type="geojson"
          data={poiData}
          cluster
          clusterMaxZoom={14}
          clusterRadius={20}
        >
          <Layer {...poiBorderStyle} />
          <Layer {...poiStyle} />
          <Layer {...poiBorderClusterStyle} />
          <Layer {...poiClusterStyle} />
          <Layer {...clusterText} />
        </Source>
        <Source type="geojson" data={heatmapData}>
          <Layer beforeId="poiBorder" {...heatmapLayer} />
        </Source>
        {popupInfo && (
          <Popup
            tipSize={10}
            anchor="bottom"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
          >
            <Box sx={{ width: '140px' }}>
              {[1,2,3,4].map((index) => {
                return (
                  <PopupState key={index} variant="popover" popupId="demo-popup-popover">
                    {(popupState) => {
                      return (
                        <>
                          <Button
                            {...bindTrigger(popupState)}
                            className={classes.button}
                            fullWidth
                            size="small"
                            variant="contained"
                            color={popupState.isOpen ? "selected" : "unselected"}
                            endIcon={popupState.isOpen ? <ArrowBackIcon/> : <ArrowForwardIcon/>}
                          >
                            {index} Floor
                          </Button>
                          <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: 'center',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'center',
                              horizontal: 'left',
                            }}
                          >
                            <Box sx={{ p: 2 }}>
                              <Typography variant="body1">Client: John B.</Typography>
                              <Typography variant="body2" color="caption">Activities: was online 3hrs. ago</Typography>
                            </Box>
                          </Popover>
                        </>
                      );
                    }}
                  </PopupState>
                );
              })}
            </Box>
          </Popup>
        )}
        {!popupInfo && hoverPopupInfo && (
          <Popup
            tipSize={10}
            anchor="bottom"
            longitude={hoverPopupInfo.longitude}
            latitude={hoverPopupInfo.latitude}
            closeOnClick={false}
            onClose={() => setHoverPopupInfo(null)}
          >
            <Box sx={{ maxWidth: '250px' }}>
              <Typography variant="body1">
                Unscheduled movement Vm
              </Typography>
              <Typography color="caption" variant="caption">
                Street, New York, 34752
              </Typography>
            </Box>
          </Popup>
        )}
      </ReactMapGL>
    </Box>
  );
};

export default MapBox;

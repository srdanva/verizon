/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useRef, useState, useCallback,
} from 'react';
import {
  Box, Typography, Button, Popover,
} from '@mui/material';
import ReactMapGL, { Source, Layer, Popup } from 'react-map-gl';
import { makeStyles } from '@mui/styles';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import * as turf from '@turf/turf';

import {
  getFeatureStyle,
  getEditHandleStyle,
  poiPolyStyle,
  poiPolyBorderStyle,
  poiPolySelectedStyle,
  poiPolyBorderSelectedStyle,
} from './style';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '390px',
  },
  button: {
    marginTop: `${theme.spacing(1)}!important`,
  },
}));

const MapBox = function ({
  isSettingPoi, setNewPoiPolygon, poiData, selectedPOIs, setSelectedPOIs, isSettingTransit,
}) {
  const classes = useStyles();
  const mapRef = useRef();
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

  const onHover = useCallback((e) => {
    // console.log(e);
    const { features, lngLat } = e;
    if (features && features[0]) {
      const { layer, properties } = features[0];
      if (layer.id === 'poiPoly') {
        setHoverPopupInfo({
          longitude: lngLat[0],
          latitude: lngLat[1],
          title: properties.name,
        });
      } else {
        setHoverPopupInfo(null);
      }
    } else {
      setHoverPopupInfo(null);
    }
  }, []);

  const onMapClick = useCallback(({ features, lngLat }) => {
    if (features && features[0]) {
      const feature = features[0];
      const { layer } = feature;
      if (layer.id === 'poiPoly' || layer.id === 'poiPolySelected') {
        if (!isSettingTransit) {
          setPopupInfo({
            longitude: lngLat[0],
            latitude: lngLat[1],
          });
        } else if (selectedPOIs.length <= 2) {
          const isAlreadyAdded = !!selectedPOIs
            .find((poi) => poi.properties.name === feature.properties.name);
          if (isAlreadyAdded) {
            setSelectedPOIs(
              selectedPOIs.filter((poi) => poi.properties.name !== feature.properties.name),
            );
          } else {
            setSelectedPOIs([
              ...selectedPOIs,
              feature,
            ]);
          }
        }
      }
    }
  }, [isSettingTransit, selectedPOIs]);

  const drawTools = (
    <div className="mapboxgl-ctrl-top-right">
      <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
        <button
          type="button"
          className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
          title="Polygon tool (p)"
          onClick={() => setMode(new DrawPolygonMode())}
        />
        <button
          type="button"
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
        {isSettingPoi
          && (
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
          )}
        {isSettingPoi && drawTools}

        <Source
          id="poi-poly-data"
          type="geojson"
          data={poiData}
        >
          <Layer {...poiPolyBorderStyle} />
          <Layer {...poiPolyStyle} />
        </Source>

        <Source
          id="poi-poly-selected-data"
          type="geojson"
          data={turf.featureCollection(selectedPOIs)}
        >
          <Layer {...poiPolyBorderSelectedStyle} />
          <Layer {...poiPolySelectedStyle} />
        </Source>

        {/* <Source
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
        </Source> */}
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
              {[1, 2, 3, 4].map((index) => (
                <PopupState key={index} variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <>
                      <Button
                        {...bindTrigger(popupState)}
                        className={classes.button}
                        fullWidth
                        size="small"
                        variant="contained"
                        color={popupState.isOpen ? 'selected' : 'unselected'}
                        endIcon={popupState.isOpen ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                      >
                        {index}
                        {' '}
                        Floor
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
                  )}
                </PopupState>
              ))}
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
                {hoverPopupInfo.title}
              </Typography>
            </Box>
          </Popup>
        )}
      </ReactMapGL>
    </Box>
  );
};

export default MapBox;

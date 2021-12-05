import React from 'react';
import { Box } from '@mui/material';
import ReactMapGL from 'react-map-gl';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '390px',
  },
}));

const MapBox = function () {
  const classes = useStyles();
  const [viewport, setViewport] = React.useState({
    longitude: -122.45,
    latitude: 37.78,
    zoom: 14,
  });

  return (
    <Box className={classes.root}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1Ijoib2JsaXZpb3VzLW1hcHMiLCJhIjoiY2t3b3Y1aW14MDZxcDJ2cDY4cWhpbnIzMCJ9.iiLQpVrQhCO2CXQGveaCeA"
        width="100%"
        height="100%"
        onViewportChange={setViewport}
      />
    </Box>
  );
};

export default MapBox;

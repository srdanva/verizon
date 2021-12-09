import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import Header from 'components/Header';
import MapBox from 'components/MapBox';
import ChartBox from 'components/ChartBox';
import Sidebar from 'components/Sidebar';
import { registerPoi, getPois } from 'api';
import * as turf from '@turf/turf';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'inline-flex',
    width: '100%',
  },
  page: {
    marginTop: theme.spacing(4),
  },
  spacing2: {
    marginTop: `${theme.spacing(2)}!important`,
  },
  spacing4: {
    marginTop: `${theme.spacing(4)}!important`,
  },
  textField: {
    '& .MuiInputBase-root': {
      borderRadius: '0',
    },
    '& input': {
      height: '1.2em',
    },
  },
}));

const Dashboard = function () {
  const classes = useStyles();
  const [isSettingPoi, setIsSettingPoi] = useState(false);
  const [newPoiPolygon, setNewPoiPolygon] = useState(null);
  const [poiName, setPoiName] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [poisData, setPoisData] = useState([]);
  const authToken = useSelector((state) => state.auth.authToken);

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertMessage(null);
  };

  const fetchPoi = () => {
    getPois(authToken).then(({ promise, status }) => {
      if (status === 200) {
        promise.then((data) => {
          setPoisData(data);
        });
      } else {
        promise.then(({ detail }) => {
          setAlertMessage(detail);
        });
      }
    }).catch(() => {
      setAlertMessage('Error when getting POIs.');
    });
  };

  const onPoiSave = () => {
    registerPoi({
      name: poiName,
      points: newPoiPolygon.geometry.coordinates[0],
    }, authToken).then(({ promise, status }) => {
      if (status === 200) {
        setPoiName('');
        setIsSettingPoi(false);
        setNewPoiPolygon(null);
        fetchPoi();
      } else {
        promise.then(({ detail }) => {
          setAlertMessage(detail);
        });
      }
    }).catch(() => {
      setAlertMessage('Query error.');
    });
  };

  const onPoiCancel = () => {
    setIsSettingPoi(false);
    setNewPoiPolygon(null);
  };

  useEffect(() => {
    if (authToken) {
      fetchPoi();
    }
  }, [authToken]);

  return (
    <Box>
      <Header />
      <Container maxWidth="xl" className={classes.page}>
        <Grid container spacing={4}>
          <Grid item xs={9}>
            <Grid container>
              <Grid item className={classes.content}>
                <Typography variant="h6">Heat Map</Typography>
                <Box sx={{ p: 0, marginLeft: 'auto' }}>
                  <Grid container spacing={2}>
                    {!isSettingPoi && (
                      <>
                        <Grid item>
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={() => setIsSettingPoi(true)}
                          >
                            New Poi
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button type="button" variant="outlined">New Tracker</Button>
                        </Grid>
                      </>
                    )}
                    {isSettingPoi && (
                      <>
                        <Grid item>
                          <TextField
                            className={classes.textField}
                            size="small"
                            label="Name"
                            variant="outlined"
                            value={poiName}
                            onChange={(e) => setPoiName(e.target.value)}
                          />
                        </Grid>
                        <Grid item>
                          <Button
                            type="button"
                            variant="contained"
                            color="success"
                            disabled={!newPoiPolygon || poiName.length < 4}
                            onClick={onPoiSave}
                          >
                            Save
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={onPoiCancel}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              </Grid>
              <Grid item className={`${classes.content} ${classes.spacing2}`}>
                <MapBox
                  poiData={turf.featureCollection(poisData.map((poi) => (turf.feature({
                    type: 'Polygon',
                    coordinates: [poi.points],
                  }, { name: poi.name }))))}
                  isSettingPoi={isSettingPoi}
                  setNewPoiPolygon={setNewPoiPolygon}
                />
              </Grid>
              <Grid item className={`${classes.content} ${classes.spacing4}`}>
                <Grid container spacing={4}>
                  <ChartBox title="Volume" />
                  <ChartBox title="Transit Time" />
                  <ChartBox title="Dwell time" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ height: '100%' }}>
              <Sidebar />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;

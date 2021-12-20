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
  Alert, FormControl, InputLabel, Select, MenuItem, Modal,
} from '@mui/material';
import Header from 'components/Header';
import MapBox from 'components/MapBox';
import ChartBox from 'components/ChartBox';
import Sidebar from 'components/Sidebar';
import {
  registerPoi, getPois, registerTransit, liveSocket, registerAlert,
} from 'api';
import * as turf from '@turf/turf';
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setPOIs } from 'redux/actions/api';

const alertTypes = [
  'volume',
  'dwell',
  'congestion',
  'transit',
];

const alertLevels = [
  { id: 1, name: '(1) info' },
  { id: 2, name: '(2) warning' },
  { id: 3, name: '(3) major alert' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

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
  const [selectedPOIs, setSelectedPOIs] = useState([]);
  const [isSettingTransit, setIsSettingTransit] = useState(false);
  const [newPoiPolygon, setNewPoiPolygon] = useState(null);
  const [poiName, setPoiName] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const dispatch = useDispatch();
  const poisData = useSelector((state) => state.api.pois);
  const authToken = useSelector((state) => state.auth.authToken);

  const [showAddAlert, setShowAddAlert] = useState(false);
  const initialFormData = {
    alert_type: '',
    name: '',
    primary_poi: '',
    secondary_poi: '',
    break_comment: '',
    level: '',
    limit: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleOpen = () => setShowAddAlert(true);
  const handleClose = () => setShowAddAlert(false);

  const onChangeFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  // const isString = (value) => typeof value === 'string' || value instanceof String;

  const addAlertClick = () => {
    let isValid = true;
    let validator;
    const reg = /^\d+$/;
    const formKeys = Object.keys(formData);
    const formValues = Object.values(formData);
    for (let i = 0; i < formValues.length; i += 1) {
      const isValueValid = formValues[i]
        && (reg.test(formValues[i]) ? true : String(formValues[i]).length > 0);
      validator = {
        ...validator,
        [formKeys[i]]: isValueValid,
      };
      if (!isValueValid) {
        isValid = false;
      }
    }

    if (isValid) {
      registerAlert(formData, authToken).then(({ promise, status }) => {
        if (status === 200) {
          promise.then(() => {
            setShowAddAlert(false);
            setSuccessMessage('Alert is added!');
            setFormData(initialFormData);
          });
        } else {
          promise.then(({ detail }) => {
            setAlertMessage(detail);
          });
        }
      }).catch(() => {
        setAlertMessage('Error when creating Alert.');
      });
    }
  };

  useEffect(() => {
    const socket = liveSocket();

    socket.onopen = function () {
      console.log('Соединение установлено.');
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
      console.log(`Код: ${event.code} причина: ${event.reason}`);
    };

    socket.onmessage = function (event) {
      console.log(`Получены данные ${event.data}`);
    };

    socket.onerror = function (error) {
      console.log(`Ошибка ${error.message}`);
    };
  }, []);

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertMessage(null);
  };

  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage(null);
  };

  const fetchPoi = () => {
    getPois(authToken).then(({ promise, status }) => {
      if (status === 200) {
        promise.then((data) => {
          dispatch(setPOIs(data));
        });
      } else {
        promise.then(({ detail }) => {
          setAlertMessage(detail);
        });
      }
    }).catch(() => {
      setAlertMessage('Error when getting Regions.');
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

  const onTransitSave = () => {
    registerTransit({
      A: selectedPOIs[0].properties.name,
      B: selectedPOIs[1].properties.name,
    }, authToken).then(({ promise, status }) => {
      if (status === 200) {
        setIsSettingTransit(false);
        setSelectedPOIs([]);
        setSuccessMessage('Transit is saved.');
      } else {
        promise.then(({ detail }) => {
          setAlertMessage(detail);
        });
      }
    }).catch(() => {
      setAlertMessage('Query error.');
    });
  };

  const onTransitCancel = () => {
    setIsSettingTransit(false);
    setSelectedPOIs([]);
  };

  useEffect(() => {
    if (authToken) {
      fetchPoi();
    }
  }, [authToken]);

  useEffect(() => {
    if (isSettingPoi) {
      setIsSettingTransit(false);
    }
    if (isSettingTransit) {
      setIsSettingPoi(false);
    }
  }, [isSettingTransit, isSettingPoi]);

  return (
    <Box>
      <Modal
        open={showAddAlert}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add New Alert
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="alert-select-label">Alert Type</InputLabel>
                <Select
                  labelId="alert-select-label"
                  id="alert-select"
                  value={formData.alert_type}
                  label="Alert Type"
                  onChange={(e) => onChangeFormData('alert_type', e.target.value)}
                >
                  {alertTypes.map((a) => (
                    <MenuItem value={a}>{a}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="alert-name"
                label="Name"
                variant="outlined"
                value={formData.name}
                onChange={(e) => onChangeFormData('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="alert-select-primary">Primary Region</InputLabel>
                <Select
                  labelId="alert-select-primary"
                  id="alert-primary"
                  value={formData.primary_poi}
                  label="Primary Region"
                  onChange={(e) => onChangeFormData('primary_poi', e.target.value)}
                >
                  {poisData.map(({ name }) => (
                    <MenuItem value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="alert-select-secondary">Secondary Region</InputLabel>
                <Select
                  labelId="alert-select-secondary"
                  id="alert-secondary"
                  value={formData.secondary_poi}
                  label="Secondary Region"
                  onChange={(e) => onChangeFormData('secondary_poi', e.target.value)}
                >
                  {poisData.map(({ name }) => (
                    <MenuItem value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="alert-comment"
                label="Comment"
                variant="outlined"
                value={formData.break_comment}
                onChange={(e) => onChangeFormData('break_comment', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="alert-select-label">Alert Type</InputLabel>
                <Select
                  labelId="alert-select-label"
                  id="alert-select"
                  value={formData.level}
                  label="Alert Type"
                  onChange={(e) => onChangeFormData('level', e.target.value)}
                >
                  {alertLevels.map(({ id, name }) => (
                    <MenuItem value={id}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="alert-limit"
                label="Limit"
                variant="outlined"
                type="number"
                value={formData.limit}
                onChange={(e) => onChangeFormData('limit', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={addAlertClick}
              >
                Add Alert
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Header />
      <Container maxWidth="xl" className={classes.page}>
        <Grid container spacing={4}>
          <Grid item xs={9}>
            <Grid container>
              <Grid item className={classes.content}>
                <Typography variant="h6">Heat Map</Typography>
                <Box sx={{ p: 0, marginLeft: 'auto' }}>
                  <Grid container spacing={2}>
                    {!isSettingPoi && !isSettingTransit && (
                      <>
                        <Grid item>
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={() => setIsSettingPoi(true)}
                          >
                            New Region
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={() => setIsSettingTransit(true)}
                          >
                            New Transit
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={() => handleOpen(true)}
                          >
                            New Alert
                          </Button>
                        </Grid>
                      </>
                    )}
                    {isSettingPoi && !isSettingTransit && (
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
                    {!isSettingPoi && isSettingTransit && (
                      <>
                        <Grid item>
                          <Typography variant="body1">
                            Select POIs:
                            {' '}
                            {selectedPOIs.length}
                            /2
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            type="button"
                            variant="contained"
                            color="success"
                            disabled={selectedPOIs.length !== 2}
                            onClick={onTransitSave}
                          >
                            Save
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={onTransitCancel}
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
                  isSettingTransit={isSettingTransit}
                  isSettingPoi={isSettingPoi}
                  setNewPoiPolygon={setNewPoiPolygon}
                  selectedPOIs={selectedPOIs}
                  setSelectedPOIs={setSelectedPOIs}
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
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;

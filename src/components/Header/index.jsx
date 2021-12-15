import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Container,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  Grid,
  Modal,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  TextField,
  Button,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { makeStyles } from '@mui/styles';
import routerPaths from 'routerPaths';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { registerAlert } from 'api';

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

const useStyles = makeStyles(() => ({
  logo: {
    fontFamily: "'Poppins', sans-serif!important",
    fontWeight: '800!important',
  },
}));

const Header = function () {
  const classes = useStyles();
  const history = useHistory();
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [formData, setFormData] = useState({
    alert_type: '',
    name: '',
    primary_poi: '',
    secondary_poi: '',
    break_comment: '',
    level: '',
    limit: '',
  });
  const poisData = useSelector((state) => state.api.pois);
  const authToken = useSelector((state) => state.auth.authToken);

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
          promise.then((data) => {
            console.log(data);
          });
        } else {
          promise.then(({ detail }) => {
            console.log(detail);
          });
        }
      }).catch(() => {
        console.log('Error when getting POIs.');
      });
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{ p: '0!important' }}>
          <Grid container spacing={4}>
            <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                className={classes.logo}
                sx={{ mr: 2, display: { xs: 'flex' } }}
              >
                verizon.
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ p: 0 }}>
                <IconButton
                  onClick={handleOpen}
                >
                  <NotificationsNoneIcon sx={{ color: '#fff' }} />
                </IconButton>
                <IconButton onClick={() => history.push(routerPaths.auth.getUrl())}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
                <Box sx={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px' }}>
                  <Typography variant="body1">Pavel Donin</Typography>
                  <Typography variant="caption">ID: 5943</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
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
                <InputLabel id="alert-select-primary">Primary POI</InputLabel>
                <Select
                  labelId="alert-select-primary"
                  id="alert-primary"
                  value={formData.primary_poi}
                  label="Primary POI"
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
                <InputLabel id="alert-select-secondary">Secondary POI</InputLabel>
                <Select
                  labelId="alert-select-secondary"
                  id="alert-secondary"
                  value={formData.secondary_poi}
                  label="Secondary POI"
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
    </AppBar>
  );
};
export default Header;

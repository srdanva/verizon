/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {
  Typography,
  TextField,
  Grid,
  FilledInput,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
  Button,
  Alert,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login } from 'api';
import Cookies from 'js-cookie';
import routerPaths from 'routerPaths';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAuthToken } from 'redux/actions/auth';

const AuthForm = function ({ setResetPassword }) {
  const history = useHistory();
  const [values, setValues] = useState({
    username: '',
    password: '',
    showPassword: false,
  });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const doLogin = () => {
    login({ username: values.username, password: values.password }).then(({ promise, status }) => {
      if (status !== 200) {
        promise.then((json) => {
          setError(json.detail);
        });
      } else {
        promise.then((json) => {
          Cookies.set('access_token', json.token, { expires: 1 });
          dispatch(getAuthToken({ authToken: json.token }));
          history.push(routerPaths.dashboard.getUrl());
        });
      }
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">Login to your account</Typography>
        <Typography variant="body2" sx={{ color: '#7E7E7E' }}>
          Please, enter your information and login to system
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Login"
          variant="filled"
          fullWidth
          value={values.username}
          onChange={handleChange('username')}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="filled" fullWidth>
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <FilledInput
            id="standard-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )}
          />
        </FormControl>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <FormControlLabel
          control={<Checkbox defaultChecked={false} />}
          label={<Typography variant="body2">Remember password</Typography>}
        />
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link onClick={() => setResetPassword(true)}><Typography variant="body2">Forgot password?</Typography></Link>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      <Grid item xs={12}>
        <Button
          type="button"
          fullWidth
          variant="contained"
          size="large"
          disabled={!(values.username.length > 3 && values.password.length > 5)}
          onClick={doLogin}
        >
          Login
        </Button>
      </Grid>
    </Grid>
  );
};

export default AuthForm;

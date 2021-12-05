import React from 'react';
import {
  Typography,
  Grid,
  FilledInput,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthForm = function ({ setResetPassword }) {
  const [values, setValues] = React.useState({
    password: '',
    confirmPassword: '',
    showPassword: false,
  });

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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">New password</Typography>
        <Typography variant="body2" sx={{ color: '#7E7E7E' }}>
          Please, enter the new password
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="filled" fullWidth>
          <InputLabel htmlFor="standard-adornment-password">New Password</InputLabel>
          <FilledInput
            id="standard-adornment-new-password"
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
      <Grid item xs={12}>
        <FormControl variant="filled" fullWidth>
          <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
          <FilledInput
            id="standard-adornment-confirm-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
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
      <Grid item xs={12}>
        <Button
          type="button"
          fullWidth
          variant="contained"
          size="large"
        >
          Reset password
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          type="button"
          fullWidth
          size="large"
          onClick={() => setResetPassword(false)}
        >
          Back to login
        </Button>
      </Grid>
    </Grid>
  );
};

export default AuthForm;

import React from 'react';
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
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthForm = function ({ setResetPassword }) {
  const [values, setValues] = React.useState({
    password: '',
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
        <Typography variant="h5">Login to your account</Typography>
        <Typography variant="body2" sx={{ color: '#7E7E7E' }}>
          Please, enter your information and login to system
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField label="Login" variant="filled" fullWidth />
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
      <Grid item xs={12}>
        <Button
          type="button"
          fullWidth
          variant="contained"
          size="large"
        >
          Login
        </Button>
      </Grid>
    </Grid>
  );
};

export default AuthForm;

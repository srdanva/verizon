import React from 'react';
import {
  Typography,
  Grid,
  Button,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { getAuthToken } from 'redux/actions/auth';

const Profile = function () {
  const dispatch = useDispatch();
  const doLogout = () => {
    Cookies.remove('access_token');
    dispatch(getAuthToken({ authToken: null }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">Logged in</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          type="button"
          fullWidth
          variant="contained"
          size="large"
          onClick={doLogout}
        >
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};

export default Profile;

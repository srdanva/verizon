import React from 'react';
import {
  Typography,
  TextField,
  Grid,
  Button,
} from '@mui/material';

const ResetPasswordForm = function ({ setResetPassword }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">Forgot password</Typography>
        <Typography variant="body2" sx={{ color: '#7E7E7E' }}>
          To reset the password please enter the email
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField label="Email" variant="filled" fullWidth />
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

export default ResetPasswordForm;

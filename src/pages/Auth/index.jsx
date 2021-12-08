import React, { useState } from 'react';
import {
  Box,
  Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import AuthForm from 'components/AuthForm';
import Profile from 'components/Profile';
import ResetPasswordForm from 'components/ResetPasswordForm';
import NewPasswordForm from 'components/NewPasswordForm';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    maxWidth: '400px',
    padding: theme.spacing(4),
    textAlign: 'center',
  },
}));

const Auth = function () {
  const classes = useStyles();
  const QueryString = window.location.search;
  const urlParams = new URLSearchParams(QueryString);
  const resetCode = urlParams.get('reset');
  const [resetPassword, setResetPassword] = useState(!!resetCode);
  const authToken = useSelector((state) => state.auth.authToken);

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        {!resetPassword && !authToken && (
          <AuthForm
            setResetPassword={setResetPassword}
          />
        )}
        {authToken && (
          <Profile />
        )}
        {resetPassword && !resetCode && <ResetPasswordForm setResetPassword={setResetPassword} />}
        {resetPassword && resetCode && <NewPasswordForm setResetPassword={setResetPassword} />}
      </Paper>
    </Box>
  );
};

export default Auth;

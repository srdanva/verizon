/* eslint-disable */
import React, { useEffect, useState } from 'react';
import './App.css';
import { Box } from '@mui/material';
import {
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Cookies from 'js-cookie';
import routerPaths from './routerPaths';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
}));

const App = function () {
  const classes = useStyles();
  const authToken = useSelector((state) => state.auth.authToken);

  if (!authToken) {
    return <Auth />;
  }

  return (
    <Box component="main" className={classes.root}>
      <Switch>
        <Route exact path={routerPaths.auth.path}>
          <Auth />
        </Route>
        <Route exact path={routerPaths.dashboard.path}>
          <Dashboard />
        </Route>
      </Switch>
    </Box>
  );
};

export default App;

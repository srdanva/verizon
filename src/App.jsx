import React from 'react';
import './App.css';
import { Box } from '@mui/material';
import {
  Switch,
  Route,
} from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import routerPaths from './routerPaths';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
}));

const App = function () {
  const classes = useStyles();

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

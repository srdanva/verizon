import React from 'react';
import './App.css';
import { Box } from '@mui/material';
import {
  Switch,
  Route,
} from 'react-router-dom';
import routerPaths from './routerPaths';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

const App = function () {
  return (
    <Box component="main">
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

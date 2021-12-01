import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from './App';
import history from './history';

const theme = createTheme();

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

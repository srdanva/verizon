import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import App from './App';
import history from './history';

const defaultStyles = {
  '*': {
    fontFamily: 'Strawford',
  },
  body: { backgroundColor: '#F8F8F8' },
  '.MuiButton-root': {
    borderRadius: '0!important',
    textTransform: 'none!important',
  },
  '.MuiPaper-root': {
    borderRadius: '0!important',
  },
};

const theme = createTheme({
  typography: {
    fontFamily: '"Strawford"',
    fontWeigth: 400,
  },
  palette: {
    primary: {
      main: '#000000',
    },
    selected: {
      main: '#F5F9FE',
      contrastText: '#2F80ED',
    },
    unselected: {
      main: '#f2f2f2',
      contrastText: '#646464',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={defaultStyles} />
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

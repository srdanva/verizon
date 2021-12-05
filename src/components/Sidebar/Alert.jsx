import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  alert: {
    backgroundColor: '#FBFBFB!important',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#000!important',
      color: '#fff',
      transition: '.3s background-color',
      cursor: 'pointer',
    },
  },
}));

const Alert = function ({ time, message }) {
  const classes = useStyles();

  return (
    <Paper className={classes.alert}>
      <Box sx={{ display: 'inline-flex' }}>
        <AccessTimeIcon fontSize="small" />
        <Typography variant="body1">{time}</Typography>
      </Box>
      <Typography variant="body1">{message}</Typography>
    </Paper>
  );
};

export default Alert;

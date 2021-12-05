import React, { useState } from 'react';
import {
  Grid,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import FilterForm from 'components/FilterForm';
import Alert from './Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  alertsCounter: {
    color: theme.palette.grey['500'],
    marginLeft: `${theme.spacing(1)}!important`,
  },
}));

const Sidebar = function () {
  const classes = useStyles();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Box className={classes.root}>
      {!showFilters && (
        <Grid container>
          <Grid item xs={12} sx={{ display: 'inline-flex' }}>
            <Typography variant="h6">
              Recent alerts
            </Typography>
            <Typography variant="h6" className={classes.alertsCounter}>
              (3)
            </Typography>
            <Box sx={{ p: 0, marginLeft: 'auto' }}>
              <IconButton onClick={() => setShowFilters(true)}>
                <TuneIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Alert time="18:56" message="Volume of traffic at location A surpassed X." />
            <Alert time="18:53" message="Mediam commute time between location A and location B surpasses 10 mins." />
            <Alert time="18:41" message="Median Dwell time at location C exceeds Y mins." />
          </Grid>
        </Grid>
      )}
      {showFilters && (
        <Grid container>
          <Grid item xs={12} sx={{ display: 'inline-flex' }}>
            <Typography variant="h6">
              Filter
            </Typography>
            <Box sx={{ p: 0, marginLeft: 'auto' }}>
              <IconButton onClick={() => setShowFilters(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FilterForm type="date" />
            <FilterForm type="time" />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Sidebar;

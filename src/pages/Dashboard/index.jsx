import React from 'react';
import {
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import Header from 'components/Header';
import MapBox from 'components/MapBox';
import ChartBox from 'components/ChartBox';
import Sidebar from 'components/Sidebar';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'inline-flex',
    width: '100%',
  },
  page: {
    marginTop: theme.spacing(4),
  },
  spacing2: {
    marginTop: `${theme.spacing(2)}!important`,
  },
  spacing4: {
    marginTop: `${theme.spacing(4)}!important`,
  },
}));

const Dashboard = function () {
  const classes = useStyles();

  return (
    <Box>
      <Header />
      <Container maxWidth="xl" className={classes.page}>
        <Grid container spacing={4}>
          <Grid item xs={9}>
            <Grid container>
              <Grid item className={classes.content}>
                <Typography variant="h6">Heat Map</Typography>
                <Box sx={{ p: 0, marginLeft: 'auto' }}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button type="button" variant="outlined">New Poi</Button>
                    </Grid>
                    <Grid item>
                      <Button type="button" variant="outlined">New Tracker</Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item className={`${classes.content} ${classes.spacing2}`}>
                <MapBox />
              </Grid>
              <Grid item className={`${classes.content} ${classes.spacing4}`}>
                <Grid container spacing={4}>
                  <ChartBox title="Volume" />
                  <ChartBox title="Transit Time" />
                  <ChartBox title="Dwell time" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ height: '100%' }}>
              <Sidebar />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;

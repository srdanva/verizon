import React from 'react';
import {
  Grid, Paper, Typography, Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import faker from 'faker';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const useStyles = makeStyles((theme) => ({
  graphPaper: {
    padding: theme.spacing(1),
  },
}));

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      fill: true,
      borderColor: 'rgb(0,0,0)',
      backgroundColor: 'rgb(0,0,0)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      fill: true,
      borderColor: 'rgba(150,150,150,0.5)',
      backgroundColor: 'rgba(150,150,150,0.5)',
    },
  ],
};

const ChartBox = function ({ title }) {
  const classes = useStyles();

  return (
    <Grid item xs={4}>
      <Paper className={classes.graphPaper}>
        <Typography variant="subtitle1">{title}</Typography>
        <Box>
          <Line options={options} data={data} />
        </Box>
      </Paper>
    </Grid>
  );
};

export default ChartBox;

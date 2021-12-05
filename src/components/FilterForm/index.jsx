import React, { useState } from 'react';
import {
  Box, Collapse, Grid, ListItemButton, ListItemText, TextField,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/lab';

const FilterForm = function ({ type }) {
  const [open, setOpen] = useState(false);
  const [valueFrom, setValueFrom] = useState(null);
  const [valueTo, setValueTo] = useState(null);

  const title = type === 'date' ? 'Date' : 'Time';
  const Picker = type === 'date' ? DatePicker : TimePicker;

  return (
    <Box>
      <ListItemButton onClick={() => setOpen(!open)}>
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary={`${title}:`} />
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={1}>
            <Grid xs={12} item>
              <Picker
                label={`Choose from ${title.toLowerCase()}`}
                value={valueFrom}
                onChange={(newValue) => {
                  setValueFrom(newValue);
                }}
                renderInput={(params) => <TextField fullWidth variant="filled" {...params} />}
              />
            </Grid>
            <Grid xs={12} item>
              <Picker
                label={`Choose to ${title.toLowerCase()}`}
                value={valueTo}
                onChange={(newValue) => {
                  setValueTo(newValue);
                }}
                renderInput={(params) => <TextField fullWidth variant="filled" {...params} />}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Collapse>
    </Box>
  );
};

export default FilterForm;

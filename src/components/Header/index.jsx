import * as React from 'react';
import {
  Box,
  Avatar,
  Container,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  Grid,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  logo: {
    fontFamily: "'Poppins', sans-serif!important",
    fontWeight: '800!important',
  },
}));

const Header = function () {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{ p: '0!important' }}>
          <Grid container spacing={4}>
            <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                className={classes.logo}
                sx={{ mr: 2, display: { xs: 'flex' } }}
              >
                verizon.
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ p: 0 }}>
                <IconButton>
                  <NotificationsNoneIcon sx={{ color: '#fff' }} />
                </IconButton>
                <IconButton>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
                <Box sx={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px' }}>
                  <Typography variant="body1">Pavel Donin</Typography>
                  <Typography variant="caption">ID: 5943</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;

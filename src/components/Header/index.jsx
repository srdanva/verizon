import * as React from 'react';
import {
  Box,
  Avatar,
  Container,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const Header = function () {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'flex' } }}
          >
            verizon.
          </Typography>

          <Box sx={{ p: 0, marginLeft: 'auto' }}>
            <IconButton>
              <NotificationsNoneIcon />
            </IconButton>
            <IconButton>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
            <Box sx={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: '8px' }}>
              <Typography variant="body1">Pavel Donin</Typography>
              <Typography variant="caption">ID: 5943</Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;

import { styled } from '@mui/material/styles';
import { Box, CssBaseline, AppBar as MuiAppBar, Toolbar } from '@mui/material';
import SearchBar from '../search-bar';
import NotificationBar from './notification-bar';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open, sidebarwidth }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${sidebarwidth}px)`,
    marginLeft: `${sidebarwidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

function TopBar({ open, sidebarwidth }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sidebarwidth={sidebarwidth}
      >
        <Toolbar
          sx={{
            marginLeft: open ? '0px' : '65px',
            transition: 'margin ease 0.25s',
            justifyContent: 'space-between'
          }}
        >
          <SearchBar />
          <NotificationBar />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopBar;

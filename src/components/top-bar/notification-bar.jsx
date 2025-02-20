import { useState, useContext } from 'react';
import {
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  Badge,
  Button
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useLogout } from '../../hooks';
import DataContext from '../../context/data-context';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const logout = useLogout();
  const open = Boolean(anchorEl);
  const { user } = useContext(DataContext);
  //TODO: get notification count from api (api notifications not yet implemented)
  const [notificationCount, setNotificationCount] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  return (
    <>
      <Box display="inline-flex">
        <Tooltip title="Notifications">
          <IconButton
            size="small"
            sx={{ ml: 2 }}
          >
            <Badge
              color="error"
              badgeContent={notificationCount}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                <NotificationsIcon />
              </Avatar>
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Account Menu">
          <Button
            onClick={handleClick}
            size="small"
            color="secondary"
            sx={{ ml: 2, color: '#fff' }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            startIcon={
              <Avatar
                sx={{ height: 32, width: 32, mr: 1, bgcolor: 'secondary.main' }}
              >
                <PersonIcon />
              </Avatar>
            }
          >
            Welcome
            <Box
              component="span"
              sx={{
                fontWeight: 'bold',
                fontSize: 'larger',
                color: 'warning.main',
                textDecoration: 'underline',
                marginLeft: 1
              }}
            >
              {user.username}
            </Box>
          </Button>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Logout
              color="error"
              fontSize="small"
            />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

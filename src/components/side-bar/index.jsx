import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer as MuiDrawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DataContext from '../../context/data-context';

import { employeeRoutes, adminRoutes } from './side-bar-data';

const openedMixin = (theme, sidebarwidth) => ({
  width: sidebarwidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open, sidebarwidth }) => ({
  width: sidebarwidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme, sidebarwidth),
    '& .MuiDrawer-paper': openedMixin(theme, sidebarwidth)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

function CustomListItem({ title, icon, to, open }) {
  return (
    <NavLink
      to={to}
      style={{
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <Tooltip
        title={open ? null : title}
        placement="right"
      >
        <ListItem
          disablePadding
          sx={{ display: 'block' }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: 'inherit'
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={title}
              sx={{ display: open ? 'initial' : 'none' }}
            />
          </ListItemButton>
        </ListItem>
      </Tooltip>
    </NavLink>
  );
}

function Sidebar({ open, onToggle, width }) {
  const { user } = useContext(DataContext);

  return (
    <Drawer
      variant="permanent"
      open={open}
      sidebarwidth={width}
    >
      <DrawerHeader>
        {open ? (
          <div
            style={{
              textAlign: 'left',
              paddingLeft: '5px',
              width: '100%',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}
          >
            Service Menu
          </div>
        ) : null}
        <IconButton onClick={onToggle}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      {open ? (
        <Box
          mb="25px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <img
            alt="Company Logo"
            src={`/woolner.png`}
            style={{ cursor: 'pointer' }}
            loading="lazy"
          />
          <Typography
            variant="h6"
            color={'grey'}
            fontWeight="bold"
          >
            Syme Woolner
          </Typography>
        </Box>
      ) : null}
      <Divider />

      {['Admin', 'Employee'].includes(user.role) ? (
        <List>
          {employeeRoutes.map((route) => (
            <CustomListItem
              key={route.title}
              {...route}
              open={open}
            />
          ))}
        </List>
      ) : null}
      {['Admin'].includes(user.role) ? (
        <>
          <Divider />
          <List>
            {adminRoutes.map((route) => (
              <CustomListItem
                key={route.title}
                {...route}
                open={open}
              />
            ))}
          </List>
        </>
      ) : null}
    </Drawer>
  );
}

export default Sidebar;

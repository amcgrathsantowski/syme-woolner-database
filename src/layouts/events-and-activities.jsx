import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
  {
    label: 'Special Events',
    to: '/events-and-activities/special-events'
  },
  {
    label: 'Core Activities',
    to: '/events-and-activities/core-activities'
  },
  {
    label: 'Project Activities',
    to: '/events-and-activities/project-activities'
  }
];

export default function EventsAndActivities() {
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    links.forEach((link, index) => {
      if (link.to === location.pathname) {
        setValue(index);
      }
    });
  }, [location]);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{
          width: '100%',
          position: 'fixed',
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          zIndex: 1000
        }}
      >
        {links.map((link) => (
          <Tab
            key={link.to}
            label={link.label}
            component={NavLink}
            to={link.to}
          />
        ))}
      </Tabs>
      <Box sx={{ pt: '50px' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

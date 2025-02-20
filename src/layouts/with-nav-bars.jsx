import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../components/side-bar';
import TopBar from '../components/top-bar';

const sidebarwidth = 300;

const Wrapper = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${sidebarwidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}));

export default function WithNavBars() {
  const [sidebarOpen, setIsSidebarOpen] = useState(
    localStorage.getItem('sidebar_open') === 'true' || false
  );

  return (
    <Box>
      <CssBaseline />
      <header>
        <TopBar
          sidebarwidth={sidebarwidth}
          open={sidebarOpen}
        />
        <Sidebar
          width={sidebarwidth}
          open={sidebarOpen}
          onToggle={() =>
            setIsSidebarOpen((prev) => {
              localStorage.setItem('sidebar_open', !prev);
              return !prev;
            })
          }
        />
      </header>
      <Wrapper open={sidebarOpen}>
        <div
          style={{
            marginLeft: `${sidebarwidth}px`,
            paddingLeft: sidebarOpen ? '0' : '65px',
            marginTop: '64px',
            marginBottom: '64px',
            transition: 'margin ease 0.25s, padding ease 0.25s'
          }}
        >
          {/* Router Outlet Code Renders Here */}
          <Outlet />
        </div>
      </Wrapper>
    </Box>
  );
}

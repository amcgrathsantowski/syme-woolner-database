import {
  HomeOutlined as HomeOutlinedIcon,
  PeopleOutlined as PeopleOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  EventOutlined as EventOutlinedIcon,
  VaccinesOutlined as VaccinesOutlinedIcon,
  Badge as BadgeIcon,
  FastfoodOutlined as FastfoodOutlinedIcon,
  QueryStats as QueryStatsIcon
} from '@mui/icons-material';

const employeeRoutes = [
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: <HomeOutlinedIcon />
  },
  {
    title: 'Events And Activities',
    to: '/events-and-activities',
    icon: <EventOutlinedIcon />
  },
  {
    title: 'Client Service',
    to: '/services/client',
    icon: <PeopleOutlinedIcon />
  },
  {
    title: 'Meal Service',
    to: '/services/meal',
    icon: <FastfoodOutlinedIcon />
  },
  {
    title: 'Referral',
    to: '/services/referral',
    icon: <DescriptionOutlinedIcon />
  },
  {
    title: 'Harm Reduction Service',
    to: '/services/harm-reduction',
    icon: <VaccinesOutlinedIcon />
  },
  {
    title: 'Reports',
    to: '/reports',
    icon: <QueryStatsIcon />
  }
];

const adminRoutes = [
  {
    title: 'Employee Management',
    to: '/employee-management',
    icon: <BadgeIcon />
  }
];

export { employeeRoutes, adminRoutes };

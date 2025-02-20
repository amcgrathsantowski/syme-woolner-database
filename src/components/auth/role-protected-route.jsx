import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import DataContext from '../../context/data-context';

export default function RoleProtectedRoutes({ allowedRoles }) {
  const location = useLocation();
  const { user } = useContext(DataContext);

  if (Boolean(user.access_token) && allowedRoles?.includes(user.role)) {
    return <Outlet />;
  } else if (user.access_token !== '') {
    return (
      <Navigate
        to="/forbidden"
        state={{ from: location }}
        replace
      />
    );
  } else {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }
}

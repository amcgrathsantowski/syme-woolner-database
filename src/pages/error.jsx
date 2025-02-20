import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import DataContext from '../context/data-context';

export default function ErrorPage({ type }) {
  const { user } = useContext(DataContext);

  let message = '';
  switch (type) {
    case 404:
      message = 'Page Not Found';
      break;
    case 403:
      message = 'Unauthorized Access';
      break;
    default:
      message = 'Error Occurred';
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Alert
        severity="error"
        sx={{
          width: '50%',
          alignItems: 'center',
          '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {message}
          <Button
            LinkComponent={Link}
            to={user.access_token ? '/dashboard' : '/login'}
            size="small"
            variant="contained"
            color="warning"
          >
            Back to {user.access_token ? 'Dashboard' : 'Login'}
          </Button>
        </div>
      </Alert>
    </div>
  );
}

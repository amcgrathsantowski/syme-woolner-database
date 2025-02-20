import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';

import axios from '../requests/axios';
import SideBanner from '../components/side-banner';
import {
  Box,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useRefresh } from '../hooks';
import DataContext from '../context/data-context';
import loginSchema from '../validations/login.js';
import { useFormik } from 'formik';
import ForgotPassword from '../components/modals/forgot-password';

function Login() {
  const { user, setUser } = useContext(DataContext);

  const navigate = useNavigate();
  const location = useLocation();
  const refresh = useRefresh();
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const from_location = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (!user.access_token || user.access_token === '') refresh();
    else navigate(from_location, { replace: true });
  }, [user.access_token]);

  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem('remember_me') === 'true'
  );

  const handleRememberMeChange = () => {
    setRememberMe((prev) => {
      localStorage.setItem('remember_me', !prev);
      return !prev;
    });
  };

  const handleLoginSubmit = async (values, actions) => {
    values.remember_me = rememberMe;
    setError('');

    await axios
      .post('/login', values)
      .then((res) => {
        const { id, username, email, role, first_name, last_name, token } =
          res.data;
        setUser({
          id,
          username,
          email,
          role,
          first_name,
          last_name,
          access_token: token
        });

        navigate(from_location, { replace: true });
      })
      .catch((err) => {
        setError(err.response?.data.error || 'Unknown error');
      });
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      username: import.meta.env.DEV ? 'test' : '',
      password: import.meta.env.DEV ? 'testtest' : ''
    },
    validationSchema: loginSchema,
    onSubmit: handleLoginSubmit
  });

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <SideBanner />
      <div
        style={{
          width: '40%',
          minWidth: '500px',
          margin: 'auto'
        }}
      >
        <form
          method="post"
          onSubmit={formik.handleSubmit}
        >
          <h2
            style={{
              fontSize: '3.5rem',
              fontFamily: `'Poppins ExtraBold 800', sans-serif`
            }}
          >
            Login
          </h2>
          <br />

          <FormControl>
            <TextField
              type="text"
              size="normal"
              name="username"
              color="primary"
              variant="standard"
              autoFocus
              id="username"
              label="Username or Email"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              required
              sx={{ marginBottom: '20px' }}
            />

            <TextField
              type="password"
              size="normal"
              name="password"
              color="primary"
              variant="standard"
              id="password"
              label="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              required
              sx={{ marginBottom: '10px' }}
            />

            <FormControlLabel
              label="Remember Me"
              control={
                <Switch
                  id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe ?? false}
                  onChange={handleRememberMeChange}
                />
              }
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}
            />

            {error ? (
              <Alert
                severity="error"
                sx={{ marginBottom: '20px' }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            ) : null}

            <LoadingButton
              sx={{
                marginBottom: '20px'
              }}
              variant="contained"
              type="submit"
              loading={formik.isSubmitting}
              startIcon={<LoginIcon />}
            >
              Login
            </LoadingButton>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenModal(true)}
            >
              Forgot password?
            </Button>
          </FormControl>
        </form>
        <ForgotPassword
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      </div>
    </Box>
  );
}

export default Login;

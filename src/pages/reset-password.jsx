import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, TextField, Alert, Divider, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import {
  Password as PasswordIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import axios from '../requests/axios';
import { resetPasswordSchema } from '../validations';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [alert, setAlert] = useState({ severity: 'success', message: '' });
  const search = useLocation().search;
  const token = new URLSearchParams(search).get('token');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    axios
      .get(`/validate-password-token?token=${token}`)
      .then((res) => {
        if (res.status === 200) setIsValid(true);
      })
      .catch((err) => {
        setIsValid(false);
        setAlert({
          severity: 'error',
          message: err.response?.data.error ?? 'Unknown error'
        });
      });
  }, []);

  const handleResetPassword = async (values, actions) => {
    if (!isValid || !token) {
      actions.setSubmitting(false);
      return;
    }
    await axios
      .post(`/reset-password?token=${token}`, values)
      .then((res) => {
        setAlert({ severity: 'success', message: res.data.message });
        actions.resetForm();
      })
      .catch((err) => {
        setAlert({
          severity: 'error',
          message: err.response?.data.error ?? 'Unknown error'
        });
      });
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_password: ''
    },
    validationSchema: resetPasswordSchema,
    onSubmit: handleResetPassword
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%'
      }}
    >
      <Box
        sx={{
          width: '600px',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 3
        }}
      >
        <h1>Reset Password</h1>
        <Divider sx={{ marginBottom: '20px' }} />
        {isValid ? (
          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <TextField
              type="password"
              size="normal"
              name="password"
              color="primary"
              variant="standard"
              autoFocus
              id="password"
              label="New Password"
              required
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ marginBottom: '20px' }}
            />
            <TextField
              type="password"
              size="normal"
              name="confirm_password"
              color="primary"
              variant="standard"
              id="confirm_password"
              label="Confirm Password"
              required
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              error={
                formik.touched.confirm_password &&
                Boolean(formik.errors.confirm_password)
              }
              helperText={
                formik.touched.confirm_password &&
                formik.errors.confirm_password
              }
              sx={{ marginBottom: '20px' }}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              color="secondary"
              startIcon={<PasswordIcon />}
              loading={formik.isSubmitting}
              sx={{ marginBottom: '20px' }}
            >
              Reset Password
            </LoadingButton>
          </form>
        ) : null}
        {alert.message ? (
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ severity: 'success', message: '' })}
          >
            {alert.message}
          </Alert>
        ) : null}
        <Button
          startIcon={<LoginIcon />}
          LinkComponent={Link}
          to="/login"
          variant="contained"
          sx={{ marginTop: '40px' }}
        >
          Back to Login
        </Button>
      </Box>
    </div>
  );
}

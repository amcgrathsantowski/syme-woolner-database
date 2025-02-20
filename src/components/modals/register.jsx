import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { usePrivateRequest } from '../../hooks';
import { FormControl, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { registerSchema } from '../../validations';
import BadgeIcon from '@mui/icons-material/Badge';
import { useFormik } from 'formik';
import CustomModal from '.';

function Register({ open, handleClose, id, successCallback }) {
  const [alert, setAlert] = useState({ severity: 'success', message: '' });
  const axios = usePrivateRequest();

  const initialValues = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  };

  useEffect(() => {
    if (!id) {
      formik.setValues(initialValues);
      formik.setTouched({}, false);
      return;
    }
    axios
      .get(`/admin/employee/${id}`)
      .then((res) => {
        if (res instanceof AxiosError) {
          setAlert({
            severity: 'error',
            message: res.response?.data.error ?? 'Unknown error'
          });
          return;
        }
        formik.setValues({
          first_name: res.data.employee.first_name,
          last_name: res.data.employee.last_name,
          username: res.data.employee.username,
          email: res.data.employee.email,
          password: '',
          confirm_password: ''
        });
      })
      .catch(() => {
        setAlert({ severity: 'error', message: 'Unknown error' });
      });
  }, [id]);

  const handleRegisterSubmit = async (values, actions) => {
    //calls api either 200 or 404 and handle the response
    setAlert({ severity: 'success', message: '' });
    axios({
      method: id ? 'put' : 'post',
      url: `/admin/employee${id ? `/${id}` : ''}`,
      data: values
    })
      .then((res) => {
        if (res instanceof AxiosError) {
          setAlert({
            severity: 'error',
            message: res.response?.data.error ?? 'Unknown error'
          });
          return;
        }
        setAlert({ severity: 'success', message: res.data.message });
        if (!id) actions.resetForm();
        if (successCallback) successCallback(res.data.employee);
      })
      .catch(() => {
        setAlert({ severity: 'error', message: 'Unknown error' });
      });
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema(!!id),
    onSubmit: handleRegisterSubmit
  });

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      onReset={() => formik.resetForm()}
      title={id ? 'Edit' : 'Register'}
      alertMessage={alert.message}
      alertSeverity={alert.severity}
      alertOnClose={() => setAlert({ severity: 'success', message: '' })}
      submitButton={
        <LoadingButton
          sx={{ fontSize: '20px' }}
          variant="contained"
          onClick={formik.handleSubmit}
          type="submit"
          startIcon={<BadgeIcon />}
          loading={formik.isSubmitting}
        >
          {id ? 'Edit' : 'Register'}
        </LoadingButton>
      }
    >
      <form
        method="post"
        onSubmit={formik.handleSubmit}
      >
        <FormControl sx={{ width: '100%' }}>
          <TextField
            type="text"
            size="normal"
            name="first_name"
            color="primary"
            variant="standard"
            autoFocus
            id="first_name"
            label="First Name"
            value={formik.values.first_name || ''}
            onChange={formik.handleChange}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
            required
            sx={{
              marginBottom: '20px'
            }}
          />

          <TextField
            type="text"
            size="normal"
            color="primary"
            name="last_name"
            variant="standard"
            id="last_name"
            label="Last Name"
            value={formik.values.last_name || ''}
            onChange={formik.handleChange}
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
            required
            sx={{
              marginBottom: '20px'
            }}
          />

          <TextField
            type="email"
            size="normal"
            name="email"
            color="primary"
            variant="standard"
            id="email"
            label="Email"
            value={formik.values.email || ''}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required
            sx={{
              marginBottom: '20px'
            }}
          />

          <TextField
            type="text"
            size="normal"
            name="username"
            color="primary"
            variant="standard"
            id="username"
            label="Username"
            value={formik.values.username || ''}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            required
            sx={{
              marginBottom: '20px'
            }}
          />

          {id ? null : (
            <TextField
              type="password"
              size="normal"
              name="password"
              color="primary"
              variant="standard"
              id="password"
              label="Password"
              value={formik.values.password || ''}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              required
              sx={{
                marginBottom: '20px'
              }}
            />
          )}

          {id ? null : (
            <TextField
              type="password"
              size="normal"
              name="confirm_password"
              color="primary"
              variant="standard"
              id="confirm_password"
              label="Confirm Password"
              value={formik.values.confirm_password || ''}
              onChange={formik.handleChange}
              error={
                formik.touched.confirm_password &&
                Boolean(formik.errors.confirm_password)
              }
              helperText={
                formik.touched.confirm_password &&
                formik.errors.confirm_password
              }
              required={id ? false : true}
            />
          )}
          <button
            type="submit"
            hidden
          />
        </FormControl>
      </form>
    </CustomModal>
  );
}

export default Register;

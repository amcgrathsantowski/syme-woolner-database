import { useState } from 'react';
import { useFormik } from 'formik';
import PasswordIcon from '@mui/icons-material/Password';
import { TextField, FormControl } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from '../../requests/axios';
import CustomModal from '.';
import { forgotPasswordSchema } from '../../validations';

export default function ForgotPassword({ openModal, setOpenModal }) {
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState({ severity: 'success', message: '' });

  const handleResetPassword = async (values, actions) => {
    if (disabled) return;
    await axios
      .get(`/forgot-password?email=${values.email}`)
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
    setDisabled(true);
    actions.setSubmitting(false);
    setTimeout(() => {
      setDisabled(false);
    }, 30000);
  };

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: handleResetPassword
  });

  return (
    <CustomModal
      open={openModal}
      onClose={() => setOpenModal(false)}
      title="Forgot Password?"
      alertMessage={alert.message}
      alertSeverity={alert.severity}
      alertOnClose={() => setAlert({ severity: 'success', message: '' })}
      submitButton={
        <LoadingButton
          variant="contained"
          onClick={formik.handleSubmit}
          type="submit"
          disabled={disabled}
          loading={formik.isSubmitting}
          startIcon={<PasswordIcon />}
        >
          Reset Password
        </LoadingButton>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <FormControl sx={{ width: '100%' }}>
          <TextField
            id="email"
            type="email"
            size="normal"
            name="email"
            variant="standard"
            label="Email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required
            sx={{ marginBottom: '20px' }}
          />
        </FormControl>
      </form>
    </CustomModal>
  );
}

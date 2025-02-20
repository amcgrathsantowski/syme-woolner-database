import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { usePrivateRequest } from '../../hooks';
import { FormControl, TextField, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useFormik } from 'formik';
import CustomModal from '.';
import { MEAL_TYPE } from '../../../api/database/enum-constants';

function HarmReduction({ open, handleClose, successCallback, submitType, id }) {
  const [alert, setAlert] = useState({ severity: 'success', message: '' });
  const [initialValues, setInitialValues] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: '',
    number_of_clients: 0
  });

  const axios = usePrivateRequest();

  useEffect(() => {
    if (id && submitType === 'Edit') {
      axios
        .get(`/employee/meal/${id}`)
        .then((res) => {
          setInitialValues({
            date: res.data.meal.date,
            type: res.data.meal.type,
            number_of_clients: res.data.meal.number_of_clients
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [submitType, id]);

  const handleTypeChange = (event) => {
    formik.setFieldValue('type', event.target.value);
  };

  const handleMealEntrySubmit = async (values, actions) => {
    setAlert({ severity: 'success', message: '' });
    const { date, type, number_of_clients } = values;

    const data = {
      date,
      type,
      number_of_clients
    };

    let apiPromise;

    if (submitType === 'Add') {
      apiPromise = axios.post('/employee/meal', data);
    } else if (submitType === 'Edit') {
      apiPromise = axios.put(`/employee/meal/${id}`, data);
    } else {
      throw new Error(`Invalid submitType: ${submitType}`);
    }

    apiPromise
      .then((res) => {
        if (res instanceof AxiosError) {
          setAlert({
            severity: 'error',
            message: res.response?.data.error ?? 'Unknown error'
          });
        } else {
          const successMessage =
            submitType === 'Add'
              ? 'Meal entry successfully added.'
              : 'Meal entry successfully updated.';
          setAlert({ severity: 'success', message: successMessage });
          if (submitType === 'Add') {
            actions.resetForm();
            if (successCallback) successCallback(res.data.meal);
          } else if (submitType === 'Edit') {
            if (successCallback) successCallback(res.data.meal, id);
          }
        }
      })
      .catch(() => {
        setAlert({ severity: 'error', message: 'Unknown error' });
      });
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    //validationSchema: mealEntrySchema,
    onSubmit: handleMealEntrySubmit,
    enableReinitialize: true
  });

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      onReset={() => formik.resetForm()}
      title={submitType + ' Meal Entry'}
      alertMessage={alert.message}
      alertSeverity={alert.severity}
      alertOnClose={() => setAlert({ severity: 'success', message: '' })}
      submitButton={
        <LoadingButton
          sx={{ fontSize: '20px' }}
          variant="contained"
          onClick={formik.handleSubmit}
          type="submit"
          startIcon={<AddCircleIcon />}
          loading={formik.isSubmitting}
        >
          {submitType}
        </LoadingButton>
      }
    >
      <form
        method="post"
        onSubmit={formik.handleSubmit}
      >
        <FormControl sx={{ width: '100%' }}>
          <TextField
            label="Date"
            type="date"
            size="normal"
            color="primary"
            variant="standard"
            id="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            required
            sx={{ marginBottom: '20px' }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Number of Meals Served"
            type="number"
            size="normal"
            color="primary"
            variant="standard"
            id="number_of_clients"
            value={formik.values.number_of_clients}
            onChange={formik.handleChange}
            error={
              formik.touched.number_of_clients &&
              Boolean(formik.errors.number_of_clients)
            }
            helperText={
              formik.touched.number_of_clients &&
              formik.errors.number_of_clients
            }
            required
            sx={{ marginBottom: '20px' }}
          />

          <TextField
            label="Type of Meal"
            select
            size="normal"
            color="primary"
            variant="standard"
            id="type"
            value={formik.values.type}
            onChange={handleTypeChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
            required
            sx={{ marginBottom: '20px' }}
          >
            {MEAL_TYPE.map((meal, index) => (
              <MenuItem
                key={index}
                value={meal}
              >
                {meal}
              </MenuItem>
            ))}
          </TextField>

          <button
            type="submit"
            hidden
          />
        </FormControl>
      </form>
    </CustomModal>
  );
}

export default HarmReduction;

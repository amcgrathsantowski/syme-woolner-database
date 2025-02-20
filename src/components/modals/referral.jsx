import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { usePrivateRequest } from '../../hooks';
import {
  FormControl,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useFormik } from 'formik';
import CustomModal from '.';
import getLocalDate from '../date-init';

function Referral({
  open,
  handleClose,
  successCallback,
  submitType,
  id
}) {
  const [alert, setAlert] = useState({ severity: 'success', message: '' });
  const [initialValues, setInitialValues] = useState({
    date: getLocalDate(),
    description: '',
    shelter_count: 0,
    housing_count: 0,
    mental_health_count: 0,
    medical_services_count: 0,
    income_support_count: 0,
    legal_services_count: 0,
    settlement_services_count: 0,
    harm_reduction_services_count: 0,
    employment_supports_count: 0,
    food_bank_count: 0,
    meal_service_count: 0,
    id_clinic_count: 0,
    other_count: 0
  });

  const axios = usePrivateRequest();

  useEffect(() => {
    if (id && submitType === 'Edit') {
      axios
        .get(`/employee/referral/${id}`)
        .then((res) => {
          setInitialValues({
            date: res.data.referral.date,
            description: res.data.referral.description,
            shelter_count: res.data.referral.shelter_count,
            housing_count: res.data.referral.housing_count,
            mental_health_count: res.data.referral.mental_health_count,
            medical_services_count: res.data.referral.medical_services_count,
            income_support_count: res.data.referral.income_support_count,
            legal_services_count: res.data.referral.legal_services_count,
            settlement_services_count: res.data.referral.settlement_services_count,
            harm_reduction_services_count: res.data.referral.harm_reduction_services_count,
            employment_supports_count: res.data.referral.employment_supports_count,
            food_bank_count: res.data.referral.food_bank_count,
            meal_service_count: res.data.meal_service_count,
            id_clinic_count: res.data.referral.id_clinic_count,
            other_count: res.data.referral.other_count
          });
        })
        .catch(() => {});
    }
    if (!open) {
      setAlert({ severity: 'success', message: '' });
    }
  }, [axios, submitType, id, open]);

  const handleShelterCountChange = (event) => {
    formik.setFieldValue('shelter_count', event.target.value);
  };

  const handleHousingCountChange = (event) => {
    formik.setFieldValue('housing_count', event.target.value);
  };

  const handleMentalHealthCountChange = (event) => {
    formik.setFieldValue('mental_health_count', event.target.value);
  }

  const handleMedicalServicesCountChange = (event) => {
    formik.setFieldValue('medical_services_count', event.target.value);
  }

  const handleIncomeSupportCountChange = (event) => { 
    formik.setFieldValue('income_support_count', event.target.value);
  }

  const handleLegalServicesCountChange = (event) => {
    formik.setFieldValue('legal_services_count', event.target.value);
  }

  const handleSettlementServicesCountChange = (event) => {
    formik.setFieldValue('settlement_services_count', event.target.value);
  }

  const handleHarmReductionServicesCountChange = (event) => {
    formik.setFieldValue('harm_reduction_services_count', event.target.value);
  }

  const handleEmploymentSupportsCountChange = (event) => {
    formik.setFieldValue('employment_supports_count', event.target.value);
  }

  const handleFoodBankCountChange = (event) => {
    formik.setFieldValue('food_bank_count', event.target.value);
  }

  const handleMealServiceCountChange = (event) => {
    formik.setFieldValue('meal_service_count', event.target.value);
  }

  const handleIDClinicCountChange = (event) => {
    formik.setFieldValue('id_clinic_count', event.target.value);
  }

  const handleOtherCountChange = (event) => {
    formik.setFieldValue('other_count', event.target.value);
  }

  const handleReferralEntrySubmit = async (values, actions) => {
    setAlert({ severity: 'success', message: '' });
    const {
      date,
      description,
      shelter_count,
      housing_count,
      mental_health_count,
      medical_services_count,
      income_support_count,
      legal_services_count,
      settlement_services_count,
      harm_reduction_services_count,
      employment_supports_count,
      food_bank_count,
      meal_service_count,
      id_clinic_count,
      other_count
    } = values;

    const data = {
      date,
      description,
      shelter_count,
      housing_count,
      mental_health_count,
      medical_services_count,
      income_support_count,
      legal_services_count,
      settlement_services_count,
      harm_reduction_services_count,
      employment_supports_count,
      food_bank_count,
      meal_service_count,
      id_clinic_count,
      other_count
    };

    let apiPromise = '';

    if (submitType === 'Add') {
      apiPromise = axios.post('/employee/referral', data);
    } else if (submitType === 'Edit') {
      apiPromise = axios.put(`/employee/referral/${id}`, data);
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
              ? 'Referral entry successfully added.'
              : 'Referral entry successfully updated.';
          setAlert({ severity: 'success', message: successMessage });
          if (submitType === 'Add') {
            actions.resetForm();
            if (successCallback) successCallback(res.data.referral);
          } else if (submitType === 'Edit') {
            if (successCallback) successCallback(res.data.referral, id);
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
    onSubmit: handleReferralEntrySubmit,
    enableReinitialize: true
  });

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      onReset={() => formik.resetForm()}
      title={submitType + ' Referral Entry'}
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
            label="Number of Shelter Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="shelter_count"
            name="shelter_count"
            type='number'
            defaultValue={0}
            value={formik.values.shelter_count}
            onChange={handleShelterCountChange}
            error={
              formik.touched.shelter_count &&
              Boolean(formik.errors.shelter_count)
            }
            helperText={
              formik.touched.shelter_count &&
              formik.errors.shelter_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of Housing Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="housing_count"
            name="housing_count"
            type='number'
            defaultValue={0}
            value={formik.values.housing_count}
            onChange={handleHousingCountChange}
            error={
              formik.touched.housing_count &&
              Boolean(formik.errors.housing_count)
            }
            helperText={
              formik.touched.housing_count &&
              formik.errors.housing_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of Mental Health Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="mental_health_count"
            name="mental_health_count"
            type='number'
            defaultValue={0}
            value={formik.values.mental_health_count}
            onChange={handleMentalHealthCountChange}
            error={
              formik.touched.mental_health_count &&
              Boolean(formik.errors.mental_health_count)
            }
            helperText={
              formik.touched.mental_health_count &&
              formik.errors.mental_health_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of Medical Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="medical_services_count"
            name="medical_services_count"
            type='number'
            defaultValue={0}
            value={formik.values.medical_services_count}
            onChange={handleMedicalServicesCountChange}
            error={
              formik.touched.medical_services_count &&
              Boolean(formik.errors.medical_services_count)
            }
            helperText={
              formik.touched.medical_services_count &&
              formik.errors.medical_services_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of Income Support Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="income_support_count"
            name="income_support_count"
            type='number'
            defaultValue={0}
            value={formik.values.income_support_count}
            onChange={handleIncomeSupportCountChange}
            error={
              formik.touched.income_support_count &&
              Boolean(formik.errors.income_support_count)
            }
            helperText={
              formik.touched.income_support_count &&
              formik.errors.income_support_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of Legal Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="legal_services_count"
            name="legal_services_count"
            type='number'
            defaultValue={0}
            value={formik.values.legal_services_count}
            onChange={handleLegalServicesCountChange}
            error={
              formik.touched.legal_services_count &&
              Boolean(formik.errors.legal_services_count)
            }
            helperText={
              formik.touched.legal_services_count &&
              formik.errors.legal_services_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of Settlement Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="settlement_services_count"
            name="settlement_services_count"
            type='number'
            defaultValue={0}
            value={formik.values.settlement_services_count}
            onChange={handleSettlementServicesCountChange}
            error={
              formik.touched.settlement_services_count &&
              Boolean(formik.errors.settlement_services_count)
            }
            helperText={
              formik.touched.settlement_services_count &&
              formik.errors.settlement_services_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of Harm Reduction Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="harm_reduction_services_count"
            name="harm_reduction_services_count"
            type='number'
            defaultValue={0}
            value={formik.values.harm_reduction_services_count}
            onChange={handleHarmReductionServicesCountChange}
            error={
              formik.touched.harm_reduction_services_count &&
              Boolean(formik.errors.harm_reduction_services_count)
            }
            helperText={
              formik.touched.harm_reduction_services_count &&
              formik.errors.harm_reduction_services_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of Employment Supports Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="employment_supports_count"
            name="employment_supports_count"
            type='number'
            defaultValue={0}
            value={formik.values.employment_supports_count}
            onChange={handleEmploymentSupportsCountChange}
            error={
              formik.touched.employment_supports_count &&
              Boolean(formik.errors.employment_supports_count)
            }
            helperText={
              formik.touched.employment_supports_count &&
              formik.errors.employment_supports_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of Food Bank Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="food_bank_count"
            name="food_bank_count"
            type='number'
            defaultValue={0}
            value={formik.values.food_bank_count}
            onChange={handleFoodBankCountChange}
            error={
              formik.touched.food_bank_count &&
              Boolean(formik.errors.food_bank_count)
            }
            helperText={
              formik.touched.food_bank_count &&
              formik.errors.food_bank_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

        <TextField
            label="Number of Meal Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="meal_service_count"
            name="meal_service_count"
            type='number'
            defaultValue={0}
            value={formik.values.meal_service_count}
            onChange={handleMealServiceCountChange}
            error={
              formik.touched.meal_service_count &&
              Boolean(formik.errors.meal_service_count)
            }
            helperText={
              formik.touched.meal_service_count &&
              formik.errors.meal_service_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of ID Clinic Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="id_clinic_count"
            name="id_clinic_count"
            type='number'
            defaultValue={0}
            value={formik.values.id_clinic_count}
            onChange={handleIDClinicCountChange}
            error={
              formik.touched.id_clinic_count &&
              Boolean(formik.errors.id_clinic_count)
            }
            helperText={
              formik.touched.id_clinic_count &&
              formik.errors.id_clinic_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Number of Other Services Provided"
            size="normal"
            color="primary"
            variant="standard"
            id="other_count"
            name="other_count"
            type='number'
            defaultValue={0}
            value={formik.values.other_count}
            onChange={handleOtherCountChange}
            error={
              formik.touched.other_count &&
              Boolean(formik.errors.other_count)
            }
            helperText={
              formik.touched.other_count &&
              formik.errors.other_count
            }
            required
            sx={{marginBottom: '20px'}}
          />

          <TextField
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            variant="standard"
            multiline
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            w
            rows={4}
            fullWidth
          />
        </FormControl>
        <button
          type="submit"
          hidden
        />
      </form>
    </CustomModal>
  );
}

export default Referral;

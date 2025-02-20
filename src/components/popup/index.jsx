import { useState } from 'react';
import { Field, Form, FormikProvider, useFormik, ErrorMessage } from 'formik';

import { Modal, TextField, Radio, RadioGroup } from '@mui/material';
import { Box, Typography, Stack } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import { usePrivateRequest } from '../../hooks';
import { DateTime } from 'luxon';
import { GENDER } from '../../../api/database/enum-constants';
import { HARM_REDUCTION_KIT } from '../../../api/database/enum-constants';
import registerSchema from '../../validations/popup';

export default function Popup(props) {
  const [date, setDate] = useState(DateTime.now());
  const harmReductions = HARM_REDUCTION_KIT;
  const genders = GENDER;
  const Axios = usePrivateRequest();

  let initialValues;
  if (props.clientId) {
    let clientInitials = props.clientName
      .split(' ')
      .map((word) => word.substring(0, 1))
      .join('');

    initialValues = {
      client_id: null,
      clientInitials: clientInitials,
      yearOfBirth: '',
      purposeOfCollection: '',
      gender: '',
      kitType: harmReductions.reduce(
        (obj, item) => ({ ...obj, [item]: false }),
        {}
      ),
      date: '',
      clientName: ''
    };
  } else if (props.selectedHarmReduction == null) {
    initialValues = {
      client_id: null,
      clientInitials: '',
      yearOfBirth: '',
      purposeOfCollection: '',
      gender: '',
      kitType: harmReductions.reduce(
        (obj, item) => ({ ...obj, [item]: false }),
        {}
      ),
      date: ''
    };
  } else {
    initialValues = {
      clientInitials: props.selectedHarmReduction.client_initials,
      yearOfBirth: props.selectedHarmReduction.year_of_birth,
      purposeOfCollection: props.selectedHarmReduction.collection_for,
      gender: props.selectedHarmReduction.gender,
      kitType: harmReductions.reduce((obj, item) => {
        return {
    ...obj,
    [item]: props.selectedHarmReduction.kit_type.split(', ').includes(item)
  };
      }, {}),
      date: props.selectedHarmReduction.date
    };
  }

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: registerSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const data = {
        year_of_birth: values.yearOfBirth,
        collection_for: values.purposeOfCollection,
        client_initials: values.clientInitials,
        kit_type: Object.keys(values.kitType)
          .filter((key) => values.kitType[key])
          .join(', '),
        date: date.toString().slice(0, 10),
        gender: values.gender
      };

      if (props.clientId) {
        data.client_id = props.clientId;
        Axios.post(`/employee/harm-reduction`, data)
          .then(() => {
            console.log('Harm Reduction Entry Added for client');
            props.setOpenDialogBox(!props.openDialogBox);
            // Refresh the harm reductions list
            props.refreshHarmReductions();
            resetForm();
            setSubmitting(false);
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (props.selectedHarmReduction == null) {
        Axios.post('/employee/harm-reduction', data)
          .then(() => {
            console.log('Harm Reduction Entry Added');
            props.setOpenDialogBox(!props.openDialogBox);
            // Refresh the harm reductions list
            props.refreshHarmReductions();
            resetForm();
            setSubmitting(false);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        Axios.put(
          `/employee/harm-reduction/${props.selectedHarmReduction.id}`,
          data
        )
          .then(() => {
            console.log('Harm Reduction Entry Updated');
            handleClose();
            props.refreshHarmReductions();
            props.setSelectedHarmReduction(null);
            setSubmitting(false);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  });

  const handleClose = () => {
    formik.resetForm();
    props.setOpenDialogBox(false);
  };

  return (
    <Modal
      open={props.openDialogBox}
      onClose={handleClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 3
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
        >
          Create New Harm Reduction{' '}
          {props.clientId && (
            <>
              for
              <span style={{ color: 'blueviolet' }}> {props.clientName}</span>
            </>
          )}
        </Typography>
        <FormikProvider value={formik}>
          <Form
            method="post"
            onSubmit={formik.handleSubmit}
            o
          >
            <Stack
              spacing={2}
              direction="column"
              sx={{
                maxHeight: '90vh',
                marginLeft: '10px',
                overflow: 'auto'
              }}
            >
              <Field
                as={TextField}
                label="Client Initials"
                type="text"
                variant="standard"
                fullWidth
                required
                name="clientInitials"
                id="clientInitials"
              />
              <ErrorMessage
                name="clientInitials"
                component={({ children }) => (
                  <div style={{ color: 'red', alignSelf: 'flex-start' }}>
                    {children}
                  </div>
                )}
              />

              <Field
                as={TextField}
                label="Year of Birth"
                type="text"
                name="yearOfBirth"
                variant="standard"
                fullWidth
              />
              <ErrorMessage
                name="yearOfBirth"
                component={({ children }) => (
                  <div style={{ color: 'red', alignSelf: 'flex-start' }}>
                    {children}
                  </div>
                )}
              />

              <Field
                as={TextField}
                label="Purpose of Collection"
                type="text"
                name="purposeOfCollection"
                variant="standard"
                fullWidth
                required
              />
              <FormControl
              required>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                {genders.map((gender) => (
                  <FormControlLabel
                    key={gender}
                    value={gender}
                    control={<Radio />}
                    label={gender}
                  />
                ))}
              </RadioGroup>
              </FormControl>
              <FormControl required style={{ marginLeft: '7px' }}>
                <FormLabel>Resources Provided</FormLabel>
                <FormGroup style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '20px' }}>
                  {harmReductions.map((item, value) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Field
                          type="checkbox"
                          name={`kitType.${item}`}
                        />
                      }
                      label={item}
                    />
                  ))}
                </FormGroup>
              </FormControl>


              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <DesktopDatePicker
                  label="Date"
                  inputFormat="MM/DD/YYYY"
                  value={date}
                  onChange={(newDate) => {
                    setDate(newDate);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                endIcon={<AddCircleIcon />}
              >
                {props.buttonType}
              </Button>

              <Button
                fullWidth
                variant="contained"
                color="secondary"
                endIcon={<CloseIcon />}
                onClick={handleClose}
              >
                Close
              </Button>
            </Stack>
          </Form>
        </FormikProvider>
      </Box>
    </Modal>
  );
}

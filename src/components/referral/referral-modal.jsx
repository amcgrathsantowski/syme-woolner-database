import { Box, Typography, Stack } from '@mui/material';
import { Modal, Button, TextField, FormControl, FormControlLabel, RadioGroup, Radio, FormLabel, InputLabel, Select, MenuItem } from '@mui/material';
import { REFERRAL_SERVICE } from '../../../api/database/enum-constants';
import { REFERRAL_RESOURCE } from '../../../api/database/enum-constants';

function ReferralModalComponent(props) {

  const { open, onClose, onSubmit, handleInputChange, formData, handleServiceTypeChange, setFormData, buttonType } = props;
  const serviceTypes = REFERRAL_SERVICE
  const resourceTypes = REFERRAL_RESOURCE

  const handleResourceChange = (event) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      resource_provided: value
    }));
  };

  const handleClose = () => {
    onClose();
  };

  return (
  <Modal open={open} onClose={handleClose}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80vw',
      maxWidth: '600px',
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
    }}
  >
    <Stack
      component="form"
      onSubmit={onSubmit}
      spacing={2}
      direction="column"
    >
      
      <TextField
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        variant="standard"
        fullWidth
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">Service Type</FormLabel>
        <RadioGroup aria-label="service type" name="service_type" value={formData.service_type} onChange={handleServiceTypeChange}>
          {serviceTypes.map((type) => (
            <FormControlLabel
              key={type}
              value={type}
              control={<Radio />}
              label={type}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <FormControl>
        <InputLabel id="resource-label">Resource Type</InputLabel>
       
        <Select
          labelId="resource-label"
          id="resource"
          value={formData.resource_provided}
          onChange={handleResourceChange}
          label="resource-label"
          fullWidth
        >
          {resourceTypes.map((resource) => (
            <MenuItem key={resource} value={resource}>
              {resource}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        variant="standard"
        multiline
        rows={4}
        fullWidth
      />
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit" sx={{ ml: 2 }}>
          {buttonType}
        </Button>
      </Stack>
    </Stack>
  </Box>
</Modal>
  );

}
export default ReferralModalComponent;
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem
} from '@mui/material';
import { GENDER } from '../../../api/database/enum-constants';
import { RELATIONSHIP } from '../../../api/database/enum-constants';

function ClientForm({
  mode,
  onClose,
  open,
  handleInputChange,
  onConfirm,
  client,
  age,
  selectedGender,
  selectedRelationship,
  address,
  postalCode,
  numChildren,
  numAdults,
  dateRegistered
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 3
        }}
      >
        <Typography variant="h5">
          {mode === 'edit' ? 'Edit Client' : 'Add Client'}
        </Typography>
        <Box
          sx={{
            maxHeight: '60vh',
            overflowY: 'auto',
            width: '100%'
          }}
        >
          <Stack
            component="form"
            onSubmit={onConfirm}
            spacing={2}
            direction="column"
          >

            <TextField
                label="First Name"
                name="first_name"
                value={client.first_name}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={client.last_name}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />

            <TextField
              label="Age"
              name="age"
              value={client.age}
              variant="standard"
              type='number'
              onChange={handleInputChange}
              fullWidth
              required
            >
            </TextField>
            <TextField
              label="Gender"
              name="gender"
              value={selectedGender}
              select
              onChange={handleInputChange}
              variant="standard"
              fullWidth
              required
            >
              {GENDER.map((gender, index) => (
                <MenuItem
                  key={index}
                  value={gender}
                >
                  {gender}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Phone No."
              name="contact_number"
              value={client.contact_number}
              onChange={handleInputChange}
              variant="standard"
              fullWidth
              required
            />

            <TextField
              label="Address"
              name="address"
              value={address}
              onChange={handleInputChange}
              variant="standard"
              fullWidth
              required
            />
            <TextField
              label="Postal Code"
              name="postal_code"
              value={postalCode}
              onChange={handleInputChange}
              variant="standard"
              fullWidth
              required
              pattern="[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]"
              helperText="Please provide in A1A1A1 format"
            />
            <TextField
              label="Number of Adults"
              name="number_of_adults"
              type="number"
              value={numAdults}
              onChange={handleInputChange}
              variant="standard"
              fullWidth
              inputProps={{ min: '0', max: client.total_family_members }}
            />
            <TextField
              label="Number of Children"
              name="number_of_children"
              type="number"
              value={numChildren}
              onChange={handleInputChange}
              variant="standard"
              fullWidth
              inputProps={{ min: '0', max: client.total_family_members }}
            />
            <TextField
              label="Family Members"
              name="total_family_members"
              type="number"
              value={client.total_family_members}
              onChange={handleInputChange}
              variant="standard"
              fullWidth
            />
            <TextField
              label="Emergency Contact Number"
              name="emergency_contact_number"
              type="tel"
              value={client.emergency_contact_number}
              onChange={handleInputChange}
              variant="standard"
              fullWidth
              required
            />
            <TextField
              label="Contact Relationship"
              name="emergency_contact_relationship"
              value={selectedRelationship}
              onChange={handleInputChange}
              variant="standard"
              select
              fullWidth
              required
            >
              {RELATIONSHIP.map((value, index) => (
                <MenuItem
                  key={index}
                  value={value}
                >
                  {value}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date Registered"
              name="date_registered"
              type="date"
              value={client.dateRegistered}
              onChange={handleInputChange}
              variant="standard"
              fullWidth
              required
            />

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ ml: 2 }}
              >
                {mode === 'edit' ? 'Save' : 'Add'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

export default ClientForm;

import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Stack, Button, MenuItem } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { PROJECT_ACTIVITY } from '../../../api/database/enum-constants';
import getLocalDate from '../date-init';

export default function ProjectActivityForm({ open, onClose, onSubmit, activity, buttonType }) {

  const [date, setDate] = useState(activity?.date || getLocalDate())
  const [type, setType] = useState(activity?.type || '');
  const [numberOfClients, setNumberOfClients] = useState(activity?.number_of_clients || 0);
  const [description, setDescription] = useState(activity?.description || '');

  useEffect(() => {
    if(activity) {
      setDate(activity.date || getLocalDate())
      setType(activity.type || '');
      setNumberOfClients(activity.number_of_clients || 0);
      setDescription(activity.description || '');
    }
  }, [activity]);

  const activities = PROJECT_ACTIVITY;

  const handleClose = () => {
    setDate(getLocalDate());
    setType('')
    setNumberOfClients(null)
    onClose();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: activity?.id, date, type, numberOfClients, description });
    setDate(getLocalDate());
    setType('')
    setNumberOfClients(null)
  };

  return  (
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
          borderRadius: '8px',
          boxShadow: 24,
          p: 3
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {buttonType} Project Activity Entry
        </Typography>
        <Stack component="form" onSubmit={handleSubmit} spacing={2} direction="column">
        <TextField
            label="Date"
            type="date"
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
                shrink: true
            }}
            variant="standard"
            fullWidth
            required
        />
           <TextField
            label="Type of Event"
            select
            value={type}
            onChange={(e) => setType(e.target.value)}
            variant="standard"
            fullWidth
            required
          >
            {
              activities.map((activity) => (
                <MenuItem key={activity} value={activity}>{activity}</MenuItem>
              ))
            }
          </TextField>
          <TextField
            label="Description"
            type="description"
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            InputLabelProps={{
                shrink: true
            }}
            variant="standard"
            fullWidth
            required
            multiline
        />
        <TextField
            label="Number of Clients"
            type="number"
            value={numberOfClients}
            onChange={(e) => setNumberOfClients(e.target.valueAsNumber)}
            variant="standard"
            fullWidth
            required
            min={0}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined" startIcon={<CloseIcon />} onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<AddCircleIcon />}>
              {buttonType} 
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
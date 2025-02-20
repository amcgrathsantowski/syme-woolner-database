import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Stack, Button, MenuItem } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { SPECIAL_EVENT } from '../../../api/database/enum-constants';
import getLocalDate from '../date-init';

export default function EventForm({ open, onClose, onSubmit, event, buttonType }) {

  const [date, setDate] = useState(event?.date || getLocalDate())
  const [type, setType] = useState(event?.type || '');
  const [numberOfClients, setNumberOfClients] = useState(event?.number_of_clients || '');

  useEffect(() => {
    if(event)
    {
      setDate(event?.date || getLocalDate())
      setType(event?.type || '');
      setNumberOfClients(event?.number_of_clients ||'');
    }
  }, [event]);

  const events = SPECIAL_EVENT;

  const handleClose = () => {
    setDate(getLocalDate());
    setType('')
    setNumberOfClients(null)
    onClose();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: event?.id, date, type, numberOfClients });
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
          borderRadius: '8px',
          boxShadow: 24,
          p: 3
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {buttonType} Event Entry
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
              events.map((eventType) => (
                <MenuItem key={eventType} value={eventType}>{eventType}</MenuItem>
              ))
            }
          </TextField>
          <TextField
            label="Number of Clients"
            type="number"
            value={numberOfClients}
            onChange={(e) => setNumberOfClients(parseInt(e.target.value))}
            variant="standard"
            fullWidth
            required
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
import { Modal, Box, Typography, Stack, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

export default function DeleteConfirmation({ open, onClose, onConfirm, info}) {
  return (
    <Modal open={open} onClose={onClose}>
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
          p: 4
        }}
      >
        <Typography variant="h6" component="h2" align="center">
          Are you sure you want to delete this {info}?
        </Typography>
        <Stack direction="row" justifyContent="center" mt={4} spacing={2}>
          <Button variant="outlined" startIcon={<CloseIcon />} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={onConfirm}>
            Delete
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
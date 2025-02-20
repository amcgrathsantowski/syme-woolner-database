import { useState } from 'react';
import { Modal, Box, Typography, Stack, Button, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import { usePrivateRequest } from '../../hooks';
import { AxiosError } from 'axios';

export default function Delete({
  open,
  onClose,
  successCallback,
  id,
  info,
  url
}) {
  const axios = usePrivateRequest();
  const [alert, setAlert] = useState({ severity: 'success', message: '' });

  const onConfirm = () => {
    setAlert({ severity: 'success', message: '' });
    axios
      .delete(`${url}`)
      .then((res) => {
        if (res instanceof AxiosError) {
          setAlert({
            severity: 'error',
            message: res.response?.data.error ?? 'Unknown error'
          });
          return;
        }
        if (successCallback) successCallback(id);
        onClose();
      })
      .catch(() => {
        setAlert({ severity: 'error', message: 'Unknown error' });
      });
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        setAlert({ severity: 'success', message: '' });
        onClose();
      }}
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
          boxShadow: 24,
          p: 4
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          align="center"
        >
          Are you sure you want to delete this <u>{info}</u>?
        </Typography>
        {alert.message ? (
          <Alert
            severity={alert.severity}
            sx={{ mt: 2 }}
            onClose={() => setAlert({ severity: 'success', message: '' })}
          >
            {alert.message}
          </Alert>
        ) : null}

        <Stack
          direction="row"
          justifyContent="center"
          mt={4}
          spacing={2}
        >
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={() => {
              setAlert({ severity: 'success', message: '' });
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onConfirm}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

import { Modal, Box, Typography, Button, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BackspaceIcon from '@mui/icons-material/Backspace';

import ForgotPassword from './forgot-password';
import Register from './register';

export { ForgotPassword, Register };

export default function CustomModal({
  open,
  onClose,
  onReset,
  title,
  alertMessage,
  alertSeverity,
  alertOnClose,
  submitButton,
  children
}) {
  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        if (alertOnClose) alertOnClose();
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85vw',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 3
        }}
      >
        {title ? (
          <Typography
            variant="h4"
            component="h2"
            sx={{
              borderRadius: '5px',
              fontWeight: 'bold',
              bgcolor: '#eceff1',
              boxShadow: 3,
              p: 2,
              marginBottom: '30px'
            }}
          >
            {title}
          </Typography>
        ) : null}
        <Box
          sx={{
            maxHeight: '60vh',
            overflow: 'scroll',
            width: '100%',
            marginBottom: '20px'
          }}
        >
          {children}
        </Box>

        {alertMessage ? (
          <Alert
            severity={alertSeverity}
            sx={{ marginBottom: '20px' }}
            onClose={alertOnClose}
          >
            {alertMessage}
          </Alert>
        ) : null}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={onClose}
            startIcon={<CloseIcon />}
            sx={{
              marginRight: submitButton || onReset ? '10px' : '0px'
            }}
          >
            Close
          </Button>
          {onReset ? (
            <Button
              variant="outlined"
              color="warning"
              onClick={onReset}
              startIcon={<BackspaceIcon />}
              sx={{
                marginRight: submitButton ? '10px' : '0px'
              }}
            >
              Reset
            </Button>
          ) : null}
          {submitButton}
        </div>
      </Box>
    </Modal>
  );
}

import {
  Modal,
  Box,
  LinearProgress,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { Suspense } from 'react';

const LinearLoading = () => (
  <>
    <h1 className="pulse">Loading...</h1>
    <LinearProgress />
  </>
);

const CircularLoading = () => (
  <>
    <h2 className="pulse">Loading...</h2>
    <CircularProgress
      color="secondary"
      style={{ width: '100px', height: '100px' }}
    />
  </>
);

function LoadingModal() {
  return (
    <Modal open={true}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85vw',
          maxWidth: '600px',
          outline: 'none'
        }}
      >
        <LinearLoading />
      </Box>
    </Modal>
  );
}

function LinearLoadingComponent() {
  return (
    <Box
      sx={{
        margin: '0 auto',
        width: '80%'
      }}
    >
      <LinearLoading />
    </Box>
  );
}

function CircularLoadingBackdrop({ loading }) {
  return (
    <Backdrop
      open={loading}
      sx={{ position: 'absolute', color: '#fff', borderRadius: '5px' }}
    >
      <div>
        <CircularLoading />
      </div>
    </Backdrop>
  );
}

function BaseLoader({ children }) {
  return <Suspense fallback={<LoadingModal />}>{children}</Suspense>;
}

function PageLoader({ children }) {
  return <Suspense fallback={<LinearLoadingComponent />}>{children}</Suspense>;
}

export { BaseLoader, PageLoader, CircularLoadingBackdrop };

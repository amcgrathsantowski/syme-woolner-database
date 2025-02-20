import { useState } from 'react';
import { DownloadButton, UploadButton } from '../buttons';
import { Box, Alert } from '@mui/material';
import {
  Storage as StorageIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';

export default function DatabaseManagement() {
  const [alert, setAlert] = useState({ message: '', severity: 'success' });

  return (
    <Alert
      severity="warning"
      sx={{ mt: 5, p: 3, maxWidth: '1000px' }}
    >
      <h2
        className="heading"
        style={{ marginTop: 0, paddingTop: 0, marginBottom: '30px' }}
      >
        Database Management
      </h2>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}
      >
        <UploadButton
          title="Select File"
          text="Import Database From Backup"
          href="/admin/database/restore"
          endIcon={<RestoreIcon />}
          setAlert={setAlert}
          sx={{ mx: 5, my: 2 }}
        />
        <DownloadButton
          title="Download"
          color="secondary"
          text="Export Database Backup"
          href="/admin/database/backup"
          filename="SW_DB_BACKUP.sql"
          endIcon={<StorageIcon />}
          setAlert={setAlert}
          sx={{ mx: 5, my: 2 }}
        />
      </Box>

      <Box>
        {alert.message ? (
          <Alert
            severity={alert.severity}
            sx={{ mt: 2 }}
            onClose={() => setAlert({ message: '', severity: 'success' })}
          >
            {alert.message}
          </Alert>
        ) : null}
      </Box>
    </Alert>
  );
}

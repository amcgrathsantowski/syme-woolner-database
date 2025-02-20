import { useState } from 'react';
import { AxiosError } from 'axios';
import { CircularProgress, Tooltip, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon
} from '@mui/icons-material';
import { usePrivateRequest } from '../../hooks';
import { fileSize } from '../../utils';

function DownloadButton({ title, text, href, filename, setAlert, ...props }) {
  const axios = usePrivateRequest();
  const [downloadState, setDownloadState] = useState({
    loading: false,
    progress: 0,
    size: 0
  });

  const onDownload = async () => {
    setDownloadState({ loading: true, progress: 0, size: 0 });
    if (setAlert) setAlert({ message: '', severity: 'success' });
    await axios
      .get(href, {
        method: 'GET',
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          setDownloadState({
            loading: true,
            progress: Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            ),
            size: progressEvent.total
          });
        }
      })
      .then((response) => {
        if (response instanceof AxiosError) {
          if (setAlert)
            setAlert({
              message: response.response?.data.error ?? 'Unknown error',
              severity: 'error'
            });
          setDownloadState({ loading: false, progress: 0, size: 0 });
          return;
        }
        const url = URL.createObjectURL(new Blob([response.data]));

        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (setAlert) setAlert({ message: 'Downloaded', severity: 'success' });
      })
      .catch(() => {
        if (setAlert) setAlert({ message: 'Unknown Error', severity: 'error' });
      })
      .finally(() => {
        setDownloadState({ loading: false, progress: 0, size: 0 });
      });
  };
  return (
    <Tooltip title={title}>
      <LoadingButton
        variant="contained"
        size="large"
        startIcon={<FileDownloadIcon />}
        onClick={onDownload}
        loading={downloadState.loading}
        loadingIndicator={
          <>
            <CircularProgress
              size={24}
              color="primary"
              variant="determinate"
              value={downloadState.progress}
              sx={{ mr: 1 }}
            />
            {downloadState.progress}% - <u>{fileSize(downloadState.size)}</u>
          </>
        }
        {...props}
      >
        {text}
      </LoadingButton>
    </Tooltip>
  );
}

function UploadButton({ title, text, href, setAlert, sx, ...props }) {
  const [uploadState, setUploadState] = useState({
    loading: false,
    progress: 0,
    size: 0
  });
  const axios = usePrivateRequest();
  const [file, setFile] = useState(null);
  const [uploadInput, setUploadInput] = useState(null);

  const uploadFile = async (file_to_upload) => {
    setUploadState({ loading: true, progress: 0, size: 0 });
    const formData = new FormData();
    formData.append('file', file_to_upload);
    await axios
      .post(href, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          setUploadState({
            loading: true,
            progress: Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            ),
            size: progressEvent.total
          });
        }
      })
      .then((response) => {
        if (response instanceof AxiosError) {
          if (setAlert)
            setAlert({
              message: response.response?.data.error ?? 'Unknown error',
              severity: 'error'
            });
          setUploadState({ loading: false, progress: 0, size: 0 });
          return;
        }
        if (setAlert)
          setAlert({
            message: response.data?.message || 'Uploaded',
            severity: 'success'
          });
        setUploadState({ loading: false, progress: 0, size: 0 });
      })
      .catch(() => {
        if (setAlert) setAlert({ message: 'Unknown Error', severity: 'error' });
        setUploadState({ loading: false, progress: 0, size: 0 });
      })
      .finally(() => {
        setUploadState({ loading: false, progress: 0, size: 0 });
        setFile(null);
        document.body.removeChild(uploadInput);
      });

    setUploadState({ loading: false, progress: 0, size: 0 });
  };

  const onUpload = () => {
    if (setAlert) setAlert({ message: '', severity: 'success' });

    if (uploadInput) {
      uploadInput.click();
      return;
    }

    const fileUpload = document.createElement('input');
    fileUpload.setAttribute('type', 'file');
    fileUpload.setAttribute('accept', '.sql');
    fileUpload.style.display = 'none';
    fileUpload.onchange = () => {
      const file = fileUpload.files[0];
      if (!file) return;
      setFile(file);
    };

    setUploadInput(fileUpload);

    document.body.appendChild(fileUpload);
    fileUpload.click();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        ...sx
      }}
    >
      <Tooltip title={title}>
        <LoadingButton
          variant="contained"
          color="warning"
          size="large"
          startIcon={<FileUploadIcon />}
          onClick={onUpload}
          loading={uploadState.loading}
          loadingIndicator={
            <>
              <CircularProgress
                size={24}
                color="primary"
                variant="determinate"
                value={uploadState.progress}
                sx={{ mr: 1 }}
              />
              {uploadState.progress}% - <u>{fileSize(uploadState.size)}</u>
            </>
          }
          {...props}
        >
          {text}
        </LoadingButton>
      </Tooltip>
      {file ? (
        <Box sx={{ mt: 1 }}>
          <LoadingButton
            variant="contained"
            size="small"
            onClick={() => uploadFile(file)}
            loading={uploadState.loading}
            disabled={!file}
            sx={{ mr: 2 }}
          >
            Upload
          </LoadingButton>
          <u>{file?.name}</u>
        </Box>
      ) : null}
    </Box>
  );
}

export { DownloadButton, UploadButton };

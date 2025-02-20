import { useEffect, useState } from 'react';
import { Alert, Box, Card, CardContent } from '@mui/material';
import { AxiosError } from 'axios';
import { usePrivateRequest } from '../../hooks';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { CircularLoadingBackdrop } from '../loader';

export default function ClientCount() {
  const axios = usePrivateRequest();
  const [clientData, setClientData] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', severity: 'success' });
  const [date, setDate] = useState(DateTime.now());
  useEffect(() => {
    const controller = new AbortController();
    async function getData() {
      setLoading(true);
      await axios
        .get(`/employee/reports/client-count?year=${date.year}`, {
          signal: controller.signal
        })
        .then((response) => {
          if (response instanceof AxiosError) {
            setAlert({
              message: response.response?.data.error ?? 'Unknown error',
              severity: 'error'
            });
            setLoading(false);
            return;
          }
          setAlert({ message: '', severity: 'success' });
          setClientData(response.data);
          setLoading(false);
        })
        .catch(() => {
          setAlert({
            message: 'Unknown error',
            severity: 'error'
          });
          setLoading(false);
        });
    }
    getData();
    return () => {
      controller.abort();
      setAlert({ message: '', severity: 'success' });
      setLoading(false);
    };
  }, [date]);

  return (
    <div>
      <h2>Client Annual Statistics</h2>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DatePicker
          label="year"
          openTo="year"
          views={['year']}
          value={date}
          onChange={(newDate) => {
            setDate(newDate);
          }}
        />
      </LocalizationProvider>
      {alert.message ? (
        <Alert severity={alert.severity}>{alert.message}</Alert>
      ) : null}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          margin: '20px 0'
        }}
      >
        <Card
          variant="outlined"
          sx={{ position: 'relative' }}
        >
          <CircularLoadingBackdrop loading={loading} />
          <CardContent>
            <h4>Total Clients Served</h4>
            <Box
              sx={{
                fontSize: '3rem',
                color: 'success.main',
                fontWeight: 'bold'
              }}
            >
              {clientData?.total_clients || 0}
            </Box>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{ position: 'relative' }}
        >
          <CircularLoadingBackdrop loading={loading} />

          <CardContent>
            <h4>New Clients Registered</h4>
            <Box
              sx={{
                fontSize: '3rem',
                color: 'success.main',
                fontWeight: 'bold'
              }}
            >
              {clientData?.new_clients || 0}
            </Box>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{ position: 'relative' }}
        >
          <CircularLoadingBackdrop loading={loading} />
          <CardContent>
            <h4>Unique Clients Served</h4>
            <Box
              sx={{
                fontSize: '3rem',
                color: 'success.main',
                fontWeight: 'bold'
              }}
            >
              {clientData?.unique_clients || 0}
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

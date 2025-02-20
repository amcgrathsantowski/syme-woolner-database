import { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Box,
  LinearProgress,
  Pagination
} from '@mui/material';
import {
  ArrowRightAlt as ArrowRightAltIcon,
  Cached as CachedIcon
} from '@mui/icons-material';
import { AxiosError } from 'axios';
import { usePrivateRequest } from '../../hooks';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { LoadingButton } from '@mui/lab';

const base_colors = [
  '76,159,250',
  '237,180,196',
  '110,238,82',
  '21,81,219',
  '105,92,142',
  '97,211,38',
  '53,130,94',
  '172,182,74',
  '121,141,133',
  '127,102,244',
  '8,119,239',
  '181,217,113'
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const MAX_BARS = 12;

export default function CustomChart({ title, xAxisTitle, dataRoute, colors }) {
  const [chartData, setChartData] = useState({ datasets: [], labels: [] });
  const [chartDataPage, setChartDataPage] = useState({
    datasets: [],
    labels: []
  });
  const [period, setPeriod] = useState('d');
  const [date, setDate] = useState(DateTime.now());
  const axios = usePrivateRequest();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState({});
  const [pagination, setPagination] = useState({ page: 1, count: 0 });
  const [alert, setAlert] = useState({
    message: '',
    severity: 'success'
  });

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: xAxisTitle,
          color: 'red',
          padding: 20
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          color: 'red',
          padding: 20
        }
      }
    }
  };

  function handlePageChange(e, page) {
    setPagination((prev) => ({ ...prev, page }));
    setChartDataPage({
      labels: chartData.labels.slice(MAX_BARS * (page - 1), MAX_BARS * page),
      datasets: chartData.datasets.map((dataset) => ({
        ...dataset,
        data: dataset.data.slice(MAX_BARS * (page - 1), MAX_BARS * page)
      }))
    });
  }

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setAlert({ message: '', severity: 'success' });
      setLoading(true);
      await axios
        .get(`${dataRoute}/chart?period=${period}&date=${date.toISODate()}`, {
          signal: controller.signal
        })
        .then((response) => {
          if (response instanceof AxiosError) {
            setAlert({
              message: response.response?.data.error ?? 'Unknown error',
              severity: 'error'
            });
            return;
          }
          const { labels, datasets } = response.data;
          let no_data_alert = false;

          setPagination((prev) => ({
            page: Math.ceil(labels.length / MAX_BARS) > 1 ? prev.page : 1,
            count: Math.ceil(labels.length / MAX_BARS)
          }));

          if (datasets.length === 0) {
            setAlert({
              message: 'No data found for the selected period',
              severity: 'info'
            });
            labels.forEach((label) => {
              datasets.push({ label, data: [0] });
            });
            no_data_alert = true;
          }

          datasets.forEach((dataset, i) => {
            if (colors) {
              Object.entries(colors).forEach(([key, value]) => {
                if (dataset.label.toLowerCase() === key.toLowerCase()) {
                  dataset.backgroundColor = [`rgba(${value},0.5)`];
                  dataset.borderColor = [`rgba(${value},1)`];
                }
                ``;
                dataset.borderWidth = 1;
              });
            } else {
              dataset.backgroundColor = [
                `rgba(${base_colors[i % base_colors.length]},0.5)`
              ];
              dataset.borderColor = [
                `rgba(${base_colors[i % base_colors.length]},1)`
              ];
              dataset.borderWidth = 1;
              if (!dataset.label) dataset.label = xAxisTitle;
            }
          });

          setChartData({ labels, datasets });

          setChartDataPage({
            labels:
              labels.length > MAX_BARS
                ? labels.slice(
                    MAX_BARS * (pagination.page - 1),
                    MAX_BARS * pagination.page
                  )
                : labels,
            datasets: datasets.map((dataset) => ({
              ...dataset,
              data:
                labels.length > MAX_BARS
                  ? dataset.data.slice(
                      MAX_BARS * (pagination.page - 1),
                      MAX_BARS * pagination.page
                    )
                  : dataset.data
            }))
          });
          if (!no_data_alert) setAlert({ message: '', severity: 'success' });
        })
        .catch(() => {
          setAlert({ message: 'Unknown error', severity: 'error' });
        });
      setLoading(false);
    };

    fetchData();

    return () => {
      controller.abort();
      setAlert({ message: '', severity: 'success' });
      setLoading(false);
    };
  }, [period, date, refresh]);

  return (
    <div>
      <h3 className="heading">{title}</h3>
      {alert.message ? (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ message: '', severity: 'success' })}
          sx={{ mb: '20px' }}
        >
          {alert.message}
        </Alert>
      ) : null}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          margin: '20px 0'
        }}
      >
        <FormControl
          variant="outlined"
          sx={{ mr: 2 }}
        >
          <InputLabel id="period-select-label">Period</InputLabel>
          <Select
            labelId="period-select-label"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Period"
          >
            <MenuItem value="d">Day</MenuItem>
            <MenuItem value="w">Week</MenuItem>
            <MenuItem value="m">Month</MenuItem>
            <MenuItem value="q">Quarter</MenuItem>
            <MenuItem value="y">Year</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DatePicker
            id="date"
            label="Date"
            inputFormat="MM/DD/YYYY"
            value={date}
            onChange={(newDate) => {
              setDate(newDate);
            }}
          />
        </LocalizationProvider>
        <LoadingButton
          variant="contained"
          size="large"
          startIcon={<CachedIcon />}
          loading={loading}
          sx={{ ml: 2 }}
          onClick={() => setRefresh({})}
        >
          Refresh
        </LoadingButton>
      </div>
      {loading ? <LinearProgress sx={{ my: 2 }} /> : null}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          width: '100%',
          maxHeight: '80vh',
          resize: 'vertical',
          overflow: 'hidden'
        }}
      >
        <Bar
          data={chartDataPage}
          options={chartOptions}
          style={{ width: '100%', height: '100%' }}
        />

        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            bottom: '0',
            right: '10px',
            color: 'error.main',
            pointerEvents: 'none',
            '-moz-user-select': 'none',
            '-webkit-user-select': 'none',
            '-ms-user-select': 'none',
            userSelect: 'none'
          }}
        >
          Resize
          <ArrowRightAltIcon />
        </Box>
      </div>
      {pagination.count > 1 ? (
        <Pagination
          variant="outlined"
          color="primary"
          count={pagination.count}
          page={pagination.page}
          onChange={handlePageChange}
        />
      ) : null}
    </div>
  );
}

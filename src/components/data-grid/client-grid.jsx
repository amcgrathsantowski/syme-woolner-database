import { useEffect, useState } from 'react';
import { Alert, LinearProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { usePrivateRequest } from '../../hooks';
import {
  CustomGridToolbar,
  CustomGridPagination,
  CustomGridNoRowsOverlay,
  CustomGridNoResultsOverlay,
  GridWrapper
} from './grid-wrapper';
import { AxiosError } from 'axios';

function ClientGrid({
  columns,
  dataRoute,
  refreshData,
  forceRefreshData,
  loading,
  setLoading,
  ...props
}) {
  const [rows, setRows] = useState([]);
  const axios = usePrivateRequest();
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function getData() {
      setError(null);
      setLoading(true);
      await axios
        .get(dataRoute, { signal: controller.signal })
        .then((response) => {
          if (response instanceof AxiosError) {
            setError(response.response?.data.error ?? 'Unknown error');
            return;
          }
          setRows(response.data.rows);
          setError(null);
        })
        .catch(() => setError('Unknown error'));
      setLoading(false);
    }
    getData();

    return () => {
      controller.abort();
      setLoading(false);
      setError(null);
    };
  }, [refreshData, dataRoute]);
  return (
    <>
      {error ? (
        <Alert
          severity="error"
          onClose={() => setError('')}
          sx={{ mt: 1 }}
        >
          {error}
        </Alert>
      ) : null}
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10
            }
          }
        }}
        autoHeight
        slots={{
          toolbar: CustomGridToolbar,
          loadingOverlay: LinearProgress,
          pagination: CustomGridPagination,
          noRowsOverlay: CustomGridNoRowsOverlay,
          noResultsOverlay: CustomGridNoResultsOverlay
        }}
        slotProps={{
          toolbar: { forceRefreshData: () => forceRefreshData({}) }
        }}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            textDecoration: 'underline'
          },
          '& .MuiDataGrid-virtualScroller': {
            overflow: 'scroll !important'
          },
          ...props.sx
        }}
        style={{ maxHeight: '600px', ...props.style }}
        {...props}
      />
    </>
  );
}

function ClientDataGrid({
  title,
  columns,
  dataRoute,
  gridActions,
  modals,
  ...props
}) {
  const [refreshData, forceRefreshData] = useState({});
  const [loading, setLoading] = useState(false);

  return (
    <GridWrapper
      title={title}
      gridActions={gridActions}
      modals={modals}
    >
      <ClientGrid
        columns={columns}
        dataRoute={dataRoute}
        refreshData={refreshData}
        forceRefreshData={forceRefreshData}
        loading={loading}
        setLoading={setLoading}
        {...props}
      />
    </GridWrapper>
  );
}

export default ClientDataGrid;

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

function ServerGrid({
  rows,
  setRows,
  columns,
  dataRoute,
  refreshData,
  forceRefreshData,
  loading,
  setLoading,
  ...props
}) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });
  const [rowCount, setRowCount] = useState(0);
  const [error, setError] = useState(null);

  const axios = usePrivateRequest();

  useEffect(() => {
    const controller = new AbortController();
    async function getData() {
      setError(null);
      setLoading(true);
      await axios
        .get(
          `${dataRoute}?page=${paginationModel.page}&page_size=${paginationModel.pageSize}`,
          { signal: controller.signal }
        )
        .then((response) => {
          if (response instanceof AxiosError) {
            setError(response.response?.data.error ?? 'Unknown error');
            return;
          }
          setRows(response.data.rows);
          setRowCount(parseInt(response.data.count));
          setError(null);
        })
        .catch(() => {
          setError('Unknown error');
        });
      setLoading(false);
    }
    getData();

    return () => {
      controller.abort();
      setLoading(false);
      setError(null);
    };
  }, [paginationModel, refreshData, dataRoute]);

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
        rowCount={rowCount ?? 0}
        loading={loading}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50, 100]}
        error={error}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10
            }
          }
        }}
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

function ServerDataGrid({
  title,
  columns,
  rows,
  setRows,
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
      <ServerGrid
        rows={rows}
        setRows={setRows}
        columns={columns}
        refreshData={refreshData}
        forceRefreshData={forceRefreshData}
        dataRoute={dataRoute}
        loading={loading}
        setLoading={setLoading}
        {...props}
      />
    </GridWrapper>
  );
}

export default ServerDataGrid;

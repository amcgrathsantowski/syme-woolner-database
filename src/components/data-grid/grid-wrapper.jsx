import { Box, Button, Pagination } from '@mui/material';
import {
  Cached as CachedIcon,
  FolderOpen as FolderOpenIcon,
  SearchOff as SearchOffIcon
} from '@mui/icons-material';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridPagination,
  gridPageSizeSelector,
  gridFilteredTopLevelRowCountSelector,
  useGridApiContext,
  useGridSelector,
  useGridRootProps
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

const getPageCount = (rowCount, pageSize) => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }
  return 0;
};

function CustomPagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const visibleTopLevelRowCount = useGridSelector(
    apiRef,
    gridFilteredTopLevelRowCountSelector
  );
  const pageCount = getPageCount(
    rootProps.rowCount ?? visibleTopLevelRowCount,
    pageSize
  );

  return (
    <Pagination
      color="primary"
      className={className}
      count={pageCount}
      variant="outlined"
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

function CustomGridPagination(props) {
  return (
    <GridPagination
      ActionsComponent={CustomPagination}
      {...props}
    />
  );
}

function CustomGridToolbar({ forceRefreshData }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <Button
        size="small"
        onClick={forceRefreshData}
        startIcon={<CachedIcon />}
      >
        Reload
      </Button>
    </GridToolbarContainer>
  );
}

function GridWrapper({ title, gridActions, modals, children }) {
  return (
    <Box
      sx={{
        margin: '0 auto'
      }}
    >
      {title ? <h3>{title}</h3> : null}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        {gridActions}
      </Box>
      <Box
        sx={{
          '& .MuiDataGrid-root': { border: 'none' }
        }}
      >
        {children}
      </Box>
      {modals}
    </Box>
  );
}

const StyledGridOverlay = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%'
}));

function CustomGridNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <FolderOpenIcon sx={{ fontSize: '45px' }} />
      <h4>No records available</h4>
    </StyledGridOverlay>
  );
}

function CustomGridNoResultsOverlay() {
  return (
    <StyledGridOverlay>
      <SearchOffIcon sx={{ fontSize: '45px' }} />
      <h4>No results found</h4>
    </StyledGridOverlay>
  );
}

export {
  CustomGridToolbar,
  CustomGridPagination,
  CustomGridNoRowsOverlay,
  CustomGridNoResultsOverlay,
  GridWrapper
};

import { Tooltip, Button } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import {
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

function GridAddButton({ title, onClick }) {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={onClick}
    >
      {title}
    </Button>
  );
}

function GridActionEditButton({ onClick }) {
  return (
    <Tooltip title="Edit">
      <GridActionsCellItem
        label="edit"
        color="secondary"
        onClick={onClick}
        icon={<EditIcon />}
      />
    </Tooltip>
  );
}

function GridActionDeleteButton({ onClick }) {
  return (
    <Tooltip title="Delete">
      <GridActionsCellItem
        label="delete"
        color="error"
        onClick={onClick}
        icon={<DeleteIcon />}
      />
    </Tooltip>
  );
}

export { GridAddButton, GridActionEditButton, GridActionDeleteButton };

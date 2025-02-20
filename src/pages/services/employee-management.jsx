import { useState } from 'react';
import { Box } from '@mui/material';
import Register from '../../components/modals/register';
import {
  GridActionDeleteButton,
  GridActionEditButton,
  GridAddButton,
  ServerDataGrid
} from '../../components/data-grid';
import DatabaseManagement from '../../components/database-management';
import { USER_ROLES } from '../../../api/database/enum-constants';
import { formatDate } from '../../utils';
import Delete from '../../components/modals/delete';

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState(null);

  const columns = [
    { field: 'first_name', headerName: 'First Name', flex: 1 },
    { field: 'last_name', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'username', headerName: 'Username', flex: 1 },
    {
      field: 'role',
      headerName: 'Access Level',
      type: 'singleSelect',
      valueOptions: USER_ROLES,
      flex: 1
    },
    {
      field: 'createdAt',
      headerName: 'Date Registered',
      type: 'date',
      valueFormatter: ({ value }) => formatDate(value),
      flex: 1
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      flex: 1,
      getActions: (params) => [
        <GridActionEditButton
          key={Math.random()}
          onClick={() => {
            setId(params.id);
            setOpen(true);
          }}
        />,
        <GridActionDeleteButton
          key={Math.random()}
          onClick={() => {
            setId(params.id);
            setOpenDelete(true);
          }}
        />
      ]
    }
  ];
  return (
    <Box m="40px">
      <h1 className="heading">Employee Management</h1>

      <ServerDataGrid
        title="Employee List"
        columns={columns}
        rows={employees}
        setRows={setEmployees}
        dataRoute="/admin/employee"
        gridActions={
          <GridAddButton
            onClick={() => setOpen(true)}
            title="Register Employee"
          />
        }
        modals={
          <>
            <Register
              open={open}
              handleClose={() => {
                setId(null);
                setOpen(false);
              }}
              id={id}
              successCallback={(employee) => {
                if (!id) setEmployees([employee, ...employees]);
              }}
            />
            <Delete
              open={openDelete}
              onClose={() => setOpenDelete(false)}
              info={'Employee'}
              id={id}
              successCallback={(deletedId) => {
                setEmployees(employees.filter((e) => e.id !== deletedId));
              }}
              url={`/admin/employee/${id}`}
            />
          </>
        }
      />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <DatabaseManagement />
      </Box>
    </Box>
  );
}

export default Employee;

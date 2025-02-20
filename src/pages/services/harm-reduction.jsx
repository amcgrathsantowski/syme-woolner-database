import { Box } from '@mui/material';
import { useState } from 'react';
import { usePrivateRequest } from '../../hooks';
import DeleteConfirmation from '../../components/eventAndAct/delete';
import Popup from '../../components/popup';
import {
  ServerDataGrid,
  GridAddButton,
  GridActionEditButton,
  GridActionDeleteButton
} from '../../components/data-grid';
import { formatDate } from '../../utils';
import { GENDER } from '../../../api/database/enum-constants';
import CustomChart from '../../components/chart';

function HarmReductionService() {
  const [harmReductions, setHarmReductions] = useState([]);
  const [selectedHarmReduction, setSelectedHarmReduction] = useState(null);
  const [editForm, setEditForm] = useState(false);
  const [harmReductionToDelete, setHarmReductionToDelete] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const Axios = usePrivateRequest();

  const handleHarmReductionAdd = () => {
    setFormOpen(true);
  };

  const handleEditActivity = (id) => {
    Axios.get(`/employee/harm-reduction/${id}`)
      .then((response) => {
        console.log(response.data);
        setSelectedHarmReduction(response.data.harm_reduction);
        setEditForm(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteActivity = (id) => {
    setHarmReductionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    Axios.delete(`/employee/harm-reduction/${harmReductionToDelete}`)
      .then(() => {
        console.log('Deleted ');
        setHarmReductions(
          harmReductions.filter(
            (harmReduction) => harmReduction.id !== harmReductionToDelete
          )
        );
        setDeleteModalOpen(false);
        setHarmReductionToDelete(null);
      })
      .catch((error) => console.log(error));
  };

  const columns = [
    {
      field: 'client_initials',
      headerName: 'Client Initials',
      flex: 1
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      flex: 1,
      valueFormatter: ({ value }) => formatDate(value)
    },
    {
      field: 'year_of_birth',
      headerName: 'Year of Birth',
      type: 'number',
      valueFormatter: (params) => params.value,
      flex: 1
    },
    {
      field: 'gender',
      headerName: 'Gender',
      type: 'singleSelect',
      valueOptions: GENDER,
      flex: 1
    },
    {
      field: 'kit_type',
      headerName: 'Kit Type',
      flex: 1,
      minWidth: 250
    },
    {
      field: 'collection_for',
      headerName: 'Collection For',
      flex: 1,
      minWidth: 250
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      flex: 0,
      getActions: (params) => [
        <GridActionEditButton
          key={Math.random()}
          onClick={() => handleEditActivity(params.id)}
        />,
        <GridActionDeleteButton
          key={Math.random()}
          onClick={() => handleDeleteActivity(params.id)}
        />
      ]
    }
  ];

  return (
    <Box m="40px">
      <h1 className="heading">Harm Reduction Service</h1>
      <CustomChart
        title="Harm Reduction Service Activity"
        xAxisTitle="Harm Reduction Services"
        dataRoute="/employee/harm-reduction"
      />
      <ServerDataGrid
        title="Harm Reduction Records"
        columns={columns}
        rows={harmReductions}
        setRows={setHarmReductions}
        dataRoute="/employee/harm-reduction"
        gridActions={
          <GridAddButton
            onClick={handleHarmReductionAdd}
            title="Add New Harm Reduction"
          />
        }
        modals={
          <>
            <DeleteConfirmation
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
              info={'harm-reduction'}
            />
            <Popup
              openDialogBox={formOpen}
              setOpenDialogBox={setFormOpen}
              buttonType="Add"
            />
            <Popup
              openDialogBox={editForm}
              setOpenDialogBox={setEditForm}
              selectedHarmReduction={selectedHarmReduction}
              setSelectedHarmReduction={setSelectedHarmReduction}
              buttonType="Update"
            />
          </>
        }
      />
    </Box>
  );
}

export default HarmReductionService;

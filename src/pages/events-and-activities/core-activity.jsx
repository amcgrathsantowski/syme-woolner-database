import { useState } from 'react';
import { Box } from '@mui/material';
import {
  GridActionDeleteButton,
  GridActionEditButton,
  GridAddButton,
  ServerDataGrid
} from '../../components/data-grid';
import ActivityForm from '../../components/eventAndAct/activity-modal';
import DeleteConfirmation from '../../components/eventAndAct/delete';
import { usePrivateRequest } from '../../hooks';
import ClientModal from '../../components/eventAndAct/client-modal';
import { CORE_ACTIVITY } from '../../../api/database/enum-constants';
import { formatDate } from '../../utils';
import CustomChart from '../../components/chart';

export default function ActivitiesTab() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState({
    id: '',
    date: '',
    type: '',
    numberOfClients: 0
  });
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [buttonType, setButtonType] = useState('');
  const [clients, setClients] = useState([]);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const axios = usePrivateRequest();

  // Event handlers
  const handleEditActivity = (id) => {
    axios
      .get(`/employee/core-activity/${id}`)
      .then((response) => {
        setSelectedActivity(response.data.core_activity);
        setButtonType('Edit');
        setFormOpen(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setButtonType('Add');
    setFormOpen(true);
  };

  const handleClose = () => {
    setSelectedActivity(null);
    setFormOpen(false);
  };

  const handleFormSubmit = (activity) => {
    if (buttonType == 'Add') {
      const data = JSON.stringify({
        type: activity.type,
        date: activity.date,
        number_of_clients: activity.numberOfClients
      });
      console.log(data);
      axios
        .post('/employee/core-activity', data, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
          console.log('Entry Added');
          setSelectedActivity(null);
          handleClose();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      const data = JSON.stringify({
        type: activity.type,
        date: activity.date,
        number_of_clients: activity.numberOfClients
      });
      axios
        .put(`/employee/core-activity/${activity?.id}`, data, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
          console.log('Editted Successfully');
          setSelectedActivity(null);
          handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDeleteActivity = (id) => {
    setActivityToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    axios
      .delete(`/employee/core-activity/${activityToDelete}`)
      .then(() => {
        console.log('Deleted ');
        setActivities(
          activities.filter((activity) => activity.id !== activityToDelete)
        );
        setDeleteModalOpen(false);
        setActivityToDelete(null);
      })
      .catch((error) => console.log(error));
  };

  const handleRowClick = (activityId) => {
    setSelectedActivity(activityId);
    axios
      .get(
        `/employee/core-activity/${activityId}/participants?page=1&page_size=20`
      )
      .then((response) => {
        const clientData = response.data.rows;
        console.log(clients);
        setClients((prevState) => ({
          ...prevState,
          [activityId]: clientData
        }));
        renderRowDetails({ row: { rows: clientData } });
      })
      .catch((err) => console.error(err));
  };

  const renderRowDetails = (params) => {
    if (params && params.row && params.row.rows) {
      setSelectedClients(params.row.rows);
      setClientModalOpen(true);
    } else {
      console.error('Invalid parameters passed to renderRowDetails');
    }
  };
  // DataGrid columns
  const columns = [
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: CORE_ACTIVITY,
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
      field: 'number_of_clients',
      headerName: 'Number of Clients',
      type: 'number',
      flex: 1
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      flex: 0,
      getActions: (params) => [
        <GridActionEditButton
          key={Math.random()}
          onClick={() => {
            handleEditActivity(params.id);
          }}
        />,
        <GridActionDeleteButton
          key={Math.random()}
          onClick={() => {
            handleDeleteActivity(params.id);
          }}
        />
      ]
    }
  ];

  // Return component
  return (
    <Box m="40px">
      <CustomChart
        title="Core Activity Chart"
        xAxisTitle="People Joined"
        dataRoute="/employee/core-activity"
        colors={{
          'summer camp': '210,230,17',
          'march break': '20, 225, 40'
        }}
      />
      <ServerDataGrid
        title="Core Activity List"
        columns={columns}
        rows={activities}
        setRows={setActivities}
        dataRoute="/employee/core-activity"
        onRowClick={(row) => handleRowClick(row.id)}
        gridActions={
          <GridAddButton
            title="Add New Core Activity"
            onClick={handleAddActivity}
          />
        }
        modals={
          <>
            <ActivityForm
              open={formOpen}
              onClose={handleClose}
              onSubmit={handleFormSubmit}
              activity={selectedActivity}
              buttonType={buttonType}
            />
            <DeleteConfirmation
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
              info={'activity'}
            />
            <ClientModal
              open={clientModalOpen}
              onClose={() => setClientModalOpen(false)}
              clients={selectedClients}
              activityId={selectedActivity}
              activityType={'core-activity'}
              successCallback={(id) => {
                setActivities(
                  activities.map((m) =>
                    m.id === id
                      ? { ...m, number_of_clients: m.number_of_clients - 1 }
                      : m
                  )
                );
              }}
            />
          </>
        }
      />
    </Box>
  );
}

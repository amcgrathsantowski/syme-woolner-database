import { useState } from 'react';
import {
  GridActionDeleteButton,
  GridActionEditButton,
  GridAddButton,
  ServerDataGrid
} from '../../components/data-grid';
import {
  Box,
  MenuItem,
  Menu,
  Tooltip,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  AddCircle as AddCircleIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  EventOutlined as EventOutlinedIcon,
  VaccinesOutlined as VaccinesOutlinedIcon
} from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { usePrivateRequest } from '../../hooks';
import DeleteConfirmation from '../../components/eventAndAct/delete';
import ClientForm from '../../components/food-bank/client-modal';
import Popup from '../../components/popup';
import CoreActivityModal from '../../components/food-bank/client-coreActivity';
import ProjectActivityModal from '../../components/food-bank/client-projectActivity';
import ClientInfoModal from '../../components/food-bank/client-readDialog';
import { formatDate } from '../../utils';
import { GENDER } from '../../../api/database/enum-constants';
import Referral from '../../components/modals/referral';

function ClientService() {
  const [clients, setClients] = useState([]);
  //Form Data
  const [age, setAge] = useState(0);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [numAdults, setNumAdults] = useState(0);
  const [numChildren, setNumChildren] = useState(0);
  const [dateRegistered, setDateRegistered] = useState('');
  // Delete
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  //Edit
  const [employeeToEdit, setEmployeeToEdit] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  //Create
  const [openCreateModal, setOpenCreateModal] = useState(false);
  //read
  const [clientModalOpen, setClientModalOpen] = useState(false);
  //Sub Menu Referral
  const [openReferralModal, setOpenReferralModal] = useState(false);
  //Sub Menu Harm Reduction
  const [openHarmReductionModal, setOpenHarmReductionModal] = useState(false);
  //Sub Menu Core Activity
  const [openCoreActivityModal, setOpenCoreActivityModal] = useState(false);
  const [coreActivities, setCoreActivities] = useState([]);
  //Sub Menu Project Activity
  const [openProjectActivityModal, setOpenProjectActivityModal] =
    useState(false);
  const [projectActivities, setProjectActivities] = useState([]);
  //Menu Options
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [clientName, setClientName] = useState('');

  const Axios = usePrivateRequest();

  // Update values of input fields when employeeToEdit changes

  function handleInputChange(event) {
    const { name, value } = event.target;

    if (name === 'age') {
      setAge(value);
    }
    if (name === 'gender') {
      setSelectedGender(value);
    }
    if (name === 'emergency_contact_relationship') {
      setSelectedRelationship(value);
    }
    if (name === 'address') {
      setAddress(value);
    }
    if (name === 'postal_code') {
      setPostalCode(value);
    }
    if (name === 'number_of_adults') {
      setNumAdults(value);
    }
    if (name === 'number_of_children') {
      setNumChildren(value);
    }
    if (name === 'date_registered') { 
      setDateRegistered(value);
    }
    setEmployeeToEdit((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }

  function handleEdit(employeeId) {
    Axios.get(`/employee/client/${employeeId}`)
      .then((response) => {
        //console.log(response.data.client)
        setEmployeeToEdit(response.data.client);
        setAge(response.data.client.age);
        setSelectedGender(response.data.client.gender);
        setSelectedRelationship(
          response.data.client.emergency_contact_relationship
        );
        setAddress(response.data.client.address);
        setPostalCode(response.data.client.postal_code);
        setNumAdults(response.data.client.number_of_adults);
        setNumChildren(response.data.client.number_of_children);
        setDateRegistered(response.data.client.dateRegistered);
      })
      .catch((error) => {
        console.log(error);
      });
    setOpenEditModal(true);
  }
  function closeEditModal() {
    setOpenEditModal(false);
    setEmployeeToEdit({});
    setAge(0);
    setSelectedGender('');
    setSelectedRelationship('');
    setAddress('');
    setPostalCode('');
    setNumAdults('');
    setNumChildren('');
    setDateRegistered('');
  }

  const handleConfirmEdit = (e) => {
    e.preventDefault();
    let data = JSON.stringify(employeeToEdit);
    Axios.put(`/employee/client/${employeeToEdit.id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        console.log('Editted Successfully');
        closeEditModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleDelete(employeeId) {
    setEmployeeToDelete(employeeId);
    setOpenDeleteModal(true);
  }
  function handleConfirmDelete() {
    Axios.delete(`/employee/client/${employeeToDelete}`)
      .then(() => {
        setClients(
          clients.filter((employee) => employee.id !== employeeToDelete)
        );
        setOpenDeleteModal(false);
      })
      .catch((error) => console.log(error));
  }

  const handleCreate = () => {
    setEmployeeToEdit({});
    setOpenCreateModal(true);
  };
  const closeCreateModal = () => {
    setEmployeeToEdit({});
    setAge(0);
    setSelectedGender('');
    setSelectedRelationship('');
    setAddress('');
    setPostalCode('');
    setNumAdults('');
    setNumChildren('');
    setDateRegistered('');
    setOpenCreateModal(false);
  };
  const handleConfirmCreate = (e) => {
    e.preventDefault();
    console.log(employeeToEdit);
    let data = JSON.stringify(employeeToEdit);

    console.log(data);
    Axios.post('/employee/client', data, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => {
        if (res.response?.status === 500) {
          alert('One of your input is wrong, please check your input format');
        } else {
          console.log('Entry Added');

          closeCreateModal();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOpenMenu = (event, employeeId) => {
    setMenuAnchorEl(event.currentTarget);
    Axios.get(`/employee/client/${employeeId}`)
      .then((response) => {
        setClientId(employeeId);
        setClientName(
          `${response.data.client.first_name} ${response.data.client.last_name}`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Referral Service

  const handleOpenReferralModal = () => {
    setOpenReferralModal(true);
    setMenuAnchorEl(null);
  };

  //Harm Reduction Service
  const handleOpenHarmReductionModal = () => {
    setOpenHarmReductionModal(true);
    setMenuAnchorEl(null);
  };

  //Core Activity
  const handleOpenCoreActivityModal = async () => {
    setMenuAnchorEl(null);
    try {
      const response = await Axios.get('/employee/core-activity/upcoming');
      setCoreActivities(response.data.rows);
      setOpenCoreActivityModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeCoreActivityModal = () => {
    setOpenCoreActivityModal(false);
    setCoreActivities([]);
  };

  const handleAddToCoreActivity = (coreActivityId) => {
    const data = {
      client_ids: [clientId]
    };
    Axios.post(`employee/core-activity/${coreActivityId}/participants`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        console.log(
          `Adding client ${clientId} to core activity ${coreActivityId}`
        );
        closeCoreActivityModal();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //Project Activity
  const handleOpenProjectActivityModal = async () => {
    setMenuAnchorEl(null);
    try {
      const response = await Axios.get('/employee/project-activity/upcoming');
      setProjectActivities(response.data.rows);
      setOpenProjectActivityModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeProjectActivityModal = () => {
    setOpenProjectActivityModal(false);
    setProjectActivities([]);
  };
  const handleAddToProjectActivity = (projectActivityId) => {
    const data = {
      client_ids: [clientId]
    };
    Axios.post(
      `employee/project-activity/${projectActivityId}/participants`,
      data,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
      .then(() => {
        console.log(
          `Adding client ${clientId} to project activity ${projectActivityId}`
        );
        closeProjectActivityModal();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleRowClick = (param) => {
    setClientId(param.row.id);
    setClientModalOpen(true);
  };

  const columns = [
    { field: 'first_name', headerName: 'First Name', flex: 1 },
    { field: 'last_name', headerName: 'Last Name', flex: 1 },
    {
      field: 'age',
      headerName: 'Age',
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
      field: 'total_family_members',
      headerName: 'Family Members',
      type: 'number',
      flex: 0.5
    },
    {
      field: 'contact_number',
      headerName: 'Phone No.',
      type: 'string',
      flex: 1
    },
    {
      field: 'date_registered',
      headerName: 'Date Registered',
      type: 'date',
      flex: 1,
      valueFormatter: ({ value }) => formatDate(value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      flex: 1,
      getActions: (params) => [
        <Tooltip
          key={Math.random()}
          title="Add Service"
        >
          <GridActionsCellItem
            label="Add Service"
            icon={<AddCircleIcon color="primary" />}
            onClick={(event) => {
              handleOpenMenu(event, params.row.id);
            }}
          />
        </Tooltip>,
        <GridActionEditButton
          key={Math.random()}
          onClick={() => {
            handleEdit(params.row.id);
          }}
        />,
        <GridActionDeleteButton
          key={Math.random()}
          onClick={() => {
            handleDelete(params.row.id);
          }}
        />
      ]
    }
  ];

  return (
    <Box m="40px">
      <h1 className="heading">Client Service</h1>

      <ServerDataGrid
        title="Client List"
        rows={clients}
        columns={columns}
        onRowClick={handleRowClick}
        setRows={setClients}
        dataRoute={'/employee/client'}
        gridActions={
          <GridAddButton
            title="Add New Client"
            onClick={handleCreate}
          />
        }
        modals={
          <>
            <Referral
              open={openReferralModal}
              handleClose={() => setOpenReferralModal(false)}
              submitType={'Add'}
            ></Referral>
            <Popup
              openDialogBox={openHarmReductionModal}
              setOpenDialogBox={setOpenHarmReductionModal}
              buttonType="Add"
              clientId={clientId}
              clientName={clientName}
            />
            <CoreActivityModal
              open={openCoreActivityModal}
              onClose={closeCoreActivityModal}
              coreActivities={coreActivities}
              onAdd={handleAddToCoreActivity}
            />
            <ProjectActivityModal
              open={openProjectActivityModal}
              onClose={closeProjectActivityModal}
              projectActivities={projectActivities}
              onAdd={handleAddToProjectActivity}
            />

            <DeleteConfirmation
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
              onConfirm={handleConfirmDelete}
              info={'client'}
            />

            <ClientForm
              mode={'edit'}
              onClose={closeEditModal}
              open={openEditModal}
              handleInputChange={handleInputChange}
              onConfirm={handleConfirmEdit}
              client={employeeToEdit}
              age={age}
              selectedGender={selectedGender}
              selectedRelationship={selectedRelationship}
              address={address}
              numChildren={numChildren}
              numAdults={numAdults}
              postalCode={postalCode}
              dateRegistered={dateRegistered}
            />
            <ClientForm
              mode={'add'}
              onClose={closeCreateModal}
              open={openCreateModal}
              handleInputChange={handleInputChange}
              onConfirm={handleConfirmCreate}
              client={employeeToEdit}
              age={age}
              selectedGender={selectedGender}
              selectedRelationship={selectedRelationship}
              address={address}
              numChildren={numChildren}
              numAdults={numAdults}
              postalCode={postalCode}
              dateRegistered={dateRegistered}
            />
            <ClientInfoModal
              clientId={clientId}
              open={clientModalOpen}
              onClose={() => setClientModalOpen(false)}
            />
          </>
        }
      />
      <Menu
        anchorEl={menuAnchorEl}
        open={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem onClick={handleOpenReferralModal}>
          <ListItemIcon>
            <DescriptionOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Referral" />
        </MenuItem>
        <MenuItem onClick={handleOpenHarmReductionModal}>
          <ListItemIcon>
            <VaccinesOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Harm Reduction" />
        </MenuItem>
        <MenuItem onClick={handleOpenCoreActivityModal}>
          <ListItemIcon>
            <EventOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Core Activity" />
        </MenuItem>
        <MenuItem onClick={handleOpenProjectActivityModal}>
          <ListItemIcon>
            <EventOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Project Activity" />
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default ClientService;

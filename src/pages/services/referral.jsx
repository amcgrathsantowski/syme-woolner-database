import { useState } from 'react';
import {
  GridActionDeleteButton,
  GridActionEditButton,
  GridAddButton,
  ServerDataGrid
} from '../../components/data-grid';
import { Box } from '@mui/material';
import { formatDate } from '../../utils';
import Referral from '../../components/modals/referral';
import Delete from '../../components/modals/delete';
import CustomChart from '../../components/chart';

function ReferralService() {
  const [referrals, setReferrals] = useState([]);
  const [openReferralModal, setOpenReferralModal] = useState(false);
  const [openReferralModalForEdit, setOpenReferralModalForEdit] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [id, setId] = useState(null);

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      flex: 1,
      valueFormatter: ({ value }) => formatDate(value)
    },
    {
      field: 'shelter_count',
      headerName: 'Shelter',
      type: 'number',
      flex: 1
    },
    {
      field: 'housing_count',
      headerName: 'Housing',
      type: 'number',
      flex: 1
    },
    {
      field: 'mental_health_count',
      headerName: 'Mental Health',
      type: 'number',
      flex: 1
    },
    {
      field: 'medical_services_count',
      headerName: 'Medical Services',
      type: 'number',
      flex: 1
    },
    {
      field: 'income_support_count',
      headerName: 'Income Support',
      type: 'number',
      flex: 1
    },
    {
      field: 'legal_services_count',
      headerName: 'Legal Services',
      type: 'number',
      flex: 1
    },
    {
      field: 'settlement_services_count',
      headerName: 'Settlement Services',
      type: 'number',
      flex: 1
    },
    {
      field: 'harm_reduction_services_count',
      headerName: 'Harm Reduction Services',
      type: 'number',
      flex: 1
    },
    {
      field: 'employment_supports_count',
      headerName: 'Employment Supports',
      type: 'number',
      flex: 1
    },
    {
      field: 'food_bank_count',
      headerName: 'Food Bank',
      type: 'number',
      flex: 1
    },
    {
      field: 'meal_service_count',
      headerName: 'Meal Service',
      type: 'number',
      flex: 1
    },
    {
      field: 'id_clinic_count',
      headerName: 'ID Clinic',
      type: 'number',
      flex: 1
    },
    {
      field: 'other_count',
      headerName: 'Other',
      type: 'number',
      flex: 1
    },
    { field: 'description', headerName: 'Description', flex: 1, minWidth: 250 },
    {
      field: 'action',
      headerName: 'Actions',
      type: 'actions',
      flex: 0,
      getActions: (params) => [
        <GridActionEditButton
          key={Math.random()}
          onClick={() => {
            setOpenReferralModalForEdit(true);
            setId(params.id);
          }}
        />,
        <GridActionDeleteButton
          key={Math.random()}
          onClick={() => {
            setOpenDeleteModal(true);
            setId(params.id);
          }}
        />
      ]
    }
  ];
  return (
    <Box m="40px">
      <h1 className="heading">Referral Service</h1>
      <CustomChart
        title="Referral Service Activity"
        xAxisTitle="Referrals Provided"
        dataRoute="/employee/referral"
      />

      <ServerDataGrid
        title="Referral Records"
        rows={referrals}
        setRows={setReferrals}
        dataRoute="/employee/referral"
        columns={columns}
        gridActions={
          <GridAddButton
            title="Add New Referral"
            onClick={() => {
              setOpenReferralModal(true);
            }}
          />
        }
        modals={
          <>
            <Referral
              open={openReferralModal}
              handleClose={() => setOpenReferralModal(false)}
              submitType={'Add'}
              successCallback={(referral) =>
                setReferrals([referral, ...referrals])
              }
            ></Referral>
            <Referral
              open={openReferralModalForEdit}
              handleClose={() => setOpenReferralModalForEdit(false)}
              submitType={'Edit'}
              successCallback={(referral, oldReferralId) => {
                setReferrals(
                  referrals.map((m) => (m.id === oldReferralId ? referral : m))
                );
              }}
              id={id}
            ></Referral>
            <Delete
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
              info={'referral'}
              id={id}
              successCallback={(deletedId) => {
                setReferrals(referrals.filter((m) => m.id !== deletedId));
              }}
              url={`/employee/referral/${id}`}
            ></Delete>
          </>
        }
      />
    </Box>
  );
}

export default ReferralService;

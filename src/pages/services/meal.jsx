import { useState } from 'react';
import { Box } from '@mui/material';
import Meal from '../../components/modals/meal';
import Delete from '../../components/modals/delete';
import {
  ServerDataGrid,
  GridActionEditButton,
  GridActionDeleteButton,
  GridAddButton
} from '../../components/data-grid';
import { formatDate } from '../../utils';
import CustomChart from '../../components/chart';

function MealService() {
  const [meals, setMeals] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [id, setId] = useState(null);

  const columns = [
    {
      field: 'type',
      headerName: 'Service Name',
      flex: 1
    },
    {
      field: 'date',
      headerName: 'Entry Date',
      type: 'date',
      flex: 1,
      valueFormatter: ({ value }) => formatDate(value)
    },
    {
      field: 'number_of_clients',
      headerName: 'Clients Served',
      type: 'number',
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
            setOpenEdit(true);
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
      <h1 className="heading">Meal Service</h1>
      <CustomChart
        title="Meal Service Activity"
        xAxisTitle="Meals Served"
        dataRoute="/employee/meal"
        colors={{
          breakfast: '96,92,247',
          lunch: '254,203,45',
          takeout: '242,38,19',
          snack: '30,130,76'
        }}
      />
      <ServerDataGrid
        title="Meal Records"
        rows={meals}
        columns={columns}
        setRows={setMeals}
        dataRoute="/employee/meal"
        gridActions={
          <GridAddButton
            onClick={() => setOpen(true)}
            title="Add Meal Entry"
          />
        }
        modals={
          <>
            <Meal
              open={open}
              handleClose={() => setOpen(false)}
              successCallback={(meal) => setMeals([meal, ...meals])}
              submitType={'Add'}
            ></Meal>
            <Meal
              open={openEdit}
              handleClose={() => setOpenEdit(false)}
              successCallback={(meal, oldMealId) => {
                setMeals(meals.map((m) => (m.id === oldMealId ? meal : m)));
              }}
              submitType={'Edit'}
              id={id}
            ></Meal>

            <Delete
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
              info={'Meal'}
              id={id}
              successCallback={(deletedId) => {
                setMeals(meals.filter((m) => m.id !== deletedId));
              }}
              url={`/employee/meal/${id}`}
            />
          </>
        }
      />
    </Box>
  );
}

export default MealService;

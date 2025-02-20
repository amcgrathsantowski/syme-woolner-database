import { Box } from '@mui/material';
import CustomChart from '../components/chart';
import { ClientDataGrid } from '../components/data-grid';

function Dashboard() {
  const columns = [
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1 },
    {
      field: 'number_of_clients',
      headerName: 'Number of Clients',
      flex: 1
    }
  ];

  return (
    <Box m="40px">
      <h1 className="heading">Dashboard</h1>
      <CustomChart
        title="Recent Meal Activity"
        xAxisTitle="Meals Served"
        dataRoute="/employee/meal"
        colors={{
          breakfast: '96,92,247',
          lunch: '254,203,45',
          takeout: '242,38,19',
          snack: '30,130,76'
        }}
      />
      <ClientDataGrid
        title="Upcoming Events"
        columns={columns}
        dataRoute="/employee/special-event/upcoming"
      />
    </Box>
  );
}

export default Dashboard;

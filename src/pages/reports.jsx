import { Box } from '@mui/material';
import CustomChart from '../components/chart';
import ClientCount from '../components/client-count';
export default function Reports() {
  return (
    <Box m="40px">
      <h1 className="heading">Reports</h1>
      <CustomChart
        title="Clients Served"
        xAxisTitle="Clients Served"
        dataRoute="/employee/reports/client-count"
      />
      <ClientCount />
    </Box>
  );
}


import { Dialog, DialogTitle, DialogContent, Button,Table, TableCell, TableBody, TableRow } from '@mui/material';

function CoreActivityModal({ open, onClose, coreActivities, onAdd }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Core Activities</DialogTitle>
      <DialogContent>
      <Table>
          <TableBody>
            {coreActivities.map((coreActivity) => (
              <TableRow key={coreActivity.id}>
                <TableCell>{coreActivity.type}</TableCell>
                <TableCell>{coreActivity.date}</TableCell>
                <TableCell>{coreActivity.number_of_clients}</TableCell>
                <TableCell>
                <Button variant="contained" color="primary" onClick={() => onAdd(coreActivity.id)}>Add</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </DialogContent>
    </Dialog>
  );
}

export default CoreActivityModal;

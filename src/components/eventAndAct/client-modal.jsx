import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableRow, TableCell, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePrivateRequest } from '../../hooks';

function ClientModal({ open, onClose, clients, activityId, activityType, successCallback }) {
  const axios = usePrivateRequest();
  // Function to handle client deletion
  const handleDelete = (clientId) => {
      axios({
        method: 'delete',
        url: `/employee/${activityType}/${activityId}/participants`,
        data: {
          client_ids: [clientId]
        }
      })
      .then(() => {
        onClose();
        successCallback(activityId);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Clients</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.client.id}>
                <TableCell>{client.client.first_name} {client.client.last_name}</TableCell>
                <TableCell>{client.date_registered}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="secondary" startIcon={<DeleteIcon/>} onClick={() => handleDelete(client.client.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

export default ClientModal;
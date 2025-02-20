
import { Dialog, DialogTitle, DialogContent, Button,Table, TableCell, TableBody, TableRow } from '@mui/material';

function ProjectActivityModal({ open, onClose, projectActivities, onAdd }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Project Activities</DialogTitle>
      <DialogContent>
      <Table>
          <TableBody>
            {projectActivities.map((projectActivity) => (
              <TableRow key={projectActivity.id}>
                <TableCell>{projectActivity.type}</TableCell>
                <TableCell>{projectActivity.date}</TableCell>
                <TableCell>{projectActivity.number_of_clients}</TableCell>
                <TableCell>{projectActivity.description}</TableCell>
                <TableCell>
                <Button variant="contained" color="primary" onClick={() => onAdd(projectActivity.id)}>Add</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </DialogContent>
    </Dialog>
  );
}

export default ProjectActivityModal;

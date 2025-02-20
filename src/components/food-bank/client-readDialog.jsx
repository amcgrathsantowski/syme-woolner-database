import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Grid } from '@mui/material';
import { usePrivateRequest } from '../../hooks';

const ClientInfoModal = ({ clientId, open, onClose }) => {
  const [clientData, setClientData] = useState({});
  const Axios = usePrivateRequest();

  useEffect(() => {
    if (clientId && open) {
      Axios.get(`/employee/client/${clientId}`)
        .then((response) => {
          const client = response.data.client;
          setClientData(client);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [clientId, open]);

  const InfoLine = ({ label, value }) => (
    <Typography variant="body1">
      <b>{label}: </b>{value}
    </Typography>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Client Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InfoLine label="First Name" value={clientData.first_name} />
            <InfoLine label="Last Name" value={clientData.last_name} />
            <InfoLine label="Contact Number" value={clientData.contact_number} />
            <InfoLine label="Address" value={clientData.address} />
            <InfoLine label="Postal Code" value={clientData.postal_code} />
          </Grid>
          <Grid item xs={6}>
            <InfoLine label="Age" value={clientData.age} />
            <InfoLine label="Gender" value={clientData.gender} />
            <InfoLine label="Number of Adults" value={clientData.number_of_adults} />
            <InfoLine label="Number of Children" value={clientData.number_of_children} />
            <InfoLine label="Total Family Members" value={clientData.total_family_members} />
          </Grid>
          <Grid item xs={12}>
            <InfoLine label="Emergency Contact Number" value={clientData.emergency_contact_number} />
            <InfoLine label="Emergency Contact Relationship" value={clientData.emergency_contact_relationship} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ClientInfoModal;

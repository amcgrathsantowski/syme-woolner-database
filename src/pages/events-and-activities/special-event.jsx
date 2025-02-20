import { useState } from 'react';
import { Box } from '@mui/material';
import Event from '../../components/modals/events';
import Delete from '../../components/modals/delete';
import {
  ServerDataGrid,
  GridActionEditButton,
  GridActionDeleteButton,
  GridAddButton
} from '../../components/data-grid';
import { formatDate } from '../../utils';
import CustomChart from '../../components/chart';

function EventService() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [id, setId] = useState(null);

  const columns = [
    {
      field: 'type',
      headerName: 'Event Name',
      flex: 1
    },
    {
      field: 'date',
      headerName: 'Event Date',
      type: 'date',
      flex: 1,
      valueFormatter: ({ value }) => formatDate(value)
    },
    {
      field: 'number_of_clients',
      headerName: 'Clients Attended',
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
      <h1 className="heading">Event Service</h1>
      <CustomChart
        title="Event Records"
        dataRoute="/employee/special-event"
        xAxisTitle="People Attended"
        colors={{
          thanksgiving: '200, 150, 10',
          christmas: '255, 50, 86',
          'good friday': '54, 162, 235'
        }}
      />
      <ServerDataGrid
        title="Event Records"
        rows={events}
        columns={columns}
        setRows={setEvents}
        dataRoute="/employee/special-event"
        gridActions={
          <GridAddButton
            onClick={() => setOpen(true)}
            title="Add Event Entry"
          />
        }
        modals={
          <>
            <Event
              open={open}
              handleClose={() => setOpen(false)}
              successCallback={(event) => setEvents([event, ...events])}
              submitType={'Add'}
            ></Event>
            <Event
              open={openEdit}
              handleClose={() => setOpenEdit(false)}
              successCallback={(event, oldEventId) => {
                setEvents(events.map((e) => (e.id === oldEventId ? event : e)));
              }}
              submitType={'Edit'}
              id={id}
            ></Event>

            <Delete
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
              info={'event'}
              id={id}
              successCallback={(deletedId) => {
                setEvents(events.filter((e) => e.id !== deletedId));
              }}
              url={`/employee/special-event/${id}`}
            ></Delete>
          </>
        }
      />
    </Box>
  );
}

export default EventService;

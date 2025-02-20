import { Box, Typography, Stack } from '@mui/material';
import { Modal, Button, TextField, MenuItem } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { MEAL_TYPE } from '../../../api/database/enum-constants';

function ModalComponent(props) {
  const { open, onClose, onSubmit, date, setDate, numMeals, setNumMeals, mealType, setMealType, buttonType } = props;
  const meals = MEAL_TYPE;
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 3
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {buttonType} Meal Entry
        </Typography>
        <Stack
          component="form"
          onSubmit={onSubmit}
          spacing={2}
          direction="column"
        >
          <TextField
            label="Date"
            type="date"
            defaultValue={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            variant="standard"
            fullWidth
            required
          />
          <TextField
            label="Number of Meals Served"
            type="number"
            value={numMeals}
            onChange={(e) => setNumMeals(parseInt(e.target.value))}
            variant="standard"
            fullWidth
            required
          />
          <TextField
            label="Type of Meal"
            select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            variant="standard"
            fullWidth
            required
          >
            {meals.map((meal, index) => (
              <MenuItem key={index} value={meal}>{meal}</MenuItem>
            ))}
          </TextField>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={onClose}                
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddCircleIcon />}
            >
              {buttonType} 
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default ModalComponent;

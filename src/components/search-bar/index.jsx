import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';

export default function SearchBar({ setSearchQuery }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      borderRadius="5px"
      bgcolor="white"
      px={2}
      marginLeft="50px"
    >
      <InputBase
        placeholder="Search"
        sx={{ ml: 1, fontSize: '1rem' }}
        onInput={(e) => {
          if (setSearchQuery) setSearchQuery(e.target.value);
        }}
      />
      <SearchIcon color="primary" />
    </Box>
  );
}

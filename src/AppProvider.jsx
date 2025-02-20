import { ThemeProvider, createTheme } from '@mui/material';
import { DataProvider } from './context/data-context';

export default function AppProviders({ children }) {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#219869'
      },
      secondary: {
        main: '#1976d2'
      }
    },
    typography: {
      fontFamily: 'Poppins, sans-serif'
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <DataProvider>{children}</DataProvider>
    </ThemeProvider>
  );
}

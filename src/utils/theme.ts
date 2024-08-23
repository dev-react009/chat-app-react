import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e8ff0',
    },
    secondary: {
      main: '#d32f2f',
    },
    background: {
      default:'rgb(2,0,36)',
    },
  },
   typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5',
          backgroundImage: 'url(/path-to-your-background-image.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        },
      },
    },
  },
});

export default theme;

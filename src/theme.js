// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Couleur principale
    },
    secondary: {
      main: '#dc004e', // Couleur secondaire
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Personnalisation des boutons
        },
      },
    },
  },
});

export default theme;

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#F8F9FA', // Global Background
      paper: '#FFFFFF',   // Surface / Cards
    },
    text: {
      primary: '#212529', // Primary Text
      secondary: '#6C757D', // Secondary / Muted Text
    },
    primary: {
      main: '#2E3192', // Brand Blue (Bank of Khyber approximate)
      light: '#5E60C2',
      dark: '#000063',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F37021', // Brand Orange (Bank of Khyber approximate)
      light: '#FFA153',
      dark: '#BA4000',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#28A745', // Success State
    },
    divider: '#DEE2E6', // Borders / Dividers
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, color: '#2E3192' }, // Branded Headings
    h2: { fontWeight: 700, color: '#2E3192' },
    h3: { fontWeight: 700, color: '#2E3192' },
    h4: { fontWeight: 700, color: '#2E3192', letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, color: '#212529' },
    h6: { fontWeight: 600, color: '#212529' },
    subtitle1: { fontWeight: 500, color: '#6C757D' },
    subtitle2: { fontWeight: 500, color: '#6C757D' },
    body1: { color: '#212529' },
    body2: { color: '#6C757D' },
    button: { fontWeight: 500, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F8F9FA',
          color: '#212529',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0,0,0,0.03)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0px 4px 12px rgba(46, 49, 146, 0.2)' }, // Blue shadow on hover
        },
        containedPrimary: {
          backgroundColor: '#2E3192',
          '&:hover': { backgroundColor: '#1F2163' },
        },
        containedSecondary: {
          backgroundColor: '#F37021',
          color: '#fff',
          '&:hover': { backgroundColor: '#D65A0D' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2E3192', // Blue text on white header
          boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FAFAFA',
            '&.Mui-focused fieldset': {
              borderColor: '#2E3192', // Blue focus border
              borderWidth: '2px',
            },
          },
        }
      }
    },
  },
});

export default theme;

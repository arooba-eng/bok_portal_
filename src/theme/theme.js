import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#F8F9FA', // Global Background (Light Grey)
      paper: '#FFFFFF',   // Surface / Cards (Pure White)
    },
    text: {
      primary: '#1A1A1A',   // Primary Text (Dark Charcoal from logo typography)
      secondary: '#6C757D', // Secondary / Muted Text
    },
    primary: {
      main: '#800033',          // Primary Maroon/Deep Burgundy (Main logo icon)
      light: '#A3335C',         // Lighter Maroon tint
      dark: '#540021',          // Dark Maroon shade
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4A1525',          // Deep Plum Accent (Extracted shadow tone)
      light: '#733345',
      dark: '#280A13',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#28A745',          // Success State
    },
    divider: '#E2E8F0',          // Borders / Dividers
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, color: '#800033' }, // Updated to Primary Maroon
    h2: { fontWeight: 700, color: '#800033' },
    h3: { fontWeight: 700, color: '#800033' },
    h4: { fontWeight: 700, color: '#800033', letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, color: '#1A1A1A' },
    h6: { fontWeight: 600, color: '#1A1A1A' },
    subtitle1: { fontWeight: 500, color: '#6C757D' },
    subtitle2: { fontWeight: 500, color: '#6C757D' },
    body1: { color: '#1A1A1A' },
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
          color: '#1A1A1A',
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
          '&:hover': { boxShadow: '0px 4px 12px rgba(128, 0, 51, 0.2)' }, // Maroon shadow on hover
        },
        containedPrimary: {
          backgroundColor: '#800033',
          '&:hover': { backgroundColor: '#540021' },
        },
        containedSecondary: {
          backgroundColor: '#4A1525',
          color: '#FFFFFF',
          '&:hover': { backgroundColor: '#280A13' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#800033', // Primary Maroon text on white header
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
              borderColor: '#800033', // Primary Maroon focus border
              borderWidth: '2px',
            },
          },
        },
      },
    },
  },
});

export default theme;
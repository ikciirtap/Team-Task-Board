import { createTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';

export const getAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary: {
              main: '#6366f1', // Indigo
              light: '#818cf8',
              dark: '#4f46e5',
            },
            secondary: {
              main: '#ec4899', // Pink
            },
            background: {
              default: '#0f172a', // Slate 900
              paper: '#1e293b', // Slate 800
            },
            text: {
              primary: '#f8fafc',
              secondary: '#94a3b8',
            },
          }
        : {
            primary: {
              main: '#4f46e5', // Deep Indigo
              light: '#6366f1',
              dark: '#3730a3',
            },
            secondary: {
              main: '#db2777',
            },
            background: {
              default: '#f8fafc', // Slate 50
              paper: '#ffffff',
            },
            text: {
              primary: '#0f172a',
              secondary: '#64748b',
            },
          }),
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h5: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      subtitle1: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow:
              mode === 'dark'
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow:
                mode === 'dark'
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
    },
  });

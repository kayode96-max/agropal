import { createTheme, ThemeOptions, alpha } from "@mui/material/styles";

// Color palette definition
export const colors = {
  // Primary colors
  green: {
    50: "#E8F5E9",
    100: "#C8E6C9",
    200: "#A5D6A7",
    300: "#81C784",
    400: "#66BB6A",
    500: "#4CAF50", // Main primary color
    600: "#43A047",
    700: "#388E3C",
    800: "#2E7D32",
    900: "#1B5E20",
    A100: "#B9F6CA",
    A200: "#69F0AE",
    A400: "#00E676",
    A700: "#00C853",
  },
  
  // Grayscale for dark theme
  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5", 
    200: "#EEEEEE",
    300: "#E0E0E0", // Main secondary color
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242", 
    900: "#212121",
  },
  
  // Dark theme backgrounds
  dark: {
    background: "#121212",
    paper: "#1E1E1E", 
    surface: "#252525",
    input: "#2D2D2D",
    border: "#333333",
  },
  
  // Functional colors
  status: {
    success: "#66BB6A",
    warning: "#FFA726",
    error: "#F44336",
    info: "#29B6F6",
  },
};

// Theme options
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: colors.green[500],
      light: colors.green[300],
      dark: colors.green[800],
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: colors.gray[300],
      light: colors.gray[100],
      dark: colors.gray[400],
      contrastText: "#000000",
    },
    background: {
      default: colors.dark.background,
      paper: colors.dark.paper,
    },
    text: {
      primary: "#FFFFFF",
      secondary: colors.gray[400],
    },
    success: {
      main: colors.status.success,
    },
    error: {
      main: colors.status.error,
    },
    warning: {
      main: colors.status.warning,
    },
    info: {
      main: colors.status.info,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.2,
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.2,
      letterSpacing: "0em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.2,
      letterSpacing: "0.00735em",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.2,
      letterSpacing: "0em",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: 1.2,
      letterSpacing: "0.0075em",
    },
    button: {
      fontWeight: 500,
      fontSize: "0.875rem",
      letterSpacing: "0.02857em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
    "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
    "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
    "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
    "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
    "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
    "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
    "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
    "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
    "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
    "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
    "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
    "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
    "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
    "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: colors.dark.border,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: colors.green[700],
            borderRadius: 4,
            "&:hover": {
              backgroundColor: colors.green[600],
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "10px 22px",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 6px 12px ${alpha(colors.green[500], 0.25)}`,
          },
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${colors.green[800]} 30%, ${colors.green[500]} 90%)`,
        },
        outlinedPrimary: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease, color 0.2s ease",
          "&:hover": {
            color: colors.green[400],
            transform: "scale(1.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.dark.paper,
          backgroundImage: "none",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.25)",
          },
          border: `1px solid ${colors.dark.border}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.15)`,
          borderBottom: `1px solid ${colors.dark.border}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.dark.paper,
          backgroundImage: "none",
          border: "none",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease-in-out",
          backgroundColor: colors.dark.input,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.green[500],
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.green[500],
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: colors.dark.border,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover": {
            backgroundColor: alpha(colors.green[700], 0.15),
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.dark.border,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 1.5,
          backgroundColor: colors.green[500],
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 500,
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            color: colors.green[400],
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: `0 6px 12px ${alpha(colors.dark.background, 0.3)}`,
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: `0 8px 16px ${alpha(colors.dark.background, 0.4)}`,
          },
        },
        primary: {
          background: `linear-gradient(45deg, ${colors.green[800]} 30%, ${colors.green[500]} 90%)`,
        },
      },
    },
  },
};

// Create and export the theme
const theme = createTheme(themeOptions);
export default theme;

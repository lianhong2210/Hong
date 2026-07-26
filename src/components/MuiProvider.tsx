"use client";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode } from "react";
import { useThemeMode } from "../contexts/ThemeContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00D4AA",
      light: "#33DCBB",
      dark: "#009977",
      contrastText: "#0A0F1E",
    },
    secondary: {
      main: "#7B8FF5",
      light: "#9FAAFF",
      dark: "#5A6BD4",
    },
    background: {
      default: "#0A0F1E",
      paper: "#141C2F",
    },
    text: {
      primary: "#F0EDE6",
      secondary: "#9EB3CC",
      disabled: "#6B7A99",
    },
    divider: "rgba(107,122,153,0.15)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
    },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.8 },
    body2: { lineHeight: 1.7 },
    caption: {
      fontFamily: '"JetBrains Mono", "Courier New", monospace',
      letterSpacing: "0.06em",
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(107,122,153,0.12)",
          transition: "all 0.3s ease",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.72rem",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4 },
        bar: { borderRadius: 4 },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00D4AA",
      light: "#33DCBB",
      dark: "#009977",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#7B8FF5",
      light: "#9FAAFF",
      dark: "#5A6BD4",
    },
    background: {
      default: "#F8F9FC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1D29",
      secondary: "#5A6577",
      disabled: "#9CA3AF",
    },
    divider: "rgba(0,0,0,0.08)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
    },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.8 },
    body2: { lineHeight: 1.7 },
    caption: {
      fontFamily: '"JetBrains Mono", "Courier New", monospace',
      letterSpacing: "0.06em",
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.72rem",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4 },
        bar: { borderRadius: 4 },
      },
    },
  },
});

export default function MuiProvider({ children }: { children: ReactNode }) {
  const { mode } = useThemeMode();
  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

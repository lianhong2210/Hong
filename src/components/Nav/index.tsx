// ** React
import { useState } from "react";

// ** Hooks
import { useThemeMode } from "../../contexts/ThemeContext";

// ** MUI
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";

// ** Icons
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";

// ** Styles
import styles from "./index.module.scss";

import { RootState } from "../../store";
import { useSelector } from "react-redux";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
];

export default function Nav() {
  const { isAboutNameVisible } = useSelector(
    (state: RootState) => state.common,
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mode, toggle } = useThemeMode();

  const showNavName =
    !isAboutNameVisible && typeof isAboutNameVisible === "boolean";

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        className={`${styles.appBar} ${showNavName ? styles.appBarScrolled : ""}`}
      >
        <Toolbar className={styles.toolbar}>
          {/* Logo */}
          <Box className={styles.logo}>
            {/* Mobile menu icon */}
            <IconButton
              className={styles.mobileMenuBtn}
              onClick={() => setDrawerOpen(true)}
              sx={{ color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="caption"
              sx={{
                color: "text.primary",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                opacity: showNavName ? 1 : 0,
                transform: showNavName ? "translateY(0)" : "translateY(4px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              Lim Lian Hong
            </Typography>
          </Box>

          {/* Desktop nav */}
          <Box className={styles.desktopNav}>
            {navLinks.map((l) => (
              <Button
                key={l.href}
                href={l.href}
                sx={{
                  color: "text.primary",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  "&:hover": {
                    color: "#FFFFFF",
                    background: "transparent",
                  },
                }}
              >
                {l.label}
              </Button>
            ))}
            <IconButton
              onClick={toggle}
              size="small"
              sx={{ color: "text.secondary", ml: 1 }}
            >
              {mode === "dark" ? (
                <LightModeIcon fontSize="small" />
              ) : (
                <DarkModeIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: { className: styles.drawerPaper },
        }}
      >
        <Box className={styles.drawerHeader}>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((l) => (
            <ListItem key={l.href} disablePadding>
              <ListItemButton
                component="a"
                href={l.href}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {l.label}
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem sx={{ px: 2, mt: 1 }}>
            <Button
              variant="text"
              color="primary"
              fullWidth
              startIcon={mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              onClick={() => {
                toggle();
                setDrawerOpen(false);
              }}
            >
              {mode === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

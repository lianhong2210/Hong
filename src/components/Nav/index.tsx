"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Box,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CodeIcon from "@mui/icons-material/Code";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../../contexts/ThemeContext";
import styles from "./index.module.scss";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
];

export default function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 40 });
  const { mode, toggle } = useThemeMode();

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        className={`${styles.appBar} ${trigger ? styles.appBarScrolled : ""}`}
      >
        <Toolbar className={styles.toolbar}>
          {/* Logo */}
          <Box className={styles.logo}>
            <CodeIcon sx={{ color: "primary.main", fontSize: 20 }} />
            <Typography
              variant="caption"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
              }}
            >
              LLH
            </Typography>
          </Box>

          {/* Desktop nav */}
          <Box className={styles.desktopNav}>
            {navLinks.map((l) => (
              <Button
                key={l.href}
                href={l.href}
                sx={{
                  color: "text.secondary",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  "&:hover": {
                    color: "primary.main",
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
            <Button
              href="mailto:lianlianghong@email.com"
              variant="outlined"
              color="primary"
              size="small"
              sx={{ ml: 1, borderRadius: 2, px: 2.5 }}
            >
              Contact
            </Button>
          </Box>

          {/* Mobile menu icon */}
          <IconButton
            className={styles.mobileMenuBtn}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
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
          <ListItem sx={{ mt: 2, px: 2 }}>
            <Button
              href="mailto:lianlianghong@email.com"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => setDrawerOpen(false)}
            >
              Contact
            </Button>
          </ListItem>
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

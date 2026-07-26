"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useEffect, useReducer } from "react";
import styles from "./index.module.scss";

const roles = [
  "Software Developer",
  "Full Stack Engineer",
  "Problem Solver",
  "Tech Enthusiast",
];

const socials = [
  { icon: <GitHubIcon />, href: "https://github.com", label: "GitHub" },
  { icon: <LinkedInIcon />, href: "https://linkedin.com", label: "LinkedIn" },
  {
    icon: <EmailIcon />,
    href: "mailto:lianlianghong@email.com",
    label: "Email",
  },
];

interface TypewriterState {
  roleIdx: number;
  displayed: string;
  deleting: boolean;
}

type TypewriterAction =
  | { type: "APPEND_CHAR"; char: string }
  | { type: "DELETE_CHAR" }
  | { type: "START_DELETING" }
  | { type: "NEXT_ROLE" };

function typewriterReducer(
  state: TypewriterState,
  action: TypewriterAction,
): TypewriterState {
  switch (action.type) {
    case "APPEND_CHAR":
      return { ...state, displayed: state.displayed + action.char };
    case "DELETE_CHAR":
      return { ...state, displayed: state.displayed.slice(0, -1) };
    case "START_DELETING":
      return { ...state, deleting: true };
    case "NEXT_ROLE":
      return {
        roleIdx: (state.roleIdx + 1) % roles.length,
        displayed: "",
        deleting: false,
      };
    default:
      return state;
  }
}

export default function Hero() {
  const [state, dispatch] = useReducer(typewriterReducer, {
    roleIdx: 0,
    displayed: "",
    deleting: false,
  });
  const { roleIdx, displayed, deleting } = state;

  useEffect(() => {
    const current = roles[roleIdx];
    if (!deleting && displayed.length < current.length) {
      const nextChar = current[displayed.length];
      const t = setTimeout(
        () => dispatch({ type: "APPEND_CHAR", char: nextChar }),
        80,
      );
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => dispatch({ type: "START_DELETING" }), 2400);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => dispatch({ type: "DELETE_CHAR" }), 45);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      const t = setTimeout(() => dispatch({ type: "NEXT_ROLE" }), 0);
      return () => clearTimeout(t);
    }
  }, [displayed, deleting, roleIdx]);

  return (
    <Box id="about" component="section" className={styles.section}>
      {/* Grid background */}
      <Box className={styles.gridBg} />
      {/* Glow */}
      <Box className={styles.glow} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box className={styles.fadeIn}>
          {/* Name */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" },
              mb: 2,
              lineHeight: 1.08,
              color: "text.primary",
            }}
          >
            Lim Lian Hong
          </Typography>

          {/* Typewriter */}
          <Box className={styles.typewriter}>
            <Typography
              component="span"
              sx={{
                fontFamily: "inherit",
                fontSize: "inherit",
                color: "primary.light",
                mr: 0.5,
              }}
            >
              {"> "}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: "inherit",
                fontSize: "inherit",
                color: "primary.main",
              }}
            >
              {displayed}
            </Typography>
            <Box component="span" className={styles.cursor} />
          </Box>

          {/* About text */}
          <Typography
            variant="body1"
            sx={{
              maxWidth: 600,
              color: "text.secondary",
              mb: 2,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            A passionate software developer with a knack for turning complex
            problems into elegant, user-friendly solutions. I thrive at the
            intersection of clean code and thoughtful design — building products
            that are fast, accessible, and genuinely useful.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: 580,
              color: "text.disabled",
              mb: 5,
              fontSize: "0.9rem",
            }}
          >
            {`Based in Kuala Lumpur, Malaysia. When I'm not writing code, you'll
            find me exploring new technologies, contributing to open-source
            projects, or grabbing a cup of kopi at the local mamak stall.`}
          </Typography>

          {/* CTA buttons */}
          <Stack direction="row" sx={{ mb: 5, gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="#experience"
              sx={{ px: 4, py: 1.5, fontSize: "0.9rem" }}
            >
              View My Work
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              href="/resume.pdf"
              target="_blank"
              startIcon={<DownloadIcon />}
              sx={{ px: 4, py: 1.5, fontSize: "0.9rem" }}
            >
              Download CV
            </Button>
          </Stack>

          {/* Social icons */}
          <Stack direction="row" sx={{ gap: 2 }}>
            {socials.map((s) => (
              <Box
                key={s.label}
                component="a"
                href={s.href}
                target={s.label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={s.label}
                sx={{
                  color: "text.disabled",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                  "&:hover": { color: "primary.main" },
                  "& svg": { fontSize: 22 },
                }}
              >
                {s.icon}
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>

      {/* Scroll hint */}
      <Box className={styles.scrollHint}>
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          Scroll
        </Typography>
        <ArrowDownwardIcon sx={{ fontSize: 16, color: "text.secondary" }} />
      </Box>
    </Box>
  );
}

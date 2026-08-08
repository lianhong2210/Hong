// ** React
import { useCallback, useEffect, useRef, useState } from "react";

// ** MUI
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

// ** Icons
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// ** Styles
import styles from "./index.module.scss";

// ** constant
import { experiences } from "../../constant/experience";

const SLIDE_DURATION = 10000;

export default function Experience() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const tickRef = useRef<() => void>(() => {});

  const goTo = useCallback((idx: number) => {
    setActive(idx);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const tick = useCallback(() => {
    if (pausedRef.current) {
      startTimeRef.current = Date.now() - (progress * SLIDE_DURATION) / 100;
      rafRef.current = requestAnimationFrame(tickRef.current);
      return;
    }
    const elapsed = Date.now() - startTimeRef.current;
    const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
    setProgress(pct);
    if (pct >= 100) {
      setActive((prev) => {
        const next = (prev + 1) % experiences.length;
        return next;
      });
      setProgress(0);
      startTimeRef.current = Date.now();
    }
    rafRef.current = requestAnimationFrame(tickRef.current);
  }, [progress]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const exp = experiences[active];

  return (
    <Box id="experience" component="section" className={styles.section}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography className={styles.headerCaption} variant="caption">
            Work Experience
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.8rem" },
              color: "text.primary",
            }}
          >
            {`Where I've Worked`}
          </Typography>
        </Box>

        {/* Dot indicators + timer */}
        <Box className={styles.dots}>
          {experiences.map((_, i) => (
            <Box
              key={i}
              onClick={() => goTo(i)}
              className={`${styles.dot} ${active === i ? styles.dotActive : ""}`}
              sx={{
                bgcolor:
                  active === i ? "primary.main" : "rgba(107,122,153,0.4)",
                "&:hover": {
                  bgcolor:
                    active === i ? "primary.main" : "rgba(107,122,153,0.7)",
                },
              }}
            />
          ))}
        </Box>

        {/* Timer progress bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 5,
            height: 2,
            borderRadius: 1,
            bgcolor: "rgba(107,122,153,0.15)",
            "& .MuiLinearProgress-bar": {
              bgcolor: exp.color,
              transition: "none",
            },
          }}
        />

        {/* Main card + sidebar list */}
        <Box className={styles.grid}>
          {/* Active card */}
          <Card
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
              startTimeRef.current =
                Date.now() - (progress / 100) * SLIDE_DURATION;
            }}
            sx={{
              background: exp.bgColor,
              border: `1px solid ${exp.color}40`,
              borderRadius: 3,
              boxShadow: `0 0 40px ${exp.color}14`,
              transition: "all 0.4s ease",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              {/* Top row */}
              <Stack
                direction="row"
                sx={{
                  mb: 3,
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: exp.color + "22",
                    color: exp.color,
                    width: 52,
                    height: 52,
                    "& svg": { fontSize: 26 },
                  }}
                >
                  {exp.icon}
                </Avatar>
                <Chip
                  label={exp.type}
                  size="small"
                  sx={{
                    bgcolor: "rgba(107,122,153,0.12)",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                  }}
                />
              </Stack>

              {/* Title */}
              <Typography variant="h5" sx={{ color: "text.primary", mb: 0.5 }}>
                {exp.role}
              </Typography>
              <Typography
                sx={{
                  color: exp.color,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  mb: 1.5,
                }}
              >
                {exp.company}
              </Typography>

              <Stack direction="row" sx={{ mb: 3, gap: 2.5, flexWrap: "wrap" }}>
                <Stack direction="row" sx={{ gap: 0.6, alignItems: "center" }}>
                  <CalendarTodayIcon
                    sx={{ fontSize: 13, color: "text.disabled" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.disabled",
                      fontFamily: "inherit",
                      fontSize: "0.78rem",
                    }}
                  >
                    {exp.period}
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ gap: 0.6, alignItems: "center" }}>
                  <LocationOnIcon
                    sx={{ fontSize: 13, color: "text.disabled" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.disabled",
                      fontFamily: "inherit",
                      fontSize: "0.78rem",
                    }}
                  >
                    {exp.location}
                  </Typography>
                </Stack>
              </Stack>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3, lineHeight: 1.8 }}
              >
                {exp.description}
              </Typography>

              {/* Achievements */}
              <Stack sx={{ mb: 3.5, gap: 1.2 }}>
                {exp.achievements.map((a, ai) => (
                  <Stack
                    key={ai}
                    direction="row"
                    sx={{ gap: 1, alignItems: "flex-start" }}
                  >
                    <CheckCircleOutlinedIcon
                      sx={{
                        fontSize: 16,
                        color: exp.color,
                        mt: "2px",
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.85rem",
                        lineHeight: 1.65,
                      }}
                    >
                      {a}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {/* Tech chips */}
              <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
                {exp.tech.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    sx={{
                      bgcolor: exp.color + "12",
                      color: exp.color,
                      border: `1px solid ${exp.color}30`,
                      fontSize: "0.7rem",
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Sidebar list */}
          <Box className={styles.sidebar}>
            {experiences.map((e, i) => (
              <Card
                key={i}
                onClick={() => goTo(i)}
                className={styles.sidebarCard}
                sx={{
                  background:
                    active === i
                      ? e.bgColor
                      : "var(--bg-card-unselected, #1a2138)",
                  border: `1px solid ${active === i ? e.color + "45" : e.color + "25"}`,
                  boxShadow: "none",
                  "&:hover": { borderColor: e.color + "50" },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Stack
                    direction="row"
                    sx={{ gap: 1.5, alignItems: "center" }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: e.color + "18",
                        color: e.color,
                        width: 36,
                        height: 36,
                        "& svg": { fontSize: 18 },
                      }}
                    >
                      {e.icon}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.primary",
                          fontWeight: 600,
                          fontSize: "0.82rem",
                        }}
                      >
                        {e.role}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: e.color,
                          fontFamily: "inherit",
                          fontSize: "0.72rem",
                        }}
                      >
                        {e.company}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

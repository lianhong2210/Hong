// ** React
import { useCallback, useEffect, useRef, useState } from "react";

// ** MUI
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

// ** Icons
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";

// ** Styles
import styles from "./index.module.scss";

// ** constants
import { sectionIds } from "@/src/constant/sectionIds";
import { educations } from "../../constant/educations";

const SLIDE_DURATION = 10000;

export default function Education() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(new Date().getTime());
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);

  const goTo = useCallback((idx: number) => {
    setActive(idx);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    const tick = () => {
      if (pausedRef.current) {
        startTimeRef.current = Date.now() - (progress / 100) * SLIDE_DURATION;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setActive((prev) => (prev + 1) % educations.length);
        setProgress(0);
        startTimeRef.current = Date.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [progress]);

  const edu = educations[active];

  return (
    <Box
      id={sectionIds.educations}
      component="section"
      className={styles.section}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography className={styles.headerCaption} variant="caption">
            Education & Certifications
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.8rem" },
              color: "text.primary",
            }}
          >
            Learning Never Stops
          </Typography>
        </Box>

        {/* Dots */}
        <Box className={styles.dots}>
          {educations.map((_, i) => (
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

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 5,
            height: 2,
            borderRadius: 1,
            bgcolor: "rgba(107,122,153,0.15)",
            "& .MuiLinearProgress-bar": {
              bgcolor: edu.color,
              transition: "none",
            },
          }}
        />

        {/* Card */}
        <Card
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
            startTimeRef.current =
              Date.now() - (progress / 100) * SLIDE_DURATION;
          }}
          className={styles.card}
          sx={{
            background: edu.bgColor,
            border: `1px solid ${edu.color}40`,
            boxShadow: `0 0 40px ${edu.color}12`,
          }}
        >
          {/* Left: image */}
          <Box
            sx={{ position: "relative", minHeight: { xs: 200, md: "auto" } }}
          >
            <CardMedia
              component="img"
              image={edu.image}
              alt={edu.imageAlt}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "brightness(0.72) saturate(0.8)",
              }}
            />
            <Box className={styles.imageOverlay} />
            <Box className={styles.institutionLabel}>
              <Stack direction="row" sx={{ gap: 1.2, alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: edu.color + "33",
                    color: edu.color,
                    width: 40,
                    height: 40,
                    "& svg": { fontSize: 20 },
                  }}
                >
                  {edu.icon}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {edu.institution}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {edu.period}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Right: content */}
          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "text.primary", mb: 0.5, fontSize: "1.15rem" }}
            >
              {edu.degree}
            </Typography>
            <Typography
              sx={{
                color: edu.color,
                fontWeight: 600,
                fontSize: "0.88rem",
                mb: 1.5,
              }}
            >
              {edu.field}
            </Typography>

            <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap", mb: 2 }}>
              <Stack direction="row" sx={{ gap: 0.6, alignItems: "center" }}>
                <CalendarTodayIcon
                  sx={{ fontSize: 13, color: "text.disabled" }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.disabled",
                    fontFamily: "inherit",
                    fontSize: "0.77rem",
                  }}
                >
                  {edu.period}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ gap: 0.6, alignItems: "center" }}>
                <LocationOnIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.disabled",
                    fontFamily: "inherit",
                    fontSize: "0.77rem",
                  }}
                >
                  {edu.location}
                </Typography>
              </Stack>
            </Stack>

            <Chip
              label={edu.grade}
              size="small"
              icon={<StarIcon style={{ fontSize: 14 }} />}
              sx={{
                alignSelf: "flex-start",
                bgcolor: edu.color + "16",
                color: edu.color,
                border: `1px solid ${edu.color}35`,
                fontSize: "0.72rem",
                mb: 2.5,
              }}
            />

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 3,
                lineHeight: 1.8,
                fontSize: "0.85rem",
              }}
            >
              {edu.description}
            </Typography>

            <Stack spacing={1.2}>
              {edu.highlights.map((h, hi) => (
                <Stack
                  key={hi}
                  direction="row"
                  sx={{ gap: 1, alignItems: "flex-start" }}
                >
                  <Box
                    component="span"
                    sx={{
                      mt: "5px",
                      flexShrink: 0,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: edu.color,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.83rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {h}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Thumbnail strip */}
        <Box className={styles.thumbnailStrip}>
          {educations.map((e, i) => (
            <Box
              key={i}
              onClick={() => goTo(i)}
              className={styles.thumbnail}
              sx={{
                border: `2px solid ${active === i ? e.color : "transparent"}`,
              }}
            >
              <Box
                component="img"
                src={e.image}
                alt={e.imageAlt}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter:
                    active === i
                      ? "brightness(0.9)"
                      : "brightness(0.45) saturate(0.5)",
                }}
              />
              {active === i && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: `${e.color}22`,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

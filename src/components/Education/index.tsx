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
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

// ** Styles
import styles from "./index.module.scss";

const SLIDE_DURATION = 10000;

interface Edu {
  institution: string;
  degree: string;
  field: string;
  period: string;
  location: string;
  grade: string;
  description: string;
  highlights: string[];
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  image: string;
  imageAlt: string;
}

const education: Edu[] = [
  {
    institution: "Tunku Abdul Rahman University College",
    degree: "Bachelor of Information Technology (Honours)",
    field: "Software Systems Development",
    period: "JUN 2020 — JUL 2022",
    location: "Kuala Lumpur, Malaysia",
    grade: "CGPA 3.74 / 4.00",
    description:
      "Focused on software engineering principles, data structures & algorithms, and distributed systems. Final year project explored real-time collaborative document editing using CRDTs.",
    highlights: [
      "Dean's List — 6 consecutive semesters",
      "Best Final Year Project — Faculty of CS & IT",
      "Secretary, UM Computing Society (2018–2019)",
    ],
    color: "#00D4AA",
    bgColor: "rgba(0,212,170,0.08)",
    icon: <SchoolIcon />,
    image: "https://picsum.photos/seed/campus1/800/400",
    imageAlt: "TARUC campus",
  },
  {
    institution: "INTI International College",
    degree: "Diploma in Computer Science",
    field: "Management Mathematics",
    period: "MAY 2018 - APR 2020",
    location: "Kuala Lumpur, Malaysia",
    grade: "CGPA 3.76 / 4.00",
    description:
      "Completed a one-year foundation programme with a perfect GPA, earning a direct entry scholarship to the bachelor's degree programme.",
    highlights: [
      "Perfect GPA — Top Student Award",
      "INTI Academic Excellence Scholarship recipient",
      "Participated in nationwide coding olympiad, top 20",
    ],
    color: "#7B8FF5",
    bgColor: "rgba(123,143,245,0.08)",
    icon: <EmojiEventsIcon />,
    image: "https://picsum.photos/seed/campus2/800/400",
    imageAlt: "TARUC campus",
  },
  {
    institution: "Amazon Web Services",
    degree: "AWS Solutions Architect",
    field: "Associate Certification",
    period: "2022",
    location: "Online / Remote",
    grade: "Score: 892 / 1000",
    description:
      "Earned the AWS Solutions Architect – Associate certification, demonstrating proficiency in designing distributed systems and cloud cost optimisation on AWS.",
    highlights: [
      "Passed on first attempt with distinction",
      "Covered EC2, S3, RDS, VPC, IAM, Lambda & more",
      "Renewed annually with continuing education credits",
    ],
    color: "#F59E0B",
    bgColor: "rgba(245,158,11,0.08)",
    icon: <VerifiedIcon />,
    image: "https://picsum.photos/seed/aws1/800/400",
    imageAlt: "AWS Certification",
  },
  {
    institution: "Coursera / Meta",
    degree: "Professional Certificate",
    field: "Meta Front-End Developer",
    period: "2021",
    location: "Online",
    grade: "100% with Distinction",
    description:
      "A nine-course professional certificate programme covering React, advanced JavaScript, UX/UI principles, and front-end tooling, completed with distinction.",
    highlights: [
      "Completed 9 courses, ~240 hours of learning",
      "Capstone: full restaurant booking web app in React",
      "Certificate verified on Credly",
    ],
    color: "#EC4899",
    bgColor: "rgba(236,72,153,0.08)",
    icon: <WorkspacePremiumIcon />,
    image: "https://picsum.photos/seed/meta1/800/400",
    imageAlt: "Meta Front-End Certificate",
  },
];

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
        setActive((prev) => (prev + 1) % education.length);
        setProgress(0);
        startTimeRef.current = Date.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [progress]);

  const edu = education[active];

  return (
    <Box id="education" component="section" className={styles.section}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
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
          {education.map((_, i) => (
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
          {education.map((e, i) => (
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

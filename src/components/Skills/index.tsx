// ** React
import { useState } from "react";

// ** MUI
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

// ** Styles
import styles from "./index.module.scss";

interface Skill {
  name: string;
  icon: string;
  color: string;
  category: string;
}

const skills: Skill[] = [
  { name: "Next.js", icon: "▲", color: "#A9A9A9", category: "Frontend" },
  { name: "React", icon: "⚛️", color: "#61DAFB", category: "Frontend" },
  { name: "React Native", icon: "📱", color: "#61DAFB", category: "Frontend" },
  { name: "NestJs", icon: "🐈", color: "#EA2845", category: "Backend" },
  { name: "Node.js", icon: "🟢", color: "#339933", category: "Backend" },
  { name: "GraphQL", icon: "◈", color: "#E10098", category: "Backend" },
  { name: "REST API", icon: "🔗", color: "#FF6C37", category: "Backend" },
  { name: "Postman", icon: "📬", color: "#EF5B25", category: "Backend" },
  { name: "PostgreSQL", icon: "🐘", color: "#336791", category: "Database" },
  { name: "MySQL", icon: "🐬", color: "#4479A1", category: "Database" },
  { name: "Redis", icon: "🔴", color: "#DC382D", category: "Database" },
  { name: "Git", icon: "🔀", color: "#F05032", category: "DevOps" },
  { name: "Linux", icon: "🐧", color: "#FCC624", category: "DevOps" },
  { name: "Docker", icon: "🐳", color: "#2496ED", category: "DevOps" },
  { name: "Cloudflare", icon: "☁️", color: "#F38020", category: "DevOps" },
  { name: "Digital Ocean", icon: "🌊", color: "#0080FF", category: "DevOps" },
];

const categories = ["All", "Frontend", "Backend", "Database", "DevOps"];

const proficiencies = [
  { label: "Frontend", percent: 70, color: "#00D4AA" },
  { label: "Backend", percent: 85, color: "#7B8FF5" },
  { label: "Database", percent: 75, color: "#F59E0B" },
  { label: "DevOps / Cloud", percent: 60, color: "#EC4899" },
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <Box id="skills" component="section" className={styles.section}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography className={styles.headerCaption} variant="caption">
            Skills & Technologies
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.8rem" },
              color: "text.primary",
              mb: 1.5,
            }}
          >
            My Tech Stack
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", maxWidth: 550 }}
          >
            Technologies and tools I use to bring ideas to life — from pixel to
            production.
          </Typography>
        </Box>

        {/* Filter chips */}
        <Stack
          direction="row"
          spacing={1.2}
          useFlexGap
          className={styles.filterStack}
          sx={{ flexWrap: "wrap" }}
        >
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => setActiveCategory(cat)}
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: "0.82rem",
                fontWeight: activeCategory === cat ? 600 : 400,
                bgcolor:
                  activeCategory === cat
                    ? "primary.main"
                    : "rgba(107,122,153,0.1)",
                color:
                  activeCategory === cat
                    ? "background.default"
                    : "text.secondary",
                border: `1px solid ${activeCategory === cat ? "transparent" : "rgba(107,122,153,0.2)"}`,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor:
                    activeCategory === cat
                      ? "primary.light"
                      : "rgba(107,122,153,0.2)",
                },
              }}
            />
          ))}
        </Stack>

        {/* Grid */}
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {filtered.map((skill) => (
            <Grid size={{ xs: 4, sm: 3, md: 2 }} key={skill.name}>
              <Card
                onMouseEnter={() => setHovered(skill.name)}
                onMouseLeave={() => setHovered(null)}
                className={`${styles.skillCard} ${hovered === skill.name ? styles.skillCardHovered : ""}`}
                sx={{
                  background:
                    hovered === skill.name
                      ? skill.color + "12"
                      : "background.paper",
                  bgcolor:
                    hovered === skill.name ? undefined : "background.paper",
                  border: `1px solid ${hovered === skill.name ? skill.color + "50" : "rgba(107,122,153,0.1)"}`,
                  boxShadow:
                    hovered === skill.name
                      ? `0 12px 32px ${skill.color}22`
                      : "none",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.2,
                    p: 2,
                    "&:last-child": { pb: 2 },
                  }}
                >
                  <Box
                    className={styles.skillIconBox}
                    sx={{
                      bgcolor:
                        hovered === skill.name
                          ? skill.color + "28"
                          : skill.color + "14",
                      fontSize: skill.icon.length <= 2 ? "0.82rem" : "1.45rem",
                      color: skill.color,
                    }}
                  >
                    {skill.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        hovered === skill.name
                          ? "text.primary"
                          : "text.secondary",
                      fontFamily: "inherit",
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      textAlign: "center",
                      lineHeight: 1.3,
                      transition: "color 0.2s",
                    }}
                  >
                    {skill.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Proficiency breakdown */}
        <Card className={styles.proficiencyCard}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography
              variant="h6"
              sx={{ color: "text.primary", mb: 3, fontSize: "1rem" }}
            >
              Proficiency Breakdown
            </Typography>
            <Grid container spacing={3}>
              {proficiencies.map((item) => (
                <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                  <Stack
                    direction="row"
                    sx={{ mb: 1, justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontSize: "0.83rem" }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: item.color,
                        fontWeight: 600,
                      }}
                    >
                      {item.percent}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={item.percent}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "rgba(107,122,153,0.14)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: item.color,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}90)`,
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

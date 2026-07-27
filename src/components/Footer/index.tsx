// ** MUI
import { Box, Container, Stack, Typography } from "@mui/material";

// ** Icons
import CodeIcon from "@mui/icons-material/Code";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// ** Styles
import styles from "./index.module.scss";

const myEmail = "lianhong2210@gmail.com";

const socials = [
  {
    icon: <GitHubIcon />,
    href: "https://github.com/lianhong2210",
    label: "GitHub",
  },
  {
    icon: <LinkedInIcon />,
    href: "https://www.linkedin.com/in/lim-lian-hong-64b334223",
    label: "LinkedIn",
  },
  {
    icon: <EmailIcon />,
    href: myEmail,
    label: "Email",
  },
];

export default function Footer() {
  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg">
        <Box className={styles.inner}>
          <Box className={styles.logoRow}>
            <CodeIcon sx={{ color: "primary.main", fontSize: 18 }} />
            <Typography
              variant="caption"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.1em",
              }}
            >
              Lim Lian Hong
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", ml: 0.5 }}
            >
              &copy; {new Date().getFullYear()} | All rights reserved.
            </Typography>
          </Box>

          {/* Social icons */}
          <Stack direction="row" sx={{ gap: 1.5 }}>
            {socials.map((s) => (
              <Box
                key={s.label}
                component="a"
                href={
                  s.label.toLowerCase() === "email"
                    ? `mailto:${myEmail}`
                    : s.href
                }
                target={s.label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={s.label}
                sx={{
                  color: "text.disabled",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                  "&:hover": { color: "primary.main" },
                  "& svg": { fontSize: 20 },
                }}
              >
                {s.icon}
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

import CodeIcon from "@mui/icons-material/Code";
import { Box, Container, Typography } from "@mui/material";
import styles from "./index.module.scss";

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
              LLH
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", ml: 0.5 }}
            >
              &copy; {new Date().getFullYear()} Lim Lian Hong. All rights
              reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

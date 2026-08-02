// ** React
import { useEffect } from "react";

// ** Hooks
import { useScroll } from "../../contexts/ScrollContext";

// ** MUI
import { Box, Container, Stack, Typography } from "@mui/material";

// ** Redux
import { useIsVisible } from "../../hooks/useIsVisible";
import { setIsAboutNameVisible, setTypewriter } from "../../store/apps/common";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

// ** Styles
import styles from "./index.module.scss";

// ** Constant
import { socials } from "../../constant/social";
import { roles } from "../../constant/roles";

export default function Hero() {
  // Redux
  const { roleIdx, displayed, deleting } = useSelector((state: RootState) =>
    state.common.typewriter !== undefined
      ? state.common.typewriter
      : {
          roleIdx: 0,
          displayed: "",
          deleting: false,
        },
  );
  const dispatch = useDispatch();

  // Hooks
  const { scrollProgress } = useScroll();
  const [isVisibleRef, isVisible] = useIsVisible({ offsetTop: 65 });

  // Roles text animation
  useEffect(() => {
    const current = roles[roleIdx];
    if (!deleting && displayed.length < current.length) {
      const nextChar = current[displayed.length];
      const t = setTimeout(
        () => dispatch(setTypewriter({ type: "APPEND_CHAR", char: nextChar })),
        80,
      );
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === current.length) {
      const t = setTimeout(
        () => dispatch(setTypewriter({ type: "START_DELETING" })),
        2400,
      );
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(
        () => dispatch(setTypewriter({ type: "DELETE_CHAR" })),
        45,
      );
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      const t = setTimeout(
        () => dispatch(setTypewriter({ type: "NEXT_ROLE" })),
        0,
      );
      return () => clearTimeout(t);
    }
  }, [displayed, deleting, roleIdx, dispatch]);

  // Scale from 1 down to 0.3, opacity from 1 to 0
  const nameScale = 1 - scrollProgress * 0.7;
  const nameOpacity = 1 - scrollProgress;

  useEffect(() => {
    if (isVisible === undefined) return;

    dispatch(setIsAboutNameVisible(isVisible));
  }, [isVisible, dispatch]);

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
            ref={isVisibleRef}
            variant="h1"
            sx={{
              fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" },
              mb: 2,
              lineHeight: 1.08,
              color: "text.primary",
              transform: `scale(${nameScale})`,
              opacity: nameOpacity,
              transformOrigin: "left center",
              transition:
                scrollProgress === 0 || scrollProgress === 1
                  ? "transform 0.3s ease, opacity 0.3s ease"
                  : "none",
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
            Building software that is scalable, maintainable, and user-centric.
            As a Full Stack Software Engineer, I transform business requirements
            into robust web applications through thoughtful architecture, clean
            code, and modern development practices.
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
            find me exploring new technologies, continuously improving my software engineering skills, or grabbing a cup of kopi at the local mamak stall.`}
          </Typography>

          {/* Social icons */}
          <Stack direction="row" sx={{ gap: 2 }}>
            {socials.map((s) => (
              <Box
                key={s.label}
                component="a"
                href={
                  s.label.toLowerCase() === "email"
                    ? `mailto:${s.href}`
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
                  "& svg": { fontSize: 22 },
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

// ** MUI Imports
import DevicesIcon from "@mui/icons-material/Devices";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import WorkIcon from "@mui/icons-material/Work";

// ** Types
import { ExperienceTypes } from "../types/experienceTypes";

export const experiences: ExperienceTypes[] = [
  {
    company: "Tazte Technology Sdn Bhd",
    role: "Full Stack Software Developer",
    period: "August 2023 — Present",
    location: "Puchong, Selangor, MY",
    type: "Full-time",
    description:
      "Develop and maintain Tazte, a Food and Beverage (F&B) ordering platform, and ThriveOS, a Point-of-Sale (POS) system, delivering solutions across web, mobile, backend services, and cloud infrastructure.",
    achievements: [
      "Enhanced merchant ordering and sales management workflows by streamlining business processes and improving overall system efficiency.",
      "Developed and maintained end-to-end features across ordering, POS, and merchant management workflows to support evolving business requirements.",
      "Supported production deployments, troubleshooting, and system improvements to ensure application reliability and operational stability.",
    ],
    tech: [
      "Next.js",
      "NestJS",
      "React Native",
      "TypeScript",
      "PostgreSQL",
      "RESTful API",
      "Redis",
      "Digital Ocean",
      "GitLab",
    ],
    color: "#F59E0B",
    bgColor: "rgba(245,158,11,0.09)",
    icon: <FastfoodIcon />,
  },

  {
    company: "Techies App Technologies Sdn Bhd",
    role: "Backend Developer",
    period: "Jan 2022 — Jul 2023",
    location: "Petaling Jaya, Selangor, MY",
    type: "Full-time",
    description:
      "Developed and maintained backend services for several projects, including project management systems and e-commerce platforms, collaborating with frontend developers to deliver reliable and user-friendly application experiences.",
    achievements: [
      "Developed and maintained backend services supporting core business operations and application workflows.",
      "Implemented file management capabilities for uploading, organizing, and associating architecture design files with projects and tasks.",
      "Built task management workflows including task creation, assignment, file attachments, and project-related operations.",
    ],
    tech: ["NestJS", "TypeScript", "GraphQL", "MySQL", "GitHub"],
    color: "#EC4899",
    bgColor: "rgba(236,72,153,0.09)",
    icon: <DevicesIcon />,
  },

  {
    company: "Data Cohort Sdn Bhd",
    role: "Intern",
    period: "Feb 2020 — Apr 2020",
    location: "Mont Kiara, Kuala Lumpur, MY",
    type: "Intern",
    description:
      "Gained practical experience in software development by contributing to web development projects and participating in the planning and development process.",
    achievements: [
      "Participated in software development lifecycle planning and contributed to discussions on system architecture.",
      "Designed and developed websites based on project requirements.",
      "Gained hands-on experience in web development and translating requirements into functional solutions.",
    ],
    tech: ["PHP", "WordPress"],
    color: "#00D4AA",
    bgColor: "rgba(0,212,170,0.09)",
    icon: <WorkIcon />,
  },
];

// 4th experience color: #7B8FF5, bgColor: "rgba(123,143,245,0.09)"

// ** Icons
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
// import VerifiedIcon from "@mui/icons-material/Verified";
// import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

// ** Types
import { EducationTypes } from "../types/educationTypes";

export const educations: EducationTypes[] = [
  {
    institution: "Tunku Abdul Rahman University College",
    degree: "Bachelor of Information Technology (Honours)",
    field: "Software Systems Development",
    period: "JUN 2020 — JUL 2022",
    location: "Kuala Lumpur, Malaysia",
    grade: "CGPA 3.74 / 4.00",
    description:
      "Developed a strong foundation in software systems development through coursework and hands-on projects covering web applications, IoT, and blockchain technologies.",
    highlights: [
      "Final Year Project — Blood Donation Application",
      "Developed a mobile application for blood donation campaigns, user registration, blood type profiles, and appointment reservations",
      "Obtained Dean's List for 5 semesters",
    ],
    color: "#00D4AA",
    bgColor: "rgba(0,212,170,0.08)",
    icon: <SchoolIcon />,
    image: "https://picsum.photos/seed/campus1/800/400",
    imageAlt: "TARUC campus",
  },
  {
    institution: "Tunku Abdul Rahman University College",
    degree: "Diploma in Computer Science",
    field: "Management Mathematics",
    period: "MAY 2018 — APR 2020",
    location: "Kuala Lumpur, Malaysia",
    grade: "CGPA 3.76 / 4.00",
    description:
      "Built a foundation in computer science and software development through programming, database development, and application design, complemented by involvement in student community activities.",
    highlights: [
      "Developed the user interface for a movie ticketing system as an academic project",
      "Committee Member — Peer Support Society (PSS), supporting student engagement and community initiatives",
      "Contributed to events including Adjustment to Campus Life (ATCL) and Wellness Campaign 2019",
    ],
    color: "#7B8FF5",
    bgColor: "rgba(123,143,245,0.08)",
    icon: <EmojiEventsIcon />,
    image: "https://picsum.photos/seed/campus2/800/400",
    imageAlt: "TARUC campus",
  },
  //   {
  //     institution: "Amazon Web Services",
  //     degree: "AWS Solutions Architect",
  //     field: "Associate Certification",
  //     period: "2022",
  //     location: "Online / Remote",
  //     grade: "Score: 892 / 1000",
  //     description:
  //       "Earned the AWS Solutions Architect – Associate certification, demonstrating proficiency in designing distributed systems and cloud cost optimisation on AWS.",
  //     highlights: [
  //       "Passed on first attempt with distinction",
  //       "Covered EC2, S3, RDS, VPC, IAM, Lambda & more",
  //       "Renewed annually with continuing education credits",
  //     ],
  //     color: "#F59E0B",
  //     bgColor: "rgba(245,158,11,0.08)",
  //     icon: <VerifiedIcon />,
  //     image: "https://picsum.photos/seed/aws1/800/400",
  //     imageAlt: "AWS Certification",
  //   },
  //   {
  //     institution: "Coursera / Meta",
  //     degree: "Professional Certificate",
  //     field: "Meta Front-End Developer",
  //     period: "2021",
  //     location: "Online",
  //     grade: "100% with Distinction",
  //     description:
  //       "A nine-course professional certificate programme covering React, advanced JavaScript, UX/UI principles, and front-end tooling, completed with distinction.",
  //     highlights: [
  //       "Completed 9 courses, ~240 hours of learning",
  //       "Capstone: full restaurant booking web app in React",
  //       "Certificate verified on Credly",
  //     ],
  //     color: "#EC4899",
  //     bgColor: "rgba(236,72,153,0.08)",
  //     icon: <WorkspacePremiumIcon />,
  //     image: "https://picsum.photos/seed/meta1/800/400",
  //     imageAlt: "Meta Front-End Certificate",
  //   },
];

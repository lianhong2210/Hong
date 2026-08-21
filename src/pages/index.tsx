// ** Components
import Education from "../components/Education";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Nav from "../components/Nav";
import Skills from "../components/Skills";

// ** Hooks
import { useScrollSnap } from "../hooks/useScrollSnap";

// ** Constants
import { sectionIds } from "../constant/sectionIds";
import { basePath } from "../constant/basePath";

const SECTION_IDS = Object.values(sectionIds);

const Home = () => {
  // Section-based scroll snapping:
  // - normal scroll within each section
  // - at the bottom + scroll down → slide to the next section's top
  // - at the top + scroll up → slide to the previous section's top
  useScrollSnap({ sectionIds: SECTION_IDS });

  if (basePath === undefined) return null;

  console.log("basePath:", basePath);
  console.log("env:", process.env.NODE_ENV);

  return (
    <>
      <Nav />
      <main>
        {/* Section 1: About / Hero */}
        <Hero />

        {/* Section 2: Work Experience */}
        <Experience />

        {/* Section 3: Education */}
        <Education />

        {/* Section 4: Skills */}
        <Skills />
      </main>
      <Footer />
    </>
  );
};

export default Home;

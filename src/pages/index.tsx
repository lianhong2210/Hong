// ** Components
import Education from "../components/Education";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Nav from "../components/Nav";
import Skills from "../components/Skills";

// ** Hooks
import { useScrollSnap } from "../hooks/useScrollSnap";

const SECTION_IDS = ["about", "experience", "education", "skills"];

const Home = () => {
  // Section-based scroll snapping:
  // - normal scroll within each section
  // - at the bottom + scroll down → slide to the next section's top
  // - at the top + scroll up → slide to the previous section's top
  useScrollSnap({ sectionIds: SECTION_IDS });

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

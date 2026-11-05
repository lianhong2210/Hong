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

const SECTION_IDS = Object.values(sectionIds);

const Home = () => {
  // Section pager: one wheel/touch/key gesture = one step.
  // - section taller than the viewport → step inside it until its bottom is reached
  // - otherwise → slide to the next section's top (mirrored when scrolling up)
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

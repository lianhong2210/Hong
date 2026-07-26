import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Skills from "../components/Skills";
import Footer from "../components/Footer";

const Home = () => {
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

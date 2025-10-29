// Home.tsx
import Hero from "../components/Hero";
import About from "./About";
import Contact from "./Contact";
import Projects from "./Project";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import Services from "../components/Services";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <Services />
      <About />
      <Projects />
      <Testimonials />
      <Contact />
    </div>
  );
}
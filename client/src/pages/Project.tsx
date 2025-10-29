// pages/Project.tsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Project {
  _id: string;
  title: string;
  description: string;
  tech: string[];
  demo?: string;
  github?: string;
  category?: string;
  featured?: boolean;
  images?: string[];
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filters = [
    { key: "all", label: "All Projects" },
    { key: "featured", label: "Featured" },
    { key: "web", label: "Web Development" },
    { key: "mobile", label: "Mobile Apps" },
    { key: "fullstack", label: "Full Stack" },
    { key: "design", label: "UI/UX Design" }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/projects");
        setProjects(res.data.projects || res.data);
        setFilteredProjects(res.data.projects || res.data);
      } catch (err) {
        console.error(err);
        // Enhanced fallback data
        const fallbackProjects: Project[] = [
          {
            _id: "1",
            title: "E-Commerce Platform",
            description: "Full-stack e-commerce solution with modern UI, secure payments, and admin dashboard.",
            tech: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind"],
            demo: "https://demo.com",
            github: "https://github.com",
            category: "fullstack",
            featured: true
          },
          {
            _id: "2",
            title: "Portfolio Website",
            description: "Interactive portfolio with 3D animations, smooth transitions, and modern design.",
            tech: ["Next.js", "Three.js", "GSAP", "TailwindCSS", "Framer"],
            demo: "https://demo.com",
            github: "https://github.com",
            category: "web",
            featured: true
          },
          {
            _id: "3",
            title: "Task Management App",
            description: "Collaborative task management with real-time updates and drag-drop functionality.",
            tech: ["React", "Socket.io", "Express", "PostgreSQL", "Redis"],
            demo: "https://demo.com",
            github: "https://github.com",
            category: "fullstack",
            featured: false
          },
          {
            _id: "4",
            title: "Mobile Fitness App",
            description: "Cross-platform fitness tracking app with workout plans and progress analytics.",
            tech: ["React Native", "Firebase", "Redux", "Chart.js"],
            demo: "https://demo.com",
            github: "https://github.com",
            category: "mobile",
            featured: true
          },
          {
            _id: "5",
            title: "UI Design System",
            description: "Comprehensive design system with reusable components and documentation.",
            tech: ["Figma", "Storybook", "React", "Styled Components"],
            demo: "https://demo.com",
            github: "https://github.com",
            category: "design",
            featured: false
          },
          {
            _id: "6",
            title: "Real Estate Platform",
            description: "Property listing platform with advanced filters and virtual tours.",
            tech: ["Vue.js", "Nuxt.js", "Python", "Django", "PostgreSQL"],
            demo: "https://demo.com",
            github: "https://github.com",
            category: "web",
            featured: true
          }
        ];
        setProjects(fallbackProjects);
        setFilteredProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // Respect reduced motion
    const ctx = gsap.context(() => {
      gsap.fromTo('.project-grid', 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo('.project-item', 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.project-grid',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo('.filter-btn', 
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.filters-container',
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  const filterProjects = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      setFilteredProjects(projects);
    } else if (filter === "featured") {
      setFilteredProjects(projects.filter(project => project.featured));
    } else {
      setFilteredProjects(projects.filter(project => project.category === filter));
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900" aria-busy="true" aria-live="polite" aria-label="Loading projects">
        <div className="container mx-auto px-6">
          <div className="flex flex-col justify-center items-center h-64" role="status">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" aria-hidden="true"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects…</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              My Projects
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A collection of my recent work showcasing innovative solutions and creative implementations across various technologies.
          </p>
        </div>
        
        {/* Filter Buttons */}
        <div className="filters-container flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => filterProjects(filter.key)}
              className={`filter-btn px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeFilter === filter.key
                  ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-cyan-400 backdrop-blur-sm"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div className="project-grid">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No projects found for this filter.</p>
              <button
                onClick={() => filterProjects("all")}
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
              >
                View all projects
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project._id} className="project-item">
                  <ProjectCard {...project} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-2xl p-8 border border-cyan-500/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interested in Working Together?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Have a project in mind? Let's discuss how we can bring your ideas to life with custom solutions tailored to your needs.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Your Project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
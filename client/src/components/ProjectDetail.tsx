// ProjectDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";

interface Project {
  _id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  tech: string[];
  demo?: string;
  github?: string;
  category?: string;
  featured?: boolean;
  images?: string[];
  challenges?: string[];
  solutions?: string[];
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(res.data);
        
        // Animation
        gsap.fromTo('.project-detail', 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h2>
          <Link to="/projects" className="text-cyan-400 hover:text-cyan-300">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="project-detail">
          {/* Back Button */}
          <Link 
            to="/projects" 
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </Link>

          {/* Project Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {project.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Code
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              {project.images && project.images.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Gallery</h3>
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-video">
                      <img
                        src={project.images[activeImage]}
                        alt={`${project.title} screenshot ${activeImage + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {project.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {project.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                              activeImage === index 
                                ? 'border-cyan-400 scale-105' 
                                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-20 object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Description */}
              {project.detailedDescription && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Overview</h3>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {project.detailedDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {project.challenges && project.challenges.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="w-3 h-3 bg-pink-400 rounded-full mr-3"></span>
                        Challenges
                      </h4>
                      <ul className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-pink-400 mr-3">•</span>
                            <span className="text-gray-600 dark:text-gray-300">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.solutions && project.solutions.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3"></span>
                        Solutions
                      </h4>
                      <ul className="space-y-3">
                        {project.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-cyan-400 mr-3">•</span>
                            <span className="text-gray-600 dark:text-gray-300">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Technologies */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((technology, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm font-medium border border-cyan-500/20"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Project Details</h4>
                <div className="space-y-3">
                  {project.category && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{project.category}</span>
                    </div>
                  )}
                  {project.featured && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-pink-500/10 rounded-2xl p-6 border border-cyan-500/20">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Interested in this project?</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Let's discuss how we can create something similar for your business.
                </p>
                <Link
                  to="/contact"
                  className="block w-full text-center py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
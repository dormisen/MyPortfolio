import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

interface ProjectProps {
  _id: string;
  title: string;
  description: string;
  tech: string[];
  demo?: string;
  github?: string;
  images?: string[];
  featured?: boolean;
}

export default function ProjectCard({ _id, title, description, tech, demo, github, featured }: ProjectProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
      gsap.to(card, {
        y: -15,
        rotationY: 8,
        rotationX: 3,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(card, {
        y: 0,
        rotationY: 0,
        rotationX: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60 hover:border-cyan-400/40 transition-all duration-500 transform-gpu h-full flex flex-col shadow-2xl hover:shadow-cyan-500/20"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-20">
          <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-2xl shadow-cyan-500/25 animate-pulse">
            ⭐ Featured
          </span>
        </div>
      )}

      {/* Project Image/Placeholder */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
        <div className="text-7xl opacity-60 group-hover:scale-110 transition-transform duration-700">
          {isHovered ? '🚀' : '💻'}
        </div>
        
        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
          <div className="flex space-x-3 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <Link
              to={`/projects/${_id}`}
              className="px-5 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View Details
            </Link>
            {demo && (
              <a 
                href={demo} 
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce delay-300"></div>
      </div>

      {/* Content */}
      <div className="p-7 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-500 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1 leading-relaxed line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </p>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tech.slice(0, 4).map((techItem, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl text-sm font-medium border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all duration-300 hover:scale-105"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {techItem}
            </span>
          ))}
          {tech.length > 4 && (
            <span className="px-4 py-2 bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded-xl text-sm border border-gray-500/20 group-hover:scale-105 transition-all duration-300">
              +{tech.length - 4}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
          <Link
            to={`/projects/${_id}`}
            className="group/link text-cyan-500 hover:text-cyan-400 font-semibold text-sm transition-all duration-300 flex items-center hover:scale-105"
          >
            Read Case Study
            <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <div className="flex space-x-4">
            {github && (
              <a 
                href={github} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110"
                title="View Code"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            {demo && (
              <a 
                href={demo} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                title="Live Demo"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Animated Border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
        <div className="absolute inset-[2px] rounded-3xl bg-white dark:bg-gray-800"></div>
      </div>
    </div>
  );
}
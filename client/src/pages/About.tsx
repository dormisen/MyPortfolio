import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  level: number;
  description: string;
  icon: string;
  category: string;
}

interface Experience {
  year: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
  type: string;
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-content', 
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

      gsap.fromTo('.skill-item', 
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo('.experience-item', 
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.experience-timeline',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const skills: Skill[] = [
    { name: 'React/Next.js', level: 90, description: 'Building modern, responsive web applications', icon: '⚛️', category: 'frontend' },
    { name: 'TypeScript', level: 85, description: 'Type-safe development for better code quality', icon: '📘', category: 'frontend' },
    { name: 'Node.js/Express', level: 80, description: 'Server-side development and API creation', icon: '🚀', category: 'backend' },
    { name: 'MongoDB', level: 75, description: 'Database design and management', icon: '🍃', category: 'backend' },
    { name: 'TailwindCSS', level: 95, description: 'Utility-first CSS framework mastery', icon: '🎨', category: 'frontend' },
    { name: 'Three.js/WebGL', level: 70, description: '3D graphics and interactive experiences', icon: '✨', category: 'creative' },
    { name: 'Figma/Adobe Suite', level: 85, description: 'UI/UX design and prototyping', icon: '🎯', category: 'design' },
    { name: 'GSAP Animations', level: 80, description: 'Advanced web animations', icon: '🎪', category: 'creative' },
    { name: 'Python/Django', level: 75, description: 'Backend development and automation', icon: '🐍', category: 'backend' },
    { name: 'AWS/DevOps', level: 70, description: 'Cloud infrastructure and deployment', icon: '☁️', category: 'backend' },
    { name: 'React Native', level: 75, description: 'Cross-platform mobile development', icon: '📱', category: 'mobile' },
    { name: 'GraphQL', level: 70, description: 'Modern API query language', icon: '🔗', category: 'backend' }
  ];

  const experiences: Experience[] = [
    {
      year: "2024",
      role: "Full Stack Developer",
      company: "Tech Corp",
      description: "Leading development of web applications using modern technologies and best practices.",
      technologies: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
      type: "fulltime"
    },
    {
      year: "2023",
      role: "Frontend Developer",
      company: "Digital Agency",
      description: "Created responsive websites and implemented complex animations for various clients.",
      technologies: ["Vue.js", "GSAP", "Sass", "Webpack", "Three.js"],
      type: "fulltime"
    },
    {
      year: "2022",
      role: "UI/UX Designer",
      company: "Startup Inc",
      description: "Designed user interfaces and improved user experience flows for mobile and web applications.",
      technologies: ["Figma", "Adobe XD", "Sketch", "Principle", "Prototyping"],
      type: "fulltime"
    },
    {
      year: "2021",
      role: "Freelance Developer",
      company: "Various Clients",
      description: "Worked with multiple clients to deliver custom web solutions and digital experiences.",
      technologies: ["React", "Node.js", "MongoDB", "Tailwind", "Firebase"],
      type: "freelance"
    }
  ];

  const categories = [
    { key: 'all', label: 'All Skills', count: skills.length },
    { key: 'frontend', label: 'Frontend', count: skills.filter(s => s.category === 'frontend').length },
    { key: 'backend', label: 'Backend', count: skills.filter(s => s.category === 'backend').length },
    { key: 'design', label: 'Design', count: skills.filter(s => s.category === 'design').length },
    { key: 'creative', label: 'Creative', count: skills.filter(s => s.category === 'creative').length },
    { key: 'mobile', label: 'Mobile', count: skills.filter(s => s.category === 'mobile').length }
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-light-gradient dark:bg-dark-gradient relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="about-content">
            {/* Enhanced Header Section */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-6">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">About Me</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-8">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                  My Journey
                </span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full mb-8"></div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Crafting digital experiences that blend innovative design with cutting-edge technology
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left Column - Bio & Experience */}
              <div className="space-y-12">
                {/* Enhanced Bio Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-cyan-600 dark:text-cyan-400 flex items-center">
                    <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                    My Story
                  </h3>
                  
                  <div className="space-y-6">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      I'm a passionate <strong className="text-cyan-600 dark:text-cyan-400">Full-Stack Developer</strong> and <strong className="text-pink-600 dark:text-pink-400">Creative Designer</strong> with a mission to build digital experiences that not only look stunning but also deliver exceptional performance and usability.
                    </p>
                    
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      With expertise in the <strong>MERN stack</strong> and modern frontend technologies, I specialize in creating scalable web applications that push the boundaries of what's possible on the web.
                    </p>

                    <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 p-6 rounded-2xl border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-600 dark:text-cyan-400 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                        What drives me:
                      </h4>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-center group">
                          <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                          Creating intuitive user experiences
                        </li>
                        <li className="flex items-center group">
                          <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                          Building performant, scalable applications
                        </li>
                        <li className="flex items-center group">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                          Exploring new technologies and frameworks
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Enhanced Experience Timeline */}
                <div className="experience-timeline">
                  <h3 className="text-2xl font-bold mb-8 text-cyan-600 dark:text-cyan-400 flex items-center">
                    <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                    Professional Experience
                  </h3>
                  <div className="space-y-8 relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-pink-500 transform -translate-x-1/2"></div>
                    
                    {experiences.map((exp, index) => (
                      <div key={index} className="experience-item relative flex gap-6 group">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-16 h-16 ${
                            exp.type === 'fulltime' 
                              ? 'bg-gradient-to-br from-cyan-400 to-pink-500' 
                              : 'bg-gradient-to-br from-purple-400 to-orange-400'
                          } rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <span className="text-white font-bold text-sm">{exp.year}</span>
                          </div>
                          <div className={`w-3 h-3 ${
                            exp.type === 'fulltime' ? 'bg-cyan-400' : 'bg-purple-400'
                          } rounded-full mt-4 group-hover:scale-150 transition-transform duration-300`}></div>
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 group-hover:shadow-xl transition-all duration-500 group-hover:border-cyan-400/30 group-hover:scale-105">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                              {exp.role}
                            </h4>
                            <p className="text-cyan-600 dark:text-cyan-400 font-semibold mb-3">{exp.company}</p>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                              {exp.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-3 py-1 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 rounded-xl text-sm border border-cyan-500/20 hover:scale-105 transition-all duration-300"
                                  style={{ transitionDelay: `${techIndex * 50}ms` }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Enhanced Skills */}
              <div className="skills-grid">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-8 text-cyan-600 dark:text-cyan-400 flex items-center">
                    <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                    Technical Skills
                  </h3>

                  {/* Skill Categories */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((category) => (
                      <button
                        key={category.key}
                        onClick={() => setActiveCategory(category.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          activeCategory === category.key
                            ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400'
                        }`}
                      >
                        {category.label} ({category.count})
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {filteredSkills.map((skill, index) => (
                      <div 
                        key={skill.name} 
                        className="skill-item group relative"
                        onMouseEnter={() => setActiveSkill(skill.name)}
                        onMouseLeave={() => setActiveSkill(null)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{skill.icon}</span>
                            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                              {skill.name}
                            </span>
                          </div>
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold group-hover:scale-110 transition-transform duration-300">{skill.level}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-green-400 via-orange-600 to-red-500 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden group-hover:from-green-400 group-hover:to-red-600"
                            style={{ width: '0%' }}
                            ref={el => {
                              if (el) {
                                setTimeout(() => {
                                  el.style.width = `${skill.level}%`;
                                }, 100 * index);
                              }
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                          </div>
                        </div>

                        {/* Enhanced Skill Description Tooltip */}
                        {activeSkill === skill.name && (
                          <div className="relative z-10 top-full left-0 right-0 mt-3 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 transform origin-top">
                            <div className="absolute -top-2 left-6 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-600 transform rotate-45"></div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {skill.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Call to Action */}
                  <div className="mt-12 text-center">
                    <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 p-8 rounded-3xl border border-cyan-500/20">
                      <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Ready to bring your ideas to life?
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                          href="/contact"
                          className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10 flex items-center">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Let's Talk
                          </span>
                        </a>
                        <a
                          href="/rida-iquen-resume.pdf"
                          download
                          className="group relative inline-flex items-center px-8 py-4 border-2 border-cyan-400 text-cyan-600 dark:text-cyan-400 font-semibold rounded-2xl transition-all duration-500 hover:bg-cyan-400 hover:text-white hover:scale-105"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Resume
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
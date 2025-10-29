import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: string;
  gradient: string;
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.service-header', 
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

      gsap.fromTo('.service-card', 
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services: Service[] = [
    {
      icon: '🎨',
      title: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user interfaces that provide exceptional user experiences.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Design Systems'],
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      icon: '💻',
      title: 'Frontend Development',
      description: 'Building responsive and performant web applications using modern technologies and frameworks.',
      features: ['React/Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP Animations', 'Responsive Design'],
      color: 'from-cyan-500 to-blue-500',
      gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500'
    },
    {
      icon: '⚙️',
      title: 'Backend Development',
      description: 'Developing robust server-side solutions and APIs to power your applications.',
      features: ['Node.js/Express', 'MongoDB', 'REST APIs', 'Authentication', 'Database Design'],
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      icon: '🚀',
      title: 'Full-Stack Solutions',
      description: 'End-to-end development of web applications from concept to deployment.',
      features: ['MERN Stack', 'DevOps', 'Performance Optimization', 'Testing', 'Deployment'],
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      icon: '📱',
      title: 'Mobile Development',
      description: 'Creating cross-platform mobile applications with modern frameworks.',
      features: ['React Native', 'PWA', 'Mobile UI/UX', 'App Store Deployment', 'Performance'],
      color: 'from-indigo-500 to-purple-500',
      gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    },
    {
      icon: '✨',
      title: 'Creative Solutions',
      description: 'Adding that extra sparkle with animations, 3D elements, and interactive features.',
      features: ['3D Graphics', 'WebGL', 'GSAP', 'Interactive Design', 'Creative Coding'],
      color: 'from-pink-500 to-rose-500',
      gradient: 'bg-gradient-to-r from-pink-500 to-rose-500'
    }
  ];

  return (
    <section id="services" ref={sectionRef} className="py-24 bg-light-gradient dark:bg-dark-gradient relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="service-header text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-6">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">My Services</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                What I Offer
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive digital solutions tailored to bring your ideas to life with cutting-edge technology and creative design.
            </p>
          </div>

          {/* Enhanced Services Grid */}
          <div className="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:scale-105 h-full flex flex-col"
                onMouseEnter={() => setActiveService(index)}
                onMouseLeave={() => setActiveService(null)}
              >
                {/* Animated Icon */}
                <div className={`relative w-20 h-20 ${service.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  {service.icon}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-500">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-1">
                  {service.description}
                </p>

                {/* Enhanced Features List */}
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className="flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300"
                      style={{ transitionDelay: `${featureIndex * 100}ms` }}
                    >
                      <svg className={`w-5 h-5 mr-3 ${service.gradient.replace('bg-', 'text-')} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover Gradient Border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`}></div>

                {/* Floating Elements */}
                {activeService === index && (
                  <>
                    <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-300"></div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced Call to Action */}
          <div className="text-center mt-20">
            <div className="relative bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-3xl p-12 border border-cyan-500/20 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-400 rounded-full blur-2xl"></div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 relative z-10">
                Ready to Start Your Project?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed relative z-10">
                Let's work together to create something amazing. I'm here to help you bring your vision to life with professional design and development services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <a
                  href="#contact"
                  className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Start a Conversation
                  </span>
                </a>
                <a
                  href="#projects"
                  className="group relative inline-flex items-center px-10 py-5 border-2 border-cyan-400 text-cyan-600 dark:text-cyan-400 font-semibold rounded-2xl transition-all duration-500 hover:bg-cyan-400 hover:text-white hover:scale-105"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  View My Work
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
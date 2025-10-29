
// components/Hero.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import myLogo from '../assets/logoorigin.png';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const tl = gsap.timeline();
    
    // Logo animation
    tl.fromTo(logoRef.current, 
      { opacity: 0, scale: 0.8, rotation: -10 },
      { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" }
    )
    // Title animation
    .fromTo(titleRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
      "-=0.5"
    )
    // Subtitle animation
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.8"
    )
    // CTA animation
    .fromTo(ctaRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.5"
    );

    // Floating background animation
    gsap.to(heroRef.current, {
      backgroundPosition: "50% 100%",
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Particle animation for background
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle) => {
      gsap.to(particle, {
        y: -100,
        x: Math.random() * 100 - 50,
        rotation: Math.random() * 360,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        delay: Math.random() * 5,
        ease: "none"
      });
    });
  }, []);

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div 
        ref={heroRef}
        className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-900/20 to-sky-900/20 bg-[size:200%_200%]"
      >
        {/* Animated Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="text-center z-10 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center">
        {/* Logo */}
        <img 
          ref={logoRef}
          src={myLogo} 
          alt="Rida Portfolio Logo - Creative Designer and Full-Stack Developer" 
          className='w-auto h-32 md:h-36 object-contain mb-8 rounded-2xl shadow-2xl' 
          loading="eager"
          width="144"
          height="144"
        />
          
        {/* Main Title */}
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
        >
         <span className="bg-gradient-to-r from-violet-600  to-blue-400 bg-clip-text text-transparent animate-gradient">
            Rida
          </span>
        </h1>
        
        {/* Subtitle */}
        <div className="overflow-hidden mb-8">
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light"
          >
            <span className="text-cyan-400 font-semibold">Creative Designer</span> &{' '}
            <span className="text-fuchsia-400 font-semibold">Full-Stack Developer</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Crafting immersive digital experiences at the intersection of innovative design and cutting-edge technology
        </p>

        {/* Call to Action Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a 
            href="#projects" 
            className="group relative px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-950 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-offset-2"
            aria-label="View my portfolio projects"
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              View My Work
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          
          <a 
            href="#contact" 
            className="group px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:shadow-2xl hover:shadow-cyan-400/25 flex items-center focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-offset-2"
            aria-label="Contact me for collaboration"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Get In Touch
          </a>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-cyan-400">3+</div>
            <div className="text-neutral-700 text-sm">Years Experience</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-pink-400">20+</div>
            <div className="text-gray-400 text-sm">Projects Done</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-purple-400">15+</div>
            <div className="text-gray-400 text-sm">Happy Clients</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="w-5 h-9 border-2 border-cyan-400 rounded-full flex justify-center">
          <div className="w-1 h-1.5 bg-cyan-400 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
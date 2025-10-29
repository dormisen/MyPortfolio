import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    label: "Years Experience",
    value: "3+",
    icon: "⏳",
    suffix: "",
    description: "Years of professional experience",
    color: "from-cyan-500 to-blue-500"
  },
  {
    label: "Projects Completed",
    value: "15",
    suffix: "+",
    icon: "🚀",
    description: "Successful projects delivered",
    color: "from-purple-500 to-pink-500"
  },
  {
    label: "Happy Clients",
    value: "10",
    suffix: "+",
    icon: "😊",
    description: "Satisfied clients worldwide",
    color: "from-green-500 to-emerald-500"
  },
  {
    label: "Technologies",
    value: "20",
    suffix: "+",
    icon: "🛠️",
    description: "Technologies mastered",
    color: "from-orange-500 to-red-500"
  },
];

const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stats-header', 
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

      gsap.fromTo('.stat-item', 
        { opacity: 0, y: 30, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse',
            onEnter: () => setCounted(true)
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const Counter = ({ value, suffix }: { value: string; suffix: string }) => {
    const [count, setCount] = useState("0");
    
    useEffect(() => {
      if (!counted) return;
      
      let start = 0;
      const end = parseInt(value);
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16); // 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start).toString());
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [value, counted]);

    return (
      <span>
        {count}{suffix}
      </span>
    );
  };

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="py-24 bg-dark-gradient relative overflow-hidden transition-colors duration-300"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="stats-header text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-cyan-400 font-semibold">Achievements</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              By The Numbers
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Quantifying success through measurable achievements and continuous growth in the digital landscape.
          </p>
        </div>

        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, _index) => (
            <div
              key={stat.label}
              className="stat-item group relative bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:scale-105 text-center"
            >
              {/* Animated Icon */}
              <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                {stat.icon}
              </div>

              {/* Counter */}
              <div className="text-5xl md:text-6xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
              </div>

              {/* Label */}
              <div className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-500">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-gray-400 text-sm">
                {stat.description}
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500 -z-10`}></div>

              {/* Floating Elements */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300"></div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Continuous Learning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Quality Focused</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span>Client First</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
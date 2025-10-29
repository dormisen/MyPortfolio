import mylogo from '../assets/logoorigin.png';
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/ridaportfolio',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/ridaportfolio',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/ridaportfolio',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'Email',
      url: 'mailto:r.aitiquen@gmail.com',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-purple-900 border-t border-cyan-500/20 py-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-pink-500/5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg shadow-cyan-500/25">
                <img src={mylogo} alt="logo" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                Rida Iquen
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg max-w-md">
              Creative Designer & Full-Stack Developer crafting immersive digital experiences with innovative design and cutting-edge technology.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-gray-800/50 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-500 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/25 backdrop-blur-sm border border-gray-700/50 hover:border-transparent"
                  aria-label={`Visit ${link.name} profile`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {link.icon}
                  <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-bottom-10 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {link.name}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/', icon: '🏠' },
                { name: 'Projects', href: '/projects', icon: '💼' },
                { name: 'About', href: '/about', icon: '👤' },
                { name: 'Contact', href: '/contact', icon: '📞' }
              ].map((link, index) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:translate-x-2 py-2"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <span className="mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{link.icon}</span>
                    <span className="border-b border-transparent group-hover:border-cyan-400 transition-all duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="w-3 h-3 bg-pink-400 rounded-full mr-3 animate-pulse"></span>
              Get In Touch
            </h4>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-cyan-500/20 transition-colors duration-300">
                  📧
                </div>
                <a href="mailto:r.aitiquen@gmail.com" className="hover:text-cyan-400 transition-colors duration-300">
                  r.aitiquen@gmail.com
                </a>
              </div>
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-pink-500/20 transition-colors duration-300">
                  📱
                </div>
                <a href="tel:+212643144457" className="hover:text-pink-400 transition-colors duration-300">
                  +212 643144457
                </a>
              </div>
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-500/20 transition-colors duration-300">
                  📍
                </div>
                <span>Morroco, MAR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <p className="text-gray-400 text-sm">
                © {currentYear} Rida Iquen. All rights reserved.
              </p>
            </div>
            <div className="text-center lg:text-right">
              <p className="text-gray-500 text-sm flex items-center justify-center lg:justify-end">
                <span className="flex items-center mr-2">
                  Built with <span className="text-red-500 mx-1">❤️</span> using
                </span>
                React, TypeScript & Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>
    </footer>
  );
}
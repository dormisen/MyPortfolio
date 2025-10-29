import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import myLogo from '../assets/logoorigin.png';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'projects', 'about', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', href: '/'},
    { name: 'Projects', href: '/projects'},
    { name: 'About', href: '/about'},
    { name: 'Contact', href: '/contact'}
  ];

  return (
    <nav className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? ' bg-light-background/90 dark:bg-dark-primary/90 backdrop-blur-xl shadow-2xl shadow-cyan-500/10' 
        : 'bg-transparent'
    }`}>
      {/* Animated Border Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></div>
      
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <a 
            href="/" 
            className="group relative flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 rounded-2xl p-2 transition-all duration-300 hover:scale-105"
            aria-label="Rida Portfolio - Go to Home"
          >
            <div className="relative">
              <img 
                src={myLogo} 
                alt="Rida Portfolio Logo" 
                className='w-auto h-12 md:h-14 object-contain bg-transparent transition-all duration-500 group-hover:scale-110'
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent hidden md:block">
              Rida Iquen
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className={`group relative flex items-center space-x-2 font-medium transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 rounded-2xl px-4 py-3 ${
                  activeSection === item.href.slice(1)
                    ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/20'
                    : 'text-dark-primary dark:text-dark-light hover:text-cyan-400 hover:bg-light-accent dark:hover:bg-dark-secondary'
                }`}
                aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                
                <span className="relative">
                  {item.name}
                  {activeSection === item.href.slice(1) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 rounded-full"></span>
                  )}
                </span>
              </a>
            ))}
            
            {/* Admin Dashboard Link */}
            {isAuthenticated && (
              <a
                href="/admin/dashboard"
                className="group relative flex items-center space-x-2 font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 rounded-2xl px-4 py-3 text-green-600 dark:text-green-400 hover:bg-green-400/10 border border-green-400/20"
                aria-current={activeSection === 'admin' ? 'page' : undefined}
              >
                <span>📊</span>
                <span>Dashboard</span>
              </a>
            )}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Admin Logout */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="group relative flex items-center space-x-2 px-4 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 text-red-600 dark:text-red-400 hover:bg-red-400/10 border border-red-400/20"
              >
                <span>🚪</span>
                <span className="hidden md:block">Logout</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden group relative p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all duration-500 hover:scale-110 hover:text-cyan-400 shadow-lg hover:shadow-cyan-500/25"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <div className="relative">
                {isMenuOpen ? '✕' : '☰'}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-3xl mt-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex items-center space-x-4 px-6 py-4 rounded-2xl font-medium transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 ${
                    activeSection === item.href.slice(1)
                      ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-lg'
                      : 'text-dark-primary dark:text-dark-light hover:bg-light-accent dark:hover:bg-dark-secondary hover:scale-105'
                  }`}
                  aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  
                  <span>{item.name}</span>
                </a>
              ))}
              
              {/* Admin Dashboard Link - Mobile */}
              {isAuthenticated && (
                <a
                  href="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center space-x-4 px-6 py-4 rounded-2xl font-medium text-green-600 dark:text-green-400 hover:bg-green-400/10 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </a>
              )}
              
              {/* Admin Logout - Mobile */}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="group flex items-center space-x-4 px-6 py-4 rounded-2xl font-medium text-red-600 dark:text-red-400 hover:bg-red-400/10 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 text-left"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
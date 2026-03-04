import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Terminal, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#stats' },
    { label: 'Repositories', href: '#projects' },
    { label: 'Stack', href: '#skills' },
    { label: 'Commits', href: '#experience' },
    { label: 'Issues', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#30363D] shadow-2xl' 
            : 'bg-[#0D1117]/70 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Terminal className="w-5 h-5 text-[#00F0FF] group-hover:text-[#BC13FE] transition-colors" />
              <span className="mono text-sm font-semibold text-[#E6EDF3]">
                bibin<span className="text-[#8B949E]">.dev</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="px-4 py-2 mono text-sm text-[#8B949E] hover:text-[#E6EDF3] rounded-md hover:bg-[#21262D] transition-all"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Social Links */}
            <div className="hidden md:flex items-center gap-3">
              <a 
                href="https://github.com/Bibin-VR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] rounded-md transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/bibin-v-r-5a6762271/"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:bibin.blp@gmail.com"
                className="p-2 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] rounded-md transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#8B949E] hover:text-[#E6EDF3]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-16 left-0 right-0 bg-[#161B22] border-b border-[#30363D] p-4 transition-transform duration-200 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="px-4 py-3 mono text-sm text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] rounded-md transition-all text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#30363D]">
              <a 
                href="https://github.com/Bibin-VR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-[#8B949E] hover:text-[#E6EDF3]"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/bibin-v-r-5a6762271/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-[#8B949E] hover:text-[#E6EDF3]"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:bibin.blp@gmail.com"
                className="p-2 text-[#8B949E] hover:text-[#E6EDF3]"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;

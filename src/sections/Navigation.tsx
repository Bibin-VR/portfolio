import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { setMuted } from '../hooks/use-audio';

const THEMES = [
  { id: 'void',     label: 'Void',     filter: 'none',                              accent: '#B0C8E0' },
  { id: 'phosphor', label: 'Phosphor', filter: 'hue-rotate(270deg) saturate(2.2)',  accent: '#4ADE80' },
  { id: 'amber',    label: 'Amber',    filter: 'hue-rotate(188deg) saturate(2)',    accent: '#FBBF24' },
  { id: 'chalk',    label: 'Chalk',    filter: 'invert(1) hue-rotate(180deg)',      accent: '#2563EB' },
] as const;

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [themeIdx, setThemeIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const theme = THEMES[themeIdx];
    document.documentElement.style.filter = theme.filter;
    document.documentElement.style.transition = 'filter 0.5s ease';
    document.documentElement.dataset.theme = theme.id;
  }, [themeIdx]);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    setMuted(!next);
  };

  const cycleTheme = () => setThemeIdx(i => (i + 1) % THEMES.length);

  const navLinks = [
    { label: 'Overview', href: '#stats' },
    { label: 'Projects', href: '#projects' },
    { label: 'Stack', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          isScrolled
            ? 'border-b border-[rgba(255,255,255,0.06)]'
            : ''
        }`}
        style={{
          background: isScrolled
            ? 'rgba(9,9,9,0.92)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 group"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="w-4 h-4 border border-[rgba(176,200,224,0.4)] flex items-center justify-center transition-colors group-hover:border-[rgba(176,200,224,0.8)]">
                <div className="w-1.5 h-1.5 bg-[#B0C8E0] transition-all group-hover:scale-110" />
              </div>
              <span className="mono text-xs tracking-[0.15em] uppercase" style={{ color: 'rgba(240,240,240,0.7)' }}>
                bibin<span style={{ color: 'rgba(240,240,240,0.3)' }}>.vr</span>
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-0">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="px-4 py-2 mono text-[11px] tracking-[0.12em] uppercase transition-colors"
                  style={{ color: 'rgba(240,240,240,0.4)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(240,240,240,0.9)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,240,240,0.4)')}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Controls + Social links */}
            <div className="hidden md:flex items-center gap-0.5">
              {/* Theme cycle — shows next theme's accent dot */}
              <button
                onClick={cycleTheme}
                className="p-2 group relative"
                title={`Theme → ${THEMES[(themeIdx + 1) % THEMES.length].label}`}
              >
                <div
                  className="w-2.5 h-2.5 transition-all group-hover:scale-125"
                  style={{ background: THEMES[(themeIdx + 1) % THEMES.length].accent, opacity: 0.7 }}
                />
              </button>

              {/* Audio toggle */}
              <button
                onClick={toggleAudio}
                className="p-2 transition-colors"
                title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
                style={{ color: audioEnabled ? 'rgba(240,240,240,0.4)' : 'rgba(240,240,240,0.18)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(240,240,240,0.85)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = audioEnabled ? 'rgba(240,240,240,0.4)' : 'rgba(240,240,240,0.18)')}
              >
                {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Divider */}
              <div className="w-px h-3.5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

              {/* Social links */}
              {[
                { href: 'https://github.com/Bibin-VR', icon: Github },
                { href: 'https://www.linkedin.com/in/bibin-v-r-5a6762271/', icon: Linkedin },
                { href: 'mailto:bibin.blp@gmail.com', icon: Mail },
              ].map(({ href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="p-2 transition-opacity"
                  style={{ color: 'rgba(240,240,240,0.35)', opacity: 1 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(240,240,240,0.85)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,240,240,0.35)')}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 transition-opacity"
              style={{ color: 'rgba(240,240,240,0.5)' }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-14 left-0 right-0 border-b border-[rgba(255,255,255,0.06)] p-6 transition-transform duration-200 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-2'
          }`}
          style={{ background: 'rgba(9,9,9,0.97)' }}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="py-3 mono text-xs tracking-[0.15em] uppercase text-left border-b border-[rgba(255,255,255,0.04)] transition-colors"
                style={{ color: 'rgba(240,240,240,0.5)' }}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              {[
                { href: 'https://github.com/Bibin-VR', icon: Github },
                { href: 'https://www.linkedin.com/in/bibin-v-r-5a6762271/', icon: Linkedin },
                { href: 'mailto:bibin.blp@gmail.com', icon: Mail },
              ].map(({ href, icon: Icon }) => (
                <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  style={{ color: 'rgba(240,240,240,0.4)' }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={cycleTheme} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5" style={{ background: THEMES[(themeIdx + 1) % THEMES.length].accent, opacity: 0.75 }} />
                <span className="mono text-[10px] tracking-widest uppercase" style={{ color: 'rgba(240,240,240,0.4)' }}>
                  {THEMES[(themeIdx + 1) % THEMES.length].label}
                </span>
              </button>
              <button onClick={toggleAudio} style={{ color: 'rgba(240,240,240,0.4)' }}>
                {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;


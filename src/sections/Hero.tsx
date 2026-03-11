import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = ({ startAnim = false }: { startAnim?: boolean }) => {
  const [displayText, setDisplayText] = useState('');
  const [wordStates, setWordStates] = useState(['', '', '']);
  const [isScrambling, setIsScrambling] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const name = 'Bibin V R';
  const words = ['Robotics', 'AI', 'Web'];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!$%';

  useEffect(() => {
    if (!startAnim) return;
    const scrambleWord = (wordIdx: number, delay: number, onDone?: () => void) => {
      setTimeout(() => {
        const word = words[wordIdx];
        let it = 0;
        const iv = setInterval(() => {
          setWordStates(prev => {
            const next = [...prev];
            next[wordIdx] = word.split('').map((_, i) =>
              i < it ? word[i] : chars[Math.floor(Math.random() * chars.length)]
            ).join('');
            return next;
          });
          if (it >= word.length) { clearInterval(iv); onDone?.(); }
          it += 0.5;
        }, 38);
      }, delay);
    };

    let iteration = 0;
    const nameInterval = setInterval(() => {
      setDisplayText(
        name.split('').map((_, index) => {
          if (index < iteration) return name[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      if (iteration >= name.length) {
        clearInterval(nameInterval);
        scrambleWord(0, 0);
        scrambleWord(1, 210);
        scrambleWord(2, 420, () => setIsScrambling(false));
      }
      iteration += 0.5;
    }, 45);
    return () => clearInterval(nameInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAnim]);

  const statusItems = [
    { label: 'AI Systems', status: 'ONLINE' },
    { label: 'Robotics', status: 'ACTIVE' },
    { label: 'Embedded', status: 'READY' },
  ];

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full flex items-center overflow-hidden"
    >
      {/* Faint grid */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-20">

          {/* LEFT — Image */}
          <div className="flex-shrink-0 w-full max-w-[280px] sm:max-w-xs lg:max-w-sm order-1">
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: '3/4', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <img
                src="/profile-hero.png"
                alt="Bibin V R"
                className="w-full h-full object-cover object-top"
                style={{ filter: 'grayscale(15%) contrast(1.05)' }}
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(9,9,9,0.5) 0%, transparent 60%)' }}
              />
              {/* Corner mark */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[rgba(176,200,224,0.4)]" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[rgba(176,200,224,0.4)]" />
            </div>

            {/* Status row below image */}
            <div className="flex items-center gap-3 mt-4">
              <div className="w-1.5 h-1.5 rounded-full status-pulse bg-[#B0C8E0]" />
              <span className="mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(240,240,240,0.35)' }}>
                SYSTEM ONLINE
              </span>
            </div>
          </div>

          {/* RIGHT — Text */}
          <div className="flex-1 flex flex-col items-start order-2 pt-2">

            {/* Section index */}
            <div className="flex items-center gap-3 mb-8">
              <span className="mono text-[10px] tracking-[0.25em] uppercase" style={{ color: 'rgba(240,240,240,0.25)' }}>
                00 / INTRO
              </span>
              <div className="h-px w-12" style={{ background: 'rgba(255,255,255,0.12)' }} />
            </div>

            {/* Name — huge */}
            <h1
              className="font-bold mb-4 leading-none"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', letterSpacing: '-0.03em' }}
            >
              <span
                className="mono block"
                style={{
                  color: isScrambling ? '#B0C8E0' : '#F0F0F0',
                  transition: 'color 0.4s ease',
                }}
              >
                {displayText || '\u00A0'}
              </span>
            </h1>

            {/* Subtitle — per-word shuffle reveal */}
            <p className="mono mb-8" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', letterSpacing: '0.06em' }}>
              {words.map((word, i) => (
                <span key={word}>
                  <span style={{
                    color: wordStates[i] === word
                      ? 'rgba(240,240,240,0.45)'
                      : wordStates[i]
                        ? '#B0C8E0'
                        : 'rgba(240,240,240,0)',
                    transition: 'color 0.35s ease',
                    display: 'inline-block',
                    minWidth: `${word.length}ch`,
                  }}>
                    {wordStates[i] || word.replace(/./g, '\u00A0')}
                  </span>
                  {i < words.length - 1 && (
                    <span style={{ color: 'rgba(240,240,240,0.2)', margin: '0 0.35em' }}>·</span>
                  )}
                </span>
              ))}
            </p>

            {/* Ruled separator */}
            <div className="w-full ig-rule mb-8" />

            {/* Description */}
            <p className="mono text-sm leading-relaxed mb-10 max-w-lg" style={{ color: 'rgba(240,240,240,0.5)', lineHeight: '1.9' }}>
              Building intelligent autonomous systems at the intersection of robotics,
              AI, and embedded systems. Specializing in ROS/ROS2, computer vision,
              and LLM-powered applications.
            </p>

            {/* Status indicators — minimal chips */}
            <div className="flex flex-wrap gap-2 mb-10">
              {statusItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-3 py-1.5 mono text-[10px] tracking-[0.12em] uppercase"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(240,240,240,0.4)',
                  }}
                >
                  <span>{item.label}</span>
                  <span className="text-[#B0C8E0]">{item.status}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="ig-btn ig-btn-primary">
                View Projects
              </a>
              <a href="#contact" className="ig-btn">
                Get in Touch
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(9,9,9,0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="mono text-[10px] tracking-[0.12em] uppercase" style={{ color: 'rgba(240,240,240,0.3)' }}>
            ROS: Humble &nbsp;·&nbsp; Python 3.10 &nbsp;·&nbsp; CUDA 12.1
          </span>
          <span className="mono text-[10px] typing-cursor" style={{ color: 'rgba(176,200,224,0.6)' }}>
            init_system
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5" style={{ color: 'rgba(240,240,240,0.2)' }} />
      </div>
    </section>
  );
};

export default Hero;


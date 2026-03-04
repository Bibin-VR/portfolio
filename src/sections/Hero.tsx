import { useEffect, useRef, useState } from 'react';
import { Cpu, Brain, Bot, ChevronDown } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [subText, setSubText] = useState('');
  const [isScrambling, setIsScrambling] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const name = 'Bibin V R';
  const title = 'Robotics & AI Engineer';
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Text scramble effect
  useEffect(() => {
    let iteration = 0;
    const nameInterval = setInterval(() => {
      setDisplayText(
        name
          .split('')
          .map((_, index) => {
            if (index < iteration) {
              return name[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= name.length) {
        clearInterval(nameInterval);
        // Start subtitle scramble
        let subIteration = 0;
        const subInterval = setInterval(() => {
          setSubText(
            title
              .split('')
              .map((_, index) => {
                if (index < subIteration) {
                  return title[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
              })
              .join('')
          );

          if (subIteration >= title.length) {
            clearInterval(subInterval);
            setIsScrambling(false);
          }
          subIteration += 1 / 2;
        }, 30);
      }

      iteration += 1 / 2;
    }, 40);

    return () => clearInterval(nameInterval);
  }, []);

  // Mouse parallax effect for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      
      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const statusItems = [
    { icon: Brain, label: 'AI Systems', status: 'ONLINE', color: '#BC13FE' },
    { icon: Bot, label: 'Robotics', status: 'ACTIVE', color: '#00F0FF' },
    { icon: Cpu, label: 'Embedded', status: 'READY', color: '#00FF9D' },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden"
      id="hero"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0D1117]" />
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #00F0FF 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* LEFT — Image */}
          <div className="flex-shrink-0 w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg order-1">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#30363D] shadow-2xl shadow-[#00F0FF]/10">
              <img
                src="/profile-hero.png"
                alt="Bibin V R"
                className="w-full h-full object-cover object-top"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/60 via-transparent to-transparent" />
              {/* Scanline */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F0FF]/5 to-transparent animate-pulse"
                style={{ animationDuration: '3s' }}
              />
            </div>
          </div>

          {/* RIGHT — Text */}
          <div className="flex-1 flex flex-col items-start order-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-[#30363D] rounded-full mb-6 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-[#00FF9D] status-pulse" />
              <span className="mono text-xs text-[#00FF9D]">SYSTEM ONLINE</span>
            </div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl xl:text-7xl font-bold mb-3">
              <span
                className={`mono ${isScrambling ? 'text-[#00F0FF]' : 'text-[#E6EDF3]'}`}
                style={{
                  textShadow: isScrambling
                    ? '0 0 30px rgba(0, 240, 255, 0.8), 0 0 60px rgba(0, 240, 255, 0.4)'
                    : '0 0 30px rgba(230, 237, 243, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {displayText || '\u00A0'}
              </span>
            </h1>

            {/* Title */}
            <p className="text-lg sm:text-xl xl:text-2xl mb-4 mono">
              <span className={isScrambling ? 'text-[#BC13FE]' : 'text-[#C9D1D9]'}>
                {subText || '\u00A0'}
              </span>
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#8B949E] leading-relaxed max-w-xl mono mb-8">
              Building intelligent autonomous systems at the intersection of{' '}
              <span className="text-[#00F0FF]">robotics</span>,{' '}
              <span className="text-[#BC13FE]">AI</span>, and{' '}
              <span className="text-[#00FF9D]">embedded systems</span>.
              Specializing in ROS/ROS2, computer vision, and LLM-powered applications.
            </p>

            {/* Status Indicators */}
            <div className="flex flex-wrap gap-3 mb-8">
              {statusItems.map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-[#30363D] rounded-lg transition-all shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  <span className="mono text-xs text-[#8B949E]">{item.label}</span>
                  <span className="mono text-xs" style={{ color: item.color }}>{item.status}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="px-5 py-2.5 bg-[#00F0FF] text-[#0D1117] font-semibold rounded-lg hover:bg-[#00F0FF]/90 transition-all flex items-center gap-2 shadow-lg shadow-[#00F0FF]/30"
              >
                <span className="mono text-sm">Explore Repositories</span>
              </a>
              <a
                href="#contact"
                className="px-5 py-2.5 border border-[#30363D] text-[#E6EDF3] bg-[#161B22] rounded-lg hover:bg-[#21262D] hover:border-[#00F0FF] transition-all flex items-center gap-2 shadow-lg"
              >
                <span className="mono text-sm">Open Issue</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Terminal Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-[#484F58]/90 backdrop-blur-lg shadow-2xl rounded-full">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="mono text-xs text-[#C9D1D9]">
                <span className="text-[#00FF9D]">user@portfolio</span>
                <span className="text-[#E6EDF3]">:~$</span>
                <span className="text-[#00F0FF] ml-2 typing-cursor">init_system()</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span className="mono text-xs text-[#C9D1D9]">ROS: Humble</span>
              <span className="mono text-xs text-[#C9D1D9]">Python: 3.10</span>
              <span className="mono text-xs text-[#C9D1D9]">CUDA: 12.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-[#8B949E]" />
      </div>
    </section>
  );
};

export default Hero;

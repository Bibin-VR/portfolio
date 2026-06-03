import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Scene3D from '../components/Scene3D';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!$%^&*+=<>?/|~_.:;{}[]\\';
const NAME   = 'Bibin V R';
const WORDS  = ['Robotics', 'AI', 'Web'];
const DESC   = 'Building intelligent autonomous systems at the intersection of robotics, AI, and embedded systems. Specializing in ROS/ROS2, computer vision, and LLM-powered applications.';
const BAR_L  = 'ROS: Humble · Python 3.10 · CUDA 12.1';
const BAR_R  = 'init_system';
const SEC_IDX = '00 / INTRO';
const SYS_ON  = 'SYSTEM ONLINE';
const STATUS_ITEMS = [
  { label: 'AI Systems', status: 'ONLINE' },
  { label: 'Robotics',   status: 'ACTIVE' },
  { label: 'Embedded',   status: 'READY'  },
];

/** color: transparent → accent (scrambling) → doneColor (settled) */
const sc = (state: string, real: string, doneColor: string) =>
  !state ? 'transparent' : state === real ? doneColor : '#FFFFFF';

const Hero = ({ startAnim = false }: { startAnim?: boolean }) => {
  const [displayText,  setDisplayText]  = useState('');
  const [wordStates,   setWordStates]   = useState(['', '', '']);
  const [isScrambling, setIsScrambling] = useState(true);
  const [secIdx,    setSecIdx]   = useState('');
  const [sysOnline, setSysOnline] = useState('');
  const [sLabels,   setSLabels]  = useState(['', '', '']);
  const [sValues,   setSValues]  = useState(['', '', '']);
  const [desc,  setDesc]  = useState('');
  const [barL,  setBarL]  = useState('');
  const [barR,  setBarR]  = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startAnim) return;

    const rc = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    /** char-by-char scramble; spaces / · / — preserved */
    const scramble = (
      text: string,
      setter: (s: string) => void,
      delay: number,
      step = 0.5,
      tickMs = 35,
      onDone?: () => void,
    ) => {
      setTimeout(() => {
        let it = 0;
        const iv = setInterval(() => {
          setter(text.split('').map((c, i) =>
            /[\s·-]/.test(c) ? c : i < it ? c : rc()
          ).join(''));
          if (it >= text.length) { clearInterval(iv); setter(text); onDone?.(); }
          it += step;
        }, tickMs);
      }, delay);
    };

    /** rapid full-string scramble for `dur`ms then snap */
    const blitz = (text: string, setter: (s: string) => void, delay: number, dur: number) => {
      setTimeout(() => {
        const rnd = () => text.split('').map(c => /[\s,.]/.test(c) ? c : rc()).join('');
        setter(rnd());
        const t0 = Date.now();
        const iv = setInterval(() => {
          if (Date.now() - t0 >= dur) { clearInterval(iv); setter(text); }
          else setter(rnd());
        }, 40);
      }, delay);
    };

    const scrambleWord = (idx: number, delay: number, onDone?: () => void) => {
      setTimeout(() => {
        const w = WORDS[idx];
        let it = 0;
        const iv = setInterval(() => {
          setWordStates(p => {
            const n = [...p];
            n[idx] = w.split('').map((_, i) => i < it ? w[i] : rc()).join('');
            return n;
          });
          if (it >= w.length) { clearInterval(iv); onDone?.(); }
          it += 0.5;
        }, 38);
      }, delay);
    };

    let it = 0;
    const ni = setInterval(() => {
      setDisplayText(NAME.split('').map((_, i) => i < it ? NAME[i] : rc()).join(''));
      if (it >= NAME.length) {
        clearInterval(ni);
        setDisplayText(NAME);
        scrambleWord(0, 0);
        scrambleWord(1, 210);
        scrambleWord(2, 420, () => {
          setIsScrambling(false);
          scramble(SEC_IDX,  setSecIdx,    0);
          scramble(SYS_ON,   setSysOnline, 120);
          STATUS_ITEMS.forEach(({ label }, i) =>
            scramble(label,  v => setSLabels(p => { const n=[...p]; n[i]=v; return n; }), 200 + i * 130)
          );
          STATUS_ITEMS.forEach(({ status }, i) =>
            scramble(status, v => setSValues(p => { const n=[...p]; n[i]=v; return n; }), 250 + i * 130)
          );
          blitz(DESC, setDesc, 350, 700);
          scramble(BAR_L, setBarL, 700, 1, 28);
          scramble(BAR_R, setBarR, 850, 0.5, 35);
        });
      }
      it += 0.5;
    }, 45);
    return () => clearInterval(ni);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAnim]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full flex items-center overflow-hidden"
    >
      {/* Faint grid */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32">
        <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-16">

          {/* LEFT — Text */}
          <div className="flex flex-col items-start order-2 lg:order-1">

            {/* Section index */}
            <div className="flex items-center gap-3 mb-8">
              <span
                className="mono text-[10px] tracking-[0.25em] uppercase"
                style={{ color: sc(secIdx, SEC_IDX, 'rgba(245,245,245,0.3)') }}
              >
                {secIdx || SEC_IDX}
              </span>
              <div className="h-px w-12" style={{ background: 'rgba(255,255,255,0.14)' }} />
            </div>

            {/* Name — huge */}
            <h1
              className="font-bold mb-4 leading-none"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', letterSpacing: '-0.04em' }}
            >
              <span
                style={{ color: isScrambling ? '#FFFFFF' : '#F5F5F5', transition: 'color 0.4s ease' }}
                className={isScrambling ? 'mono block' : 'block'}
              >
                {displayText || ' '}
              </span>
            </h1>

            {/* Subtitle — per-word shuffle */}
            <p className="mono mb-8" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', letterSpacing: '0.06em' }}>
              {WORDS.map((word, i) => (
                <span key={word}>
                  <span style={{
                    color: wordStates[i] === word
                      ? 'rgba(245,245,245,0.5)'
                      : wordStates[i] ? '#FFFFFF' : 'transparent',
                    transition: 'color 0.35s ease',
                    display: 'inline-block',
                    minWidth: `${word.length}ch`,
                  }}>
                    {wordStates[i] || word}
                  </span>
                  {i < WORDS.length - 1 && (
                    <span style={{ color: 'rgba(245,245,245,0.22)', margin: '0 0.35em' }}>·</span>
                  )}
                </span>
              ))}
            </p>

            {/* Ruled separator */}
            <div className="w-full ig-rule mb-8" />

            {/* Description — blitz reveal */}
            <p
              className="mono text-sm leading-relaxed mb-10 max-w-lg"
              style={{
                color: !desc ? 'transparent' : desc === DESC ? 'rgba(245,245,245,0.55)' : '#FFFFFF',
                lineHeight: '1.9',
              }}
            >
              {desc || DESC}
            </p>

            {/* Status chips */}
            <div className="flex flex-wrap gap-2 mb-10">
              {STATUS_ITEMS.map(({ label, status }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 mono text-[10px] tracking-[0.12em] uppercase glass"
                >
                  <span style={{ color: sc(sLabels[i], label, 'rgba(245,245,245,0.45)') }}>
                    {sLabels[i] || label}
                  </span>
                  <span style={{ color: sc(sValues[i], status, '#FFFFFF') }}>
                    {sValues[i] || status}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="ig-btn ig-btn-primary">View Projects</a>
              <a href="#contact" className="ig-btn">Get in Touch</a>
            </div>
          </div>

          {/* RIGHT — 3D centerpiece */}
          <div className="order-1 lg:order-2 w-full">
            <div
              className="relative w-full mx-auto"
              style={{ aspectRatio: '1 / 1', maxWidth: 'min(70vw, 520px)' }}
            >
              {/* corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[rgba(255,255,255,0.25)] z-10" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[rgba(255,255,255,0.25)] z-10" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[rgba(255,255,255,0.25)] z-10" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[rgba(255,255,255,0.25)] z-10" />

              <Scene3D className="absolute inset-0" />

              {/* status row under object */}
              <div className="absolute -bottom-9 left-0 right-0 flex items-center justify-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full status-pulse bg-white" />
                <span
                  className="mono text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: sc(sysOnline, SYS_ON, 'rgba(245,245,245,0.35)') }}
                >
                  {sysOnline || SYS_ON}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom status bar */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t glass"
        style={{ borderColor: 'rgba(255,255,255,0.10)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <span
            className="mono text-[10px] tracking-[0.12em] uppercase"
            style={{ color: sc(barL, BAR_L, 'rgba(245,245,245,0.3)') }}
          >
            {barL || BAR_L}
          </span>
          <span
            className="mono text-[10px] typing-cursor"
            style={{ color: sc(barR, BAR_R, 'rgba(245,245,245,0.6)') }}
          >
            {barR || BAR_R}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5" style={{ color: 'rgba(245,245,245,0.2)' }} />
      </div>
    </section>
  );
};

export default Hero;

import { useEffect, useState } from 'react';
import Hero from './sections/Hero';
import Stats from './sections/Stats';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import Navigation from './sections/Navigation';
import LoadingScreen from './sections/LoadingScreen';
import Dither from './components/Dither';
import { playClick, playScroll, playSection, unlockAudio, startBgAmbient, stopAllAudio } from './hooks/use-audio';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Safety net only — LoadingScreen calls onComplete when boot sequence finishes.
  // This timer fires if something goes wrong (audio error, etc.) after 10 s.
  useEffect(() => {
    const safety = setTimeout(() => { setIsLoading(false); startBgAmbient(); }, 10000);
    return () => clearTimeout(safety);
  }, []);

  // ── Stop all audio when tab is hidden or page is left ─────────────────
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        stopAllAudio();
      } else {
        // Tab returned — resume the AudioContext (browsers allow this without a gesture
        // after the page already had user interaction) then restart bg ambient.
        unlockAudio();
        startBgAmbient();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    // pagehide fires on mobile Safari and bfcache navigations
    window.addEventListener('pagehide', stopAllAudio);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', stopAllAudio);
    };
  }, []);

  // ── Eagerly unlock AudioContext on first valid user gesture ──────────
  // mousemove and scroll do NOT qualify for AudioContext resume in any browser
  // and would silently consume the one-shot flag, blocking real gestures.
  // pointerdown fires on first mouse press AND first touch (before 'click').
  useEffect(() => {
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      unlockAudio();
      document.removeEventListener('pointerdown', unlock, true);
      document.removeEventListener('touchstart', unlock, true);
      document.removeEventListener('keydown', unlock, true);
    };
    document.addEventListener('pointerdown', unlock, true);
    document.addEventListener('touchstart', unlock, true);
    document.addEventListener('keydown', unlock, true);
    return () => {
      document.removeEventListener('pointerdown', unlock, true);
      document.removeEventListener('touchstart', unlock, true);
      document.removeEventListener('keydown', unlock, true);
    };
  }, []);

  // ── Section-crossing chime — fires once per section enter ────────────
  useEffect(() => {
    if (isLoading) return;
    const sections = document.querySelectorAll('main > section[id]');
    let lastId = '';
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id !== lastId) {
            lastId = entry.target.id;
            playSection();
          }
        });
      },
      { threshold: 0.25, rootMargin: '-80px 0px -20% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [isLoading]);

  // ── Global click → techie beep ────────────────────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only beep on interactive elements
      if (
        target.closest('button, a, [role="button"], input, textarea, select, label')
      ) {
        playClick();
      }
    };
    window.addEventListener('click', handleClick, { capture: true });
    return () => window.removeEventListener('click', handleClick, { capture: true });
  }, []);

  // ── Cursor spotlight — update CSS vars directly, zero React re-render ───
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // ── Scroll → sci-fi sweep sound (rAF-throttled) ────────────────────
  useEffect(() => {
    let rafPending = false;
    const handleScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => { playScroll(); rafPending = false; });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden relative scanlines">
      {isLoading && (
        <LoadingScreen
          onComplete={() => { setIsLoading(false); startBgAmbient(); }}
        />
      )}

      {/* Dither Background */}
      <div style={{ width: '100%', minHeight: '100%', position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: 0 }}>
        <Dither
          waveColor={[0.04, 0.04, 0.06]}
          disableAnimation={false}
          enableMouseInteraction
          mouseRadius={0.25}
          colorNum={4}
          waveAmplitude={0.4}
          waveFrequency={0}
          waveSpeed={0.02}
        />
        {/* Near-black overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(9,9,9,0.72)' }} />
      </div>

      <Navigation />

      <main className="relative z-10">
        <Hero />
        <Stats />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}

export default App;

import { useEffect, useRef, useState } from 'react';
import Hero from './sections/Hero';
import Stats from './sections/Stats';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import Navigation from './sections/Navigation';
import LoadingScreen from './sections/LoadingScreen';
import Dither from './components/Dither';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate boot sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen text-[#E6EDF3] overflow-x-hidden relative">
      {isLoading && <LoadingScreen />}
      
      {/* Dither Background - Covers entire site */}
      <div style={{ width: '100%', minHeight: '100%', position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: 0 }}>
        <Dither
          waveColor={[0.2, 0.4, 1]}
          disableAnimation={false}
          enableMouseInteraction
          mouseRadius={0.3}
          colorNum={29.8}
          waveAmplitude={0.86}
          waveFrequency={0}
          waveSpeed={0.04}
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-[#0D1117]/40" />
      </div>
      
      <Navigation />
      
      <main ref={mainRef} className="relative z-10">
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

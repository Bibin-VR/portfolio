import { useEffect, useState } from 'react';
import { playBoot, playBootAmbient, stopBootAmbient, unlockAudio } from '../hooks/use-audio';

const LoadingScreen = () => {
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'ready'>('boot');

  const bootSequence = [
    'BVRS_OS v3.1.4 — initializing...',
    'loading kernel modules............OK',
    'mounting filesystems...............OK',
    'starting ROS2 daemon...............OK',
    'initializing AI inference engine...OK',
    'loading neural network weights.....OK',
    'calibrating sensors................OK',
    'establishing secure connection.....OK',
    'all systems nominal.',
  ];

  useEffect(() => {
    // Try to unlock AudioContext immediately on mount.
    // Browser may allow it on revisits; worst case it's a no-op and the
    // statechange listener inside playBootAmbient handles the deferred start.
    unlockAudio();
    playBootAmbient();
    let lineIndex = 0;

    const lineInterval = setInterval(() => {
      if (lineIndex < bootSequence.length) {
        setBootLines(prev => [...prev, bootSequence[lineIndex]]);
        playBoot(lineIndex, bootSequence.length);
        lineIndex++;
      } else {
        clearInterval(lineInterval);
        setPhase('ready');
        stopBootAmbient();   // fade out drone when boot completes
      }
    }, 220);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100; }
        return prev + 2.2;
      });
    }, 38);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
      stopBootAmbient();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: '#060608' }}
      onPointerDown={unlockAudio}
      onTouchStart={unlockAudio}
    >
      <div className="w-full max-w-xl px-8">

        {/* Logo mark */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-5 h-5 border border-[rgba(176,200,224,0.5)] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#B0C8E0]" />
          </div>
          <span className="mono text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(240,240,240,0.4)' }}>
            bibin.vr — portfolio os
          </span>
        </div>

        {/* Boot log */}
        <div className="terminal p-6 min-h-[280px] mb-6">
          <div className="space-y-1.5">
            {bootLines.map((line, i) => (
              <div
                key={i}
                className="mono text-xs fade-in flex gap-3"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span style={{ color: 'rgba(176,200,224,0.5)' }}>›</span>
                <span style={{
                  color: i === bootLines.length - 1 && phase === 'ready'
                    ? '#B0C8E0'
                    : 'rgba(240,240,240,0.75)'
                }}>
                  {line}
                </span>
              </div>
            ))}
            {phase === 'boot' && (
              <div className="mono text-xs" style={{ color: 'rgba(240,240,240,0.4)' }}>
                <span className="typing-cursor" />
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="mono text-[10px] tracking-widest uppercase" style={{ color: 'rgba(240,240,240,0.3)' }}>
              System Init
            </span>
            <span className="mono text-[10px]" style={{ color: '#B0C8E0' }}>
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
          <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-px transition-all duration-100"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, rgba(176,200,224,0.4), #B0C8E0)',
              }}
            />
          </div>
        </div>

        {/* Status row */}
        <div className="flex items-center gap-8 mt-8">
          {['AI MODULES', 'ROBOTICS', 'EMBEDDED'].map((label) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full status-pulse" style={{ background: '#B0C8E0' }} />
              <span className="mono text-[10px] tracking-widest" style={{ color: 'rgba(240,240,240,0.3)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;


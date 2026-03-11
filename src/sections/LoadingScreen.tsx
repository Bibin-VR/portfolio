import { useEffect, useRef, useState } from 'react';
import { playBoot, playBootAmbient, stopBootAmbient, unlockAudio } from '../hooks/use-audio';

const BOOT_SEQ = [
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

interface Props { onComplete: () => void; }

const LoadingScreen = ({ onComplete }: Props) => {
  const [phase, setPhase] = useState<'init' | 'boot' | 'ready'>('init');
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  const startSequence = () => {
    if (started.current) return;
    started.current = true;
    setPhase('boot');
    playBootAmbient();

    let lineIndex = 0;
    const lineInterval = setInterval(() => {
      if (lineIndex < BOOT_SEQ.length) {
        setBootLines(prev => [...prev, BOOT_SEQ[lineIndex]]);
        playBoot(lineIndex, BOOT_SEQ.length);
        lineIndex++;
      } else {
        clearInterval(lineInterval);
        setPhase('ready');
        stopBootAmbient();
        setTimeout(onComplete, 700);
      }
    }, 220);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100; }
        return prev + 2.2;
      });
    }, 38);
  };

  useEffect(() => {
    // Return visitors / Chrome MEI: ctx already allowed — fires callback immediately.
    // First-time visitors: deferred until their first click on this screen.
    unlockAudio(startSequence);
    return () => { stopBootAmbient(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: '#060608' }}
      onClick={() => unlockAudio(startSequence)}
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

        {/* INIT phase — waiting for first gesture */}
        {phase === 'init' && (
          <div className="terminal p-6 min-h-[280px] mb-6 flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border border-[rgba(176,200,224,0.15)] animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-2 border border-[rgba(176,200,224,0.25)]" />
                <div className="w-2 h-2 bg-[#B0C8E0] animate-pulse" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="mono text-[10px] tracking-[0.35em] uppercase text-[rgba(176,200,224,0.5)]">
                  audio system standby
                </span>
                <span className="mono text-[9px] tracking-[0.15em] uppercase text-[rgba(240,240,240,0.15)]">
                  context suspended — awaiting gesture
                </span>
              </div>
            </div>
            <div
              className="border border-[rgba(176,200,224,0.15)] px-8 py-3 flex items-center gap-3"
              style={{ background: 'rgba(176,200,224,0.03)' }}
            >
              <div className="w-1.5 h-1.5 bg-[#B0C8E0] animate-pulse" />
              <span className="mono text-[10px] tracking-[0.28em] uppercase text-[rgba(240,240,240,0.35)]">
                click anywhere to initialize
              </span>
            </div>
          </div>
        )}

        {/* BOOT / READY phase — boot log */}
        {phase !== 'init' && (
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
        )}

        {/* Progress bar */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="mono text-[10px] tracking-widest uppercase" style={{ color: 'rgba(240,240,240,0.3)' }}>
              {phase === 'init' ? 'Awaiting Signal' : 'System Init'}
            </span>
            <span className="mono text-[10px]" style={{ color: '#B0C8E0' }}>
              {phase === 'init' ? '--' : `${Math.min(Math.round(progress), 100)}%`}
            </span>
          </div>
          <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-px transition-all duration-100"
              style={{
                width: phase === 'init' ? '0%' : `${Math.min(progress, 100)}%`,
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


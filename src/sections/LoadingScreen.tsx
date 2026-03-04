import { useEffect, useState } from 'react';
import { Terminal, Cpu, Activity } from 'lucide-react';

const LoadingScreen = () => {
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootSequence = [
    '> Initializing system core...',
    '> Loading kernel modules...',
    '> Mounting file systems...',
    '> Starting ROS/ROS2 daemon...',
    '> Initializing AI inference engine...',
    '> Loading neural network weights...',
    '> Calibrating sensors...',
    '> Establishing secure connection...',
    '> System ready.',
  ];

  useEffect(() => {
    let lineIndex = 0;
    const lineInterval = setInterval(() => {
      if (lineIndex < bootSequence.length) {
        setBootLines(prev => [...prev, bootSequence[lineIndex]]);
        lineIndex++;
      }
    }, 150);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#010409] flex items-center justify-center">
      <div className="w-full max-w-2xl p-8">
        {/* Terminal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00F0FF]" />
            <span className="mono text-sm text-[#8B949E]">portfolio_boot.log</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#00FF9D]" />
              <span className="mono text-xs text-[#8B949E]">CPU: 12%</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#BC13FE]" />
              <span className="mono text-xs text-[#8B949E]">MEM: 2.4GB</span>
            </div>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="terminal p-6 min-h-[300px]">
          {/* Boot Lines */}
          <div className="space-y-1 mb-6">
            {bootLines.map((line, index) => (
              <div 
                key={index} 
                className="mono text-sm fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-[#00F0FF]">$</span>
                <span className="text-[#E6EDF3] ml-2">{line}</span>
              </div>
            ))}
            {progress < 100 && (
              <div className="mono text-sm">
                <span className="text-[#00F0FF]">$</span>
                <span className="text-[#E6EDF3] ml-2 typing-cursor">_</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="mono text-xs text-[#8B949E]">SYSTEM INITIALIZATION</span>
              <span className="mono text-xs text-[#00FF9D]">{progress}%</span>
            </div>
            <div className="h-1 bg-[#21262D] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00F0FF] to-[#BC13FE] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-center gap-8 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF9D] status-pulse" />
            <span className="mono text-xs text-[#8B949E]">AI MODULES</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00F0FF] status-pulse" />
            <span className="mono text-xs text-[#8B949E]">ROBOTICS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#BC13FE] status-pulse" />
            <span className="mono text-xs text-[#8B949E]">EMBEDDED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

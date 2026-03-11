import { useEffect, useRef, useState } from 'react';
import { GitCommit, FolderGit, TrendingUp, Users } from 'lucide-react';

interface GitHubStats {
  repos: number;
  totalContributions: number;
  totalCommits: number;
  yearsExperience: number;
  followers: number;
  contributionGrid: number[][];
}

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ repos: 0, contributions: 0, commits: 0, followers: 0 });
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch real GitHub data
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || '';
    fetch(`${apiBase}/api/github-stats`)
      .then(r => r.json())
      .then(data => {
        setGithubStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setApiError(true);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Animated counters — triggered when visible and data is ready
  useEffect(() => {
    if (!isVisible || !githubStats) return;

    const targets = {
      repos: githubStats.repos,
      contributions: githubStats.totalContributions,
      commits: githubStats.totalCommits,
      followers: githubStats.followers,
    };
    const duration = 2000;
    const steps = 60;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const easeOut = 1 - Math.pow(1 - step / steps, 3);
      setCounts({
        repos: Math.floor(targets.repos * easeOut),
        contributions: Math.floor(targets.contributions * easeOut),
        commits: Math.floor(targets.commits * easeOut),
        followers: Math.floor(targets.followers * easeOut),
      });
      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, githubStats]);

  // Scanline sweep animation state
  const [scanCol, setScanCol] = useState(-1);
  useEffect(() => {
    if (!isVisible) return;
    let col = 0;
    const total = grid.length;
    const sweep = setInterval(() => {
      setScanCol(col);
      col++;
      if (col >= total) { clearInterval(sweep); setScanCol(-1); }
    }, 28);
    return () => clearInterval(sweep);
  }, [isVisible, grid.length]);

  const statCards = [
    { icon: FolderGit, label: 'Repositories', value: counts.repos, suffix: '', color: '#B0C8E0' },
    { icon: GitCommit, label: 'Commits (this year)', value: counts.commits, suffix: '+', color: '#B0C8E0' },
    { icon: TrendingUp, label: 'Contributions (this year)', value: counts.contributions, suffix: '+', color: '#B0C8E0' },
    { icon: Users, label: 'Followers', value: counts.followers, suffix: '', color: '#B0C8E0' },
  ];

  // Fallback grid if data isn't loaded yet
  const grid = githubStats?.contributionGrid ?? Array.from({ length: 26 }, () => Array(7).fill(0));
  // Weekly totals for the frequency spectrum waveform
  const weekTotals = grid.map((week: number[]) => week.reduce((a: number, b: number) => a + b, 0));
  const maxWeekTotal = Math.max(...weekTotals, 1);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[rgba(255,255,255,0.15)]" />
            <span className="mono text-[10px] tracking-[0.2em] uppercase text-[rgba(240,240,240,0.3)]">01 / Metrics</span>
          </div>
          <h2 className="text-3xl font-bold text-[#F0F0F0] mono mb-3">System Metrics</h2>
          <p className="text-[rgba(240,240,240,0.42)] max-w-2xl mono text-sm">
            Live telemetry pulled directly from{' '}
            <a
              href="https://github.com/Bibin-VR"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B0C8E0] hover:underline"
            >
              github.com/Bibin-VR
            </a>
            . Contribution graphs and counters reflect real activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className={`gh-card p-6 hover-lift transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <stat.icon className="w-4 h-4 text-[rgba(240,240,240,0.45)]" />
                </div>
                {loading && (
                  <div className="w-2 h-2 rounded-full border border-t-transparent animate-spin border-[#B0C8E0]" />
                )}
              </div>
              <div className="counter text-3xl font-bold text-[#F0F0F0] mb-1 mono">
                {loading ? '—' : `${stat.value}${stat.suffix}`}
              </div>
              <div className="mono text-[10px] tracking-widest uppercase text-[rgba(240,240,240,0.35)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Commit Frequency Spectrum — oscilloscope waveform */}
        <div
          className={`gh-card p-6 transition-all duration-700 contrib-panel ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-2 h-2">
                <div className="w-2 h-2 rounded-full bg-[#B0C8E0] absolute animate-ping opacity-40" />
                <div className="w-2 h-2 rounded-full bg-[#B0C8E0]" />
              </div>
              <h3 className="mono text-sm tracking-widest uppercase text-[#B0C8E0]">Signal Waveform</h3>
            </div>
            <div className="flex items-center gap-2">
              {!loading && githubStats && (
                <span className="mono text-[10px] px-2 py-0.5 text-[#B0C8E0] tracking-widest"
                  style={{ border: '1px solid rgba(176,200,224,0.25)', background: 'rgba(176,200,224,0.05)' }}>
                  {githubStats.totalContributions.toLocaleString()} SIGNALS / YEAR
                </span>
              )}
              {apiError && (
                <span className="mono text-[10px] px-2 py-0.5 text-[rgba(240,240,240,0.35)] tracking-widest"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}>UPLINK LOST</span>
              )}
            </div>
          </div>

          {/* Oscilloscope display */}
          <div className="contrib-display">
            {/* Reference grid lines */}
            <div className="contrib-grid-lines">
              {[25, 50, 75].map(pct => (
                <div key={pct} className="contrib-gridline" style={{ bottom: `${pct}%` }} />
              ))}
            </div>
            {/* Frequency bars — one per week */}
            <div className="contrib-bars">
              {weekTotals.map((total, weekIndex) => {
                const heightPct = (total / maxWeekTotal) * 100;
                return (
                  <div key={weekIndex} className="contrib-bar-wrapper">
                    <div
                      className={`contrib-bar-fill${scanCol === weekIndex ? ' contrib-scan-bar' : ''}`}
                      style={{
                        height: isVisible ? `${total > 0 ? Math.max(heightPct, 2) : 0}%` : '0%',
                        transitionDelay: `${weekIndex * 6}ms`,
                        transitionDuration: '500ms',
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="contrib-baseline" />
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Month labels */}
            <div className="flex justify-between sm:justify-start sm:gap-6">
              {['JAN','FEB','MAR','APR','MAY','JUN'].map(month => (
                <span key={month} className="mono text-[10px] tracking-widest text-[rgba(240,240,240,0.25)]">{month}</span>
              ))}
            </div>
            {/* Signal legend */}
            <div className="flex items-center gap-2">
              <span className="mono text-[10px] tracking-widest text-[rgba(240,240,240,0.25)]">BASELINE</span>
              <div className="flex items-end gap-[2px]" style={{ height: '16px' }}>
                {[12, 25, 40, 62, 100].map((h, i) => (
                  <div key={i} className="contrib-legend-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
              <span className="mono text-[10px] tracking-widest text-[rgba(240,240,240,0.25)]">PEAK</span>
            </div>
          </div>
        </div>

        {/* CAPABILITY MATRIX — HUD segmented bars */}
        <div
          className={`mt-6 gh-card p-6 transition-all duration-700 hud-matrix ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          {/* Corner bracket accents */}
          <div className="hud-corner hud-corner-tl" />
          <div className="hud-corner hud-corner-tr" />
          <div className="hud-corner hud-corner-bl" />
          <div className="hud-corner hud-corner-br" />

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="relative w-2 h-2">
                <div className="w-2 h-2 bg-[#B0C8E0] absolute animate-ping opacity-40" />
                <div className="w-2 h-2 bg-[#B0C8E0]" />
              </div>
              <h3 className="mono text-sm tracking-widest uppercase text-[#B0C8E0]">Capability Matrix</h3>
            </div>
            <span className="mono text-[10px] tracking-widest text-[rgba(240,240,240,0.2)]">
              SYS.STATUS: <span className="text-[#B0C8E0]">NOMINAL</span>
            </span>
          </div>

          {/* Skill rows */}
          <div>
            {([
              { name: 'Python / ROS',                   level: 95, id: '01' },
              { name: 'Computer Vision / OpenCV',        level: 88, id: '02' },
              { name: 'Machine Learning / TensorFlow',   level: 85, id: '03' },
              { name: 'Embedded Systems',                level: 82, id: '04' },
              { name: 'LLMs / NLP',                     level: 78, id: '05' },
              { name: 'React / TypeScript',              level: 88, id: '06' },
              { name: 'Tailwind CSS',                    level: 90, id: '07' },
              { name: 'Three.js / OpenGL / WebGL',       level: 75, id: '08' },
              { name: 'Vite / Node.js / Vercel',         level: 83, id: '09' },
            ] as { name: string; level: number; id: string }[]).map((skill, index) => {
              const SEGS = 22;
              const filled = isVisible ? Math.round((skill.level / 100) * SEGS) : 0;
              return (
                <div key={skill.name} className="hud-row">
                  {/* Row ID */}
                  <span className="mono text-[9px] text-[rgba(176,200,224,0.3)] tracking-wider">[{skill.id}]</span>
                  {/* Skill name */}
                  <span className="mono text-[11px] text-[rgba(240,240,240,0.42)] truncate tracking-wide">{skill.name}</span>
                  {/* Segmented bar */}
                  <div className="hud-segments" style={{ width: 'clamp(100px,28vw,210px)' }}>
                    {Array.from({ length: SEGS }).map((_, s) => {
                      const isActive = s < filled;
                      const isPeak   = isActive && s >= filled - 2 && skill.level >= 78;
                      return (
                        <div
                          key={s}
                          className={`hud-seg${ isPeak ? ' hud-seg-peak' : isActive ? ' hud-seg-active' : '' }`}
                          style={{ transitionDelay: `${700 + index * 50 + s * 16}ms` }}
                        />
                      );
                    })}
                  </div>
                  {/* Percentage readout */}
                  <span
                    className="mono text-[10px] w-8 text-right"
                    style={{ color: skill.level >= 85 ? '#B0C8E0' : 'rgba(176,200,224,0.45)' }}
                  >
                    {isVisible ? `${skill.level}%` : '--'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;

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

  const getContributionColor = (level: number) => {
    return [
      'contrib-0',
      'contrib-1',
      'contrib-2',
      'contrib-3',
      'contrib-4',
    ][level] ?? 'contrib-0';
  };

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

        {/* Real Contribution Graph — sci-fi edition */}
        <div
          className={`gh-card p-6 transition-all duration-700 contrib-panel ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="relative w-2 h-2">
                <div className="w-2 h-2 rounded-full bg-[#B0C8E0] absolute animate-ping opacity-40" />
                <div className="w-2 h-2 rounded-full bg-[#B0C8E0]" />
              </div>
              <h3 className="mono text-sm tracking-widest uppercase text-[#B0C8E0]">Contribution Activity</h3>
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

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
              gap: 'clamp(1px, 0.35vw, 3px)',
              width: '100%',
            }}
          >
            {grid.map((week, weekIndex) => (
              <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1px, 0.35vw, 3px)' }}>
                {week.map((level, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`contrib-cell ${getContributionColor(level)} ${
                      isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    } ${scanCol === weekIndex ? 'contrib-scan' : ''}`}
                    style={{
                      transitionDelay: `${(weekIndex * 7 + dayIndex) * 4}ms`,
                      transitionDuration: '180ms',
                    }}
                    title={`${level > 0 ? level : 'No'} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Month labels */}
            <div className="flex justify-between sm:justify-start sm:gap-6">
              {['JAN','FEB','MAR','APR','MAY','JUN'].map(month => (
                <span key={month} className="mono text-[10px] tracking-widest text-[rgba(240,240,240,0.25)]">{month}</span>
              ))}
            </div>
            {/* Energy legend */}
            <div className="flex items-center gap-2">
              <span className="mono text-[10px] tracking-widest text-[rgba(240,240,240,0.25)]">LOW</span>
              <div className="flex gap-[3px]">
                {[0,1,2,3,4].map(level => (
                  <div key={level} className={`contrib-cell w-3 h-3 ${getContributionColor(level)}`} style={{ borderRadius: '2px' }} />
                ))}
              </div>
              <span className="mono text-[10px] tracking-widest text-[rgba(240,240,240,0.25)]">HIGH</span>
            </div>
          </div>
        </div>

        {/* Technology Stack Intensity */}
        <div
          className={`mt-6 gh-card p-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <h3 className="text-lg font-semibold text-[#F0F0F0] mono mb-6">
            Technology Stack Intensity
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Python / ROS', level: 95 },
              { name: 'Computer Vision / OpenCV', level: 88 },
              { name: 'Machine Learning / TensorFlow', level: 85 },
              { name: 'Embedded Systems', level: 82 },
              { name: 'LLMs / NLP', level: 78 },
              { name: 'React / TypeScript', level: 88 },
              { name: 'Tailwind CSS', level: 90 },
              { name: 'Three.js / OpenGL / WebGL', level: 75 },
              { name: 'Vite / Node.js / Vercel', level: 83 },
            ].map((skill, index) => (
              <div key={skill.name} className="flex items-center gap-4">
                <span className="mono text-xs text-[rgba(240,240,240,0.4)] w-52 truncate">{skill.name}</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-px transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? `${skill.level}%` : '0%',
                      background: 'linear-gradient(90deg, rgba(176,200,224,0.5), #B0C8E0)',
                      transitionDelay: `${700 + index * 100}ms`,
                    }}
                  />
                </div>
                <span className="mono text-xs text-[rgba(240,240,240,0.5)] w-10">{skill.level}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;

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
      .catch(() => setLoading(false));
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
      'bg-[#21262D]',
      'bg-[#0E4429]',
      'bg-[#006D32]',
      'bg-[#26A641]',
      'bg-[#39D353]',
    ][level] ?? 'bg-[#21262D]';
  };

  const statCards = [
    { icon: FolderGit, label: 'Repositories', value: counts.repos, suffix: '', color: '#00F0FF' },
    { icon: GitCommit, label: 'Commits (this year)', value: counts.commits, suffix: '+', color: '#00FF9D' },
    { icon: TrendingUp, label: 'Contributions (this year)', value: counts.contributions, suffix: '+', color: '#BC13FE' },
    { icon: Users, label: 'Followers', value: counts.followers, suffix: '', color: '#FFA657' },
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
            <div className="w-1 h-6 bg-gradient-to-b from-[#00F0FF] to-[#BC13FE] rounded-full" />
            <h2 className="text-3xl font-bold text-[#E6EDF3] mono">System Metrics</h2>
          </div>
          <p className="text-[#8B949E] max-w-2xl">
            Live telemetry pulled directly from{' '}
            <a
              href="https://github.com/Bibin-VR"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00F0FF] hover:underline"
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
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                {loading && (
                  <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: stat.color }} />
                )}
              </div>
              <div className="counter text-3xl font-bold text-[#E6EDF3] mb-1">
                {loading ? '—' : `${stat.value}${stat.suffix}`}
              </div>
              <div className="mono text-xs text-[#8B949E]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Real Contribution Graph */}
        <div
          className={`gh-card p-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-[#E6EDF3] mono">Contribution Activity</h3>
              {!loading && githubStats && (
                <span className="mono text-xs px-2 py-1 rounded-full bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/30">
                  {githubStats.totalContributions} this year
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="mono text-xs text-[#8B949E]">Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div key={level} className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`} />
                ))}
              </div>
              <span className="mono text-xs text-[#8B949E]">More</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max pb-2">
              {grid.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((level, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`contrib-cell ${getContributionColor(level)} ${
                        isVisible ? 'scale-100' : 'scale-0'
                      } transition-transform`}
                      style={{
                        transitionDelay: `${(weekIndex * 7 + dayIndex) * 5}ms`,
                        transitionDuration: '200ms',
                      }}
                      title={`${level > 0 ? level : 'No'} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-2 px-1">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => (
              <span key={month} className="mono text-xs text-[#8B949E]">{month}</span>
            ))}
          </div>
        </div>

        {/* Technology Stack Intensity */}
        <div
          className={`mt-6 gh-card p-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <h3 className="text-lg font-semibold text-[#E6EDF3] mono mb-6">
            Technology Stack Intensity
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Python / ROS', level: 95, color: '#00F0FF' },
              { name: 'Computer Vision / OpenCV', level: 88, color: '#00FF9D' },
              { name: 'Machine Learning / TensorFlow', level: 85, color: '#BC13FE' },
              { name: 'Embedded Systems', level: 82, color: '#F85149' },
              { name: 'LLMs / NLP', level: 78, color: '#FFA657' },
              { name: 'React / TypeScript', level: 88, color: '#00F0FF' },
              { name: 'Tailwind CSS', level: 90, color: '#00FF9D' },
              { name: 'Three.js / OpenGL / WebGL', level: 75, color: '#BC13FE' },
              { name: 'Vite / Node.js / Vercel', level: 83, color: '#FFA657' },
            ].map((skill, index) => (
              <div key={skill.name} className="flex items-center gap-4">
                <span className="mono text-sm text-[#8B949E] w-52 truncate">{skill.name}</span>
                <div className="flex-1 h-2 bg-[#21262D] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? `${skill.level}%` : '0%',
                      backgroundColor: skill.color,
                      boxShadow: `0 0 10px ${skill.color}40`,
                      transitionDelay: `${700 + index * 100}ms`,
                    }}
                  />
                </div>
                <span className="mono text-sm text-[#E6EDF3] w-10">{skill.level}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;

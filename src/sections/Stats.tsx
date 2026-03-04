import { useEffect, useRef, useState } from 'react';
import { GitCommit, FolderGit, Clock, TrendingUp } from 'lucide-react';

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ projects: 0, commits: 0, experience: 0, contributions: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;

    const targets = { projects: 12, commits: 500, experience: 4, contributions: 1200 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        projects: Math.floor(targets.projects * easeOut),
        commits: Math.floor(targets.commits * easeOut),
        experience: Math.floor(targets.experience * easeOut),
        contributions: Math.floor(targets.contributions * easeOut),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Generate contribution grid data
  const generateContributionData = () => {
    const weeks = 26;
    const days = 7;
    const data = [];
    
    for (let w = 0; w < weeks; w++) {
      const week = [];
      for (let d = 0; d < days; d++) {
        // Simulate realistic contribution pattern
        const baseIntensity = Math.random();
        const dayOfWeek = d;
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const intensity = isWeekend ? baseIntensity * 0.5 : baseIntensity;
        
        let level = 0;
        if (intensity > 0.8) level = 4;
        else if (intensity > 0.6) level = 3;
        else if (intensity > 0.3) level = 2;
        else if (intensity > 0.1) level = 1;
        
        week.push(level);
      }
      data.push(week);
    }
    return data;
  };

  const contributionData = generateContributionData();

  const getContributionColor = (level: number) => {
    const colors = [
      'bg-[#21262D]',
      'bg-[#0E4429]',
      'bg-[#006D32]',
      'bg-[#26A641]',
      'bg-[#39D353]',
    ];
    return colors[level];
  };

  const statCards = [
    { 
      icon: FolderGit, 
      label: 'Repositories', 
      value: counts.projects,
      suffix: '+',
      color: '#00F0FF'
    },
    { 
      icon: GitCommit, 
      label: 'Commits', 
      value: counts.commits,
      suffix: '+',
      color: '#00FF9D'
    },
    { 
      icon: Clock, 
      label: 'Years Experience', 
      value: counts.experience,
      suffix: '',
      color: '#BC13FE'
    },
    { 
      icon: TrendingUp, 
      label: 'Contributions', 
      value: counts.contributions,
      suffix: '+',
      color: '#F85149'
    },
  ];

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
            Real-time telemetry from development activity. Tracking repository contributions, 
            commit frequency, and system engagement metrics.
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
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="counter text-3xl font-bold text-[#E6EDF3] mb-1">
                {stat.value}{stat.suffix}
              </div>
              <div className="mono text-xs text-[#8B949E]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Contribution Graph */}
        <div 
          className={`gh-card p-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#E6EDF3] mono">
              Contribution Activity
            </h3>
            <div className="flex items-center gap-2">
              <span className="mono text-xs text-[#8B949E]">Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div 
                    key={level}
                    className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
                  />
                ))}
              </div>
              <span className="mono text-xs text-[#8B949E]">More</span>
            </div>
          </div>

          {/* Contribution Grid */}
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max pb-2">
              {contributionData.map((week, weekIndex) => (
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
                      title={`${level} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Month Labels */}
          <div className="flex justify-between mt-2 px-1">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
              <span key={month} className="mono text-xs text-[#8B949E]">{month}</span>
            ))}
          </div>
        </div>

        {/* Skill Heatmap */}
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
            ].map((skill, index) => (
              <div key={skill.name} className="flex items-center gap-4">
                <span className="mono text-sm text-[#8B949E] w-48 truncate">{skill.name}</span>
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

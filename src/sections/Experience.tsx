import { useEffect, useRef, useState } from 'react';
import { 
  GitCommit, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Cpu,
  Car,
  Building2,
  Factory,
  type LucideIcon
} from 'lucide-react';

interface ExperienceItem {
  id: string;
  commitHash: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  icon: LucideIcon;
  color: string;
}

const Experience = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const experiences: ExperienceItem[] = [
    {
      id: 'makerspace',
      commitHash: '8a3f2d1',
      role: 'Makerspace Assistant',
      company: 'Inunity LLP',
      location: 'Mangalore',
      period: 'Nov 2024 - Mar 2025',
      description: [
        'Developed projects on Raspberry Pi, Jetson Nano, and Orion Nano platforms',
        'Implemented computer vision pipelines for real-time object detection',
        'Built autonomous navigation systems using ROS2',
      ],
      icon: Cpu,
      color: '#00F0FF',
    },
    {
      id: 'nitk',
      commitHash: '7e9b4c2',
      role: 'Research Volunteer',
      company: 'NITK Surathkal - CSD',
      location: 'Surathkal',
      period: 'Jun 2024 - Aug 2024',
      description: [
        'Contributed to self-driving car perception and decision-making systems',
        'Implemented sensor fusion algorithms for LiDAR and camera data',
        'Optimized path planning using A* and RRT algorithms',
      ],
      icon: Car,
      color: '#00FF9D',
    },
    {
      id: 'comedkares',
      commitHash: '6d8a3e5',
      role: 'Robotics Intern',
      company: 'ComedKares',
      location: 'Mangalore',
      period: 'Aug 2023 - Jan 2024',
      description: [
        'Built robots with obstacle avoidance and object detection capabilities',
        'Developed Smart Band for athletic performance tracking using Edge Impulse',
        'Won weekly innovation challenges for sustainable robotics solutions',
      ],
      icon: Factory,
      color: '#BC13FE',
    },
    {
      id: 'mcf',
      commitHash: '5c7b2d4',
      role: 'IT Intern',
      company: 'Mangalore Chemicals & Fertilizers',
      location: 'Mangalore',
      period: 'Jul 2023 - Aug 2023',
      description: [
        'Developed AI-powered fire safety system using computer vision',
        'Achieved 99.2% fire detection accuracy with real-time alerts',
        'Integrated with facility management systems for automated response',
      ],
      icon: Building2,
      color: '#F85149',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="experience"
      className="relative py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[rgba(255,255,255,0.15)]" />
            <span className="mono text-[10px] tracking-[0.2em] uppercase text-[rgba(240,240,240,0.3)]">04 / Experience</span>
          </div>
          <h2 className="text-3xl font-bold text-[#F0F0F0] mono mb-3">Execution Log</h2>
          <p className="mono text-sm text-[rgba(240,240,240,0.42)] max-w-2xl">
            Commit history of professional experience. Each entry represents a significant 
            contribution to robotics and AI systems development.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Experience Items */}
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative flex flex-col md:flex-row items-start gap-6 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Timeline Node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                  <div 
                    className="w-6 h-6 flex items-center justify-center"
                    style={{ background: 'rgba(17,17,20,1)', border: '1px solid rgba(176,200,224,0.25)' }}
                  >
                    <exp.icon className="w-3 h-3 text-[#B0C8E0]" />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                }`}>
                  <div className="gh-card p-6 hover-lift">
                    {/* Commit Header */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
                      <GitCommit className="w-4 h-4 text-[rgba(240,240,240,0.3)]" />
                      <span className="mono text-xs text-[#B0C8E0]">commit {exp.commitHash}</span>
                    </div>

                    {/* Role & Company */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-[#F0F0F0] mono mb-1">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-[rgba(240,240,240,0.5)]">
                        <span className="text-sm mono">{exp.company}</span>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[rgba(240,240,240,0.4)]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="mono text-xs">{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="mono text-xs">{exp.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      {exp.description.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[rgba(240,240,240,0.3)] mt-1.5 text-xs">›</span>
                          <p className="text-xs text-[rgba(240,240,240,0.5)] leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                      <span className="mono text-[10px] text-[rgba(240,240,240,0.25)]">Author: Bibin V R</span>
                      <a 
                        href="#"
                        className="flex items-center gap-1 text-[10px] text-[#B0C8E0] hover:opacity-70 transition-opacity mono"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div 
          className={`mt-16 gh-card p-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[rgba(255,255,255,0.15)]" />
            <h3 className="text-xl font-semibold text-[#F0F0F0] mono">Education</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <Cpu className="w-4 h-4 text-[rgba(240,240,240,0.5)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#F0F0F0] mono text-sm mb-1">
                  B.Tech - Robotics, AI & ML
                </h4>
                <p className="text-xs text-[rgba(240,240,240,0.4)] mono mb-1">Srinivas University, Mangalore</p>
                <p className="mono text-[10px] text-[rgba(240,240,240,0.25)]">Dec 2020 - May 2024</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <Factory className="w-4 h-4 text-[rgba(240,240,240,0.5)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#F0F0F0] mono text-sm mb-1">
                  Pre-University - PCMB
                </h4>
                <p className="text-xs text-[rgba(240,240,240,0.4)] mono mb-1">
                  Sri Subrahmanyeshwara PU College
                </p>
                <p className="mono text-[10px] text-[rgba(240,240,240,0.25)]">Jul 2017 - May 2019</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

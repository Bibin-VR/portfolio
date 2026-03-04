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
            <div className="w-1 h-6 bg-gradient-to-b from-[#F85149] to-[#FFA657] rounded-full" />
            <h2 className="text-3xl font-bold text-[#E6EDF3] mono">Execution Log</h2>
          </div>
          <p className="text-[#8B949E] max-w-2xl">
            Commit history of professional experience. Each entry represents a significant 
            contribution to robotics and AI systems development.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00F0FF] via-[#BC13FE] to-[#F85149]" />

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
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0D1117]"
                    style={{ backgroundColor: exp.color }}
                  >
                    <exp.icon className="w-4 h-4 text-[#0D1117]" />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                }`}>
                  <div className="gh-card p-6 hover-lift">
                    {/* Commit Header */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#30363D]">
                      <GitCommit className="w-4 h-4 text-[#8B949E]" />
                      <span className="mono text-xs text-[#00F0FF]">commit {exp.commitHash}</span>
                    </div>

                    {/* Role & Company */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-[#E6EDF3] mono mb-1">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-[#8B949E]">
                        <span className="text-sm">{exp.company}</span>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[#8B949E]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="mono text-xs">{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="mono text-xs">{exp.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      {exp.description.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[#00FF9D] mt-1.5">•</span>
                          <p className="text-sm text-[#8B949E] leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>

                    {/* Author Info */}
                    <div className="mt-4 pt-4 border-t border-[#30363D] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#BC13FE]" />
                        <span className="mono text-xs text-[#8B949E]">Author: Bibin V R</span>
                      </div>
                      <a 
                        href="#"
                        className="flex items-center gap-1 text-xs text-[#00F0FF] hover:underline"
                      >
                        <span className="mono">View Details</span>
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
            <div className="w-1 h-6 bg-gradient-to-b from-[#00FF9D] to-[#00F0FF] rounded-full" />
            <h3 className="text-xl font-semibold text-[#E6EDF3] mono">Education</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[#00F0FF]/10">
                <Cpu className="w-5 h-5 text-[#00F0FF]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#E6EDF3] mb-1">
                  B.Tech - Robotics, AI & ML
                </h4>
                <p className="text-sm text-[#8B949E] mb-1">Srinivas University, Mangalore</p>
                <p className="mono text-xs text-[#484F58]">Dec 2020 - May 2024</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[#BC13FE]/10">
                <Factory className="w-5 h-5 text-[#BC13FE]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#E6EDF3] mb-1">
                  Pre-University - PCMB
                </h4>
                <p className="text-sm text-[#8B949E] mb-1">
                  Sri Subrahmanyeshwara PU College
                </p>
                <p className="mono text-xs text-[#484F58]">Jul 2017 - May 2019</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

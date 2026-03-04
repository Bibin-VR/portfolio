import { useEffect, useRef, useState } from 'react';
import { 
  Cpu, 
  Brain, 
  Code, 
  Microchip,
  ChevronRight,
  Check,
  type LucideIcon
} from 'lucide-react';

interface SkillCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  skills: { name: string; level: number }[];
}

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('robotics');
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

  const categories: SkillCategory[] = [
    {
      id: 'robotics',
      name: 'Robotics & Embedded',
      icon: Cpu,
      color: '#00F0FF',
      description: 'Autonomous systems, ROS/ROS2, sensor fusion, and real-time control.',
      skills: [
        { name: 'ROS / ROS2', level: 95 },
        { name: 'Autoware', level: 85 },
        { name: 'SLAM / Navigation', level: 88 },
        { name: 'Sensor Fusion', level: 82 },
        { name: 'Real-time Control', level: 80 },
        { name: 'Gazebo / RViz', level: 90 },
      ],
    },
    {
      id: 'ai',
      name: 'AI / Machine Learning',
      icon: Brain,
      color: '#BC13FE',
      description: 'Deep learning, computer vision, NLP, and large language models.',
      skills: [
        { name: 'TensorFlow / Keras', level: 90 },
        { name: 'PyTorch', level: 85 },
        { name: 'Computer Vision', level: 92 },
        { name: 'OpenCV', level: 95 },
        { name: 'LLMs / NLP', level: 88 },
        { name: 'Reinforcement Learning', level: 75 },
      ],
    },
    {
      id: 'programming',
      name: 'Programming',
      icon: Code,
      color: '#00FF9D',
      description: 'Languages, frameworks, and development tools.',
      skills: [
        { name: 'Python', level: 95 },
        { name: 'C / C++', level: 85 },
        { name: 'MATLAB', level: 80 },
        { name: 'Git / GitHub', level: 92 },
        { name: 'Docker', level: 78 },
        { name: 'Linux', level: 88 },
      ],
    },
    {
      id: 'hardware',
      name: 'Hardware & Sensors',
      icon: Microchip,
      color: '#F85149',
      description: 'Embedded platforms, microcontrollers, and sensor integration.',
      skills: [
        { name: 'Raspberry Pi', level: 95 },
        { name: 'NVIDIA Jetson', level: 88 },
        { name: 'Arduino', level: 90 },
        { name: 'LiDAR / Camera', level: 85 },
        { name: 'IMU / GPS', level: 82 },
        { name: 'CAN / Serial', level: 78 },
      ],
    },
  ];

  const activeSkills = categories.find(c => c.id === activeCategory)?.skills || [];
  const activeColor = categories.find(c => c.id === activeCategory)?.color || '#00F0FF';

  return (
    <section 
      ref={sectionRef}
      id="skills"
      className="relative py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#BC13FE] to-[#F85149] rounded-full" />
            <h2 className="text-3xl font-bold text-[#E6EDF3] mono">System Architecture</h2>
          </div>
          <p className="text-[#8B949E] max-w-2xl">
            Modular skill stack organized by domain. Each module represents a competency 
            area with associated technologies and proficiency levels.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Navigation */}
          <div 
            className={`space-y-3 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-[#161B22] border-[#30363D]'
                    : 'bg-transparent border-transparent hover:bg-[#161B22]/50'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-lg transition-all"
                    style={{ 
                      backgroundColor: activeCategory === category.id 
                        ? `${category.color}30` 
                        : '#21262D',
                    }}
                  >
                    <category.icon 
                      className="w-5 h-5 transition-colors"
                      style={{ 
                        color: activeCategory === category.id ? category.color : '#8B949E' 
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="font-semibold transition-colors"
                      style={{ 
                        color: activeCategory === category.id ? '#E6EDF3' : '#8B949E' 
                      }}
                    >
                      {category.name}
                    </h3>
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 transition-all ${
                      activeCategory === category.id 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-2'
                    }`}
                    style={{ color: category.color }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Skills Display */}
          <div 
            className={`lg:col-span-2 gh-card p-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Active Category Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#30363D]">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${activeColor}20` }}
              >
                {(() => {
                  const Icon = categories.find(c => c.id === activeCategory)?.icon || Cpu;
                  return <Icon className="w-6 h-6" style={{ color: activeColor }} />;
                })()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#E6EDF3] mono">
                  {categories.find(c => c.id === activeCategory)?.name}
                </h3>
                <p className="text-sm text-[#8B949E]">
                  {categories.find(c => c.id === activeCategory)?.description}
                </p>
              </div>
            </div>

            {/* Skills List */}
            <div className="space-y-5">
              {activeSkills.map((skill, index) => (
                <div 
                  key={skill.name}
                  className="group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Check 
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: activeColor }}
                      />
                      <span className="mono text-sm text-[#E6EDF3]">{skill.name}</span>
                    </div>
                    <span className="mono text-sm text-[#8B949E]">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-[#21262D] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: isVisible ? `${skill.level}%` : '0%',
                        backgroundColor: activeColor,
                        boxShadow: `0 0 10px ${activeColor}50`,
                        transitionDelay: `${300 + index * 50}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Certification Badges */}
            <div className="mt-8 pt-6 border-t border-[#30363D]">
              <h4 className="text-sm text-[#8B949E] mono mb-4">Verified Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'TensorFlow Developer',
                  'Google ML Engineer',
                  'AWS NLP',
                  'Advanced Python',
                ].map((cert) => (
                  <span 
                    key={cert}
                    className="px-3 py-1.5 text-xs mono rounded-full bg-[#21262D] text-[#8B949E] border border-[#30363D] flex items-center gap-1.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tech Constellation */}
        <div 
          className={`mt-12 gh-card p-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <h3 className="text-lg font-semibold text-[#E6EDF3] mono mb-6">
            Technology Constellation
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'ROS2', color: '#00F0FF' },
              { name: 'Python', color: '#00FF9D' },
              { name: 'TensorFlow', color: '#BC13FE' },
              { name: 'OpenCV', color: '#F85149' },
              { name: 'PyTorch', color: '#FFA657' },
              { name: 'Docker', color: '#00F0FF' },
              { name: 'Git', color: '#F85149' },
              { name: 'Linux', color: '#00FF9D' },
              { name: 'CUDA', color: '#BC13FE' },
              { name: 'LLaMA', color: '#FFA657' },
              { name: 'YOLO', color: '#00F0FF' },
              { name: 'Gazebo', color: '#F85149' },
            ].map((tech, index) => (
              <div
                key={tech.name}
                className="px-4 py-2 rounded-full border border-[#30363D] bg-[#161B22] hover:bg-[#21262D] transition-all cursor-default hover:scale-105"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  borderColor: `${tech.color}40`,
                }}
              >
                <span className="mono text-sm" style={{ color: tech.color }}>
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;

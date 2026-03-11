import { useEffect, useRef, useState } from 'react';
import { 
  Cpu, 
  Brain, 
  Code, 
  Microchip,
  Globe,
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
    {
      id: 'web',
      name: 'Web Development',
      icon: Globe,
      color: '#FFA657',
      description: 'Frontend, UI frameworks, 3D graphics, and full-stack tooling.',
      skills: [
        { name: 'React / TypeScript', level: 88 },
        { name: 'Tailwind CSS', level: 90 },
        { name: 'Three.js / WebGL', level: 78 },
        { name: 'OpenGL / GLSL', level: 72 },
        { name: 'Vite / Node.js', level: 82 },
        { name: 'Vercel / CI-CD', level: 85 },
      ],
    },
  ];

  const activeSkills = categories.find(c => c.id === activeCategory)?.skills || [];

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
            <div className="h-px w-8 bg-[rgba(255,255,255,0.15)]" />
            <span className="mono text-[10px] tracking-[0.2em] uppercase text-[rgba(240,240,240,0.3)]">03 / Stack</span>
          </div>
          <h2 className="text-3xl font-bold text-[#F0F0F0] mono mb-3">System Architecture</h2>
          <p className="mono text-sm text-[rgba(240,240,240,0.42)] max-w-2xl">
            Modular skill stack organized by domain.
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
                className={`w-full text-left p-4 transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-[#18181C]'
                    : 'bg-transparent hover:bg-[#13131620]'
                }`}
                style={{
                  border: `1px solid ${activeCategory === category.id ? 'rgba(176,200,224,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  transitionDelay: `${index * 60}ms`
                }}
              >
                <div className="flex items-center gap-4">
                  <category.icon
                    className="w-4 h-4 transition-colors"
                    style={{ color: activeCategory === category.id ? '#B0C8E0' : 'rgba(240,240,240,0.3)' }}
                  />
                  <h3
                    className="font-medium text-sm mono transition-colors"
                    style={{ color: activeCategory === category.id ? '#F0F0F0' : 'rgba(240,240,240,0.4)' }}
                  >
                    {category.name}
                  </h3>
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
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[rgba(255,255,255,0.06)]">
              <div className="p-2" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                {(() => {
                  const Icon = categories.find(c => c.id === activeCategory)?.icon || Cpu;
                  return <Icon className="w-5 h-5 text-[rgba(240,240,240,0.5)]" />;
                })()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#F0F0F0] mono">
                  {categories.find(c => c.id === activeCategory)?.name}
                </h3>
                <p className="text-xs text-[rgba(240,240,240,0.4)] mono">
                  {categories.find(c => c.id === activeCategory)?.description}
                </p>
              </div>
            </div>

            {/* Skills List */}
            <div className="space-y-5">
              {activeSkills.map((skill, index) => (
                <div 
                  key={skill.name}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="mono text-xs text-[rgba(240,240,240,0.65)]">{skill.name}</span>
                    <span className="mono text-xs text-[rgba(240,240,240,0.35)]">{skill.level}%</span>
                  </div>
                  <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-px transition-all duration-700 ease-out"
                      style={{
                        width: isVisible ? `${skill.level}%` : '0%',
                        background: 'linear-gradient(90deg, rgba(176,200,224,0.4), #B0C8E0)',
                        transitionDelay: `${300 + index * 60}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)]">
              <p className="mono text-[10px] tracking-widest uppercase text-[rgba(240,240,240,0.25)] mb-4">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {['TensorFlow Dev', 'Google ML', 'AWS NLP', 'Advanced Python'].map((cert) => (
                  <span 
                    key={cert}
                    className="px-3 py-1 text-[10px] mono text-[rgba(240,240,240,0.45)] flex items-center gap-1.5"
                    style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="w-1 h-1 rounded-full bg-[#B0C8E0]" />
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
          <h3 className="text-lg font-semibold text-[#F0F0F0] mono mb-6">
            Technology Constellation
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {[
              'ROS2', 'Python', 'TensorFlow', 'OpenCV', 'PyTorch', 'Docker',
              'Git', 'Linux', 'CUDA', 'LLaMA', 'YOLO', 'Gazebo',
              'React', 'TypeScript', 'Tailwind CSS', 'Three.js', 'OpenGL', 'Vite', 'Vercel', 'Node.js',
            ].map((tech) => (
              <div
                key={tech}
                className="px-3 py-1.5 mono text-xs cursor-default transition-all hover:border-[rgba(176,200,224,0.25)]"
                style={{ border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(240,240,240,0.5)' }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;

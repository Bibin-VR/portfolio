import { useEffect, useRef, useState } from 'react';
import { 
  Star, 
  GitFork, 
  ExternalLink, 
  Brain, 
  Factory, 
  Flame, 
  Watch,
  ChevronDown,
  ChevronUp,
  Code2,
  type LucideIcon
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  techStack: string[];
  stats: { stars: number; forks: number };
  color: string;
  icon: LucideIcon;
}

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
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

  const projects: Project[] = [
    {
      id: 'trex-ai',
      name: 'trex-ai',
      description: 'Local LLM Personal Assistant',
      fullDescription: `Trex is an AI-powered personal assistant designed to run entirely on a local system, ensuring privacy and offline accessibility. Built on LLaMA 3 architecture with Ollama as the backend runtime, enabling efficient inference directly on the host machine.

Key Features:
• Natural language interaction with contextual understanding
• Task management and scheduling capabilities
• Privacy-focused: all data stays local
• Optimized for consumer hardware
• Extensible plugin architecture`,
      image: '/project-trex.jpg',
      tags: ['AI', 'LLM', 'Python'],
      techStack: ['Python', 'Ollama', 'LLaMA 3', 'PyQt5'],
      stats: { stars: 47, forks: 12 },
      color: '#BC13FE',
      icon: Brain,
    },
    {
      id: 'industry-4.0',
      name: 'industry-4.0-automation',
      description: 'Human-less Industrial Setup',
      fullDescription: `A fully automated industrial environment prototype aligning with Industry 4.0 principles. Utilizes robotic arms and autonomous mobile robots to replace human labor in key factory operations.

System Architecture:
• ROS2-based distributed control system
• Collaborative robotic arms for assembly
• AMR fleet for material transport
• Real-time monitoring and quality control
• 40% improvement in operational efficiency`,
      image: '/project-industry.jpg',
      tags: ['Robotics', 'ROS2', 'Automation'],
      techStack: ['ROS2', 'Python', 'C++', 'MoveIt'],
      stats: { stars: 38, forks: 8 },
      color: '#00FF9D',
      icon: Factory,
    },
    {
      id: 'fire-safety',
      name: 'ai-fire-safety',
      description: 'AI-Powered Fire Safety System',
      fullDescription: `Intelligent fire safety system leveraging computer vision for proactive hazard detection. Designed and deployed at Mangalore Chemicals & Fertilizers Limited (MCF) for industrial safety.

Capabilities:
• Real-time fire and smoke detection using YOLOv8
• Thermal anomaly detection
• Automated alert system with SMS/email notifications
• Integration with existing facility management systems
• 99.2% detection accuracy with <100ms latency`,
      image: '/project-fire.jpg',
      tags: ['Computer Vision', 'Safety', 'IoT'],
      techStack: ['Python', 'OpenCV', 'YOLOv8', 'TensorFlow'],
      stats: { stars: 52, forks: 15 },
      color: '#F85149',
      icon: Flame,
    },
    {
      id: 'smart-band',
      name: 'smart-band-athletics',
      description: 'Performance Tracking Wearable',
      fullDescription: `AI-powered wristband designed to monitor and analyze athletic performance in real time. Developed during internship at ComedKares with focus on edge computing.

Features:
• Motion pattern recognition using Edge Impulse
• Real-time performance metrics on OLED display
• Firebase cloud integration for analytics
• Mistake identification and coaching feedback
• 12-hour battery life with continuous monitoring`,
      image: '/project-band.jpg',
      tags: ['Embedded', 'Edge AI', 'Wearable'],
      techStack: ['C++', 'Edge Impulse', 'Firebase', 'Arduino'],
      stats: { stars: 29, forks: 6 },
      color: '#00F0FF',
      icon: Watch,
    },
  ];

  const toggleExpand = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  return (
    <section 
      ref={sectionRef}
      id="projects"
      className="relative py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00FF9D] to-[#00F0FF] rounded-full" />
            <h2 className="text-3xl font-bold text-[#E6EDF3] mono">Active Modules</h2>
          </div>
          <p className="text-[#8B949E] max-w-2xl">
            Repository overview of active development projects. Each module represents 
            a complete system with documentation, tests, and deployment configurations.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`gh-card overflow-hidden hover-lift transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                borderTop: `3px solid ${project.color}`,
              }}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{ background: `linear-gradient(to top, ${project.color}40, transparent)` }}
                />
                <div className="absolute top-4 left-4">
                  <div 
                    className="p-2 rounded-lg backdrop-blur-sm"
                    style={{ backgroundColor: `${project.color}30` }}
                  >
                    <project.icon className="w-5 h-5" style={{ color: project.color }} />
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-[#E6EDF3] mono mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-[#8B949E]">{project.description}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs mono rounded-full bg-[#21262D] text-[#8B949E] border border-[#30363D]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-4 h-4 text-[#8B949E]" />
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map((tech) => (
                      <span 
                        key={tech}
                        className="text-xs text-[#8B949E]"
                      >
                        {tech}
                        {project.techStack.indexOf(tech) < project.techStack.length - 1 && (
                          <span className="mx-1">•</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-[#8B949E]">
                    <Star className="w-4 h-4" />
                    <span className="mono text-sm">{project.stats.stars}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#8B949E]">
                    <GitFork className="w-4 h-4" />
                    <span className="mono text-sm">{project.stats.forks}</span>
                  </div>
                </div>

                {/* Expandable Description */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedProject === project.id ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="pt-4 border-t border-[#30363D]">
                    <pre className="text-sm text-[#8B949E] whitespace-pre-wrap font-mono leading-relaxed">
                      {project.fullDescription}
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#30363D]">
                  <button
                    onClick={() => toggleExpand(project.id)}
                    className="flex items-center gap-1 text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
                  >
                    {expandedProject === project.id ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span className="mono">Collapse README</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span className="mono">View README</span>
                      </>
                    )}
                  </button>
                  <div className="flex-1" />
                  <a 
                    href="#"
                    className="flex items-center gap-1 text-sm text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="mono">View Code</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className={`mt-12 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <a 
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#30363D] rounded-lg text-[#E6EDF3] hover:bg-[#21262D] hover:border-[#00F0FF] transition-all"
          >
            <span className="mono text-sm">View All Repositories</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;

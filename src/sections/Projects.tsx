import { useEffect, useRef, useState } from 'react';
import { 
  Star, 
  GitFork, 
  ExternalLink, 
  Bot,
  Layers,
  Watch,
  ShoppingBag,
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
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
  techStack: string[];
  stats: { stars: number; forks: number };
  color: string;
  icon: LucideIcon;
}

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [iframeErrors, setIframeErrors] = useState<Record<string, boolean>>({});
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
      id: 'trendora',
      name: 'Trendora',
      description: 'Fashion Aggregator & E-Commerce Platform',
      fullDescription: `A cinematic fashion e-commerce web app with an immersive loading experience. Built with React 19 and a Python/FastAPI backend, deployed on GitHub Pages.

Features:
• 🔐 User Authentication with JWT
• 🛒 Shopping Cart & Checkout flow
• 🎨 Dark / Light theme toggle
• 🔊 Ambient Audio Manager
• 🏷️ Collections & Featured Products
• 💳 Razorpay Payment Integration
• 🔍 Gender filter & product search
• 📱 Fully responsive — mobile to desktop`,
      liveUrl: 'https://trendora-studio.web.app/',
      tags: ['Web', 'E-Commerce', 'React'],
      techStack: ['React 19', 'Tailwind CSS', 'FastAPI', 'MongoDB', 'Razorpay'],
      stats: { stars: 0, forks: 0 },
      color: '#FF6B9D',
      icon: ShoppingBag,
    },
    {
      id: 'texstudio',
      name: 'Tex Studio',
      description: 'Creative Web Studio & Design Platform',
      fullDescription: `A modern creative studio web application built with Next.js and deployed on Firebase. Designed as a professional design and productivity platform with a clean, minimal UI.

Highlights:
• ⚡ Next.js 14 App Router architecture
• 🎨 Studio-grade design tooling interface
• 🔥 Firebase hosting with global CDN
• 📱 Fully responsive layout
• 🌙 Dark-first aesthetic
• ⚡ Blazing fast page loads with SSR`,
      liveUrl: 'https://texstudio.web.app/',
      tags: ['Web', 'Next.js', 'Firebase'],
      techStack: ['Next.js 14', 'React', 'Tailwind CSS', 'Firebase'],
      stats: { stars: 0, forks: 0 },
      color: '#BC13FE',
      icon: Layers,
    },
    {
      id: 'go2w',
      name: 'Go2W_ws',
      description: 'Voice-Controlled Unitree Go2 Robot',
      fullDescription: `An interactive voice-controlled system for the Unitree Go2 quadruped robot. Combines offline speech recognition with Google Gemini AI to interpret and execute natural language commands in real time.

System Architecture:
• Wake-word detection ("zha zha") via Vosk offline ASR
• Gemini AI interprets freeform voice commands
• Direct keyword bypass for faster critical actions
• Custom C++ executables for each robot behaviour
• UDP broadcast of recognised speech for sensor fusion
• 5-minute auto-reset to wake-word mode after pose

Supported Commands:
• Walk, turn left/right, move back, stop/halt
• Pose, sing, talk, answer, sad expression
• Stand up / sit down / lie down / balance`,
      image: '/project-go2w.png',
      githubUrl: 'https://github.com/Bibin-VR/Go2W_ws',
      tags: ['Robotics', 'Voice AI', 'C++'],
      techStack: ['C++', 'Python', 'Vosk', 'Gemini AI', 'Unitree SDK'],
      stats: { stars: 0, forks: 0 },
      color: '#00FF9D',
      icon: Bot,
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
      githubUrl: 'https://github.com/Bibin-VR/smart-band-athletics',
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
              {/* Project Preview */}
              <div className="relative h-48 overflow-hidden bg-[#0D1117]">
                {project.liveUrl && !iframeErrors[project.id] ? (
                  <>
                    <iframe
                      src={project.liveUrl}
                      title={`${project.name} preview`}
                      className="absolute top-0 left-0"
                      style={{
                        width: '200%',
                        height: '200%',
                        transform: 'scale(0.5)',
                        transformOrigin: 'top left',
                        border: 'none',
                        pointerEvents: 'none',
                      }}
                      onError={() => setIframeErrors(prev => ({ ...prev, [project.id]: true }))}
                    />
                    {/* Live badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-sm" style={{ backgroundColor: '#0D1117cc', border: `1px solid ${project.color}40` }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: project.color }} />
                      <span className="mono text-xs" style={{ color: project.color }}>LIVE</span>
                    </div>
                  </>
                ) : project.liveUrl && iframeErrors[project.id] ? (
                  /* Fallback when iframe is blocked by X-Frame-Options */
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 hover:bg-[#21262D]/40 transition-colors"
                  >
                    <project.icon className="w-10 h-10" style={{ color: project.color }} />
                    <span className="mono text-xs" style={{ color: project.color }}>Click to visit live site</span>
                  </a>
                ) : (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                )}
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{ background: `linear-gradient(to top, ${project.color}30, transparent 60%)` }}
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
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity"
                      style={{ color: project.color }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="mono">Live Site</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="mono">View Code</span>
                    </a>
                  )}
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

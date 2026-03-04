import { useEffect, useRef, useState } from 'react';
import { 
  Send, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone,
  AlertCircle,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    body: '',
    label: 'collaboration',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          title: formData.title,
          body: formData.body,
          label: formData.label,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset after showing success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', title: '', body: '', label: 'collaboration' });
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setIsSubmitting(false);
      alert('Failed to send email. Please try again.');
    }
  };

  const labels = [
    { id: 'collaboration', name: 'Collaboration', color: '#00FF9D' },
    { id: 'opportunity', name: 'Opportunity', color: '#00F0FF' },
    { id: 'consulting', name: 'Consulting', color: '#BC13FE' },
    { id: 'bug', name: 'Bug Report', color: '#F85149' },
  ];

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'bibin.blp@gmail.com', href: 'mailto:bibin.blp@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+91 8105286921', href: 'tel:+918105286921' },
    { icon: MapPin, label: 'Location', value: 'Mangalore, India', href: '#' },
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com', color: '#E6EDF3' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: '#00F0FF' },
  ];

  return (
    <section 
      ref={sectionRef}
      id="contact"
      className="relative py-24"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #00F0FF 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00F0FF] to-[#00FF9D] rounded-full" />
            <h2 className="text-3xl font-bold text-[#E6EDF3] mono">Open an Issue</h2>
          </div>
          <p className="text-[#8B949E] max-w-2xl">
            Found a bug in the matrix? Want to collaborate on a project? 
            Open an issue and let's build something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form - GitHub Issue Style */}
          <div 
            className={`lg:col-span-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="gh-card overflow-hidden">
              {/* Form Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#30363D] bg-[#161B22]">
                <AlertCircle className="w-5 h-5 text-[#00F0FF]" />
                <span className="mono text-sm text-[#E6EDF3]">New Issue</span>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FF9D]" />
                  <span className="mono text-xs text-[#8B949E]">Open</span>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#00FF9D]/10 flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-[#00FF9D]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#E6EDF3] mb-2">
                      Issue Created Successfully!
                    </h3>
                    <p className="text-[#8B949E] text-center">
                      Thank you for reaching out. I'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Name Input */}
                    <div className="mb-6">
                      <label className="block text-sm text-[#8B949E] mb-2 mono">
                        Name <span className="text-[#F85149]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] placeholder-[#484F58] focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] outline-none transition-all mono text-sm"
                        required
                      />
                    </div>

                    {/* Email Input */}
                    <div className="mb-6">
                      <label className="block text-sm text-[#8B949E] mb-2 mono">
                        Email <span className="text-[#F85149]">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] placeholder-[#484F58] focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] outline-none transition-all mono text-sm"
                        required
                      />
                    </div>

                    {/* Label Selection */}
                    <div className="mb-6">
                      <label className="block text-sm text-[#8B949E] mb-2 mono">
                        Label
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {labels.map((label) => (
                          <button
                            key={label.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, label: label.id })}
                            className={`px-3 py-1.5 rounded-full text-xs mono transition-all ${
                              formData.label === label.id
                                ? 'ring-2 ring-offset-2 ring-offset-[#161B22]'
                                : 'opacity-60 hover:opacity-100'
                            }`}
                            style={{
                              backgroundColor: `${label.color}20`,
                              color: label.color,
                              '--tw-ring-color': formData.label === label.id ? label.color : 'transparent',
                            } as React.CSSProperties}
                          >
                            {label.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title Input */}
                    <div className="mb-6">
                      <label className="block text-sm text-[#8B949E] mb-2 mono">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Brief description of your message"
                        className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] placeholder-[#484F58] focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] outline-none transition-all mono text-sm"
                        required
                      />
                    </div>

                    {/* Body Input */}
                    <div className="mb-6">
                      <label className="block text-sm text-[#8B949E] mb-2 mono">
                        Body
                      </label>
                      <textarea
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        placeholder="Describe your message in detail..."
                        rows={6}
                        className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] placeholder-[#484F58] focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] outline-none transition-all mono text-sm resize-none"
                        required
                      />
                      <div className="mt-2 flex items-center gap-2 text-xs text-[#484F58]">
                        <MessageSquare className="w-3 h-3" />
                        <span>Markdown supported</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#484F58] mono">
                        <span className="text-[#F85149]">*</span> Required fields
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-[#00FF9D] text-[#0D1117] font-semibold rounded-lg hover:bg-[#00FF9D]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin" />
                            <span className="mono text-sm">Creating...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span className="mono text-sm">{formData.label === 'bug' ? 'Submit Issue' : 'Submit Request'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div 
            className={`space-y-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Contact Details */}
            <div className="gh-card p-6">
              <h3 className="text-lg font-semibold text-[#E6EDF3] mono mb-4">
                Contact Details
              </h3>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#21262D] transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-[#21262D] group-hover:bg-[#00F0FF]/10 transition-colors">
                      <item.icon className="w-4 h-4 text-[#8B949E] group-hover:text-[#00F0FF] transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8B949E] mono">{item.label}</p>
                      <p className="text-sm text-[#E6EDF3]">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="gh-card p-6">
              <h3 className="text-lg font-semibold text-[#E6EDF3] mono mb-4">
                Connect
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col items-center gap-2 p-4 rounded-lg bg-[#21262D] hover:bg-[#30363D] transition-all group"
                  >
                    <social.icon 
                      className="w-6 h-6 transition-colors"
                      style={{ color: social.color }}
                    />
                    <span className="text-xs text-[#8B949E] mono">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability Badge */}
            <div className="gh-card p-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-[#00FF9D]" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#00FF9D] animate-ping" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#E6EDF3]">Available for work</p>
                  <p className="text-xs text-[#8B949E]">Open to collaborations & opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-16 pt-8 border-t border-[#30363D] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#BC13FE] flex items-center justify-center">
                <span className="text-[#0D1117] font-bold text-sm">B</span>
              </div>
              <span className="mono text-sm text-[#8B949E]">
                Bibin V R <span className="text-[#484F58]">© 2025</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="mono text-xs text-[#484F58]">
                Built with React + TypeScript + Tailwind
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF9D]" />
                <span className="mono text-xs text-[#00FF9D]">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import { useEffect, useRef, useState } from 'react';
import { 
  Send, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone,
  AlertCircle,
  CheckCircle
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
  const [isError, setIsError] = useState(false);
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
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }
  };

  const labels = [
    { id: 'collaboration', name: 'Collaboration' },
    { id: 'opportunity', name: 'Opportunity' },
    { id: 'consulting', name: 'Consulting' },
    { id: 'bug', name: 'Bug Report' },
  ];

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'bibin.blp@gmail.com', href: 'mailto:bibin.blp@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+91 8105286921', href: 'tel:+918105286921' },
    { icon: MapPin, label: 'Location', value: 'Mangalore, India', href: '#' },
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com/Bibin-VR' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/bibin-v-r-5a6762271/' },
  ];

  return (
    <section 
      ref={sectionRef}
      id="contact"
      className="relative py-24"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[rgba(255,255,255,0.15)]" />
            <span className="mono text-[10px] tracking-[0.2em] uppercase text-[rgba(240,240,240,0.3)]">05 / Contact</span>
          </div>
          <h2 className="text-3xl font-bold text-[#F0F0F0] mono mb-3">Initiate Transmission</h2>
          <p className="mono text-sm text-[rgba(240,240,240,0.42)] max-w-2xl">
            Want to collaborate on a project or discuss an opportunity? Send a message.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form - GitHub Issue Style */}
          <div 
            className={`lg:col-span-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div
              className="overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#111114' }}
            >
              {/* Form Header */}
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#13131A' }}
              >
                <AlertCircle className="w-4 h-4 text-[rgba(240,240,240,0.4)]" />
                <span className="mono text-xs tracking-widest uppercase text-[rgba(240,240,240,0.5)]">New Message</span>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B0C8E0]" />
                  <span className="mono text-[10px] text-[rgba(240,240,240,0.35)]">OPEN</span>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6">
              {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ border: '1px solid rgba(176,200,224,0.25)' }}>
                      <CheckCircle className="w-6 h-6 text-[#B0C8E0]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#F0F0F0] mono mb-2">
                      Transmission Sent
                    </h3>
                    <p className="text-[rgba(240,240,240,0.42)] text-sm mono text-center">
                      I'll get back to you shortly.
                    </p>
                  </div>
                ) : isError ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ border: '1px solid rgba(255,80,80,0.2)' }}>
                      <AlertCircle className="w-6 h-6 text-[rgba(240,100,100,0.7)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#F0F0F0] mono mb-2">
                      Transmission Failed
                    </h3>
                    <p className="text-[rgba(240,240,240,0.42)] text-sm mono text-center mb-6">
                      Try again or email{' '}
                      <a href="mailto:bibin.blp@gmail.com" className="text-[#B0C8E0] hover:underline">bibin.blp@gmail.com</a>.
                    </p>
                    <button
                      onClick={() => setIsError(false)}
                      className="ig-btn text-xs px-4 py-2"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Name Input */}
                    <div className="mb-6">
                      <label className="block text-[10px] tracking-widest uppercase text-[rgba(240,240,240,0.35)] mb-2 mono">
                        Name <span className="text-[rgba(240,100,100,0.6)]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="ig-input w-full"
                        required
                      />
                    </div>

                    {/* Email Input */}
                    <div className="mb-6">
                      <label className="block text-[10px] tracking-widest uppercase text-[rgba(240,240,240,0.35)] mb-2 mono">
                        Email <span className="text-[rgba(240,100,100,0.6)]">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="ig-input w-full"
                        required
                      />
                    </div>

                    {/* Label Selection */}
                    <div className="mb-6">
                      <label className="block text-[10px] tracking-widest uppercase text-[rgba(240,240,240,0.35)] mb-3 mono">
                        Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {labels.map((label) => (
                          <button
                            key={label.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, label: label.id })}
                            className="px-3 py-1.5 mono text-xs transition-all"
                            style={{
                              border: `1px solid ${formData.label === label.id ? 'rgba(176,200,224,0.4)' : 'rgba(255,255,255,0.07)'}`,
                              color: formData.label === label.id ? '#B0C8E0' : 'rgba(240,240,240,0.4)',
                              background: formData.label === label.id ? 'rgba(176,200,224,0.05)' : 'transparent',
                            }}
                          >
                            {label.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title Input */}
                    <div className="mb-6">
                      <label className="block text-[10px] tracking-widest uppercase text-[rgba(240,240,240,0.35)] mb-2 mono">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Brief description of your message"
                        className="ig-input w-full"
                        required
                      />
                    </div>

                    {/* Body Input */}
                    <div className="mb-6">
                      <label className="block text-[10px] tracking-widest uppercase text-[rgba(240,240,240,0.35)] mb-2 mono">
                        Message
                      </label>
                      <textarea
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        placeholder="Describe your message in detail..."
                        rows={6}
                        className="ig-input w-full resize-none"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-[rgba(240,240,240,0.25)] mono">
                        <span className="text-[rgba(240,100,100,0.5)]">*</span> Required
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ig-btn-primary flex items-center gap-2 px-6 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3 h-3 border border-[#090909] border-t-transparent rounded-full animate-spin" />
                            <span className="mono text-xs">Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span className="mono text-xs">{formData.label === 'bug' ? 'Submit Issue' : 'Send Message'}</span>
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
            <div className="p-6" style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#111114' }}>
              <p className="mono text-[10px] tracking-widest uppercase text-[rgba(240,240,240,0.25)] mb-5">Contact</p>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 py-2 group transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-[rgba(240,240,240,0.3)] group-hover:text-[#B0C8E0] transition-colors" />
                    <div>
                      <p className="text-[10px] mono uppercase tracking-widest text-[rgba(240,240,240,0.25)]">{item.label}</p>
                      <p className="text-xs text-[rgba(240,240,240,0.65)] mono">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6" style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#111114' }}>
              <p className="mono text-[10px] tracking-widest uppercase text-[rgba(240,240,240,0.25)] mb-4">Connect</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col items-center gap-2 py-4 transition-all group"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <social.icon
                      className="w-5 h-5 text-[rgba(240,240,240,0.35)] group-hover:text-[#B0C8E0] transition-colors"
                    />
                    <span className="text-[10px] mono uppercase tracking-widest text-[rgba(240,240,240,0.25)]">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="p-5" style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#111114' }}>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B0C8E0]" />
                <div>
                  <p className="text-xs mono text-[rgba(240,240,240,0.65)]">Available for work</p>
                  <p className="text-[10px] mono text-[rgba(240,240,240,0.3)]">Open to collaborations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`mt-16 pt-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', transitionDelay: '400ms' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center" style={{ border: '1px solid rgba(176,200,224,0.2)' }}>
                <span className="text-[#B0C8E0] font-bold text-xs mono">B</span>
              </div>
              <span className="mono text-xs text-[rgba(240,240,240,0.35)]">
                Bibin V R — 2026
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="mono text-[10px] text-[rgba(240,240,240,0.2)]">
                React · TypeScript · Tailwind
              </span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B0C8E0]" />
                <span className="mono text-[10px] text-[rgba(240,240,240,0.35)]">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

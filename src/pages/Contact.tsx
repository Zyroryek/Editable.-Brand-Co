import { motion } from "motion/react";
import PageTransition from "../components/PageTransition";
import { Instagram, Linkedin, ArrowUpRight, Mail, Phone } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    interest: ""
  });

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/official_editable?igsh=MWt6OWtvYm41bTEyZQ==" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
    { name: "Gmail", icon: Mail, href: "mailto:editable.freelancing@gmail.com" },
    { name: "WhatsApp", icon: Phone, href: "https://wa.me/917604969891" }
  ];

  const handleWhatsApp = () => {
    const phone = "917604969891";
    const nameStr = formData.name ? `Hello, I'm ${formData.name}.` : "Hello!";
    const interestStr = formData.interest ? ` I'm interested in ${formData.interest} and would like to discuss a project.` : " I'm interested in your creative services.";
    const message = encodeURIComponent(`${nameStr}${interestStr}`);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-40 pb-24 flex flex-col justify-center">
        <header className="mb-20">
          <span className="text-xs uppercase tracking-widest opacity-40 font-mono mb-4 block">Get in touch</span>
          <h1 className="text-5xl md:text-[10vw] font-display font-medium tracking-tighter leading-none">
            Hello.<br/>Editable.
          </h1>
        </header>

        <div className="grid md:grid-cols-2 gap-20">
          <div className="space-y-16">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-widest opacity-40 font-mono">Quick Contact</p>
              <div className="flex flex-col gap-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="YOUR NAME"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-ink/10 py-4 focus:border-accent outline-none text-xl md:text-2xl font-display transition-colors placeholder:opacity-20"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="I'M INTERESTED IN..."
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full bg-transparent border-b border-ink/10 py-4 focus:border-accent outline-none text-xl md:text-2xl font-display transition-colors placeholder:opacity-20"
                  />
                </div>
              </div>
              
              <div className="pt-8">
                <button 
                  onClick={handleWhatsApp}
                  className="flex items-center gap-4 py-4 px-10 border border-ink/20 rounded-full hover:border-accent group transition-all"
                >
                  <span className="text-sm uppercase tracking-widest font-bold">WhatsApp Us</span>
                  <div className="w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                     →
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 opacity-60">
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold">Email</p>
                <a href="mailto:editable.freelancing@gmail.com" className="text-sm border-b border-ink/20 pb-1 hover:text-accent hover:border-accent transition-all">
                  editable.freelancing@gmail.com
                </a>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold">Phone</p>
                <a href="tel:7604969891" className="text-sm border-b border-ink/20 pb-1 hover:text-accent hover:border-accent transition-all">
                  +91 76049 69891
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end space-y-12">
            <div className="space-y-6">
                <p className="text-sm uppercase tracking-widest opacity-40 font-mono">Location</p>
                <p className="text-xl md:text-2xl font-light opacity-60 leading-relaxed">
                  Design Studio International<br/>
                  Global Presence
                </p>
            </div>

            <div className="flex flex-col gap-6 pt-10 border-t border-ink/5">
                {socialLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-between items-center group py-2"
                  >
                    <span className="text-xl md:text-2xl font-display opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all uppercase">
                        {link.name}
                    </span>
                    <ArrowUpRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

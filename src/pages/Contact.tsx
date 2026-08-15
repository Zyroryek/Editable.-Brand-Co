import { motion } from "motion/react";
import PageTransition from "../components/PageTransition";
import { ArrowUpRight, Instagram, MessageCircle } from "lucide-react";

export default function Contact() {
  const contactMethods = [
    {
      name: "WhatsApp",
      description: "Fastest response for quick inquiries",
      icon: MessageCircle,
      href: "https://wa.me/917604969891",
      color: "bg-[#25D366]/10 text-[#25D366]",
      label: "Open Chat"
    },
    {
      name: "Instagram",
      description: "Follow us for daily creative inspiration",
      icon: Instagram,
      href: "https://www.instagram.com/official_editable?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      color: "bg-[#E4405F]/10 text-[#E4405F]",
      label: "View Profile"
    }
  ];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[85vh] pt-4 sm:pt-8 md:pt-12 pb-16 sm:pb-24 flex flex-col justify-center">
        <header className="mb-8 sm:mb-16 md:mb-20">
          <div className="glass-badge mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>Let's Connect</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[8vw] font-display font-medium tracking-tight leading-none text-gradient-alt">
            Work With Us.
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-light opacity-60 max-w-xl uppercase tracking-widest font-mono mt-3">
            Reach out directly for rapid consultations, custom ecosystems, or creative partnerships.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 md:gap-12 lg:gap-16">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.name}
              href={method.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              whileHover={{ 
                y: -6,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="glass-card p-6 sm:p-10 md:p-14 flex flex-col gap-6 sm:gap-10 group hover:border-accent/40 transition-all duration-300 overflow-hidden relative shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <method.icon size={80} className="sm:w-[120px] sm:h-[120px]" strokeWidth={1} />
              </div>
              
              <div className="space-y-2 sm:space-y-4 relative z-10">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 ${method.color} backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10`}
                >
                  <method.icon size={20} className="sm:w-6 sm:h-6" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter transition-transform group-hover:translate-x-1 duration-300 text-ink">{method.name}</h2>
                <p className="text-sm sm:text-base md:text-lg opacity-60 max-w-xs leading-relaxed group-hover:opacity-85 transition-opacity duration-300">{method.description}</p>
              </div>

              <div className="mt-auto flex justify-between items-center relative z-10 pt-4 sm:pt-8 border-t border-ink/10">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                  {method.label}
                </span>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-300 shadow-md">
                  <ArrowUpRight size={16} className="sm:w-5 sm:h-5" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <footer className="mt-12 sm:mt-24 md:mt-32 pt-8 sm:pt-16 border-t border-ink/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-10">
          <div className="space-y-1 sm:space-y-2">
             <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] opacity-40 font-bold leading-relaxed font-mono">Design Studio International<br />Creative Network</p>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-8 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold opacity-60">
             <a href="https://www.instagram.com/official_editable?igsh=MWt6OWtvYm41bTEyZQ==" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Instagram</a>
             <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}

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
      <div className="min-h-screen pt-40 pb-24 flex flex-col justify-center">
        <header className="mb-16 md:mb-24">
          <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold mb-4 block">Let's Connect</span>
          <h1 className="text-4xl md:text-[12vw] font-display font-medium tracking-tight leading-none text-gradient-alt">
            Work With Us.
          </h1>
        </header>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.name}
              href={method.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass p-10 md:p-16 flex flex-col gap-10 group hover:border-accent transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                <method.icon size={120} strokeWidth={1} />
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center`}>
                  <method.icon size={20} />
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter">{method.name}</h2>
                <p className="text-lg opacity-40 max-w-xs leading-relaxed">{method.description}</p>
              </div>

              <div className="mt-auto flex justify-between items-center relative z-10 pt-10 border-t border-ink/5">
                <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                  {method.label}
                </span>
                <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-bg transition-all duration-500">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <footer className="mt-24 md:mt-32 pt-16 border-t border-ink/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-2">
             <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold leading-relaxed">Design Studio International<br />Creative Network</p>
          </div>
          <div className="flex flex-wrap gap-8 text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">
             <a href="https://www.instagram.com/official_editable?igsh=MWt6OWtvYm41bTEyZQ==" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Instagram</a>
             <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}

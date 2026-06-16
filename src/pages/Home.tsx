import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { cn } from "@/lib/utils";
import Magnetic from "../components/Magnetic";
import TextReveal from "../components/TextReveal";
import Marquee from "../components/Marquee";
import { CharacterReveal } from "../components/CharacterReveal";
import { EditableHeroText } from "../components/EditableHeroText";

interface TiltCardProps {
  children: React.ReactNode;
  className: string;
  i: number;
  color: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className, i, color }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const springConfig = { stiffness: 150, damping: 20 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ 
        duration: 1, 
        ease: [0.22, 1, 0.36, 1], 
        delay: i * 0.2 
      }}
      whileHover={{ 
        scale: 1.02,
        zIndex: 20,
        transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      className={className}
    >
      <div className={cn("absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700", color)} />
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </motion.div>
  );
};

const PACKAGES = [
  { 
    id: "bf", 
    name: "Brand Foundation", 
    price: "₹2,000 – ₹15,000", 
    desc: "We build your brand from scratch with a strong, modern identity.", 
    includes: ["Logo design", "Brand colors & typography", "Basic guidelines"] 
  },
  { 
    id: "ui", 
    name: "UI/UX & Website", 
    price: "₹5,000 – ₹20,000", 
    desc: "We design clean, user-focused digital experiences that convert.", 
    includes: ["UX research", "Wireframes", "UI design (Figma)"] 
  },
  { 
    id: "cv", 
    name: "Content & Video", 
    price: "₹3,000 – ₹12,000", 
    desc: "We turn your content into scroll-stopping visuals.", 
    includes: ["Reel editing", "Motion graphics", "Thumbnails"] 
  },
  { 
    id: "gc", 
    name: "Growth Combo", 
    price: "₹5,000 – ₹25,000", 
    desc: "A complete creative system to build, launch, and grow your brand.", 
    includes: ["Full Creative System", "Monthly Support", "Video Content"] 
  },
  { 
    id: "mr", 
    name: "Monthly Retainer", 
    price: "Custom Monthly", 
    desc: "Your dedicated creative team, on demand.", 
    includes: ["Fixed Task Slots", "Continuous Editing", "Priority Support"] 
  }
];

export default function Home() {
  const [activePackage, setActivePackage] = useState(PACKAGES[0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const textSkew = useTransform(smoothProgress, [0, 1], [0, 2]);
  const textY = useTransform(smoothProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const reasons = [
    { 
      title: "Strategic Minimalism", 
      desc: "We strip away the noise to find the core essence of your brand. Purposeful design that speaks louder by saying less.",
      impact: "Reduced interface clutter for 'Zenit' by 45%, leading to a 30% boost in conversion rates.",
      color: "bg-accent-purple/10" 
    },
    { 
      title: "Visceral Impact", 
      desc: "We create digital artifacts that aren't just seen—they are felt. Design that triggers emotion and commands attention.", 
      impact: "Developed the viral 'Aura' campaign which generated 2.5M impressions within the first 48 hours.",
      color: "bg-accent-blue/10" 
    },
    { 
      title: "Future-Ready", 
      desc: "Scalable systems built for the modern frontier. We ensure your brand evolves ahead of the digital curve.", 
      impact: "Designed a universal design system for 'Nexus Corp' that successfully scaled to 50+ regional sub-brands.",
      color: "bg-accent/10" 
    }
  ];

  const clientLogos = [
    "InfrontOfUs", "Sparknest", "ThurikaSchoolOfArts"
  ];

  return (
    <PageTransition>
      <div ref={containerRef} className="relative">
        {/* 1. Opening Frame */}
        <section className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 mb-4 md:mb-8 relative z-10 overflow-visible">
            <EditableHeroText className="text-[8.5vw] sm:text-[8vw] md:text-[7.5vw] lg:text-[7vw] xl:text-[6.5vw] font-display font-extrabold tracking-[-0.05em] uppercase" />
          </div>
          
          <motion.div 
            className="mt-12 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ translateZ: 0 }}
          >
            <p className="text-[10px] tracking-[0.6em] font-bold opacity-30 uppercase">
              Design Studio International / Global Presence
            </p>
            <div className="flex items-center gap-6 justify-center">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="h-[1px] bg-ink/20 hidden md:block" 
              />
              <p className="text-lg md:text-2xl italic font-serif opacity-60">
                Creative Studio focused on visceral design
              </p>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="h-[1px] bg-ink/20 hidden md:block" 
              />
            </div>

            <div className="pt-10 md:pt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/packages">
                <Magnetic>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "#ff4d00", color: "#121212" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-ink text-bg rounded-full text-[10px] uppercase tracking-[0.3em] font-bold border border-transparent transition-all shadow-2xl shadow-accent-purple/20 w-48 sm:w-auto"
                  >
                    Explore Packages
                  </motion.button>
                </Magnetic>
              </Link>

              <Link to="/contact">
                <Magnetic>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(18, 18, 18, 0.05)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-transparent text-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold border border-ink/20 transition-all w-48 sm:w-auto"
                  >
                    Contact Us
                  </motion.button>
                </Magnetic>
              </Link>

              <Link to="/internship">
                <Magnetic>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 77, 0, 0.08)", borderColor: "#ff4d00", color: "#ff4d00" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-transparent text-accent border border-accent/30 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all w-48 sm:w-auto"
                  >
                    Internships
                  </motion.button>
                </Magnetic>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-12 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="text-[10px] uppercase tracking-widest opacity-40">Scroll</span>
            <motion.div 
              animate={{ height: [24, 48, 24] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px bg-gradient-to-b from-ink/20 to-transparent" 
            />
          </motion.div>
        </section>

        {/* Simplified Packages List - Moved to Top */}
        <section id="packages-section" className="py-20 md:py-32 max-w-[1440px] mx-auto px-6 lg:px-20 relative">
          <div className="mb-12 md:mb-16 flex items-center gap-6">
            <CharacterReveal 
              text="Our Packages"
              className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight mb-0"
              stagger={0.04}
            />
            <div className="h-[1px] flex-1 bg-gradient-to-r from-ink/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PACKAGES.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="glass group p-6 md:p-8 flex flex-col justify-center gap-4 hover:border-accent transition-all duration-500 overflow-hidden relative"
                style={{ willChange: "transform, opacity" }}
              >
                <motion.div 
                  className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.22, 1, 0.36, 1]"
                />
                <div className="flex items-center justify-between relative z-10">
                  <h3 className="text-xl md:text-2xl font-display font-bold uppercase group-hover:text-accent transition-colors">
                    {pkg.name}
                  </h3>
                  <Link to="/packages">
                    <motion.span 
                      whileHover={{ x: 5 }}
                      className="text-[11px] uppercase tracking-[0.2em] font-black opacity-100 text-accent transition-all flex items-center gap-2"
                    >
                      Details <span className="text-[14px]">→</span>
                    </motion.span>
                  </Link>
                </div>
                <p className="text-xs opacity-50 font-light leading-relaxed line-clamp-1 relative z-10">
                  {pkg.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 2. Statement with TextReveal */}
        <section className="section-spacing flex items-center justify-center px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-purple/20 to-transparent" />
          <TextReveal 
            text="We create digital artifacts that resonate. No templates. No noise. Just pure intent."
            className="text-4xl md:text-7xl lg:text-8xl font-display font-medium leading-[1.05] text-center max-w-6xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-600"
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-blue/20 to-transparent" />
        </section>

        {/* Featured Content / Immersive Image */}
        <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-4xl mx-auto aspect-square md:aspect-[4/3] rounded-[40px] md:rounded-[60px] overflow-hidden bg-neutral-900 group shadow-[0_0_100px_rgba(0,0,0,0.1)] forced-color-adjust-none border border-zinc-200/10"
          >
            <motion.img 
              src="https://drive.google.com/uc?export=view&id=13NuzvIn7mc-GPpoQi7tES9euEcGCHe3g" 
              alt="Editable Creative Direction" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
              <motion.div>
                <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-accent-blue font-bold mb-3 block">Perspective</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter leading-none mb-4">
                  Pure Aesthetic.
                </h2>
                <div className="flex items-center gap-4 text-white/50 text-[10px] uppercase tracking-widest font-medium">
                  <span>Visual Identity</span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span>2024 Showcase</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Why Us Section */}
        <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
            <div className="flex flex-col">
              <CharacterReveal 
                text="Why Us?"
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] mb-0"
                stagger={0.1}
              />
            </div>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-40 max-w-[280px] leading-relaxed">
              Design is a competitive advantage. We ensure yours is unparalleled through precision and vision.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {reasons.map((reason, i) => (
              <TiltCard 
                key={i}
                i={i}
                color={reason.color}
                className="group relative p-8 md:p-10 glass rounded-[32px] overflow-hidden min-h-[300px] border border-ink/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center text-[10px] font-bold group-hover:border-accent transition-colors group-hover:bg-accent group-hover:text-bg">
                    0{i + 1}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-display font-bold uppercase leading-none">{reason.title}</h3>
                  <p className="text-sm opacity-50 leading-relaxed font-light">
                    {reason.desc}
                  </p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="mt-8 pt-6 border-t border-ink/5"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-black block mb-2">Case Study Impact</span>
                  <p className="text-xs font-serif italic text-ink/70">
                    &ldquo;{reason.impact}&rdquo;
                  </p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* Client Logos Marquee */}
        <section className="py-20 border-y border-ink/5 overflow-hidden">
          <div className="px-6 mb-12 text-center">
            <span className="text-[10px] uppercase tracking-[0.5em] opacity-30 font-bold">In Trusted Partnership With</span>
          </div>
          <div className="flex gap-20 overflow-hidden relative group">
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-20 items-center justify-around min-w-full"
            >
              {[...clientLogos, ...clientLogos].map((logo, index) => (
                <div 
                  key={index} 
                  className="text-2xl md:text-4xl font-display font-black tracking-tighter opacity-20 hover:opacity-100 hover:text-accent transition-all duration-500 cursor-default px-4"
                >
                  {logo}.
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Marquee Section */}
        <Marquee 
          text="Identity / UI-UX / Development / Motion / Strategy / "
          className="text-[10vw] font-display font-bold uppercase opacity-[0.03] select-none"
        />




        {/* 6. Final Moment */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden relative">
          <div className="space-y-16 z-10 max-w-6xl">
            <CharacterReveal
              text="Let’s craft your distinctive edge."
              className="text-6xl md:text-[8vw] font-display font-bold leading-[0.9] tracking-[-0.04em] uppercase"
              stagger={0.03}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/contact">
                <Magnetic>
                  <motion.button 
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: "#ff4d00", 
                      color: "#121212",
                      boxShadow: "0 0 40px rgba(255,77,0,0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-20 py-8 bg-ink text-bg rounded-full text-xs uppercase tracking-[0.4em] font-bold border border-transparent transition-all shadow-2xl shadow-accent-purple/20"
                  >
                    Contact Us
                  </motion.button>
                </Magnetic>
              </Link>
            </motion.div>
          </div>

          {/* Floating background text */}
          <motion.div 
            className="absolute text-[30vw] font-display font-black opacity-[0.05] select-none pointer-events-none whitespace-nowrap text-gradient-alt"
            style={{ 
              x: useTransform(smoothProgress, [0.8, 1], [200, -200]),
              y: useTransform(smoothProgress, [0.8, 1], [0, 100])
            }}
          >
            CREATIVE STUDIO
          </motion.div>
        </section>

        <footer className="py-12 border-t border-ink/5 flex flex-col md:flex-row justify-between items-center gap-8 px-12 opacity-40 text-[10px] uppercase tracking-widest font-bold bg-ink/[0.02]">
          <p>© {new Date().getFullYear()} Editable. / Design Studio International</p>
          <div className="flex gap-4 md:gap-10">
            {[
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Instagram", href: "https://www.instagram.com/official_editable?igsh=MWt6OWtvYm41bTEyZQ==", target: "_blank" },
              { label: "LinkedIn", href: "https://linkedin.com", target: "_blank" },
              { label: "Gmail", href: "mailto:editable.freelancing@gmail.com" },
              { label: "WhatsApp", href: "https://wa.me/917604969891", target: "_blank" }
            ].map((link) => (
              <Magnetic key={link.label}>
                <motion.a 
                  href={link.href} 
                  target={link.target}
                  rel={link.target === "_blank" ? "noreferrer" : undefined}
                  className="group relative hover:text-accent transition-colors duration-300 py-2 px-4 inline-block"
                  whileHover={{ 
                    scale: 1.1,
                    y: -2,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <motion.span 
                    className="absolute bottom-1 left-4 right-4 h-[1px] bg-accent origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </motion.a>
              </Magnetic>
            ))}
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}

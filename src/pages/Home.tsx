import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { cn } from "@/src/lib/utils";
import Magnetic from "../components/Magnetic";
import TextReveal from "../components/TextReveal";
import Marquee from "../components/Marquee";

const PACKAGES = [
  { id: "bf", name: "Brand Foundation", price: "₹2,000 – ₹15,000", desc: "For startups looking to find their visual voice. Includes logo system, color strategy, and basic guidelines.", includes: ["Logo Suite", "Style Guide", "Visual Strategy"] },
  { id: "ui", name: "UI/UX & Website", price: "₹5,000 – ₹20,000", desc: "Digital-first experiences that convert. High-performance websites tailored to your product.", includes: ["Wireframes", "Interactive Prototyping", "Full Development"] },
  { id: "cv", name: "Content & Video", price: "₹3,000 – ₹12,000", desc: "Storytelling through moving pixels. Production and post-production for modern brands.", includes: ["Commercial Shoots", "Social Strategy", "VFX & Motion"] },
  { id: "gc", name: "Growth Combo", price: "₹5,000 – ₹25,000", desc: "The ultimate creative powerhouse. We manage your entire digital presence and design.", includes: ["All Core Services", "Retainer Support", "Analytics Insights"] }
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
      color: "bg-accent-purple/10" 
    },
    { 
      title: "Visceral Impact", 
      desc: "We create digital artifacts that aren't just seen—they are felt. Design that triggers emotion and commands attention.", 
      color: "bg-accent-blue/10" 
    },
    { 
      title: "Future-Ready", 
      desc: "Scalable systems built for the modern frontier. We ensure your brand evolves ahead of the digital curve.", 
      color: "bg-accent/10" 
    }
  ];

  return (
    <PageTransition>
      <div ref={containerRef} className="relative">
        {/* 1. Opening Frame */}
        <section className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Multi-layered dynamic background blobs - reactive to mouse and scroll */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-accent/10 rounded-full blur-[120px] -z-10"
            style={{ y: useTransform(smoothProgress, [0, 0.5], [0, -150]) }}
            animate={{ 
              x: (mousePos.x - (typeof window !== "undefined" ? window.innerWidth : 0) / 2) * 0.05,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/4 w-[40vw] h-[40vw] bg-accent-purple/5 rounded-full blur-[100px] -z-10"
            style={{ y: useTransform(smoothProgress, [0, 0.5], [0, 50]) }}
            animate={{ 
              x: (mousePos.x - (typeof window !== "undefined" ? window.innerWidth : 0) / 2) * -0.03,
              scale: [1.1, 1, 1.1],
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-accent-blue/10 rounded-full blur-[100px] -z-10"
            style={{ y: useTransform(smoothProgress, [0, 0.5], [0, 100]) }}
            animate={{ 
              x: (mousePos.x - (typeof window !== "undefined" ? window.innerWidth : 0) / 2) * -0.05,
              scale: [1.1, 1, 1.1],
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          
          <div className="overflow-hidden mb-8 md:mb-12">
            <motion.h1 
              className="text-[18vw] lg:text-[15vw] font-display font-bold leading-[0.85] tracking-[-0.06em] uppercase relative text-accent-purple"
              style={{ willChange: "transform, opacity" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Editable.
              <motion.span 
                className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full hidden md:block shadow-[0_0_20px_rgba(255,77,0,0.5)]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
              />
            </motion.h1>
          </div>
          
          <motion.div 
            className="mt-12 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            style={{ translateZ: 0 }}
          >
            <p className="text-[10px] tracking-[0.4em] font-bold opacity-30 uppercase">
              Design Studio International / Global Presence
            </p>
            <div className="flex items-center gap-6 justify-center">
              <div className="w-12 h-[1px] bg-ink/20 hidden md:block" />
              <p className="text-lg md:text-2xl italic font-serif opacity-60">
                Creative Studio focused on visceral design
              </p>
              <div className="w-12 h-[1px] bg-ink/20 hidden md:block" />
            </div>

            <div className="pt-10 md:pt-16">
              <Link to="/packages">
                <Magnetic>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "#ff4d00", color: "#121212" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-ink text-bg rounded-full text-[10px] uppercase tracking-[0.3em] font-bold border border-transparent transition-all shadow-2xl shadow-accent-purple/20"
                  >
                    Explore Packages
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

        {/* 2. Statement with TextReveal */}
        <section className="section-spacing flex items-center justify-center px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-purple/20 to-transparent" />
          <TextReveal 
            text="We create digital artifacts that resonate. No templates. No noise. Just pure intent."
            className="text-4xl md:text-7xl lg:text-8xl font-display font-medium leading-[1.05] text-center max-w-6xl tracking-tight text-gradient-alt"
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-blue/20 to-transparent" />
        </section>

        {/* Why Us Section */}
        <section className="section-spacing px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
          <div className="mb-24 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold uppercase tracking-tighter leading-[0.8] mb-0">Why Us<span className="text-accent">?</span></h2>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-40 max-w-[250px] leading-relaxed">
              Design is a competitive advantage. We ensure yours is unparalleled through precision and vision.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {reasons.map((reason, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className="group relative p-12 glass rounded-[32px] overflow-hidden min-h-[400px] flex flex-col justify-end"
              >
                <div className={cn("absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700", reason.color)} />
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center text-[10px] font-bold group-hover:border-accent transition-colors">
                    0{i + 1}
                  </div>
                  <h3 className="text-3xl font-display font-bold uppercase leading-none">{reason.title}</h3>
                  <p className="text-sm opacity-60 leading-relaxed font-light">
                    {reason.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Marquee Section */}
        <Marquee 
          text="Identity / UI-UX / Development / Motion / Strategy / "
          className="text-[10vw] font-display font-bold uppercase opacity-[0.03] select-none"
        />

        {/* 4. Packages */}
        <section id="packages-section" className="section-spacing mb-24 max-w-[1440px] mx-auto px-6 lg:px-20 relative">
          <div className="absolute -top-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-accent-purple/5 rounded-full blur-[80px] md:blur-[100px] -z-10" />
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">
            <motion.div 
              className="w-full lg:flex-1 flex flex-col gap-6 md:gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              <div className="flex items-center gap-4 mb-4 md:mb-8">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30">Our Ecosystem</span>
                <div className="h-px flex-1 bg-gradient-to-r from-ink/10 to-transparent" />
              </div>
              
              {/* Horizontal scroll on mobile, vertical list on desktop */}
              <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-8 lg:gap-6 scrollbar-hide snap-x">
                {PACKAGES.map((pkg) => (
                  <motion.button
                    key={pkg.id}
                    variants={{
                      hidden: { x: -20, opacity: 0 },
                      visible: { x: 0, opacity: 1 }
                    }}
                    onMouseEnter={() => setActivePackage(pkg)}
                    onClick={() => setActivePackage(pkg)}
                    className={cn(
                      "text-3xl md:text-5xl lg:text-6xl font-display font-bold text-left transition-all duration-500 whitespace-nowrap lg:whitespace-normal snap-center",
                      activePackage.id === pkg.id ? "text-accent lg:pl-6 scale-105" : "text-ink/10 hover:text-ink/40"
                    )}
                  >
                    {pkg.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            
            <div className="w-full lg:flex-1 pt-0 lg:pt-20">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activePackage.id}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card p-8 md:p-12 space-y-8 md:space-y-10 relative overflow-hidden"
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-accent/20 rounded-full blur-2xl md:blur-3xl -z-10 animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 md:w-40 md:h-40 bg-accent-purple/10 rounded-full blur-2xl md:blur-3xl -z-10" />
                  
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold">Financial Guide</p>
                    <p className="text-2xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-gradient-alt">{activePackage.price}</p>
                  </div>
                  
                  <p className="text-base md:text-lg opacity-80 leading-relaxed max-w-md font-light italic font-serif">
                    &ldquo;{activePackage.desc}&rdquo;
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/20">
                    {activePackage.includes.slice(0, 4).map(item => (
                      <div key={item} className="flex items-center gap-3">
                          <motion.div 
                            animate={{ scale: [1, 1.5, 1], backgroundColor: ["#ff4d00", "#7000ff", "#ff4d00"] }}
                            transition={{ duration: 3, repeat: Infinity, delay: Math.random() }}
                            className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,77,0,0.5)]" 
                          />
                          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/book" className="inline-block mt-8 w-full">
                    <Magnetic>
                      <motion.div 
                        className="book-btn w-full text-center py-6 bg-accent text-ink font-bold uppercase tracking-[0.3em] text-xs shadow-xl shadow-accent/20 rounded-full"
                        whileHover={{ scale: 1.02, backgroundColor: "#121212", color: "#e8e8e8" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Initiate Project
                      </motion.div>
                    </Magnetic>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 5. Reviews Mini-Grid */}
        <section className="section-spacing bg-ink/[0.02] -mx-4 px-8 md:px-20 border-y border-ink/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-[60vw] h-[60vw] bg-accent-blue/5 rounded-full blur-[120px] -z-10" />
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
              <div className="space-y-6">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-40 font-bold">Social Proof</span>
                <h2 className="text-5xl md:text-7xl font-display font-medium leading-[0.9]">Loved by <span className="text-gradient-alt italic font-serif">innovators.</span></h2>
              </div>
              <Link to="/reviews">
                <motion.span 
                  whileHover={{ x: 5, color: "#ff4d00" }}
                  className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold border-b border-ink/40 pb-2 cursor-pointer hover:border-accent transition-all"
                >
                  View all reviews
                </motion.span>
              </Link>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
            >
              {[
                { text: "The brand identity overhaul exceeded all our expectations. The team really understood our vision.", author: "Arjun Mehta", role: "CEO, TechFlow" },
                { text: "Minimalist, professional, and extremely easy to work with. They made us look like a luxury label.", author: "Sanya Gupta", role: "Founder, Bloom & Co" },
                { text: "Speed and precision. They delivered a high-converting landing page in record time without compromise.", author: "Rohan Das", role: "Marketing Head, Velocity" }
              ].map((review, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { y: 30, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="glass-card p-10 space-y-6 group hover:translate-y--4 transition-all duration-700"
                >
                  <p className="text-lg italic font-light group-hover:text-ink transition-colors leading-relaxed">"{review.text}"</p>
                  <div className="pt-6 border-t border-ink/5">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent-purple group-hover:text-accent transition-colors">{review.author}</p>
                    <p className="text-[10px] opacity-40 uppercase font-mono mt-1">{review.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Space Section - Creative Moment */}
        <section className="py-48 flex items-center justify-center overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
          >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-72 h-72 md:w-96 md:h-96 border border-ink/5 rounded-full flex items-center justify-center p-14 relative"
              >
                <div className="text-[9px] uppercase tracking-[0.6em] font-bold text-center opacity-10">
                  Design / Studio / Vision / Space / International / Design / Studio / Vision / Space / International
                </div>
                {/* Orbiting dot */}
                <motion.div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "0 192px" }}
                />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Magnetic>
                  <motion.div 
                    whileHover={{ scale: 1.3, rotate: 10 }}
                    className="w-20 h-20 bg-accent rounded-full flex items-center justify-center font-bold text-ink shadow-2xl shadow-accent/20"
                  >
                    E.
                  </motion.div>
                </Magnetic>
              </div>
          </motion.div>
        </section>

        {/* 6. Final Moment */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden relative">
          <motion.div 
            className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] bg-accent-purple/10 rounded-full blur-[120px] -z-10"
            style={{ y: useTransform(smoothProgress, [0.8, 1], [0, -100]) }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] bg-accent-blue/10 rounded-full blur-[100px] -z-10"
            style={{ y: useTransform(smoothProgress, [0.8, 1], [0, 100]) }}
          />
          
          <div className="space-y-16 z-10 max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-6xl md:text-[8vw] font-display font-bold leading-[0.9] tracking-[-0.04em] uppercase text-gradient"
            >
              Let’s craft your <span className="text-accent italic font-serif lowercase opacity-100!">distinctive</span> edge.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <Link to="/book">
                <Magnetic>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "#ff4d00", color: "#121212" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-20 py-8 bg-ink text-bg rounded-full text-xs uppercase tracking-[0.4em] font-bold border border-transparent transition-all shadow-2xl shadow-accent-purple/20"
                  >
                    Book Now
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

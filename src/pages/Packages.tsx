import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageTransition from "../components/PageTransition";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import Magnetic from "../components/Magnetic";
import TextReveal from "../components/TextReveal";

const PACKAGES = [
  { 
    id: "bf", 
    name: "Brand Foundation", 
    price: "₹2,000 – ₹15,000", 
    bestFor: "startups, new businesses",
    desc: "We build your brand from scratch with a strong, modern identity.", 
    includes: [
      "Logo design",
      "Brand colors & typography",
      "Basic brand guidelines",
      "Social media starter kit (DP, posts)"
    ] 
  },
  { 
    id: "ui", 
    name: "UI/UX & Website", 
    price: "₹5,000 – ₹20,000", 
    bestFor: "businesses going digital",
    desc: "We design clean, user-focused digital experiences that convert.", 
    includes: [
      "UX research (basic)",
      "Wireframes",
      "UI design (Figma)",
      "Responsive layouts (mobile + desktop)",
      "Optional add-on: developer handoff"
    ] 
  },
  { 
    id: "cv", 
    name: "Content & Video", 
    price: "₹3,000 – ₹12,000", 
    bestFor: "social media growth",
    desc: "We turn your content into scroll-stopping visuals.", 
    includes: [
      "Reel/video editing",
      "Motion graphics",
      "Thumbnails / covers",
      "Content styling aligned with brand"
    ] 
  },
  { 
    id: "gc", 
    name: "Growth Combo", 
    price: "₹5,000 – ₹25,000", 
    bestFor: "serious clients",
    desc: "A complete creative system to build, launch, and grow your brand.", 
    includes: [
      "Branding + UI/UX + Content",
      "Monthly design support",
      "Ongoing video content"
    ] 
  },
  { 
    id: "mr", 
    name: "Monthly Retainer", 
    price: "Custom Monthly", 
    bestFor: "long-term clients",
    desc: "Your dedicated creative team, on demand.", 
    includes: [
      "Fixed number of design tasks",
      "Continuous video editing",
      "Priority support"
    ] 
  }
];

export default function Packages() {
  const [selected, setSelected] = useState(PACKAGES[0]);

  return (
    <PageTransition>
      <div className="min-h-screen pt-4 sm:pt-8 md:pt-12 pb-16 sm:pb-24 max-w-7xl mx-auto flex flex-col px-4 sm:px-6">
        <div className="mb-8 sm:mb-16">
          <div className="glass-badge mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span>Creative Solutions</span>
          </div>
          <TextReveal 
            text="Design Ecosystem."
            className="text-3xl sm:text-5xl md:text-7xl font-display font-medium tracking-tighter mb-2 sm:mb-4 uppercase text-gradient-alt"
          />
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-sm md:text-base font-light opacity-60 max-w-xl uppercase tracking-widest font-mono"
          >
            Explore our tailored creative solutions, purpose-built from identity foundations through digital user experiences to immersive video motion frameworks.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 sm:gap-12 md:gap-16 items-start">
        {/* Left Side - Package List */}
        <div className="w-full md:w-1/3 flex flex-col">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest opacity-40 font-mono mb-4 sm:mb-6 block font-bold">Offerings Menu</span>
          <div className="flex flex-row md:flex-col gap-2 sm:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelected(pkg)}
                className={cn(
                  "text-left group relative whitespace-nowrap md:whitespace-normal px-4 py-3 rounded-2xl transition-all duration-300 flex-shrink-0 md:flex-shrink cursor-pointer",
                  selected.id === pkg.id 
                    ? "glass-card border-accent/40 shadow-lg shadow-accent/10" 
                    : "glass hover:border-white/20 opacity-70 hover:opacity-100"
                )}
              >
                <div className="flex items-center justify-between">
                  <motion.div 
                    className={cn(
                      "text-sm sm:text-xl md:text-2xl font-display font-bold transition-all duration-300",
                      selected.id === pkg.id ? "text-accent" : "text-ink group-hover:text-accent"
                    )}
                  >
                    {pkg.name}
                  </motion.div>
                  {selected.id === pkg.id && (
                    <motion.div 
                      layoutId="package-active-dot" 
                      className="w-2 h-2 rounded-full bg-accent ml-2 shrink-0 hidden sm:block" 
                    />
                  )}
                </div>
                <div className="text-[10px] opacity-50 font-mono mt-1 hidden md:block">{pkg.bestFor}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Dynamic Content */}
        <div className="w-full md:w-2/3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel p-6 sm:p-10 md:p-14 space-y-6 sm:space-y-10 md:space-y-12 relative overflow-hidden"
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-2 sm:space-y-3 relative z-10">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] opacity-40 font-mono font-bold">Investment Range</p>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-accent">{selected.price}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 relative z-10">
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest opacity-40 font-mono font-bold">Purpose</p>
                  <p className="text-base sm:text-xl md:text-2xl leading-relaxed font-light text-ink/90">
                    {selected.desc}
                  </p>
                  <div className="glass px-3 py-1.5 rounded-xl inline-block text-xs italic opacity-70">
                    Best for: {selected.bestFor}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest opacity-40 font-mono font-bold">What's Inside</p>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {selected.includes.map((item, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                        className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm uppercase font-medium tracking-wide text-ink/80"
                      >
                        <span className="text-accent font-bold mt-0.5">•</span> {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 sm:pt-8 md:pt-10 flex justify-center relative z-10 border-t border-ink/5">
                <Link to="/contact" className="w-full">
                  <Magnetic>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 sm:py-5 md:py-6 bg-gradient-to-r from-accent to-accent-alt text-white rounded-2xl text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] font-black transition-all duration-300 shadow-xl shadow-accent/25 cursor-pointer border border-white/20"
                    >
                      Book This Ecosystem →
                    </motion.button>
                  </Magnetic>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

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
      <div className="min-h-screen pt-40 pb-24 max-w-7xl mx-auto flex flex-col">
        <div className="mb-16">
          <TextReveal 
            text="Design Ecosystem."
            className="text-6xl md:text-8xl font-display font-medium tracking-tighter mb-4 uppercase"
          />
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-base font-light opacity-50 max-w-xl uppercase tracking-widest font-mono"
          >
            Explore our tailored creative solutions, purpose-built from identity foundations through digital user experiences to immersive video motion frameworks.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-20">
        {/* Left Side - Package List */}
        <div className="w-full md:w-1/3 flex flex-col">
          <span className="text-xs uppercase tracking-widest opacity-40 font-mono mb-12 block">Offerings</span>
          <div className="flex flex-col gap-6">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelected(pkg)}
                className={cn(
                  "text-left group relative",
                )}
              >
                <motion.div 
                  className={cn(
                    "text-3xl md:text-5xl font-display font-medium transition-all duration-500",
                    selected.id === pkg.id ? "text-accent" : "opacity-30 group-hover:opacity-100"
                  )}
                  animate={{ x: selected.id === pkg.id ? 10 : 0 }}
                >
                  {pkg.name}
                </motion.div>
                {selected.id === pkg.id && (
                    <motion.div 
                        layoutId="underline" 
                        className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent" 
                    />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Dynamic Content */}
        <div className="w-full md:w-2/3 md:pl-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl border-2 border-ink/20 dark:border-white/15 p-8 md:p-12 space-y-12 rounded-2xl relative overflow-hidden shadow-xl shadow-black/10"
            >
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.1em] opacity-40 font-mono">Investment Range</p>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-accent">{selected.price}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <p className="text-sm uppercase tracking-widest opacity-40 font-mono">Purpose</p>
                  <p className="text-xl md:text-2xl leading-relaxed font-light">
                    {selected.desc}
                  </p>
                  <p className="text-sm italic opacity-50">Best for: {selected.bestFor}</p>
                </div>

                <div className="space-y-6">
                  <p className="text-sm uppercase tracking-widest opacity-40 font-mono">What's Inside</p>
                  <ul className="space-y-3">
                    {selected.includes.map((item, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                        className="flex items-start gap-3 text-sm uppercase font-medium tracking-wide"
                      >
                        <span className="text-accent">•</span> {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-12 flex justify-center">
                <Link to="/contact" className="w-full">
                  <Magnetic>
                    <motion.button 
                      whileHover={{ scale: 1.02, backgroundColor: "#121212", color: "#e8e8e8" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-8 bg-accent text-ink rounded-full text-xs uppercase tracking-[0.4em] font-bold transition-all duration-300 shadow-xl shadow-accent/20"
                    >
                      Contact Us
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

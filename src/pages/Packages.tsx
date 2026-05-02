import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageTransition from "../components/PageTransition";
import { cn } from "@/src/lib/utils";
import { Link } from "react-router-dom";
import Magnetic from "../components/Magnetic";
import TextReveal from "../components/TextReveal";

const PACKAGES = [
  { 
    id: "bf", 
    name: "Brand Foundation", 
    price: "₹2,000 – ₹15,000", 
    bestFor: "Early stage startups and solo innovators",
    desc: "A core identity system that defines your brand's soul. We focus on creating a memorable visual impact through minimalist but powerful design elements that work across all mediums.", 
    includes: [
      "Primary Logo (Vector & Raster)",
      "Iconography System",
      "Brand Color Palette",
      "Typography Guidelines",
      "Business Card Design",
      "Basic Social Media Kit",
      "1 Week Delivery"
    ] 
  },
  { 
    id: "ui", 
    name: "UI/UX & Website", 
    price: "₹5,000 – ₹20,000", 
    bestFor: "D2C brands and tech products",
    desc: "Conversion-centric digital architecture. We combine high-end aesthetic with functional UX to ensure your website isn't just a gallery, but a powerful business asset.", 
    includes: [
      "Strategic UX Map",
      "High-Fidelity UI Design",
      "Custom React/Next.js Build",
      "Responsive Layouts",
      "On-page SEO setup",
      "CMS Implementation",
      "Post-launch Support"
    ] 
  },
  { 
    id: "cv", 
    name: "Content & Video", 
    price: "₹3,000 – ₹12,000", 
    bestFor: "Campaign launches and social presence",
    desc: "Storytelling through moving pixels. We craft cinematic content that captures attention in a crowded digital landscape, from product trailers to viral social media loops.", 
    includes: [
      "Creative Scriptwriting",
      "3D Motion Graphics",
      "Color Grading & VFX",
      "Sound Design & Selection",
      "Vertical Video Formatting",
      "Promo Video Snippets",
      "High-res Exports"
    ] 
  },
  { 
    id: "gc", 
    name: "Growth Combo", 
    price: "₹5,000 – ₹25,000", 
    bestFor: "Established brands ready for scale",
    desc: "Your comprehensive design partner. This package integrates all our core disciplines into a unified growth strategy, serving as your virtual creative department.", 
    includes: [
      "All Services Combined",
      "Monthly Creative Audit",
      "Priority Turnaround",
      "Dedicated Project Lead",
      "Ad Creative Generation",
      "Unlimited Minor Iterations",
      "Strategic Partnership"
    ] 
  }
];

export default function Packages() {
  const [selected, setSelected] = useState(PACKAGES[0]);

  return (
    <PageTransition>
      <div className="min-h-screen pt-40 pb-24 max-w-7xl mx-auto flex flex-col">
        <TextReveal 
          text="Design Ecosystem."
          className="text-6xl md:text-8xl font-display font-medium tracking-tighter mb-20 uppercase"
        />

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
              className="glass-card p-12 space-y-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -z-10" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-muted/10 rounded-full blur-[80px] -z-10" />
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
                      <li key={i} className="flex items-start gap-3 text-sm uppercase font-medium tracking-wide">
                        <span className="text-accent">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-12 flex justify-center">
                <Link to="/book" className="w-full">
                  <Magnetic>
                    <motion.button 
                      whileHover={{ scale: 1.02, backgroundColor: "#121212", color: "#e8e8e8" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-8 bg-accent text-ink rounded-full text-xs uppercase tracking-[0.4em] font-bold transition-all duration-300 shadow-xl shadow-accent/20"
                    >
                      Book Now
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

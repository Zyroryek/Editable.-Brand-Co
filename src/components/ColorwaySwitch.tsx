import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Paintbrush, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Magnetic from "./Magnetic";
import { playNavigationSound } from "../lib/audio";

export interface Colorway {
  id: string;
  name: string;
  description: string;
  colors: string[]; // Color hex preview array
  className: string;
}

export const COLORWAYS: Colorway[] = [
  {
    id: "vermilion",
    name: "Swiss Vermilion",
    description: "Vivid vermilion & sandstone cream",
    colors: ["#ff4d00", "#ffa880", "#7d1aff"],
    className: "palette-vermilion"
  },
  {
    id: "aurora",
    name: "Midnight Electric",
    description: "Electric cyan & deep space cobalt",
    colors: ["#00f2ff", "#2563eb", "#d946ef"],
    className: "palette-aurora"
  },
  {
    id: "gold",
    name: "Obsidian Saffron",
    description: "Royal saffron & smoked charcoal",
    colors: ["#f59e0b", "#10b981", "#ec4899"],
    className: "palette-gold"
  },
  {
    id: "forest",
    name: "Nordic Emerald",
    description: "Sleek organic emerald pine & sage",
    colors: ["#10b981", "#3b82f6", "#6366f1"],
    className: "palette-forest"
  },
  {
    id: "cyber",
    name: "Crimson Poison",
    description: "Vicious ruby red & toxic teal",
    colors: ["#e11d48", "#06b6d4", "#6366f1"],
    className: "palette-cyber"
  }
];

export default function ColorwaySwitch() {
  const [activePalette, setActivePalette] = useState(() => {
    return localStorage.getItem("color-palette") || "vermilion";
  });
  const [isOpen, setIsOpen] = useState(false);

  // Apply palette class on load and state change
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all previous palette classes
    COLORWAYS.forEach((c) => {
      root.classList.remove(c.className);
    });

    // Add selected palette class
    const selected = COLORWAYS.find((c) => c.id === activePalette) || COLORWAYS[0];
    root.classList.add(selected.className);
    
    localStorage.setItem("color-palette", activePalette);
  }, [activePalette]);

  const selectPalette = (id: string) => {
    playNavigationSound();
    setActivePalette(id);
  };

  return (
    <div className="relative pointer-events-auto flex items-center">
      {/* Control Button */}
      <Magnetic>
        <button
          onClick={() => {
            playNavigationSound();
            setIsOpen(!isOpen);
          }}
          className={cn(
            "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full glass border border-white/20 transition-all group shadow-2xl relative",
            isOpen ? "border-accent text-accent ring-2 ring-accent/20" : "hover:border-accent"
          )}
          title="Customize studio colorway"
        >
          <Paintbrush size={16} className="md:size-[18px] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-background animate-pulse" />
        </button>
      </Magnetic>

      {/* Palette Select Panel HUD */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click dismiss guard */}
            <div 
              className="fixed inset-0 z-40 cursor-default" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-14 md:top-16 right-0 z-50 w-72 md:w-80 bg-glass/50 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink/5 dark:border-white/5">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-accent" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-ink/80 dark:text-white/80">
                    Studio Colorways
                  </span>
                </div>
                <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest">[ PRESENTS ]</span>
              </div>

              <div className="space-y-3">
                {COLORWAYS.map((c) => {
                  const isSelected = c.id === activePalette;
                  return (
                    <button
                      key={c.id}
                      onClick={() => selectPalette(c.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group",
                        isSelected 
                          ? "bg-ink text-bg border-transparent shadow-lg shadow-ink/10 dark:bg-white dark:text-bg dark:shadow-white/5" 
                          : "bg-transparent border-ink/5 dark:border-white/5 hover:border-accent hover:bg-ink/5 dark:hover:bg-white/5"
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-display font-extrabold uppercase tracking-widest">
                          {c.name}
                        </span>
                        <span className={cn(
                          "text-[9px] font-serif italic mt-0.5 opacity-60 leading-tight",
                          isSelected ? "text-bg/85" : ""
                        )}>
                          {c.description}
                        </span>
                      </div>

                      {/* Color dots preview & Selected tick */}
                      <div className="flex items-center gap-2.5">
                        <div className="flex -space-x-1.5">
                          {c.colors.map((color, idx) => (
                            <span 
                              key={idx}
                              style={{ backgroundColor: color }}
                              className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                            />
                          ))}
                        </div>
                        {isSelected && (
                          <Check size={12} className="text-accent shrink-0 ml-1" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-ink/5 dark:border-white/5 flex items-center justify-between text-[8px] font-mono opacity-50 tracking-wider">
                <span>[ DRAPED IN ART DIRECTION ]</span>
                <span className="text-right">PREMIUM SYSTEM v2.5</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

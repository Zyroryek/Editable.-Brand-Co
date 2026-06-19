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

export default function ColorwaySwitch({ theme }: { theme?: string }) {
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

  const isLightTheme = theme === "light";

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
            "w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-transparent transition-all relative group",
            isLightTheme 
              ? "text-white hover:text-accent hover:bg-white/10" 
              : "text-neutral-900 dark:text-neutral-900 hover:text-accent hover:bg-black/5",
            isOpen ? "text-accent" : ""
          )}
          title="Customize studio colorway"
        >
          <Paintbrush size={15} className="md:size-[17px] group-hover:rotate-12 transition-transform relative z-10" />
          
          {/* Ambient rotation border */}
          <span className={cn(
            "absolute inset-0.5 rounded-full border border-dashed border-accent/0 group-hover:border-accent/40 group-hover:animate-[spin_8s_linear_infinite] transition-all",
            isLightTheme ? "group-hover:border-accent/40" : "group-hover:border-accent/40"
          )} />

          {/* Micro state indicator dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent scale-100 group-hover:scale-125 transition-all" />
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
              className={cn(
                "absolute top-14 md:top-16 right-0 z-50 w-72 md:w-80 rounded-3xl p-6 shadow-2xl backdrop-blur-3xl border",
                isLightTheme 
                  ? "bg-stone-950 border-stone-850 text-white shadow-[0_24px_64px_rgba(0,0,0,0.5)]" 
                  : "bg-white border-neutral-200 text-neutral-950 shadow-[0_24px_64px_rgba(0,0,0,0.15)]"
              )}
            >
              <div className={cn(
                "flex items-center justify-between mb-4 pb-3 border-b",
                isLightTheme ? "border-white/10" : "border-neutral-100"
              )}>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-accent" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black">
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
                          ? (isLightTheme 
                              ? "bg-white text-black border-transparent shadow-lg" 
                              : "bg-neutral-950 text-white border-transparent shadow-lg")
                          : (isLightTheme
                              ? "bg-transparent border-white/10 hover:border-accent hover:bg-white/5 text-white/90"
                              : "bg-transparent border-neutral-200 hover:border-accent hover:bg-neutral-50 text-neutral-800")
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-display font-extrabold uppercase tracking-widest">
                          {c.name}
                        </span>
                        <span className={cn(
                          "text-[9px] font-serif italic mt-0.5 opacity-60 leading-tight",
                          isSelected ? "" : (isLightTheme ? "text-white/70" : "text-neutral-600")
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
                              className={cn(
                                "w-3.5 h-3.5 rounded-full shrink-0 border",
                                isLightTheme ? "border-black/25" : "border-white/20"
                              )}
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

              <div className={cn(
                "mt-4 pt-3 border-t flex items-center justify-between text-[8px] font-mono opacity-50 tracking-wider",
                isLightTheme ? "border-white/10" : "border-neutral-100"
              )}>
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

import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "motion/react";
import { cn } from "../lib/utils";

interface EditableHeroTextProps {
  className?: string;
}

export const EditableHeroText: React.FC<EditableHeroTextProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text = "Editable.";

  // Mouse positions for the subtle background glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 80, damping: 25 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Calculate mouse position relative to the container as percentage (-50% to 50%)
    const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Split text into characters
  const characters = text.split("");

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  // Animation variants for individual letters (initial loading)
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 120, 
      rotateX: 45, 
      skewX: 10 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      skewX: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] // Custom easeout Expo
      }
    },
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative select-none py-6 overflow-visible flex items-center justify-center w-full"
    >
      {/* Dynamic Ambient Background Glows that follow the mouse */}
      <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center z-0">
        <motion.div 
          style={{ x: glowX, y: glowY }}
          className="absolute w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-accent/10 blur-[80px] dark:bg-accent/15"
        />
        <motion.div 
          style={{ x: useTransform(glowX, (v) => -v), y: useTransform(glowY, (v) => -v) }}
          className="absolute w-[35vw] h-[35vw] max-w-[350px] max-h-[350px] rounded-full bg-accent-purple/10 blur-[80px] dark:bg-accent-purple/15"
        />
      </div>

      {/* Main Heading element */}
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "relative z-10 flex flex-nowrap whitespace-nowrap justify-center origin-center leading-none text-ink pb-4 overflow-visible",
          className
        )}
      >
        {characters.map((char, index) => {
          // Special styling & rendering for the period "."
          const isPeriod = char === ".";
          
          return (
            <motion.span
              key={index}
              variants={letterVariants}
              className="relative inline-block cursor-pointer group/letter"
              style={{ 
                transformStyle: "preserve-3d",
                perspective: "1000px" 
              }}
              whileHover={{
                scale: 1.15,
                y: -15,
                rotateZ: isPeriod ? [0, -10, 10, 0] : -3,
                transition: { 
                  scale: { type: "spring", stiffness: 400, damping: 15 },
                  y: { type: "spring", stiffness: 400, damping: 15 },
                  rotateZ: isPeriod 
                    ? { type: "tween", duration: 0.45, ease: "easeInOut" }
                    : { type: "spring", stiffness: 400, damping: 15 }
                }
              }}
            >
              {/* Chromatical Splitting Copy 1: Vermilion Accent (Leans Left) */}
              <span 
                className={cn(
                  "absolute inset-0 select-none pointer-events-none opacity-0 group-hover/letter:opacity-75 transition-all duration-300 ease-out font-display",
                  isPeriod ? "text-accent-blue" : "text-accent"
                )}
                style={{
                  transform: "translate3d(-8px, -2px, -10px) scale(0.98)",
                  mixBlendMode: "screen"
                }}
              >
                {char}
              </span>

              {/* Chromatical Splitting Copy 2: Tech Blue/Purple Accent (Leans Right) */}
              <span 
                className={cn(
                  "absolute inset-0 select-none pointer-events-none opacity-0 group-hover/letter:opacity-75 transition-all duration-300 ease-out font-display",
                  isPeriod ? "text-accent" : "text-accent-blue"
                )}
                style={{
                  transform: "translate3d(8px, 2px, -10px) scale(0.98)",
                  mixBlendMode: "screen"
                }}
              >
                {char}
              </span>

              {/* Foreground main copy */}
              <span 
                className={cn(
                  "relative block font-display tracking-tight transition-colors duration-300",
                  isPeriod ? "text-accent drop-shadow-[0_0_15px_rgba(255,77,0,0.5)]" : "text-ink group-hover/letter:text-ink/90"
                )}
                style={{ transform: "translateZ(10px)" }}
              >
                {char}
              </span>
            </motion.span>
          );
        })}
      </motion.h1>
    </div>
  );
};

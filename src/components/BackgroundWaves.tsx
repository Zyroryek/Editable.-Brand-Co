import React from "react";
import { motion } from "motion/react";

export const BackgroundWaves: React.FC = () => {
  return (
    <div className="background-wrapper select-none pointer-events-none overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Dynamic Glowing Mesh Orbs that shine through glassmorphism cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-70 dark:opacity-50">
        
        {/* Top-Right Ambient Glow (Neon Orange / Warm Coral) */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-accent/30 via-accent-purple/20 to-transparent blur-[90px] md:blur-[140px]"
        />

        {/* Center-Left Ambient Glow (Electric Cyan / Royal Blue) */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 60, -40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-[35%] -left-[15%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-tr from-accent-blue/25 via-accent-purple/25 to-transparent blur-[100px] md:blur-[150px]"
        />

        {/* Bottom Center Ambient Glow (Deep Violet / Magenta / Amber) */}
        <motion.div
          animate={{
            x: [0, 35, -35, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-t from-accent-purple/20 via-accent/15 to-transparent blur-[110px] md:blur-[160px]"
        />
      </div>

      {/* Subtle modern micro-dot grid for tactile precision */}
      <div 
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--color-ink) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};



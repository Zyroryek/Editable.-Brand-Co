import React from "react";
import { motion } from "motion/react";

export const BackgroundWaves: React.FC = () => {
  return (
    <div className="background-wrapper select-none pointer-events-none" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Underlying atmospheric gradients adapted dynamically to active colorway selection */}
      <div className="absolute inset-0 opacity-45 dark:opacity-25 transition-all duration-1000">
        <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,var(--color-accent-blue)_0%,transparent_50%)] opacity-35" />
        <div className="absolute inset-0 bg-[radial-gradient(at_100%_0%,var(--color-accent-purple)_0%,transparent_50%)] opacity-25" />
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_100%,var(--color-accent)_0%,transparent_60%)] opacity-20" />
      </div>

      <svg
        className="absolute w-full h-full opacity-100 transition-all duration-1500 pointer-events-none"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Wave 1: Top Wave - Themes to soft Surface transition to prevent harsh header lines */}
        <motion.path
          d="M0 120C240 180 480 80 720 120C960 160 1200 60 1440 100V0H0V120Z"
          fill="url(#themeGradientTop)"
          animate={{
            d: [
              "M0 120C240 180 480 80 720 120C960 160 1200 60 1440 100V0H0V120Z",
              "M0 100C240 60 480 160 720 120C960 80 1200 180 1440 120V0H0V100Z",
              "M0 120C240 180 480 80 720 120C960 160 1200 60 1440 100V0H0V120Z",
            ],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 2: Blue-Accent Stream Wave */}
        <motion.path
          d="M0 240C300 180 600 300 900 240C1200 180 1380 280 1440 260V0H0V240Z"
          fill="url(#themeGradientBlueStream)"
          animate={{
            d: [
              "M0 240C300 180 600 300 900 240C1200 180 1380 280 1440 260V0H0V240Z",
              "M0 260C300 300 600 180 900 260C1200 320 1380 180 1440 240V0H0V260Z",
              "M0 240C300 180 600 300 900 240C1200 180 1380 280 1440 260V0H0V240Z",
            ],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 3: Middle Wave - Themes to active purple-blue accent flow with modern transparency */}
        <motion.path
          d="M0 380C360 300 720 460 1080 380C1260 340 1380 420 1440 400V0H0V380Z"
          fill="url(#themeGradientMiddle)"
          animate={{
            d: [
              "M0 380C360 300 720 460 1080 380C1260 340 1380 420 1440 400V0H0V380Z",
              "M0 400C360 460 720 300 1080 400C1260 420 1380 340 1440 380V0H0V400Z",
              "M0 380C360 300 720 460 1080 380C1260 340 1380 420 1440 400V0H0V380Z",
            ],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 4: Amber/Muted Custom Highlight Wave */}
        <motion.path
          d="M0 520C280 480 580 580 880 520C1180 460 1360 560 1440 510V800H0V520Z"
          fill="url(#themeGradientAmberStream)"
          animate={{
            d: [
              "M0 520C280 480 580 580 880 520C1180 460 1360 560 1440 510V800H0V520Z",
              "M0 540C280 560 580 465 880 545C1180 575 1360 460 1440 530V800H0V540Z",
              "M0 520C280 480 580 580 880 520C1180 460 1360 560 1440 510V800H0V520Z",
            ],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 5: Bottom Wave - Themes to active brand-accent to accent-purple flow */}
        <motion.path
          d="M0 620C300 670 600 570 900 620C1200 670 1440 570 1440 620V800H0V620Z"
          fill="url(#themeGradientBottom)"
          animate={{
            d: [
              "M0 620C300 670 600 570 900 620C1200 670 1440 570 1440 620V800H0V620Z",
              "M0 640C300 590 600 690 900 640C1200 590 1440 690 1440 640V800H0V640Z",
              "M0 620C300 670 600 570 900 620C1200 670 1440 570 1440 620V800H0V620Z",
            ],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <defs>
          <linearGradient id="themeGradientTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-surface)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="themeGradientBlueStream" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="themeGradientMiddle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-purple)" stopOpacity="0.38" />
            <stop offset="50%" stopColor="var(--color-accent-blue)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="themeGradientAmberStream" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-muted)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="themeGradientBottom" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-accent-purple)" stopOpacity="0.18" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

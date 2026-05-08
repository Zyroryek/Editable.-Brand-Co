import React from "react";
import { motion } from "motion/react";

export const BackgroundWaves: React.FC = () => {
  return (
    <div className="background-wrapper" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Underlying atmospheric gradients */}
      <div className="absolute inset-0 opacity-80 dark:opacity-30 transition-opacity duration-700">
        <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(224,231,255,1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(at_100%_0%,rgba(243,232,255,1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_100%,rgba(219,234,254,1)_0%,transparent_60%)]" />
      </div>

      <svg
        className="absolute w-full h-full opacity-80 dark:opacity-40"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Top Wave - Solid White */}
        <motion.path
          d="M0 120C240 180 480 80 720 120C960 160 1200 60 1440 100V0H0V120Z"
          fill="rgba(255, 255, 255, 1)"
          animate={{
            d: [
              "M0 120C240 180 480 80 720 120C960 160 1200 60 1440 100V0H0V120Z",
              "M0 100C240 60 480 160 720 120C960 80 1200 180 1440 120V0H0V100Z",
              "M0 120C240 180 480 80 720 120C960 160 1200 60 1440 100V0H0V120Z",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Middle Wave - White Gradient */}
        <motion.path
          d="M0 300C360 220 720 380 1080 300C1260 260 1380 340 1440 320V0H0V300Z"
          fill="url(#whiteGradient1)"
          animate={{
            d: [
              "M0 300C360 220 720 380 1080 300C1260 260 1380 340 1440 320V0H0V300Z",
              "M0 320C360 380 720 220 1080 320C1260 340 1380 260 1440 300V0H0V320Z",
              "M0 300C360 220 720 380 1080 300C1260 260 1380 340 1440 320V0H0V300Z",
            ],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Bottom Wave - White Gradient */}
        <motion.path
          d="M0 500C300 550 600 450 900 500C1200 550 1440 450 1440 500V800H0V500Z"
          fill="url(#whiteGradient2)"
          animate={{
            d: [
              "M0 500C300 550 600 450 900 500C1200 550 1440 450 1440 500V800H0V500Z",
              "M0 520C300 470 600 570 900 520C1200 470 1440 570 1440 520V800H0V520Z",
              "M0 500C300 550 600 450 900 500C1200 550 1440 450 1440 500V800H0V500Z",
            ],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <defs>
          <linearGradient id="whiteGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.65)" />
          </linearGradient>
          <linearGradient id="whiteGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.75)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.45)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

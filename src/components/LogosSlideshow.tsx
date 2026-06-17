import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AgencySlide {
  id: string;
  imgUrl: string;
}

export const LogosSlideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const agencySlides: AgencySlide[] = [
    {
      id: "brand-foundation",
      imgUrl: "/src/assets/images/pkg_brand_foundation_1781709357784.jpg"
    },
    {
      id: "uiux-website",
      imgUrl: "/src/assets/images/pkg_uiux_website_1781709375177.jpg"
    },
    {
      id: "content-video",
      imgUrl: "/src/assets/images/pkg_content_video_1781709391007.jpg"
    },
    {
      id: "growth-combo",
      imgUrl: "/src/assets/images/pkg_growth_combo_1781709410976.jpg"
    },
    {
      id: "monthly-retainer",
      imgUrl: "/src/assets/images/pkg_monthly_retainer_1781709430112.jpg"
    }
  ];

  // Automate slide cycle every 2200ms, paused on manual hover/interaction
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % agencySlides.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [isHovered, agencySlides.length]);

  return (
    <div 
      className="p-1 flex flex-col items-center justify-center relative select-none w-full max-w-xl md:max-w-[580px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Blueprint Corner L-Lines for precise agency look */}
      <div className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 border-ink/20 rounded-tl pointer-events-none" />
      <div className="absolute -top-4 -right-4 w-6 h-6 border-t-2 border-r-2 border-ink/20 rounded-tr pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b-2 border-l-2 border-ink/20 rounded-bl pointer-events-none" />
      <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b-2 border-r-2 border-ink/20 rounded-br pointer-events-none" />
      
      {/* Large Square/Rectangular Canvas with rounded edges and high quality glass shadow */}
      <div className="relative w-full aspect-square bg-slate-900 rounded-2xl border border-ink/10 dark:border-white/10 overflow-hidden shadow-2xl">
        
        {/* Dynamic Image Slides inside the frame */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative"
          >
            <img
              src={agencySlides[currentIndex].imgUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Elegant structural inner border frames */}
        <div className="absolute inset-3 rounded-xl border border-white/10 pointer-events-none z-10" />
      </div>

      {/* Manual slide indicator tabs underneath */}
      <div className="flex gap-2 mt-6 w-full justify-center items-center z-10">
        {agencySlides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
              idx === currentIndex 
                ? "w-8 bg-accent" 
                : "w-2 bg-ink/20 dark:bg-white/20 hover:bg-ink/40"
            }`}
            title={`View slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

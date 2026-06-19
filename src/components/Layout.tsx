import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import Lenis from "lenis";
import { CustomCursor } from "./CustomCursor";
import Magnetic from "./Magnetic";
import { playNavigationSound, getSoundEnabled, setSoundEnabled } from "../lib/audio";
import ColorwaySwitch from "./ColorwaySwitch";

const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => {
  const handleClick = () => {
    playNavigationSound();
    if (onClick) onClick();
  };
  return (
    <Link to={to} onClick={handleClick} className="block py-3 md:py-4 pointer-events-auto">
      <motion.span
        className="block text-4xl md:text-6xl font-display font-medium text-black dark:text-white hover:text-accent transition-colors duration-300 pointer-events-auto uppercase tracking-tighter"
        whileHover={{ x: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {label}
      </motion.span>
    </Link>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled());
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  const toggleTheme = () => {
    playNavigationSound();
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabledState(nextVal);
    setSoundEnabled(nextVal);
    if (nextVal) {
      // Small deferred timeout so current thread context handles storage sync
      setTimeout(() => {
        playNavigationSound();
      }, 30);
    }
  };

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(currentScroll / totalScroll);
    };

    lenis.on('scroll', handleScroll);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0 });
    }
    setIsMenuOpen(false); // Ensure menu closes on navigation
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-transparent">
      <CustomCursor />
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 z-[1000] origin-left shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        style={{ 
          scaleX: scrollProgress,
          background: `linear-gradient(90deg, 
            hsl(${(scrollProgress * 360) % 360}, 90%, 55%) 0%, 
            hsl(${(scrollProgress * 360 + 120) % 360}, 90%, 55%) 50%, 
            hsl(${(scrollProgress * 360 + 240) % 360}, 90%, 55%) 100%
          )`
        }}
      />

      {/* Top Fixed Actions */}
      <div className="fixed top-0 right-0 z-[999] p-6 md:p-8 lg:p-12 flex items-center gap-3 pointer-events-none">
        
        {/* Separate Theme Toggle Capsule */}
        <div className={cn(
          "flex items-center justify-center p-1.5 md:p-2 rounded-full backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.12)] pointer-events-auto border transition-all duration-300",
          theme === "light" 
            ? "bg-stone-950 border-stone-850 text-white" 
            : "bg-white border-neutral-200 text-neutral-950"
        )}>
          <Magnetic>
            <button 
              onClick={toggleTheme}
              className={cn(
                "w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-transparent transition-all relative overflow-hidden",
                theme === "light"
                  ? "text-white hover:text-accent hover:bg-white/10"
                  : "text-neutral-950 hover:text-accent hover:bg-neutral-100"
              )}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <AnimatePresence mode="wait">
                {theme === "light" ? (
                  <motion.div
                    key="light"
                    initial={{ y: 8, opacity: 0, rotate: -40 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -8, opacity: 0, rotate: 40 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <Moon size={15} className="md:size-[17px]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="dark"
                    initial={{ y: 8, opacity: 0, rotate: -40 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -8, opacity: 0, rotate: 40 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <Sun size={15} className="md:size-[17px] text-accent" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </Magnetic>
        </div>

        {/* Separate Colorway Switch Capsule */}
        <div className={cn(
          "flex items-center justify-center p-1.5 md:p-2 rounded-full backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.12)] pointer-events-auto border transition-all duration-300",
          theme === "light" 
            ? "bg-stone-950 border-stone-850 text-white" 
            : "bg-white border-neutral-200 text-neutral-950"
        )}>
          <ColorwaySwitch theme={theme} />
        </div>

        {/* Separate Menu Capsule */}
        <div className="pointer-events-auto">
          <Magnetic>
            <button 
              onClick={() => {
                playNavigationSound();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="flex items-center gap-2.5 pl-3.5 pr-2.5 py-1.5 md:py-2.5 rounded-full bg-accent text-white hover:opacity-90 shadow-md transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-extrabold z-10 leading-none">
                {isMenuOpen ? "Close" : "Menu"}
              </span>
              <div className="relative z-10 w-4 h-4 md:w-4 md:h-4 flex flex-col justify-center gap-[4px] items-center">
                <motion.span 
                  className="w-3.5 md:w-3.5 h-[1.5px] bg-white rounded-full origin-center"
                  animate={isMenuOpen ? { rotate: 45, y: 2.75 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                />
                <motion.span 
                  className="w-3.5 md:w-3.5 h-[1.5px] bg-white rounded-full origin-center"
                  animate={isMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                />
                <motion.span 
                  className="w-3.5 md:w-3.5 h-[1.5px] bg-white rounded-full origin-center"
                  animate={isMenuOpen ? { rotate: -45, y: -2.75 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                />
              </div>
            </button>
          </Magnetic>
        </div>

      </div>

      {/* Persistent Logo */}
      <div className="fixed top-0 left-0 z-[999] p-6 md:p-8 lg:p-12 pointer-events-none">
        <Magnetic>
          <Link to="/" className="pointer-events-auto block">
            <motion.div 
              className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover="hover"
            >
              {/* Outer stylized dashed orbit ring */}
              <motion.div 
                className="absolute inset-0 rounded-full border border-dashed border-neutral-950 dark:border-white opacity-40 group-hover:opacity-100 animate-[spin_30s_linear_infinite]"
                variants={{
                  hover: { scale: 1.1 }
                }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />
              {/* Inner key-ring with solid borders split */}
              <motion.div 
                className="absolute inset-1 rounded-full border-2 border-accent border-r-transparent group-hover:border-r-accent"
                variants={{
                  hover: { rotate: -180, scale: 1.05 }
                }}
                transition={{ type: "spring", stiffness: 120, damping: 12 }}
              />
              {/* Center core holding the letter "e" */}
              <div className="absolute inset-2 bg-neutral-950 dark:bg-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-95 duration-350">
                <span className="text-white dark:text-neutral-950 font-mono font-black text-sm md:text-base leading-none lowercase select-none">e</span>
              </div>
              {/* Dynamic Spark pulse dot */}
              <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-accent ring-[2px] ring-white dark:ring-black animate-ping" />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-accent ring-[2px] ring-white dark:ring-black" />
            </motion.div>
          </Link>
        </Magnetic>
      </div>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-3xl flex flex-col justify-start p-6 md:p-12 lg:p-20 overflow-y-auto"
          >
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-start space-y-8 md:space-y-12 pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-48 lg:pb-32 min-h-full text-center">
              <div className="flex flex-col gap-5 text-center">
                <NavLink to="/" label="Home" onClick={() => setIsMenuOpen(false)} />
                <NavLink to="/about" label="About" onClick={() => setIsMenuOpen(false)} />
                <NavLink to="/packages" label="Packages" onClick={() => setIsMenuOpen(false)} />
                <NavLink to="/profile" label="Profile" onClick={() => setIsMenuOpen(false)} />
                <NavLink to="/internship" label="Internship" onClick={() => setIsMenuOpen(false)} />
                <NavLink to="/contact" label="Contact" onClick={() => setIsMenuOpen(false)} />
                <NavLink to="/admin" label="Admin Login" onClick={() => setIsMenuOpen(false)} />
              </div>
              
              <div className="flex flex-col items-center gap-4 border-t border-neutral-200/50 dark:border-neutral-800/50 pt-12 w-full max-w-sm">
                <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-black dark:text-white opacity-50 leading-relaxed text-center">
                  Design Studio International // Creative Network
                </span>
                <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.2em] font-extrabold text-black dark:text-white mt-2">
                  <a href="https://www.instagram.com/official_editable?igsh=MWt6OWtvYm41bTEyZQ==" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors duration-250">Instagram</a>
                  <a href="https://wa.me/917604969891" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors duration-250">WhatsApp</a>
                  <a href="mailto:editable.freelancing@gmail.com" className="hover:text-accent transition-colors duration-250">Gmail</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="app-content px-6 md:px-12 lg:px-20 max-w-[1920px] mx-auto">
        {children}
      </main>
    </div>
  );
}

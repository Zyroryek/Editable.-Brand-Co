import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import Lenis from "lenis";
import { BackgroundWaves } from "./BackgroundWaves";
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
    <Link to={to} onClick={handleClick}>
      <motion.span
        className="text-4xl md:text-6xl font-display font-medium hover:text-accent transition-colors duration-300 pointer-events-auto"
        whileHover={{ x: 20 }}
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
        <div className="flex items-center gap-3 pointer-events-auto">
          <Magnetic>
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full glass hover:border-accent transition-all group shadow-2xl"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={16} className="md:size-[18px]" /> : <Sun size={16} className="md:size-[18px] text-accent" />}
            </button>
          </Magnetic>

          <ColorwaySwitch />
          
          <Magnetic>
            <button 
              onClick={() => {
                playNavigationSound();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="flex items-center gap-3 group focus:outline-none pl-5 pr-2 py-2 rounded-full glass border border-white/20 hover:border-accent transition-all shadow-2xl backdrop-blur-xl"
            >
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black opacity-70 group-hover:opacity-100 group-hover:text-accent transition-all">
                {isMenuOpen ? "Close" : "Menu"}
              </span>
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-accent text-white group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
                {isMenuOpen ? <X size={18} className="md:size-5" /> : <Menu size={18} className="md:size-5" />}
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
              className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-ink text-bg font-display font-black text-base md:text-lg shadow-md border border-white/10 dark:border-white/5 relative group overflow-hidden mix-blend-difference"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ rotate: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 transition-colors group-hover:text-white leading-none">e</span>
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
            className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-2xl flex flex-col items-center justify-start p-6 md:p-10 overflow-y-auto"
          >
            <div className="w-full max-w-4xl flex flex-col items-center justify-start space-y-8 md:space-y-12 py-24 md:py-32 lg:py-40 min-h-full">
            <div className="flex flex-col gap-6 text-center">
              <NavLink to="/" label="Home" onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/about" label="About" onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/packages" label="Packages" onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/profile" label="Profile" onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/internship" label="Internship" onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/contact" label="Contact" onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/admin" label="Admin Login" onClick={() => setIsMenuOpen(false)} />
            </div>
            
              <div className="flex flex-col items-center gap-4 border-t border-ink/5 pt-12 w-full max-w-xs">
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold text-center leading-relaxed">Design Studio International<br />Creative Network</span>
                <div className="flex flex-wrap gap-6 opacity-60 text-[10px] uppercase tracking-widest font-bold justify-center mt-4">
                  <a href="https://www.instagram.com/official_editable?igsh=MWt6OWtvYm41bTEyZQ==" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Instagram</a>
                  <a href="https://wa.me/917604969891" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">WhatsApp</a>
                  <a href="mailto:editable.freelancing@gmail.com" className="hover:text-accent transition-colors">Gmail</a>
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

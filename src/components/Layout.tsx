import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import Lenis from "lenis";

const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => (
  <Link to={to} onClick={onClick}>
    <motion.span
      className="text-4xl md:text-6xl font-display font-medium hover:text-accent transition-colors duration-300"
      whileHover={{ x: 20 }}
    >
      {label}
    </motion.span>
  </Link>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
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
    <div className="relative min-h-screen">
      <div className="grain" aria-hidden="true" />

      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-accent z-[100] origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Top Fixed Actions */}
      <div className="fixed top-0 right-0 z-[60] p-6 md:p-12 lg:p-16 flex items-center gap-4 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 flex items-center justify-center rounded-full glass hover:border-accent transition-all group shadow-xl"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} className="text-accent" />}
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-4 group focus:outline-none pl-6 pr-2 py-2 rounded-full glass hover:border-accent transition-all shadow-xl"
          >
            <span className="hidden sm:block text-[10px] uppercase tracking-[0.3em] font-black opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all">
              {isMenuOpen ? "Dismiss" : "Menu"}
            </span>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent text-white group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </div>
          </button>
        </div>
      </div>

      {/* Persistent Logo */}
      <div className="fixed top-0 left-0 z-50 p-6 md:p-12 lg:p-16 pointer-events-none">
        <Link to="/" className="pointer-events-auto">
          <motion.span 
            className="text-2xl font-display font-black tracking-tighter block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Editable.
          </motion.span>
        </Link>
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
            {/* Background Accent Blobs for Menu */}
            <div className="absolute top-0 -right-20 w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-20 -left-20 w-[60vw] h-[60vw] bg-accent-muted/5 rounded-full blur-[120px] -z-10" />

            <div className="flex flex-col gap-6 text-center">
              <NavLink to="/" label="Home" onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/about" label="About" onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/packages" label="Packages" onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/profile" label="Profile" onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/contact" label="Contact" onClick={() => setIsMenuOpen(false)} />
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

      <main className="relative z-10 px-6 md:px-12 lg:px-20 max-w-[1920px] mx-auto">
        {children}
      </main>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { cn } from "@/src/lib/utils";
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isClickable = target.closest('a, button, [role="button"]');
      setIsHovering(!!isClickable);
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(currentScroll / totalScroll);
    };

    lenis.on('scroll', handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      lenis.destroy();
      window.removeEventListener("mousemove", handleMouseMove);
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
    <div className="relative min-h-screen cursor-none">
      <div className="grain" aria-hidden="true" />
      
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          x: mousePos.x - 8,
          y: mousePos.y - 8,
          scale: isHovering ? 4 : 1,
          opacity: 1
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-accent rounded-full pointer-events-none z-[9998] hidden md:block"
        animate={{
          x: mousePos.x - 24,
          y: mousePos.y - 24,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 0.5
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200, mass: 1 }}
      />

      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-accent z-[100] origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-12 lg:p-16 flex justify-between items-center pointer-events-none">
        <Link to="/" className="pointer-events-auto">
          <span className="text-2xl font-display font-bold tracking-tighter">Editable.</span>
        </Link>
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full glass hover:border-accent transition-all group"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} className="text-accent" />}
          </button>
          
          <button 
            onClick={toggleMenu}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <span className="hidden sm:block text-[11px] uppercase tracking-[0.2em] font-bold opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all">
              {isMenuOpen ? "Dismiss" : "Menu"}
            </span>
            <div className="w-12 h-12 flex items-center justify-center rounded-full glass group-hover:border-accent transition-all">
              {isMenuOpen ? <X size={18} className="text-accent" /> : <Menu size={18} />}
            </div>
          </button>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-2xl flex flex-col items-center justify-center p-6 md:p-10 overflow-y-auto"
          >
            <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-8 md:space-y-12 py-20 min-h-full">
            {/* Background Accent Blobs for Menu */}
            <div className="absolute top-0 -right-20 w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-20 -left-20 w-[60vw] h-[60vw] bg-accent-muted/5 rounded-full blur-[120px] -z-10" />

            <div className="flex flex-col gap-6 text-center">
              <NavLink to="/" label="Home" onClick={toggleMenu} />
              <NavLink to="/packages" label="Packages" onClick={toggleMenu} />
              <NavLink to="/reviews" label="Reviews" onClick={toggleMenu} />
              <NavLink to="/profile" label="Profile" onClick={toggleMenu} />
              <NavLink to="/book" label="Book Now" onClick={toggleMenu} />
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

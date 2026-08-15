import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Moon, Sun, Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Lenis from "lenis";
import Magnetic from "./Magnetic";
import { playNavigationSound, getSoundEnabled, setSoundEnabled } from "../lib/audio";

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
      setTimeout(() => {
        playNavigationSound();
      }, 30);
    }
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
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
      setScrollProgress(totalScroll > 0 ? currentScroll / totalScroll : 0);
    };

    lenis.on("scroll", handleScroll);

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

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0 });
    }
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/#portfolio-section", label: "Work (17)" },
    { to: "/packages", label: "Packages" },
    { to: "/internship", label: "Internship" },
    { to: "/profile", label: "Profile" },
    { to: "/contact", label: "Contact" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <div className="relative min-h-screen bg-bg text-ink flex flex-col font-sans transition-colors duration-300">
      {/* Subtle Top Scroll Progress Line */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] z-[100] origin-left bg-accent"
        style={{ scaleX: scrollProgress }}
      />

      {/* Swiss Editorial Top Navigation Bar (Exact match to reference top) */}
      <header className="sticky top-0 z-50 w-full bg-bg/90 backdrop-blur-md border-b border-ink/10 dark:border-white/10 transition-all">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-6">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6 sm:gap-10">
            <Link
              to="/"
              onClick={playNavigationSound}
              className="font-display font-extrabold text-lg sm:text-xl tracking-tighter uppercase text-ink hover:text-accent transition-colors"
            >
              EDITABLE
            </Link>
          </div>

          {/* Right: Clean Minimal Text Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isHash = link.to.includes("#");
              const isActive = !isHash && location.pathname === link.to;

              if (isHash) {
                return (
                  <a
                    key={link.label}
                    href={link.to}
                    onClick={playNavigationSound}
                    className="text-xs font-mono uppercase tracking-wider text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={playNavigationSound}
                  className={cn(
                    "text-xs font-mono uppercase tracking-wider transition-colors relative py-1",
                    isActive
                      ? "text-ink dark:text-white font-bold"
                      : "text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Rightmost Controls (Theme, Audio, Mobile Hamburger) */}
          <div className="flex items-center gap-3">
            <Magnetic>
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-ink/10 dark:border-white/15 text-ink hover:border-accent hover:text-accent transition-all cursor-pointer"
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                <AnimatePresence mode="wait">
                  {theme === "light" ? (
                    <motion.div
                      key="light"
                      initial={{ opacity: 0, rotate: -20 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 20 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Moon size={14} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="dark"
                      initial={{ opacity: 0, rotate: -20 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 20 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Sun size={14} className="text-accent" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </Magnetic>

            <Magnetic>
              <button
                onClick={toggleSound}
                className={cn(
                  "w-8 h-8 hidden sm:flex items-center justify-center rounded-full border border-ink/10 dark:border-white/15 text-ink hover:border-accent hover:text-accent transition-all cursor-pointer",
                  !soundEnabled && "opacity-40"
                )}
                title={soundEnabled ? "Mute interactive audio" : "Enable interactive audio"}
              >
                {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              </button>
            </Magnetic>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => {
                  playNavigationSound();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-ink/10 dark:border-white/15 text-ink hover:text-accent transition-all cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-ink/10 dark:border-white/10 bg-bg px-6 py-5 space-y-3"
            >
              {navLinks.map((link) => {
                const isHash = link.to.includes("#");
                const isActive = !isHash && location.pathname === link.to;

                if (isHash) {
                  return (
                    <a
                      key={link.label}
                      href={link.to}
                      onClick={() => {
                        playNavigationSound();
                        setIsMenuOpen(false);
                      }}
                      className="block text-xs font-mono uppercase tracking-widest text-ink/70 dark:text-white/70 py-1"
                    >
                      {link.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => {
                      playNavigationSound();
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "block text-xs font-mono uppercase tracking-widest py-1 transition-colors",
                      isActive
                        ? "text-accent font-bold"
                        : "text-ink/70 dark:text-white/70 hover:text-ink dark:hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main App Content */}
      <main className="app-content flex-grow w-full">
        {children}
      </main>

      {/* Editorial Footer (Exact Match to Reference Bottom Section: "Let's Talk / Get in touch" + Watermark) */}
      <footer className="relative pt-24 pb-16 border-t border-ink/10 dark:border-white/10 overflow-hidden bg-bg">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
            {/* Left: Let's Talk / Get in touch */}
            <div className="lg:col-span-7 space-y-2">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-ink">
                Let&apos;s Talk
              </h2>
              <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-light text-ink/30 dark:text-white/30">
                Get in touch
              </p>
            </div>

            {/* Right: Contact & Follow Us Columns */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 pt-4">
              {/* CONTACT COLUMN */}
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-[0.2em] font-mono font-bold text-ink/40 dark:text-white/40 block">
                  CONTACT
                </span>
                <div className="space-y-2 text-sm text-ink/80 dark:text-white/80 font-mono">
                  <p>
                    <a
                      href="mailto:editablecreativestudio@gmail.com"
                      className="hover:text-accent transition-colors block"
                    >
                      editablecreativestudio@gmail.com
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://wa.me/917604969891"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent transition-colors block"
                    >
                      +91 76049 69891
                    </a>
                  </p>
                </div>
              </div>

              {/* FOLLOW US COLUMN */}
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-[0.2em] font-mono font-bold text-ink/40 dark:text-white/40 block">
                  FOLLOW US
                </span>
                <ul className="space-y-2 text-sm text-ink/80 dark:text-white/80 font-mono">
                  <li>
                    <a
                      href="https://x.com"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent transition-colors flex items-center gap-1 group"
                    >
                      <span>X</span>
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/official_editable?igsh=MWt6OWtvYm41bTEyZQ=="
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent transition-colors flex items-center gap-1 group"
                    >
                      <span>Instagram</span>
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent transition-colors flex items-center gap-1 group"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://behance.net"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent transition-colors flex items-center gap-1 group"
                    >
                      <span>Behance</span>
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="pt-8 border-t border-ink/10 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-ink/50 dark:text-white/40">
            <p>© {new Date().getFullYear()} Editable Studio. All rights reserved.</p>
            <p>Designed with pure precision & intent.</p>
          </div>

        </div>

        {/* Giant Hollow Watermark in Footer (Matching © MOKA in reference) */}
        <div className="w-full flex justify-center items-center pointer-events-none select-none mt-12 overflow-hidden">
          <span className="text-watermark font-display uppercase tracking-tighter whitespace-nowrap">
            © EDITABLE
          </span>
        </div>
      </footer>
    </div>
  );
}


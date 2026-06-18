import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import React, { useEffect } from "react";
import Layout from "./components/Layout";
import { BackgroundWaves } from "./components/BackgroundWaves";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Internship from "./pages/Internship";
import Admin from "./pages/Admin";
import { initGlobalSounds, playTransitionSound } from "./lib/sound";

function AnimatedRoutes() {
  const location = useLocation();

  // Play transition sound effect whenever route changes
  useEffect(() => {
    // Only play on actual path transition (skip initial loads if needed, but standard is fine)
    playTransitionSound();
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/internship" element={<Internship />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  // Initialize the sound haptics for all buttons, hovers and interactive components globally
  useEffect(() => {
    const cleanup = initGlobalSounds();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <Router>
      <BackgroundWaves />
      <Layout>
        <div className="grain" id="grain-effect" />
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

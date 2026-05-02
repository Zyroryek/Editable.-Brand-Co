import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Reviews from "./pages/Reviews";
import Packages from "./pages/Packages";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <div className="grain" id="grain-effect" />
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

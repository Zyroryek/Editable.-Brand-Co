import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Sparkles, Image as ImageIcon, Eye } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: "logo" | "poster";
  categoryLabel: string;
  image: string;
  year: string;
  studio: string;
  description: string;
}

const PROJECTS: Project[] = [
  {
    id: "solstice",
    title: "Solstice Identity",
    category: "logo",
    categoryLabel: "Logo Design",
    image: "/solstice_logo.jpg",
    year: "2024",
    studio: "Strategic Branding",
    description: "A perfect geometric sun intersected by horizon lines, celebrating elegant solar-tech minimalism."
  },
  {
    id: "echo",
    title: "ECHO Bauhaus",
    category: "poster",
    categoryLabel: "Poster Design",
    image: "/echo_poster.jpg",
    year: "2024",
    studio: "Swiss Typographic Study",
    description: "Geometric harmony and overlapping high-contrast color planes, inspired by mid-century brutalism."
  },
  {
    id: "helix",
    title: "Helix Geometric",
    category: "logo",
    categoryLabel: "Logo Design",
    image: "/helix_logo.jpg",
    year: "2024",
    studio: "Digital Artifacts",
    description: "An elegant, continuous helical spiral loop reflecting technical precision and corporate flow."
  },
  {
    id: "serene",
    title: "Serene Landscapes",
    category: "poster",
    categoryLabel: "Poster Design",
    image: "/serene_poster.jpg",
    year: "2025",
    studio: "Organic Contemporary Art",
    description: "Calming visual landscapes pairing earthy sand, sage green, and dark charcoal mineral shapes."
  }
];

interface PortfolioCardProps {
  project: Project;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl border-2 border-ink/20 dark:border-white/15 p-4 md:p-5 h-full cursor-pointer select-none transition-all duration-500 hover:border-accent shadow-xl shadow-black/10"
    >
      {/* Interactive Canvas/Image Stage */}
      <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[0.25, 1, 0.5, 1]"
          style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
            filter: "brightness(0.9)"
          }}
        />

        {/* Hover Grid overlay */}
        <div 
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6 pointer-events-none"
        >
          {/* Top Info Bar */}
          <div className="flex justify-between items-start translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-500">
            <span className="text-[9px] uppercase tracking-[0.25em] bg-bg/10 backdrop-blur-md text-bg py-1.5 px-3 rounded-full border border-bg/10 font-black">
              {project.categoryLabel}
            </span>
            <span className="text-xs font-mono text-bg/70">{project.year}</span>
          </div>

          {/* Bottom Info Bar */}
          <div className="translate-y-[10px] group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-xs text-white/80 font-light leading-relaxed mb-1">
              {project.studio}
            </p>
            <h4 className="text-xl font-display font-bold text-white uppercase tracking-tight">
              {project.title}
            </h4>
          </div>
        </div>

        {/* Cursor-Following View Badge (Desktop Only) */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute pointer-events-none w-20 h-20 rounded-full bg-accent/90 text-bg backdrop-blur-sm shadow-xl flex flex-col items-center justify-center gap-1 overflow-hidden z-20 hidden md:flex"
              style={{
                left: coords.x - 40,
                top: coords.y - 40,
                willChange: "transform"
              }}
            >
              <Eye className="w-4 h-4 text-bg" />
              <span className="text-[8px] uppercase tracking-widest font-black font-sans">
                Observe
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Static text underneath block for pristine mobile visual layout */}
      <div className="mt-5 space-y-2 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base md:text-lg font-display font-bold uppercase tracking-tight text-ink">
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-ink/30 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </div>
          <p className="text-xs text-ink/65 font-light leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>
        
        <div className="pt-3 border-t border-ink/5 mt-2 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#9333EA] dark:text-[#A855F7] font-bold">
          <span>{project.categoryLabel}</span>
          <span className="font-mono text-ink/40">{project.year}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function Portfolio() {
  const [filter, setFilter] = useState<"all" | "logo" | "poster">("all");

  const filteredProjects = PROJECTS.filter((p) => {
    if (filter === "all") return true;
    return p.category === filter;
  });

  return (
    <section id="portfolio-section" className="py-20 md:py-32 max-w-[1440px] mx-auto px-6 lg:px-20 relative overflow-hidden">
      {/* Top Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-black">Featured Direction</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-medium tracking-tight uppercase leading-none">
            Selected Work
          </h2>
        </div>

        {/* Categories Filtering Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-ink/5 border border-ink/5 rounded-full self-start md:self-auto">
          {([
            { id: "all", label: "All Cases" },
            { id: "logo", label: "Logos" },
            { id: "poster", label: "Posters" }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${
                filter === tab.id
                  ? "bg-ink text-bg shadow-md"
                  : "text-ink/60 hover:text-ink hover:bg-ink/[0.03]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <PortfolioCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

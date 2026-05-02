import { motion } from "motion/react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "CEO, TechFlow",
    content: "The brand identity overhaul exceeded all our expectations. The team really understood our vision and translated it into a visual language that speaks volumes. Highly recommended for startups looking to find their footing.",
    rating: 5,
    date: "March 2024"
  },
  {
    id: 2,
    name: "Sanya Gupta",
    role: "Founder, Bloom & Co",
    content: "Minimalist, professional, and extremely easy to work with. They took our small e-commerce brand and made it look like a high-end luxury label. The digital presence we have now is exactly what I dreamed of.",
    rating: 5,
    date: "February 2024"
  },
  {
    id: 3,
    name: "Rohan Das",
    role: "Marketing Head, Velocity Dynamics",
    content: "Speed and precision. They delivered a high-converting landing page in record time without compromising on design. The attention to detail in the UI was impressive.",
    rating: 5,
    date: "January 2024"
  },
  {
    id: 4,
    name: "Priya Nair",
    role: "Creative Director, Studio P",
    content: "As a fellow creative, I was hesitant to outsource our visual systems, but Editable delivered beyond words. Their approach to grid systems and typography is world-class.",
    rating: 5,
    date: "December 2023"
  }
];

export default function Reviews() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-40 pb-24 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-20">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs uppercase tracking-widest opacity-40 font-mono"
          >
            Social Proof
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-medium tracking-tighter"
          >
            What our clients <span className="text-accent italic">say.</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-10 flex flex-col justify-between group"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl font-light leading-relaxed text-ink/80 italic group-hover:text-ink transition-colors duration-500">
                  "{review.content}"
                </p>
              </div>

              <div className="mt-12 flex justify-between items-end border-t border-accent-muted/10 pt-8">
                <div>
                  <h3 className="font-display font-semibold text-lg text-accent">{review.name}</h3>
                  <p className="text-xs uppercase opacity-40 tracking-widest font-mono mt-1">
                    {review.role}
                  </p>
                </div>
                <span className="text-[10px] font-mono opacity-20">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="mt-32 p-20 glass flex flex-col items-center text-center gap-8 border-accent/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-display">Ready to be our next success story?</h2>
          <Link to="/book">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-ink text-bg rounded-full text-xs uppercase tracking-[0.4em] font-bold"
            >
              Book Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}

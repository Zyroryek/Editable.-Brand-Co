import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageTransition from "../components/PageTransition";
import Magnetic from "../components/Magnetic";
import TextReveal from "../components/TextReveal";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { X, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

const PACKAGES = [
  { 
    id: "bf", 
    name: "Brand Foundation", 
    price: "₹2,000 – ₹15,000", 
    bestFor: "startups, new businesses",
    desc: "We build your brand from scratch with a strong, modern identity.", 
    includes: [
      "Logo design",
      "Brand colors & typography",
      "Basic brand guidelines",
      "Social media starter kit (DP, posts)"
    ] 
  },
  { 
    id: "ui", 
    name: "UI/UX & Website", 
    price: "₹5,000 – ₹20,000", 
    bestFor: "businesses going digital",
    desc: "We design clean, user-focused digital experiences that convert.", 
    includes: [
      "UX research (basic)",
      "Wireframes",
      "UI design (Figma)",
      "Responsive layouts (mobile + desktop)",
      "Optional add-on: developer handoff"
    ] 
  },
  { 
    id: "cv", 
    name: "Content & Video", 
    price: "₹3,000 – ₹12,000", 
    bestFor: "social media growth",
    desc: "We turn your content into scroll-stopping visuals.", 
    includes: [
      "Reel/video editing",
      "Motion graphics",
      "Thumbnails / covers",
      "Content styling aligned with brand"
    ] 
  },
  { 
    id: "gc", 
    name: "Growth Combo", 
    price: "₹5,000 – ₹25,000", 
    bestFor: "serious clients",
    desc: "A complete creative system to build, launch, and grow your brand.", 
    includes: [
      "Branding + UI/UX + Content",
      "Monthly design support",
      "Ongoing video content"
    ] 
  },
  { 
    id: "mr", 
    name: "Monthly Retainer", 
    price: "Custom Monthly", 
    bestFor: "long-term clients",
    desc: "Your dedicated creative team, on demand.", 
    includes: [
      "Fixed number of design tasks",
      "Continuous video editing",
      "Priority support"
    ] 
  }
];

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    details: ""
  });

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !form.name.trim() || !form.email.trim() || !form.phone.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        businessName: form.businessName.trim() || "Independent Client",
        package: selectedPackage.name,
        details: `[Package Booking: ${selectedPackage.name}] Needs/Requirements: ${form.details.trim() || "No specific notes provided"}`
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error submitting package booking:", err);
      alert(err?.message || "Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-4 sm:pt-8 md:pt-12 pb-16 sm:pb-24 max-w-4xl mx-auto flex flex-col px-4 sm:px-6">
        <div className="mb-10 text-center">
          <div className="glass-badge mb-3 sm:mb-4 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span>Creative Solutions</span>
          </div>
          <TextReveal 
            text="Design Ecosystem."
            className="text-3xl sm:text-5xl md:text-7xl font-display font-medium tracking-tighter mb-2 sm:mb-4 uppercase text-gradient-alt"
          />
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-sm md:text-base font-light opacity-60 max-w-xl mx-auto uppercase tracking-widest font-mono"
          >
            Explore our tailored creative solutions. Select any ecosystem below to submit your project needs directly to our studio database.
          </motion.p>
        </div>

        {/* TOP BOOKING TILE (Appears when customer clicks Book This Ecosystem) */}
        <AnimatePresence>
          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden mb-12"
            >
              <div className="glass-panel p-6 sm:p-10 border-accent/40 shadow-2xl relative bg-ink/[0.03] dark:bg-white/[0.03]">
                <button
                  onClick={() => {
                    setSelectedPackage(null);
                    setIsSuccess(false);
                  }}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-ink/5 dark:bg-white/5 border border-ink/10 dark:border-white/10 flex items-center justify-center text-ink/70 hover:text-ink dark:hover:text-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>

                {isSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-display font-bold">Booking Request Received!</h3>
                    <p className="text-xs font-mono uppercase tracking-widest opacity-70 max-w-md mx-auto">
                      We have logged your request for <span className="text-accent font-bold">{selectedPackage.name}</span> in our secure database. Our team will review your needs and contact you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setSelectedPackage(null);
                      }}
                      className="px-6 py-3 bg-ink text-white dark:bg-white dark:text-ink text-xs font-mono uppercase tracking-widest font-bold rounded-xl cursor-pointer mt-4"
                    >
                      Close & Explore More
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookSubmit} className="space-y-6">
                    <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-widest font-bold">
                      <Sparkles size={14} />
                      <span>Booking Ecosystem: {selectedPackage.name} ({selectedPackage.price})</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-60 block mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Taylor"
                          className="w-full glass-input text-sm px-4 py-3 rounded-xl"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-60 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="alex@example.com"
                          className="w-full glass-input text-sm px-4 py-3 rounded-xl"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-60 block mb-1">Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          className="w-full glass-input text-sm px-4 py-3 rounded-xl"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-60 block mb-1">Company / Brand Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Studio Vertex"
                          className="w-full glass-input text-sm px-4 py-3 rounded-xl"
                          value={form.businessName}
                          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest opacity-60 block mb-1">Your Project Needs & Goals</label>
                      <textarea
                        rows={3}
                        placeholder="Describe your vision, specific requirements, timeline or goals..."
                        className="w-full glass-input text-sm p-4 rounded-xl resize-none"
                        value={form.details}
                        onChange={(e) => setForm({ ...form, details: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPackage(null)}
                        className="px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider border border-ink/10 dark:border-white/10 hover:border-ink/30 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-accent to-accent-alt text-white rounded-xl text-xs font-mono uppercase tracking-widest font-bold cursor-pointer shadow-lg shadow-accent/20 disabled:opacity-50"
                      >
                        {isSubmitting ? "Storing in Database..." : "Confirm & Save to Admin Portal →"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OFFERINGS MENU: Centered Tiles Stacked One by One */}
        <div className="space-y-6">
          {PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-panel p-6 sm:p-8 md:p-10 space-y-6 relative overflow-hidden group hover:border-accent/40 transition-all duration-500 shadow-xl"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/10 transition-all" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink/10 pb-6 relative z-10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 block mb-1">Offer #{index + 1} • {pkg.bestFor}</span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink dark:text-white group-hover:text-accent transition-colors">{pkg.name}</h3>
                </div>
                <div className="text-right md:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 block">Investment</span>
                  <span className="text-xl sm:text-2xl font-display font-black text-accent">{pkg.price}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest opacity-50 font-bold">Purpose</h4>
                  <p className="text-sm sm:text-base font-light text-ink/80 leading-relaxed">
                    {pkg.desc}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest opacity-50 font-bold">What's Included</h4>
                  <ul className="space-y-1.5">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs uppercase font-medium text-ink/70">
                        <span className="text-accent">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 flex justify-center relative z-10 border-t border-ink/5">
                <div className="w-full">
                  <motion.button
                    onClick={() => {
                      setSelectedPackage(pkg);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 bg-gradient-to-r from-accent to-accent-alt text-white rounded-full text-xs font-mono uppercase tracking-[0.25em] font-bold transition-all shadow-md shadow-accent/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Book This Ecosystem</span>
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

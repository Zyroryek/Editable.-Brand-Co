import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { ArrowUpRight, Sparkles, ArrowRight, Check, Info, ShieldCheck, Clock, Globe } from "lucide-react";
import Portfolio from "../components/Portfolio";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

import heroDeskWorkspace from "../assets/images/hero_desk_workspace_1786799868803.jpg";

const PACKAGES = [
  { 
    id: "bf", 
    num: "01",
    name: "Brand Foundation", 
    price: "₹2,000 – ₹15,000", 
    desc: "We build your brand from scratch with a strong, modern identity that stands the test of time.", 
    includes: ["Logo design & guidelines", "Brand colors & typography", "Vector asset suite", "Social media kit"] 
  },
  { 
    id: "ui", 
    num: "02",
    name: "UI/UX & Website", 
    price: "₹5,000 – ₹20,000", 
    desc: "We design clean, high-performance digital experiences and bespoke websites that convert visitors.", 
    includes: ["UX research & wireframes", "Figma design system", "Responsive development", "SEO & Speed optimization"] 
  },
  { 
    id: "cv", 
    num: "03",
    name: "Content & Video", 
    price: "₹3,000 – ₹12,000", 
    desc: "We turn your content into scroll-stopping visuals, reels, and commercial motion graphics.", 
    includes: ["Reel & Short video editing", "Motion graphics & VFX", "High-CTR Thumbnails", "Audio mastering"] 
  },
  { 
    id: "gc", 
    num: "04",
    name: "Growth Combo", 
    price: "₹5,000 – ₹25,000", 
    desc: "A complete creative system to build, launch, and scale your brand across all digital touchpoints.", 
    includes: ["Full Brand Identity", "Custom Website Build", "10x Video Deliverables", "Launch Strategy"] 
  },
  { 
    id: "mr", 
    num: "05",
    name: "Monthly Retainer", 
    price: "Custom Monthly", 
    desc: "Your dedicated full-stack creative studio team on demand with guaranteed turnaround times.", 
    includes: ["Unlimited task requests", "Continuous design & dev", "Priority 24/7 Slack comms", "Flexible bandwidth"] 
  }
];

export default function Home() {
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [claimedCount, setClaimedCount] = useState<number>(0);
  const totalSlots = 15;
  const remainingSlots = Math.max(0, totalSlots - claimedCount);
  const nextAvailableSlot = Math.min(totalSlots, claimedCount + 1);
  const [selectedSlotNumber, setSelectedSlotNumber] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    projectType: "New Business / Startup Website",
    details: ""
  });

  // Sync claimed count from Firestore
  useEffect(() => {
    const syncClaims = async () => {
      try {
        const q = query(
          collection(db, "inquiries"),
          where("isIndependenceOffer", "==", true)
        );
        const snapshot = await getDocs(q);
        const validDocs = snapshot.docs.filter(d => !d.data().isDeleted);
        const count = validDocs.length;
        setClaimedCount(Math.min(totalSlots, count));
        setSelectedSlotNumber(Math.min(totalSlots, count + 1));
      } catch {
        setClaimedCount(0);
      }
    };
    syncClaims();
  }, []);

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    try {
      const assignedSlot = selectedSlotNumber || nextAvailableSlot;
      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        businessName: formData.businessName.trim() || "Independent Business",
        package: "Independence Day Free Website Offer (Aug 15 - Aug 30)",
        details: `[Independence Day Free Offer - Slot #${assignedSlot}] Type: ${formData.projectType}. Goal: ${formData.details.trim() || "Free website creation under Independence Day initiative"}`,
        status: "pending",
        isIndependenceOffer: true,
        slotNumber: assignedSlot,
        projectType: formData.projectType,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "inquiries"), payload);
      setClaimedCount(prev => Math.min(totalSlots, prev + 1));
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error submitting claim:", err);
      handleFirestoreError(err, OperationType.WRITE, "inquiries");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative w-full">

        {/* 1. TOP SPECIAL OFFER NOTICE BAR (Aug 15 - Aug 30 Independence Day Free Website Offer) */}
        <div className="w-full bg-gradient-to-r from-[#FF9933] via-amber-500/10 to-[#138808] text-slate-900 dark:text-white px-4 sm:px-6 py-3 border-b border-amber-500/30 shadow-sm">
          <div className="max-w-[1440px] mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#000080] dark:bg-amber-400 animate-ping shrink-0" />
              <span className="font-mono font-bold tracking-wider uppercase text-[10px] sm:text-[11px] drop-shadow-xs">
                🇮🇳 Independence Special (Aug 15 – Aug 30): 100% Free Website Build ({remainingSlots} of 15 Slots Left)
              </span>
            </div>
            <button
              onClick={() => setIsOfferModalOpen(true)}
              className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#000080] dark:text-amber-400 font-mono font-extrabold flex items-center gap-1.5 cursor-pointer bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black px-3.5 py-1.5 rounded-full shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <span>CLAIM FREE SLOT #{nextAvailableSlot} (₹0)</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* 2. HERO SECTION */}
        <section className="pt-10 sm:pt-16 md:pt-20 pb-16 md:pb-24 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Sub-Notice line for desktop matching screenshot 2 */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-ink/80 dark:text-white/80 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
            <span className="font-semibold">INDEPENDENCE SPECIAL (AUG 15 – AUG 30): 100% FREE WEBSITE BUILD ({remainingSlots} OF 15 SLOTS LEFT)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Column: Massive Stacked Bold Typography */}
            <div className="md:col-span-6 lg:col-span-6 space-y-6 md:space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-6xl lg:text-[4.6vw] font-display font-black tracking-[-0.03em] text-ink leading-[0.98] uppercase"
              >
                CRAFTING<br />
                BOLD<br />
                BRANDS <span className="text-accent font-sans font-normal">&amp;</span><br />
                DIGITAL<br />
                EXPERIENCES.
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 max-w-xl lg:max-w-2xl"
              >
                <p className="text-base sm:text-lg md:text-xl text-ink/70 dark:text-white/70 font-normal leading-relaxed">
                  We turn ambitious ideas into iconic brand identities, bespoke websites, and digital experiences that convert.
                </p>

                {/* Pill Action Buttons Row - Single line on desktop */}
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 sm:gap-3 pt-2">
                  <Link
                    to="/packages"
                    className="px-5 sm:px-6 py-3.5 bg-ink text-white dark:bg-accent dark:text-white text-xs font-mono uppercase tracking-[0.14em] sm:tracking-[0.16em] font-bold rounded-full hover:bg-accent hover:text-white dark:hover:opacity-90 transition-all shadow-md flex items-center gap-2 cursor-pointer group whitespace-nowrap"
                  >
                    <span>EXPLORE PACKAGES</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    to="/contact"
                    className="px-5 sm:px-6 py-3.5 border border-ink/30 dark:border-white/30 text-ink dark:text-white text-xs font-mono uppercase tracking-[0.14em] sm:tracking-[0.16em] font-bold rounded-full hover:bg-ink/5 dark:hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer group whitespace-nowrap"
                  >
                    <span>GET IN TOUCH</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <button
                    onClick={() => setIsOfferModalOpen(true)}
                    className="px-5 sm:px-6 py-3.5 bg-amber-500/10 dark:bg-white/10 border border-amber-500/30 dark:border-white/20 text-accent dark:text-amber-400 text-xs font-mono uppercase tracking-[0.14em] sm:tracking-[0.16em] font-bold rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Sparkles size={14} className="text-accent animate-pulse" />
                    <span>FREE OFFER (₹0)</span>
                  </button>
                </div>

              </motion.div>
            </div>

            {/* Right Hero Column: High Quality Desk Laptop Workspace Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-6 lg:col-span-6 w-full flex justify-center md:justify-end"
            >
              <div className="relative w-full max-w-xl md:max-w-none overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl border border-ink/10 dark:border-white/10 group">
                <img
                  src={heroDeskWorkspace}
                  onError={(e) => {
                    // Fallback to high resolution desk mockup URL if local bundle asset path ever varies
                    const target = e.currentTarget;
                    if (!target.src.includes("unsplash")) {
                      target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";
                    }
                  }}
                  alt="Editable Creative Studio - Laptop Desk Workspace"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                
                {/* Overlay Studio Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-bg/90 dark:bg-black/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-ink/10 dark:border-white/10 flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-ink dark:text-white shadow-md">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    BRAND STRATEGY &amp; DIGITAL DESIGN
                  </span>
                  <span className="text-accent font-bold">EDITABLE STUDIO</span>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* 3. SELECTED WORK SECTION (MATCHING BOTTOM-LEFT OF REFERENCE IMAGE "(17) Selected Work") */}
        <Portfolio />

        {/* 4. PACKAGES & SERVICES LIST (Editorial Minimalist Architecture) */}
        <section id="packages-section" className="py-24 md:py-32 border-t border-ink/10 dark:border-white/10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-ink/40 dark:text-white/40 block">
                [ 05 PACKAGES AVAILABLE ]
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight uppercase text-ink">
                Our Services &amp; Packages
              </h2>
            </div>
            <Link
              to="/packages"
              className="text-xs font-mono uppercase tracking-widest text-accent hover:underline font-bold flex items-center gap-1.5"
            >
              <span>View Full Packages Guide</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="p-8 border border-ink/10 dark:border-white/10 rounded-2xl flex flex-col justify-between hover:border-accent transition-all duration-300 group bg-surface/50 dark:bg-surface/20"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-bold text-ink/40 dark:text-white/40">
                      {pkg.num}
                    </span>
                    <span className="text-xs font-mono font-bold px-3 py-1 bg-ink/5 dark:bg-white/5 rounded-full text-accent border border-ink/10 dark:border-white/10">
                      {pkg.price}
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-bold uppercase text-ink group-hover:text-accent transition-colors">
                    {pkg.name}
                  </h3>

                  <p className="text-xs text-ink/60 dark:text-white/60 font-light leading-relaxed">
                    {pkg.desc}
                  </p>

                  <ul className="space-y-2 pt-3 border-t border-ink/5 dark:border-white/5">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className="text-xs text-ink/70 dark:text-white/70 flex items-center gap-2 font-mono">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6 border-t border-ink/10 dark:border-white/10 flex items-center justify-between">
                  <Link
                    to={`/booking?pkg=${pkg.id}`}
                    className="text-xs font-mono font-bold uppercase tracking-widest text-ink hover:text-accent flex items-center gap-1.5 group-hover:translate-x-1 transition-all"
                  >
                    <span>Book Package</span>
                    <ArrowUpRight size={14} />
                  </Link>

                  <Link
                    to="/packages"
                    className="text-[11px] font-mono uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* 5. EDITORIAL STATEMENT */}
        <section className="py-24 md:py-36 border-t border-ink/10 dark:border-white/10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-ink/40 dark:text-white/40 mb-8">
            STUDIO PHILOSOPHY
          </p>
          <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-medium max-w-5xl mx-auto leading-tight tracking-tight text-ink">
            &ldquo;We create digital artifacts that resonate. No templates. No noise. Just pure intent.&rdquo;
          </h3>
        </section>

        {/* 6. WHY US — MINIMALIST SWISS NUMBERED GRID */}
        <section className="py-20 md:py-28 border-t border-ink/10 dark:border-white/10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest block">
                01 / PRECISION
              </span>
              <h4 className="text-2xl font-display font-bold uppercase text-ink">
                Strategic Minimalism
              </h4>
              <p className="text-xs text-ink/60 dark:text-white/60 font-light leading-relaxed">
                We strip away unnecessary decoration to find the sharpest core essence of your brand. Purposeful aesthetics that command instant respect.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest block">
                02 / IMPACT
              </span>
              <h4 className="text-2xl font-display font-bold uppercase text-ink">
                Visceral Conversion
              </h4>
              <p className="text-xs text-ink/60 dark:text-white/60 font-light leading-relaxed">
                Every layout, animation, and typography decision is engineered to capture buyer attention and drive tangible business revenue.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest block">
                03 / VELOCITY
              </span>
              <h4 className="text-2xl font-display font-bold uppercase text-ink">
                Rapid Deployment
              </h4>
              <p className="text-xs text-ink/60 dark:text-white/60 font-light leading-relaxed">
                Agile sprints and seamless delivery. We turn briefs into production-ready web platforms and brand suites in record time.
              </p>
            </div>

          </div>
        </section>

        {/* 7. INDEPENDENCE DAY OFFER MODAL (Positioned at the Top) */}
        <AnimatePresence>
          {isOfferModalOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-6 sm:pt-10 md:pt-14 bg-black/75 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -24 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-lg bg-bg border border-ink/15 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden mb-12 max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => {
                    setIsOfferModalOpen(false);
                    setIsSuccess(false);
                  }}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-ink/5 dark:bg-white/5 border border-ink/10 dark:border-white/10 flex items-center justify-center text-ink/60 hover:text-ink transition-all cursor-pointer"
                  title="Close modal"
                >
                  ✕
                </button>

                {!isSuccess ? (
                  <div className="space-y-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-emerald-500/20">
                        <span>Slot #{selectedSlotNumber} of 15 • 100% Free (₹0)</span>
                      </div>
                      <h3 className="text-2xl font-display font-bold text-ink uppercase tracking-tight">
                        Independence Day Free Website
                      </h3>
                      <p className="text-xs text-ink/60 dark:text-white/60 font-light mt-1">
                        Valid Aug 15 – Aug 30, 2026 for the first 15 businesses. ₹0 design &amp; development fee.
                      </p>
                    </div>

                    <form onSubmit={handleSubmitClaim} className="space-y-3.5">
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-ink/60 dark:text-white/60 block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="glass-input w-full text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-ink/60 dark:text-white/60 block mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="you@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="glass-input w-full text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-ink/60 dark:text-white/60 block mb-1">
                            WhatsApp / Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="glass-input w-full text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-ink/60 dark:text-white/60 block mb-1">
                          Business / Brand Name
                        </label>
                        <input
                          type="text"
                          placeholder="Brand Name"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="glass-input w-full text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-ink/60 dark:text-white/60 block mb-1">
                          Website Type &amp; Goals
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Tell us what you want to build."
                          value={formData.details}
                          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                          className="glass-input w-full text-sm resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.fullName || !formData.email || !formData.phone}
                        className="w-full py-3.5 bg-accent hover:opacity-90 text-white rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        {isSubmitting ? (
                          <span>Reserving Slot #{selectedSlotNumber}...</span>
                        ) : (
                          <>
                            <Check size={14} />
                            <span>Confirm Slot #{selectedSlotNumber} Reservation (₹0)</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                      <Check size={24} />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-ink uppercase">
                      Slot #{selectedSlotNumber} Reserved!
                    </h3>
                    <p className="text-xs text-ink/60 dark:text-white/60 leading-relaxed">
                      Thank you, <strong>{formData.fullName}</strong>. We've registered your free website claim. Our director will contact you via WhatsApp / Email shortly.
                    </p>
                    <button
                      onClick={() => {
                        setIsOfferModalOpen(false);
                        setIsSuccess(false);
                      }}
                      className="px-6 py-2 bg-ink/10 dark:bg-white/10 text-ink dark:text-white rounded-xl text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}


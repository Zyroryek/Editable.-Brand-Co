import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { 
  ArrowDown, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Send,
  RotateCcw,
  Check,
  Info,
  ShieldCheck,
  Clock,
  Globe,
  Zap
} from "lucide-react";

interface IndependenceHeroProps {
  onScrollToStudioHero?: () => void;
}

export default function IndependenceHero({ onScrollToStudioHero }: IndependenceHeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"claim" | "details">("claim");
  
  // Total quota of free websites
  const totalSlots = 15;
  // Baseline claimed slots = 0, dynamic additional claims from database
  const [claimedCount, setClaimedCount] = useState<number>(0);
  const remainingSlots = Math.max(0, totalSlots - claimedCount);
  const nextAvailableSlot = Math.min(totalSlots, claimedCount + 1);
  const [selectedSlotNumber, setSelectedSlotNumber] = useState<number>(1);

  // Animated Intro State
  const [introStep, setIntroStep] = useState<number>(0); 

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    projectType: "New Business / Startup Website",
    details: ""
  });

  // Real-time Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  // Synchronize claimed slots with Firestore on mount starting strictly from 0
  const syncClaimCount = async () => {
    try {
      const q = query(
        collection(db, "inquiries"),
        where("isIndependenceOffer", "==", true)
      );
      const snapshot = await getDocs(q);
      // Only count non-deleted claims
      const validDocs = snapshot.docs.filter(d => !d.data().isDeleted);
      const dbClaimsCount = validDocs.length;
      
      const updatedTotal = Math.min(totalSlots, dbClaimsCount);
      setClaimedCount(updatedTotal);
      setSelectedSlotNumber(Math.min(totalSlots, updatedTotal + 1));
    } catch {
      // Fallback to 0 claimed
      setClaimedCount(0);
      setSelectedSlotNumber(1);
    }
  };

  useEffect(() => {
    syncClaimCount();
  }, []);

  // Trigger intro progression smoothly
  useEffect(() => {
    const t1 = setTimeout(() => setIntroStep(1), 200);
    const t2 = setTimeout(() => setIntroStep(2), 650);
    const t3 = setTimeout(() => setIntroStep(3), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const replayIntro = () => {
    setIntroStep(0);
    setTimeout(() => setIntroStep(1), 200);
    setTimeout(() => setIntroStep(2), 650);
    setTimeout(() => setIntroStep(3), 1200);
  };

  // Active Real-Time Countdown targeting August 30, 2026 at 23:59:59 (or August 30 of current year)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Target: August 30, 2026 23:59:59
      let targetYear = now.getFullYear();
      let targetDate = new Date(targetYear, 7, 30, 23, 59, 59, 999).getTime(); // Note: Month 7 is August

      // If already past August 30 of current year, fallback to 2026 target
      if (targetDate < now.getTime()) {
        targetDate = new Date(2026, 7, 30, 23, 59, 59, 999).getTime();
      }

      const difference = targetDate - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenClaim = (slot?: number) => {
    if (slot && slot > claimedCount) {
      setSelectedSlotNumber(slot);
    } else {
      setSelectedSlotNumber(nextAvailableSlot);
    }
    setActiveTab("claim");
    setIsModalOpen(true);
  };

  const handleOpenDetails = (slot?: number) => {
    if (slot && slot > claimedCount) {
      setSelectedSlotNumber(slot);
    }
    setActiveTab("details");
    setIsModalOpen(true);
  };

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

      // Increment local count and sync state
      setClaimedCount(prev => Math.min(totalSlots, prev + 1));
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error submitting claim:", err);
      handleFirestoreError(err, OperationType.WRITE, "inquiries");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToNextHero = () => {
    if (onScrollToStudioHero) {
      onScrollToStudioHero();
    } else {
      const el = document.getElementById("studio-hero");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const titleLetters = "INDEPENDENCE".split("");

  return (
    <section 
      id="independence-offer-hero"
      className="relative min-h-[92vh] md:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-transparent text-[#0F172A] dark:text-slate-100 select-none transition-colors"
    >
      {/* Full-Covered Atmospheric Ambient Background Glow Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Saffron Aura (Top Right) */}
        <div className="absolute -top-[10%] -right-[10%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full bg-[#FF9933]/20 dark:bg-[#FF9933]/15 blur-[100px] md:blur-[140px] transform rotate-12" />
        
        {/* Emerald Green Aura (Bottom Left) */}
        <div className="absolute -bottom-[10%] -left-[10%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full bg-[#138808]/20 dark:bg-[#138808]/15 blur-[100px] md:blur-[140px]" />
        
        {/* Center Rose / Cyan Sparkle Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full bg-[#E11D48]/10 dark:bg-[#38bdf8]/10 blur-[100px]" />
      </div>

      {/* Intro Animation Layer: Flying Tri-Color Sparkles & Ribbon Beams */}
      <AnimatePresence>
        {introStep < 3 && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0.8] }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF9933] to-transparent top-1/3 blur-[1px]"
            />
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0.8] }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#138808] to-transparent bottom-1/3 blur-[1px]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Glass Pill Bar - Perfectly Aligned for Mobile, Tablet, Desktop */}
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-2 flex flex-wrap items-center justify-between gap-2 z-20">
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping shrink-0" />
          <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#0F172A] dark:text-slate-200 whitespace-nowrap">
            Aug 15 – Aug 30 Special
          </span>
        </motion.div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={() => handleOpenDetails()}
            className="text-[9px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-[#E11D48] dark:hover:text-[#FB7185] flex items-center gap-1.5 transition-all cursor-pointer bg-white/65 dark:bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/80 dark:border-white/15 shadow-sm hover:scale-105 active:scale-95"
          >
            <Info size={11} className="text-[#E11D48]" />
            <span className="whitespace-nowrap font-bold">Offer Details</span>
          </button>

          <button
            onClick={replayIntro}
            title="Replay intro animation"
            className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-all cursor-pointer px-2 py-1 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-lg border border-white/40 dark:border-white/10"
          >
            <RotateCcw size={10} />
            <span className="hidden sm:inline">Replay</span>
          </button>

          <button
            onClick={scrollToNextHero}
            className="group inline-flex items-center gap-1.5 text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[#0F172A]/80 dark:text-slate-300 hover:text-[#E11D48] dark:hover:text-[#FB7185] transition-all cursor-pointer px-3 py-1.5 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-lg border border-white/40 dark:border-white/10 hover:border-accent/40"
          >
            <span className="whitespace-nowrap font-bold">Studio Hero</span>
            <ArrowDown size={11} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Poster Section: Guaranteed Full Visibility of INDEPENDENCE on 1 Line */}
      <div className="relative w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8 text-center my-auto z-10 overflow-visible flex flex-col items-center">
        
        {/* Artistic Watercolor Brush Stroke Layer Behind Title */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: introStep >= 1 ? 0.75 : 0, scale: introStep >= 1 ? 1 : 0.9 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl h-[130px] sm:h-[200px] pointer-events-none -z-10 dark:opacity-20 flex items-center justify-center"
        >
          <svg viewBox="0 0 800 240" className="w-full h-full filter blur-[1px] transform -rotate-1">
            <defs>
              <linearGradient id="brushGradSafe" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9933" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#138808" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            <path 
              d="M 40,85 C 110,45 250,65 390,50 C 530,35 670,60 750,85 C 775,100 770,145 740,175 C 690,210 550,195 400,205 C 250,215 110,195 50,165 C 10,135 15,100 40,85 Z" 
              fill="url(#brushGradSafe)" 
            />
          </svg>
        </motion.div>

        {/* Eyebrow Glass Badge with Animated Reveal */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: introStep >= 1 ? 1 : 0, y: introStep >= 1 ? 0 : -6 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-badge mb-2 sm:mb-3 text-[#0F172A] dark:text-slate-200"
        >
          <Sparkles size={11} className="text-[#FF9933]" />
          <span>Special Independence Day Offer</span>
        </motion.div>

        {/* 100% Fully Visible Single-Line INDEPENDENCE Title with Fluid Scaling */}
        <div className="w-full py-0.5 sm:py-1 mb-3 sm:mb-5 flex justify-center items-center overflow-visible">
          <motion.h1 
            className="w-full text-center flex items-center justify-center whitespace-nowrap text-[6.5vw] sm:text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-[0.01em] sm:tracking-[0.03em] uppercase text-[#0B1528] dark:text-white leading-none drop-shadow-sm select-none px-1 overflow-visible"
          >
            {titleLetters.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 25, rotateX: -30 }}
                animate={{ 
                  opacity: introStep >= 2 ? 1 : 0, 
                  y: introStep >= 2 ? 0 : 25,
                  rotateX: introStep >= 2 ? 0 : -30
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: introStep >= 2 ? index * 0.035 : 0,
                  ease: [0.215, 0.61, 0.355, 1] 
                }}
                className="inline-block transform origin-bottom hover:text-[#E11D48] transition-colors"
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Central Action Buttons with Glassmorphism Depth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ 
            opacity: introStep >= 3 ? 1 : 0, 
            scale: introStep >= 3 ? 1 : 0.92, 
            y: introStep >= 3 ? 0 : 10 
          }}
          transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 mb-3 sm:mb-4 w-full max-w-xs sm:max-w-none"
        >
          <button
            onClick={() => handleOpenClaim(nextAvailableSlot)}
            className="w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#E11D48] to-[#be123c] text-white rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider uppercase transition-all shadow-xl shadow-rose-500/25 hover:shadow-2xl hover:shadow-rose-500/35 flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 min-h-[44px] border border-white/20"
          >
            <span>Claim Free Website (Slot #{nextAvailableSlot})</span>
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight size={10} className="text-white" />
            </div>
          </button>

          <button
            onClick={() => handleOpenDetails()}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 hover:border-accent/40 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] hover:scale-102 active:scale-98"
          >
            <Info size={13} className="text-accent" />
            <span className="font-bold">View Offer Details</span>
          </button>
        </motion.div>

        {/* Spaced Subtitle Below Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: introStep >= 3 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[9px] sm:text-xs font-mono tracking-[0.1em] sm:tracking-[0.18em] uppercase text-[#475569] dark:text-slate-300 font-bold px-3 py-1 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10"
        >
          Free Websites For The First 15 Customers • ₹0 Cost • {remainingSlots} Slots Left
        </motion.div>
      </div>

      {/* Bottom Floating Glass Card Container with Live Active Running Countdown */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: introStep >= 3 ? 1 : 0, y: introStep >= 3 ? 0 : 25 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pb-6 mt-auto"
      >
        <div className="glass-panel p-4 sm:p-6 md:p-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
            
            {/* Header Text Above Countdown */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <h3 className="text-[10px] sm:text-xs font-mono font-black tracking-[0.18em] sm:tracking-[0.25em] text-[#0F172A] dark:text-white uppercase">
                  The Free Website Initiative Ends In
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs font-mono text-[#64748B] dark:text-slate-300">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{remainingSlots} of {totalSlots} Slots Available</span> ({claimedCount} Claimed) • Valid Aug 15 to Aug 30, 2026
              </p>
            </div>

            {/* 4 Glassmorphism Running Countdown Squares (Ticking Live Every Second) */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 font-mono max-w-[320px] sm:max-w-md mx-auto">
              
              {/* Days Box */}
              <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-2xl py-2 sm:py-3 px-1.5 text-center shadow-md">
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white tabular-nums leading-tight font-display">
                  {String(timeLeft.days).padStart(2, "0")}
                </div>
                <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[#64748B] dark:text-slate-400 font-bold mt-1">
                  Days
                </div>
              </div>

              {/* Hours Box */}
              <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-2xl py-2 sm:py-3 px-1.5 text-center shadow-md">
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white tabular-nums leading-tight font-display">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[#64748B] dark:text-slate-400 font-bold mt-1">
                  Hours
                </div>
              </div>

              {/* Minutes Box */}
              <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-2xl py-2 sm:py-3 px-1.5 text-center shadow-md">
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white tabular-nums leading-tight font-display">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[#64748B] dark:text-slate-400 font-bold mt-1">
                  Minutes
                </div>
              </div>

              {/* Seconds Box - Live Highlight with Ticking Glow */}
              <div className="bg-rose-500/10 dark:bg-rose-950/40 backdrop-blur-xl border border-rose-500/30 dark:border-rose-500/40 rounded-2xl py-2 sm:py-3 px-1.5 text-center shadow-lg shadow-rose-500/10">
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#E11D48] dark:text-[#FB7185] tabular-nums leading-tight font-display">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[#E11D48] dark:text-[#FB7185] font-bold mt-1">
                  Seconds
                </div>
              </div>

            </div>

            {/* Quick 15 Slot Indicator Row (Dynamic Claim State in Glass Pills) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-xl mx-auto pt-1">
              {Array.from({ length: totalSlots }).map((_, i) => {
                const slotNum = i + 1;
                const isClaimed = slotNum <= claimedCount;
                const isCurrent = slotNum === nextAvailableSlot;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (!isClaimed) {
                        handleOpenClaim(slotNum);
                      } else {
                        handleOpenDetails(slotNum);
                      }
                    }}
                    className={`text-[9px] sm:text-[10px] font-mono px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl transition-all cursor-pointer min-h-[26px] sm:min-h-[30px] font-bold backdrop-blur-md ${
                      isClaimed 
                        ? "bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-slate-300/40 dark:border-slate-700/40" 
                        : isCurrent
                        ? "bg-[#E11D48]/20 text-[#E11D48] border border-[#E11D48]/50 shadow-md shadow-rose-500/15 hover:bg-[#E11D48] hover:text-white"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
                    }`}
                    title={isClaimed ? `Slot #${slotNum} Claimed (Click to view details)` : `Slot #${slotNum} Available! Click to reserve`}
                  >
                    #{slotNum} {isClaimed ? "✓" : isCurrent ? "Next" : "Free"}
                  </button>
                );
              })}
            </div>

            {/* Jump Link to Studio Showcase */}
            <div className="pt-1">
              <button
                onClick={scrollToNextHero}
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold tracking-wider text-[#64748B] dark:text-slate-300 hover:text-accent dark:hover:text-accent transition-colors cursor-pointer py-1"
              >
                <span>Explore Editable Studio Core</span>
                <ArrowDown size={11} />
              </button>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Comprehensive Details & Claim Modal (Positioned at the Top of Hero Page 1) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-6 sm:pt-10 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-white/90 dark:bg-[#0c101d]/90 backdrop-blur-2xl rounded-3xl border border-white/80 dark:border-white/15 p-5 sm:p-8 shadow-2xl overflow-hidden text-left mb-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsSuccess(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ink/5 dark:bg-white/5 border border-ink/10 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                title="Close modal"
              >
                <X size={16} />
              </button>

              {/* Top Mode Selector Tabs: Claim vs Offer Details Tile */}
              {!isSuccess && (
                <div className="flex items-center gap-2 mb-6 border-b border-ink/10 dark:border-white/10 pb-3 pr-8 flex-wrap">
                  <button
                    onClick={() => setActiveTab("claim")}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      activeTab === "claim"
                        ? "bg-[#E11D48] text-white shadow-md shadow-rose-500/25"
                        : "bg-ink/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    <span>Claim Slot #{selectedSlotNumber} (₹0)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("details")}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "details"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                        : "bg-ink/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    <Info size={12} />
                    <span>Offer Details & Scope</span>
                  </button>
                </div>
              )}

              {!isSuccess ? (
                activeTab === "claim" ? (
                  /* TAB 1: Quick Reservation Form */
                  <div className="space-y-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-emerald-500/20 backdrop-blur-md">
                        <span>Reserving Slot #{selectedSlotNumber} of 15 • 100% Free (₹0)</span>
                      </div>
                      <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Claim Free Website Build
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1">
                        Reserve your spot under our Independence Day initiative (valid Aug 15 – Aug 30, 2026).
                      </p>
                    </div>

                    <form onSubmit={handleSubmitClaim} className="space-y-3.5">
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Rivera"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="glass-input w-full text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="alex@brand.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="glass-input w-full text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                            Phone / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 / +1 Contact Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="glass-input w-full text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                            Brand / Business Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Zenith Apparel"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            className="glass-input w-full text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                            Project Type
                          </label>
                          <select
                            value={formData.projectType}
                            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                            className="glass-input w-full text-sm"
                          >
                            <option value="New Business / Startup Website">New Business / Startup Website</option>
                            <option value="Personal Portfolio / Creative Website">Personal Portfolio / Creative Website</option>
                            <option value="E-Commerce / Online Store">E-Commerce / Online Store</option>
                            <option value="Corporate / Agency Redesign">Corporate / Agency Redesign</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                          Project Brief & Goals
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Tell us what your business does and what type of website you envision."
                          value={formData.details}
                          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                          className="glass-input w-full text-sm resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.fullName || !formData.email || !formData.phone}
                        className="w-full py-3.5 bg-gradient-to-r from-[#E11D48] to-[#be123c] hover:opacity-90 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg shadow-rose-500/25 min-h-[44px]"
                      >
                        {isSubmitting ? (
                          <span>Reserving Slot #{selectedSlotNumber} in Database...</span>
                        ) : (
                          <>
                            <Send size={13} />
                            <span>Confirm Reservation for Slot #{selectedSlotNumber} (₹0)</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  /* TAB 2: Independence Offer Details Tile */
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48]">
                        Independence Day Special Initiative
                      </span>
                      <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white mt-0.5 uppercase tracking-tight">
                        Free Website Offer Details
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1">
                        Everything you need to know about the zero-cost website program for the first 15 customers.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 space-y-1.5 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                          <Check size={14} />
                          <span>100% Free Design & Code</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Complete UI/UX design and responsive engineering with ₹0 development fee.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 space-y-1.5 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                          <Clock size={14} />
                          <span>7-Day Rapid Turnaround</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Fast development cycle so your brand can launch on the web immediately.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 space-y-1.5 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                          <Globe size={14} />
                          <span>Mobile & SEO Ready</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Clean semantic HTML, lightning-fast load times, and fluid mobile optimization.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 space-y-1.5 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                          <ShieldCheck size={14} />
                          <span>Strict 15 Slot Quota</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Currently {claimedCount} filled, {remainingSlots} slots remaining. Offer closes automatically on Aug 30.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={() => setActiveTab("claim")}
                        className="flex-1 py-3.5 bg-gradient-to-r from-[#E11D48] to-[#be123c] hover:opacity-90 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] shadow-lg shadow-rose-500/25"
                      >
                        <span>Claim Your Slot #{selectedSlotNumber} Now</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* Success Confirmation */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={28} />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      Slot #{selectedSlotNumber} Confirmed & Synced
                    </span>
                    <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      Reservation Successful
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Thank you, <strong className="text-slate-900 dark:text-white">{formData.fullName}</strong>! We've registered your free website reservation under our Independence Day initiative. Our team will contact you at <span className="font-mono text-[#E11D48] font-semibold">{formData.email}</span> / <span className="font-mono">{formData.phone}</span>.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsSuccess(false);
                      }}
                      className="px-8 py-2.5 bg-ink/5 dark:bg-white/10 hover:bg-ink/10 dark:hover:bg-white/20 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer min-h-[40px] border border-ink/10 dark:border-white/10"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

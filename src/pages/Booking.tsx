import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { cn } from "@/lib/utils";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { X, QrCode, ArrowUpRight, Copy, Check, Sparkles, Gift } from "lucide-react";

type Step = 1 | 2 | 3;

export default function Booking() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const initialPkg = searchParams.get("package") || (searchParams.get("offer") === "independence" ? "Independence Day Free Website Offer (₹0 - Aug 15-30)" : "Brand Foundation");

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("7604969891@ybl");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
    package: initialPkg
  });

  useEffect(() => {
    const pkgFromUrl = searchParams.get("package");
    const offerFromUrl = searchParams.get("offer");
    if (pkgFromUrl) {
      setForm(f => ({ ...f, package: pkgFromUrl }));
    } else if (offerFromUrl === "independence") {
      setForm(f => ({ ...f, package: "Independence Day Free Website Offer (₹0 - Aug 15-30)" }));
    }
  }, [searchParams]);

  const isFreeOffer = form.package.includes("Independence Day") || form.package.includes("₹0");

  const nextStep = () => setStep((s) => (s + 1) as Step);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const inquiryPath = 'inquiries';
      // 1. Save to Firestore
      await addDoc(collection(db, inquiryPath), {
        ...form,
        status: 'pending',
        isIndependenceOffer: isFreeOffer,
        createdAt: serverTimestamp()
      });

      // 2. If it's a free offer, complete directly to step 3! If paid, show QR Code modal
      if (isFreeOffer) {
        setStep(3);
      } else {
        setShowQR(true);
      }
      
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'inquiries');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentConfirmation = () => {
    // UI state updates
    setShowQR(false);
    setTimeout(() => {
      setStep(3);
    }, 500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-24 md:pt-40 md:pb-36 flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-alt/10 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6 sm:space-y-10 relative z-10"
              >
                <header>
                  <div className="glass-badge mb-3">
                    <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                    <span>Step 01 / Direct Inquiry</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium leading-tight text-gradient-alt uppercase">
                    Tell us about your project.
                  </h1>
                </header>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-widest text-ink/50 block mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Alex Taylor"
                      className="glass-input text-base sm:text-lg"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-widest text-ink/50 block mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="alex@example.com"
                      className="glass-input text-base sm:text-lg"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-widest text-ink/50 block mb-1">Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210"
                      className="glass-input text-base sm:text-lg"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-widest text-ink/50 block mb-1">Selected Package / Service *</label>
                    <div className="relative">
                      <select 
                        className="glass-input text-base sm:text-lg appearance-none cursor-pointer pr-10"
                        value={form.package}
                        onChange={(e) => setForm({ ...form, package: e.target.value })}
                      >
                        <option value="Independence Day Free Website Offer (₹0 - Aug 15-30)" className="bg-slate-900 text-amber-400 font-bold">🇮🇳 Independence Day Free Website (₹0 - Aug 15-30)</option>
                        <option value="Brand Foundation" className="bg-slate-900 text-white">Brand Foundation (₹2,000 – ₹15,000)</option>
                        <option value="UI/UX & Website" className="bg-slate-900 text-white">UI/UX & Website (₹5,000 – ₹20,000)</option>
                        <option value="Content & Video" className="bg-slate-900 text-white">Content & Video (₹3,000 – ₹12,000)</option>
                        <option value="Growth Combo" className="bg-slate-900 text-white">Growth Combo (₹5,000 – ₹25,000)</option>
                        <option value="Monthly Retainer" className="bg-slate-900 text-white">Monthly Retainer (Custom)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink/50">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-widest text-ink/50 block mb-1">Project Brief / Details</label>
                    <textarea 
                      placeholder="Briefly describe your objectives, ideas, or timeline..."
                      rows={4}
                      className="glass-input text-base sm:text-lg resize-none"
                      value={form.details}
                      onChange={(e) => setForm({ ...form, details: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                  onClick={nextStep}
                  disabled={!form.name || !form.email}
                  className="w-full py-4 sm:py-5 bg-gradient-to-r from-accent to-accent-alt text-white rounded-2xl text-xs uppercase tracking-[0.3em] font-bold hover:opacity-95 transition-all shadow-xl shadow-accent/20 cursor-pointer disabled:opacity-30 border border-white/20"
                >
                  Continue to Verification
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8 sm:space-y-10 relative z-10"
              >
                <header>
                  <div className="glass-badge mb-3">
                    <Gift className="w-3 h-3 text-accent" />
                    <span>{isFreeOffer ? "Step 02 / Free Offer Confirmation" : "Step 02 / Finalize Inquiry"}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-display font-medium text-gradient-alt uppercase">
                    {isFreeOffer ? "Claim Free Website Slot" : "Ready to Send?"}
                  </h1>
                  <p className="mt-3 text-base sm:text-lg text-ink/70 leading-relaxed font-light">
                    {isFreeOffer 
                      ? "Under our Independence Day Special (Aug 15 – Aug 30), your website design & build is 100% free of charge with ₹0 upfront payment."
                      : "Complete your inquiry by confirming the details. Scan the QR code on the next screen to proceed."}
                  </p>
                </header>

                <div className="glass-card p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono text-ink/60 border-b border-white/10 pb-2">
                    <span>Selected Plan</span>
                    <span className="font-bold text-ink">{form.package}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-ink/60 border-b border-white/10 pb-2">
                    <span>Applicant</span>
                    <span className="font-bold text-ink">{form.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-ink/60">
                    <span>Contact</span>
                    <span className="font-bold text-ink">{form.email}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-5 bg-gradient-to-r from-accent to-accent-alt text-white rounded-2xl hover:opacity-95 transition-all text-base sm:text-lg font-display text-center px-8 group flex justify-center items-center gap-3 disabled:opacity-50 shadow-xl shadow-accent/25 cursor-pointer border border-white/20"
                  >
                    {isSubmitting 
                      ? "Processing Claim..." 
                      : isFreeOffer 
                      ? "Confirm & Reserve Free Slot (₹0)" 
                      : "Confirm & Pay Online"}
                    {!isSubmitting && (isFreeOffer ? <Sparkles className="w-5 h-5" /> : <QrCode className="w-5 h-5" />)}
                  </button>

                  <p className="text-[10px] text-center uppercase tracking-widest text-ink/40 font-mono">
                    {isFreeOffer ? "100% Free of charge • First 15 customers" : "Scan QR to complete your booking inquiry"}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-xs uppercase tracking-widest text-ink/50 hover:text-accent transition-colors glass-pill px-4 py-2"
                  >
                    ← Edit Project Details
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center space-y-8 sm:space-y-10 relative z-10 py-6"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-accent/15 rounded-full flex items-center justify-center mx-auto text-accent shadow-inner border border-accent/30">
                   <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-3xl sm:text-4xl"
                   >
                     ✓
                   </motion.div>
                </div>
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-5xl font-display font-medium text-gradient-alt uppercase">Your Request Is In.</h1>
                    <p className="text-base sm:text-lg text-ink/70 max-w-md mx-auto leading-relaxed font-light">We’ll reach out to you within 24 hours to begin your creative journey.</p>
                </div>
                <div>
                  <motion.a 
                    href="https://wa.me/917604969891?text=Hi%20Editable%20Team,%20I've%20made%20the%20payment%20for%20my%20booking.%20Here%20is%20the%20proof."
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-block px-8 sm:px-12 py-4 bg-gradient-to-r from-accent to-accent-alt text-white rounded-2xl text-xs uppercase tracking-[0.3em] font-bold shadow-xl shadow-accent/20 border border-white/20"
                  >
                    Send Payment Proof on WhatsApp
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showQR && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-2xl"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 10 }}
                  className="glass-panel p-6 sm:p-10 max-w-[calc(100vw-2rem)] md:max-w-md w-full relative space-y-6 text-center shadow-2xl rounded-3xl"
                >
                  <button 
                    onClick={handlePaymentConfirmation}
                    className="absolute top-5 right-5 p-2 glass hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-gradient-alt">Scan to Pay</h2>
                    <div className="flex flex-col items-center gap-1.5">
                       <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-ink/50">UPI Payment Address</span>
                       <button 
                        onClick={handleCopyUPI}
                        className="flex items-center gap-2.5 text-xs font-mono glass-pill px-4 py-2 hover:bg-white/20 transition-all cursor-pointer"
                       >
                         <span>7604969891@ybl</span>
                         {isCopied ? (
                           <Check className="w-3.5 h-3.5 text-accent" />
                         ) : (
                           <Copy className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                         )}
                       </button>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="aspect-square bg-white rounded-2xl overflow-hidden flex items-center justify-center border border-white/20 shadow-2xl p-4 relative group mx-auto max-w-[240px]"
                  >
                    <motion.img 
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      src="/payment-qr.png" 
                      alt="Payment QR Code"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-bold font-mono">
                      Step 1: Scan & Pay via any UPI App
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-ink/60 leading-relaxed max-w-[260px] mx-auto font-light">
                      Please take a <span className="text-ink font-bold">clear screenshot</span> of the successful payment page.
                    </p>
                  </div>

                  <button 
                    onClick={handlePaymentConfirmation}
                    className="w-full py-4 bg-gradient-to-r from-accent to-accent-alt text-white rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg shadow-accent/20 cursor-pointer border border-white/20"
                  >
                    I've Made the Payment
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

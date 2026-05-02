import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageTransition from "../components/PageTransition";
import { cn } from "@/src/lib/utils";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { X, QrCode, Mail, ArrowUpRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type Step = 1 | 2 | 3;

export default function Booking() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
    package: "Brand Foundation"
  });

  const nextStep = () => setStep((s) => (s + 1) as Step);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const inquiryPath = 'inquiries';
      // 1. Save to Firestore
      await addDoc(collection(db, inquiryPath), {
        ...form,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 2. Show QR Code modal instead of opening mailto
      setShowQR(true);
      
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'inquiries');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentConfirmation = () => {
    // 1. Construct Email Content
    const subject = encodeURIComponent(`Project Inquiry: ${form.package} - ${form.name}`);
    const bodyText = encodeURIComponent(
      `Hi Editable Team,\n\n` +
      `I have made the payment for the inquiry.\n\n` +
      `----- PROJECT DETAILS -----\n` +
      `Package: ${form.package}\n` +
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n\n` +
      `Details:\n${form.details}\n\n` +
      `--------------------------\n` +
      `Best regards,\n${form.name}`
    );
    
    const mailtoUrl = `mailto:editable.freelancing@gmail.com?subject=${subject}&body=${bodyText}`;
    
    // Open email client
    window.location.href = mailtoUrl;
    
    // UI state updates
    setShowQR(false);
    setTimeout(() => {
      setStep(3);
    }, 500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-32 md:pt-48 md:pb-48 flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-3xl glass p-8 md:p-20 lg:p-24">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 md:space-y-12"
              >
                <header>
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold mb-4 block">Step 01 / Inquiry</span>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium leading-tight">Tell us about your project.</h1>
                </header>

                <div className="space-y-8 md:space-y-10 lg:space-y-12">
                  <div className="group relative">
                    <input 
                      type="text" 
                      placeholder="Name"
                      className="w-full bg-transparent border-b border-ink/10 py-6 text-xl md:text-2xl focus:outline-none focus:border-accent transition-colors font-light"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="group relative">
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      className="w-full bg-transparent border-b border-ink/10 py-6 text-xl md:text-2xl focus:outline-none focus:border-accent transition-colors font-light"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="group relative">
                    <input 
                      type="tel" 
                      placeholder="Phone"
                      className="w-full bg-transparent border-b border-ink/10 py-6 text-xl md:text-2xl focus:outline-none focus:border-accent transition-colors font-light"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="group relative">
                    <select 
                      className="w-full bg-transparent border-b border-ink/10 py-6 text-xl md:text-2xl focus:outline-none focus:border-accent transition-colors font-light appearance-none"
                      value={form.package}
                      onChange={(e) => setForm({ ...form, package: e.target.value })}
                    >
                      <option value="Brand Foundation" className="bg-bg text-ink">Brand Foundation</option>
                      <option value="UI/UX & Website" className="bg-bg text-ink">UI/UX & Website</option>
                      <option value="Content & Video" className="bg-bg text-ink">Content & Video</option>
                      <option value="Growth Combo" className="bg-bg text-ink">Growth Combo</option>
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                      <ArrowUpRight size={20} className="rotate-90" />
                    </div>
                    <label className="text-[10px] uppercase tracking-widest opacity-30 mt-2 block">Selected Service</label>
                  </div>
                  <div className="group relative">
                    <textarea 
                      placeholder="Briefly describe what you need..."
                      rows={4}
                      className="w-full bg-transparent border-b border-ink/10 py-6 text-xl md:text-2xl focus:outline-none focus:border-accent transition-colors font-light resize-none"
                      value={form.details}
                      onChange={(e) => setForm({ ...form, details: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                  onClick={nextStep}
                  disabled={!form.name || !form.email}
                  className="w-full py-6 bg-accent text-bg rounded-full text-xs uppercase tracking-[0.4em] font-bold hover:opacity-90 transition-opacity disabled:opacity-20 translate-y-4"
                >
                  Continue to Selection
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-12"
              >
                <header>
                  <span className="text-xs uppercase tracking-widest opacity-40 font-mono mb-4 block">Step 02 / Finalize Inquiry</span>
                  <h1 className="text-4xl md:text-6xl font-display font-medium">Ready to send?</h1>
                  <p className="mt-4 text-xl opacity-60">Complete your inquiry by making the payment. Scan the QR code to proceed.</p>
                </header>

                <div className="space-y-4">
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-8 bg-accent text-ink rounded-full hover:opacity-90 transition-all text-xl font-display text-center px-8 group flex justify-center items-center gap-4 disabled:opacity-50 shadow-xl shadow-accent/20"
                  >
                    {isSubmitting ? "Processing..." : "Confirm & Pay Online"}
                    {!isSubmitting && <QrCode className="w-6 h-6" />}
                  </button>

                  <p className="text-[10px] text-center uppercase tracking-widest opacity-30">Scan QR to complete your booking inquiry</p>
                </div>

                <div className="flex justify-center">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
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
                className="text-center space-y-12"
              >
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8">
                   <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-bg text-4xl"
                   >
                     ✓
                   </motion.div>
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-display font-medium">Your request is in.</h1>
                    <p className="text-xl opacity-60 max-w-md mx-auto">We’ll reach out to you within 24 hours to begin the process.</p>
                </div>
                <button 
                  onClick={() => window.location.href = "/"}
                  className="px-12 py-5 bg-ink text-bg rounded-full text-xs uppercase tracking-[0.3em] font-bold"
                >
                  Return Home
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showQR && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-bg/95 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 10 }}
                  className="glass p-6 md:p-10 max-w-[calc(100vw-2rem)] md:max-w-sm w-full relative space-y-6 md:space-y-8 text-center"
                >
                  <button 
                    onClick={handlePaymentConfirmation}
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-ink/5 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  
                  <div className="space-y-2 md:space-y-4 pt-2 md:pt-4">
                    <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight">Scan to Pay</h2>
                    <div className="flex flex-col items-center gap-1 md:gap-2">
                       <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] opacity-40">UPI ID</span>
                       <span className="text-xs md:text-sm font-mono bg-ink/5 px-4 py-1 rounded-full">7604969891@ybl</span>
                    </div>
                  </div>

                  <div className="aspect-square bg-white rounded-[32px] p-8 flex items-center justify-center border border-ink/5 shadow-2xl">
                    <QRCodeSVG 
                      value={`upi://pay?pa=7604969891@ybl&pn=Editable%20Freelancing&cu=INR`}
                      size={256}
                      level="H"
                      includeMargin={false}
                      className="w-full h-full"
                    />
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 leading-relaxed max-w-[200px] mx-auto">
                    Take a screenshot after payment and wait for our team to contact you.
                  </p>

                  <button 
                    onClick={handlePaymentConfirmation}
                    className="w-full py-4 bg-ink text-bg rounded-full text-[10px] uppercase tracking-[0.2em] font-bold"
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

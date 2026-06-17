import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageTransition from "../components/PageTransition";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Send, 
  Flame, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Monitor, 
  Instagram, 
  Clock, 
  Globe 
} from "lucide-react";
import Magnetic from "../components/Magnetic";

type RoleType = "Graphic Designer" | "Social Media Manager";
type CommitmentType = "Full-time" | "Part-time";

export default function Internship() {
  // Step flow states
  // 1 = Select Role, 2 = Select Commitment, 3 = Details & Form
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [selectedType, setSelectedType] = useState<CommitmentType | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    portfolioUrl: "",
    degree: "",
    interest: "",
    canvaExperience: "Beginner"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !selectedType) {
      setErrorMsg("Please select a role and commitment type before submitting.");
      return;
    }
    if (!form.fullName || !form.email || !form.portfolioUrl || !form.degree || !form.interest) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const collectionPath = "internship_applications";
      // 1. Record application in Firestore
      await addDoc(collection(db, collectionPath), {
        fullName: form.fullName,
        email: form.email,
        portfolioUrl: form.portfolioUrl,
        degree: form.degree,
        interest: form.interest,
        canvaExperience: form.canvaExperience,
        role: selectedRole,
        type: selectedType,
        status: "submitted",
        createdAt: serverTimestamp()
      });

      // 1b. Record in the secure separate registry for private applicant ledger
      const secureCollectionPath = "secure_internship_registry";
      await addDoc(collection(db, secureCollectionPath), {
        fullName: form.fullName,
        email: form.email,
        role: selectedRole,
        createdAt: serverTimestamp()
      });

      // 2. Dispatch a notification email via backend SMTP route
      try {
        await fetch("/api/internship/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            portfolioUrl: form.portfolioUrl,
            degree: form.degree,
            interest: form.interest,
            canvaExperience: form.canvaExperience,
            role: selectedRole,
            type: selectedType
          }),
        });
      } catch (emailErr) {
        console.warn("Emails notification delivery issue (may be unconfigured in dev):", emailErr);
      }

      setIsSubmitted(true);
    } catch (error) {
      setErrorMsg("Something went wrong while submitting. Please try again.");
      console.error("Submission error:", error);
      handleFirestoreError(error, OperationType.WRITE, "internship_applications");
    } finally {
      setIsSubmitting(false);
    }
  };

  const companyDescription = 
    "Editable creative studio empowers small businesses, solopreneurs, and local shops with professional yet flexible graphic and web design solutions. Specializing in Canva-powered Design Kits, Editable Creative Studio offers tailored services, including custom brand identities, editable social media templates, and launch-ready Canva websites. With an emphasis on user empowerment, Editable equips clients to manage and evolve their visual presence while ensuring a blend of quality, affordability, and simplicity. The company is committed to creating designs that are both beautiful and functional, enabling entrepreneurs to build stunning and manageable brands that drive growth and success.";

  // Tailored details depending on selection
  const getRoleDetails = () => {
    if (selectedRole === "Social Media Manager") {
      return {
        title: "Social Media Manager Intern",
        desc: `This is a ${selectedType ? selectedType.toLowerCase() : "part-time"} remote role for a Social Media Manager Intern at Editable Creative Studio. As a Social Media Manager Intern, you will assist in structuring, scheduling and creating engaging brand campaigns, contribute to digital growth strategies, and analyze audience engagement logs across major platforms. Key responsibilities include maintaining beautiful layout consistency, conducting target audience research to spot design/engagement trends, and utilizing Canva to tailor fast, impactful templates for viral social dissemination.`,
        qualifications: [
          "Passion for Digital Marketing, Copywriting, and Community Engagement.",
          "Ability to conduct Audience Research and track performance metrics.",
          "Competency with Canva for high-tempo layout editing and templates.",
          "Eye for consistent color, style, and typography in curated feeds.",
          "Outstanding written communication and visual storytelling abilities.",
          "Self-motivated, proactive, and highly disciplined in remote workflows.",
          "Understanding of social media algorithms and post-scheduling tools.",
          "Currently pursuing or recently completed a degree in Marketing, Communications, Design, or equivalent."
        ]
      };
    } else {
      // Graphic Designer default
      return {
        title: "Design Intern",
        desc: `This is a ${selectedType ? selectedType.toLowerCase() : "part-time"} remote role for a Design Intern at Editable Creative Studio. As a Design Intern, you will assist in creating high-quality graphic designs, contribute to brand strategy projects, and develop assets, including social media templates and web design components. Key responsibilities include collaborating with team members, conducting research to inform design choices, and utilizing tools like Canva and other design software to create cohesive, visually impactful deliverables.`,
        qualifications: [
          "Proficiency in Graphic Design and creating high-quality visuals.",
          "Ability to conduct Research to inform design decisions.",
          "Experience with Graphics and Computer-Aided Design (Canva) tools.",
          "General understanding of Architecture in design and layout.",
          "Strong communication and collaboration skills.",
          "Ability to work efficiently in a remote environment.",
          "Familiarity with Canva is highly advantageous.",
          "Currently pursuing or recently completed a degree in Graphic Design, Visual Arts, or a related field (or similar)."
        ]
      };
    }
  };

  const roleDetails = getRoleDetails();

  return (
    <PageTransition>
      <div className="min-h-screen pt-40 pb-32 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
        
        {/* Navigation / Progress Indicator */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button 
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center hover:bg-ink hover:text-bg transition-colors"
                title="Go Back"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold block">Editable Studio Careers</span>
              <h2 className="text-sm font-medium opacity-55 mt-1">
                {step === 1 && "Step 1: Choose Your Specialization"}
                {step === 2 && "Step 2: Choose Commitment Type"}
                {step === 3 && `Step 3: Direct Application for ${selectedRole}`}
              </h2>
            </div>
          </div>

          {/* Stepper bubbles */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                onClick={() => {
                  if (num === 1) {
                    setStep(1);
                  } else if (num === 2 && selectedRole) {
                    setStep(2);
                  } else if (num === 3 && selectedRole && selectedType) {
                    setStep(3);
                  }
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black cursor-pointer transition-all ${
                  step === num 
                    ? "bg-accent text-bg scale-110 shadow-lg shadow-accent/20" 
                    : (num === 1 || (num === 2 && selectedRole) || (num === 3 && selectedRole && selectedType))
                      ? "bg-ink/5 hover:bg-ink/10 text-ink"
                      : "bg-ink/5 opacity-30 cursor-not-allowed text-ink/40"
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: SELECT ROLE */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-[5.5vw] font-display font-medium tracking-tight leading-none text-gradient-alt uppercase">
                  Select Role.
                </h1>
                <p className="mt-4 text-base md:text-lg text-ink/60">
                  Select the path that matches your creative strengths. We are searching for visionary interns ready to make a significant impact.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-4">
                {/* Option A: Graphic Designer */}
                <motion.div 
                  whileHover={{ y: -6, borderColor: "#ff4d00" }}
                  onClick={() => {
                    setSelectedRole("Graphic Designer");
                    setStep(2);
                  }}
                  className={`p-8 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between group min-h-[350px] relative overflow-hidden bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl shadow-xl shadow-black/10 ${
                    selectedRole === "Graphic Designer" 
                      ? "border-accent" 
                      : "border-ink/20 dark:border-white/15 hover:border-accent"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                      <Monitor size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-ink group-hover:text-accent transition-colors">
                        Graphic Designer
                      </h3>
                      <p className="text-xs text-accent uppercase tracking-widest font-black mt-1">Design Kit Specialist</p>
                    </div>
                    <p className="text-sm md:text-base text-ink/60 font-light leading-relaxed">
                      Assist in drafting customizable social layouts, launching scalable Canva templates, building responsive brand assets, and empowering clients to evolve their dynamic screen presences.
                    </p>
                  </div>

                  <div className="pt-6 flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-ink/40 group-hover:text-accent transition-colors">
                    <span>Select this position</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>

                {/* Option B: Social Media Manager */}
                <motion.div 
                  whileHover={{ y: -6, borderColor: "#ff4d00" }}
                  onClick={() => {
                    setSelectedRole("Social Media Manager");
                    setStep(2);
                  }}
                  className={`p-8 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between group min-h-[350px] relative overflow-hidden bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl shadow-xl shadow-black/10 ${
                    selectedRole === "Social Media Manager" 
                      ? "border-accent" 
                      : "border-ink/20 dark:border-white/15 hover:border-accent"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                      <Instagram size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-ink group-hover:text-accent transition-colors">
                        Social Media Manager
                      </h3>
                      <p className="text-xs text-accent uppercase tracking-widest font-black mt-1">Audience & Branding Growth</p>
                    </div>
                    <p className="text-sm md:text-base text-ink/60 font-light leading-relaxed">
                      Lead content calendars, design custom social dissemination media kits, execute digital campaigns, draft trend audits, and optimize brand consistency across feed layouts.
                    </p>
                  </div>

                  <div className="pt-6 flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-ink/40 group-hover:text-accent transition-colors">
                    <span>Select this position</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT COMMITMENT */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              <div className="max-w-2xl">
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-accent">Role: {selectedRole}</span>
                <h1 className="text-4xl md:text-[5.5vw] font-display font-medium tracking-tight leading-none text-gradient-alt uppercase mt-2">
                  Commitment.
                </h1>
                <p className="mt-4 text-base md:text-lg text-ink/60">
                  Select your available weekly dedication level. Both pathways offer complete certificates on completion and extensive executive mentorship.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-4">
                {/* Part-Time choice */}
                <motion.div 
                  whileHover={{ y: -6, borderColor: "#ff4d00" }}
                  onClick={() => {
                    setSelectedType("Part-time");
                    setStep(3);
                  }}
                  className={`p-8 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between group min-h-[250px] relative overflow-hidden bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl shadow-xl shadow-black/10 ${
                    selectedType === "Part-time" 
                      ? "border-accent" 
                      : "border-ink/20 dark:border-white/15 hover:border-accent"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-bold uppercase text-ink group-hover:text-accent transition-all">Part-Time Internship</h4>
                      <p className="text-xs text-ink/40 mt-1 uppercase tracking-widest font-black">15 - 20 hours / week</p>
                    </div>
                    <p className="text-sm text-ink/60 font-light">
                      Ideal for contemporary students working around semester classes, or designers pursuing external certifications simultaneously. Fully remote.
                    </p>
                  </div>
                  
                  <div className="pt-6 flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-ink/40 group-hover:text-accent transition-colors">
                    <span>Choose Part-Time</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>

                {/* Full-Time choice */}
                <motion.div 
                  whileHover={{ y: -6, borderColor: "#ff4d00" }}
                  onClick={() => {
                    setSelectedType("Full-time");
                    setStep(3);
                  }}
                  className={`p-8 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between group min-h-[250px] relative overflow-hidden bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl shadow-xl shadow-black/10 ${
                    selectedType === "Full-time" 
                      ? "border-accent" 
                      : "border-ink/20 dark:border-white/15 hover:border-accent"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-bold uppercase text-ink group-hover:text-accent transition-all">Full-Time Internship</h4>
                      <p className="text-xs text-ink/40 mt-1 uppercase tracking-widest font-black">35 - 40 hours / week</p>
                    </div>
                    <p className="text-sm text-ink/60 font-light">
                      Immersive daily environment. Directly integrated with leadership, taking charge of robust key accounts. Outstanding acceleration path.
                    </p>
                  </div>

                  <div className="pt-6 flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-ink/40 group-hover:text-accent transition-colors">
                    <span>Choose Full-Time</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DETAILS & APPLICATION FORM */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* Banner/Title */}
              <header className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase font-bold tracking-[0.25em] text-accent mb-4">
                  <span>Careers</span>
                  <div className="w-1 h-1 rounded-full bg-accent/40" />
                  <span>{selectedRole}</span>
                  <div className="w-1 h-1 rounded-full bg-accent/40" />
                  <span className="bg-accent/10 px-2 py-0.5 rounded text-[10px]">{selectedType}</span>
                </div>
                <h1 className="text-4xl md:text-[6.5vw] font-display font-medium tracking-tight leading-none text-gradient-alt uppercase">
                  {roleDetails.title}.
                </h1>
                <p className="mt-4 text-base md:text-xl text-ink/60 max-w-2xl leading-relaxed">
                  Join Editable Creative Studio as a remote <strong className="font-semibold text-ink">{selectedType}</strong> helper. Check out our description, prerequisites, and submit your application coordinates below.
                </p>
              </header>

              {/* Content split */}
              <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                
                {/* Details Column */}
                <div className="lg:col-span-7 space-y-16">
                  
                  {/* The Studio */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <Sparkles size={16} />
                      </div>
                      <h2 className="text-xs uppercase tracking-[0.3em] font-black opacity-40">Company Description</h2>
                    </div>
                    <p className="text-base md:text-lg text-ink/70 leading-relaxed font-light">
                      {companyDescription}
                    </p>
                  </section>

                  {/* The Role */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <Briefcase size={16} />
                      </div>
                      <h2 className="text-xs uppercase tracking-[0.3em] font-black opacity-40">Role Description</h2>
                    </div>
                    <p className="text-base md:text-lg text-ink/70 leading-relaxed font-light">
                      {roleDetails.desc}
                    </p>
                  </section>

                  {/* Qualifications */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <GraduationCap size={16} />
                      </div>
                      <h2 className="text-xs uppercase tracking-[0.3em] font-black opacity-40">Qualifications</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {roleDetails.qualifications.map((qual, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                          className="flex gap-3 items-start p-4 bg-[var(--color-surface)] border-2 border-ink/20 dark:border-white/20 rounded-2xl shadow-md transition-all hover:border-accent/40"
                        >
                          <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                          <span className="text-sm text-ink/80 font-light">{qual}</span>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Benefits */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <Award size={16} />
                      </div>
                      <h2 className="text-xs uppercase tracking-[0.3em] font-black opacity-40">Program Perks</h2>
                    </div>
                    <div className="p-6 bg-[var(--color-surface)] border-2 border-accent/20 hover:border-accent rounded-2xl flex items-center gap-4 transition-all shadow-md">
                      <span className="text-3xl">🎓</span>
                      <div>
                        <h4 className="font-semibold text-base text-ink">Certificate of Completion</h4>
                        <p className="text-sm text-ink/60 font-light">
                          A certified internship certificate is awarded to validate your stellar contributions and visual accomplishments upon successful completion of the period.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Form Column */}
                <div className="lg:col-span-5 relative">
                  <div className="sticky top-28">
                    <div className="bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl p-8 md:p-12 rounded-2xl border-2 border-ink/20 dark:border-white/15 relative overflow-hidden shadow-xl shadow-black/10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                      
                      <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                          <motion.form 
                            key="intern-form-main"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                          >
                            <div>
                              <h3 className="text-2xl font-display font-medium tracking-tight">Apply Online</h3>
                              <p className="text-xs text-ink/50 mt-1 uppercase tracking-widest font-bold">Submit Your Candidacy</p>
                            </div>

                            {errorMsg && (
                              <div className="p-4 bg-rose-500/10 text-rose-500 rounded-xl text-sm font-medium border border-rose-500/10">
                                {errorMsg}
                              </div>
                            )}

                            <div className="space-y-5">
                              {/* Name */}
                              <div>
                                <label className="text-[10px] uppercase tracking-widest text-ink/40 font-bold block mb-2">Full Name *</label>
                                <input 
                                  required
                                  type="text" 
                                  placeholder="e.g. Robin Sen"
                                  className="w-full bg-bg/50 border border-ink/10 rounded-xl px-5 py-4 focus:outline-none focus:border-accent transition-colors font-light text-base"
                                  value={form.fullName}
                                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                />
                              </div>

                              {/* Email */}
                              <div>
                                <label className="text-[10px] uppercase tracking-widest text-ink/40 font-bold block mb-2">Email Address *</label>
                                <input 
                                  required
                                  type="email" 
                                  placeholder="name@example.com"
                                  className="w-full bg-bg/50 border border-ink/10 rounded-xl px-5 py-4 focus:outline-none focus:border-accent transition-colors font-light text-base"
                                  value={form.email}
                                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                              </div>

                              {/* Education */}
                              <div>
                                <label className="text-[10px] uppercase tracking-widest text-ink/40 font-bold block mb-2">Education / Degree *</label>
                                <input 
                                  required
                                  type="text" 
                                  placeholder="e.g. BFA in Graphic Design / Self-taught"
                                  className="w-full bg-bg/50 border border-ink/10 rounded-xl px-5 py-4 focus:outline-none focus:border-accent transition-colors font-light text-base"
                                  value={form.degree}
                                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                                />
                              </div>

                              {/* Portfolio */}
                              <div>
                                <label className="text-[10px] uppercase tracking-widest text-ink/40 font-bold block mb-2">Portfolio / Drive / Behance Link *</label>
                                <input 
                                  required
                                  type="url" 
                                  placeholder="https://behance.net/work"
                                  className="w-full bg-bg/50 border border-ink/10 rounded-xl px-5 py-4 focus:outline-none focus:border-accent transition-colors font-light text-base"
                                  value={form.portfolioUrl}
                                  onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                                />
                              </div>

                              {/* Canva Proficiency */}
                              <div>
                                <label className="text-[10px] uppercase tracking-widest text-ink/40 font-bold block mb-2">Canva Experience Level *</label>
                                <select 
                                  className="w-full bg-bg/50 border border-ink/10 rounded-xl px-5 py-4 focus:outline-none focus:border-accent transition-colors font-light text-base appearance-none"
                                  value={form.canvaExperience}
                                  onChange={(e) => setForm({ ...form, canvaExperience: e.target.value })}
                                >
                                  <option value="Beginner" className="bg-bg text-ink">Beginner (Basic usage)</option>
                                  <option value="Intermediate" className="bg-bg text-ink">Intermediate (Design custom templates)</option>
                                  <option value="Advanced" className="bg-bg text-ink">Advanced (Expert Canva layout & features)</option>
                                  <option value="None" className="bg-bg text-ink">None / Use other tools (e.g. Photoshop, Illustrator)</option>
                                </select>
                              </div>

                              {/* Cover Letter / Interest */}
                              <div>
                                <label className="text-[10px] uppercase tracking-widest text-ink/40 font-bold block mb-2">Why do you want to join and brief background *</label>
                                <textarea 
                                  required
                                  rows={4}
                                  placeholder="Share your experience and motivation to work with us'..."
                                  className="w-full bg-bg/50 border border-ink/10 rounded-xl px-5 py-4 focus:outline-none focus:border-accent transition-colors font-light text-base resize-none"
                                  value={form.interest}
                                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                                />
                              </div>
                            </div>

                            <Magnetic>
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-accent text-bg rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30 mt-4 shadow-xl shadow-accent/10"
                              >
                                {isSubmitting ? (
                                  "Sending application..."
                                ) : (
                                  <>
                                    <span>Submit Application</span>
                                    <Send size={14} />
                                  </>
                                )}
                              </button>
                            </Magnetic>
                          </motion.form>
                        ) : (
                          <motion.div 
                            key="success-card-main"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="text-center py-10 space-y-8"
                          >
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent shadow-inner">
                              <Flame className="w-10 h-10 animate-pulse" />
                            </div>
                            
                            <div className="space-y-3">
                              <h3 className="text-3xl font-display font-bold text-gradient-alt uppercase tracking-tight">Application Sent</h3>
                              <p className="text-base text-ink/70 leading-relaxed font-light">
                                Thank you for applying, <span className="font-semibold text-ink">{form.fullName}</span>! We have successfully registered your candidacy in our database.
                              </p>
                              <p className="text-sm text-ink/40 font-light mt-2">
                                Our directors will review your graphic portfolio and background details. We'll be in touch via <span className="text-ink font-semibold">{form.email}</span> within 3-5 business days.
                              </p>
                            </div>

                            <div className="pt-6">
                              <button 
                                onClick={() => {
                                  _resetForm();
                                }}
                                className="px-8 py-3.5 border border-ink/10 hover:bg-ink hover:text-bg rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all"
                              >
                                Back to selection
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );

  function _resetForm() {
    setForm({
      fullName: "",
      email: "",
      portfolioUrl: "",
      degree: "",
      interest: "",
      canvaExperience: "Beginner"
    });
    setStep(1);
    setSelectedRole(null);
    setSelectedType(null);
    setIsSubmitted(false);
  }
}

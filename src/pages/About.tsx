import React from "react";
import { motion } from "motion/react";
import PageTransition from "../components/PageTransition";
import { Link } from "react-router-dom";
import Magnetic from "../components/Magnetic";
import TextReveal from "../components/TextReveal";
import { ChevronRight, Target, Users, Zap, Palette, Rocket } from "lucide-react";

const Section = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="border-t border-ink/5 pt-12 pb-20 group"
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent/5 text-accent group-hover:scale-110 transition-transform duration-500">
          <Icon size={24} />
        </div>
        <h2 className="text-2xl font-display font-medium">{title}</h2>
      </div>
      <div className="md:col-span-2 prose prose-lg dark:prose-invert max-w-none text-ink/70">
        {children}
      </div>
    </div>
  </motion.div>
);

export default function About() {
  return (
    <PageTransition>
      <div className="pt-32 md:pt-40 lg:pt-48 pb-20">
        {/* Hero Section */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter leading-[0.9] mb-12">
              <TextReveal text="Modern Design." />
              <br />
              <span className="text-accent">
                <TextReveal text="Manageable." delay={0.2} />
              </span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-ink/60 leading-relaxed max-w-xl"
            >
              Welcome to Editable. – your partner for modern, manageable, and impactful design solutions.
              We specialize in empowering small businesses and ambitious solopreneurs with design that's built for flexibility and growth.
            </motion.p>
            
            <div className="flex justify-start md:justify-end">
              <Magnetic>
                <Link 
                  to="/contact" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform duration-500 group"
                >
                  <span className="relative z-10">Connect</span>
                  <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-32">
          <Section title="Our Mission" icon={Target}>
            <p>
              In today's fast-paced digital landscape, we believe every business deserves a stunning visual presence without being tied to complex tools or endless design revisions. Our goal is to bridge the gap between high-end professional design and everyday usability.
            </p>
          </Section>

          <Section title="Canva-Powered Design Kits" icon={Zap}>
            <p className="mb-6">
              Our unique approach leverages the intuitive power of Canva to deliver comprehensive 'Design Kits' tailored to your specific needs. This isn't just about handing over a JPG; it's about giving you a living brand.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 list-none p-0">
              <li className="flex flex-col gap-2 p-6 rounded-2xl bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl border-2 border-ink/20 dark:border-white/15 shadow-md">
                <Palette size={20} className="text-accent" />
                <span className="font-bold text-ink">Custom Brand Identity</span>
                <span className="text-sm opacity-70">A unique logo, refined color palettes, and curated typography that authentically represent your brand.</span>
              </li>
              <li className="flex flex-col gap-2 p-6 rounded-2xl bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl border-2 border-ink/20 dark:border-white/15 shadow-md">
                <Users size={20} className="text-accent" />
                <span className="font-bold text-ink">Social Media Templates</span>
                <span className="text-sm opacity-70">Branded templates for Instagram, Facebook, Pinterest, and more, empowering you to create content effortlessly.</span>
              </li>
              <li className="flex flex-col gap-2 p-6 rounded-2xl bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl border-2 border-ink/20 dark:border-white/15 shadow-md">
                <Rocket size={20} className="text-accent" />
                <span className="font-bold text-ink">Launch-Ready Websites</span>
                <span className="text-sm opacity-70">Simple, professional landing pages or multi-page websites designed and hosted directly on Canva.</span>
              </li>
              <li className="flex flex-col gap-2 p-6 rounded-2xl bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl border-2 border-ink/20 dark:border-white/15 shadow-md">
                <Target size={20} className="text-accent" />
                <span className="font-bold text-ink">User Empowerment</span>
                <span className="text-sm opacity-70">We don't just deliver files; we deliver tools. Gain the confidence to manage and evolve your own visuals.</span>
              </li>
            </ul>
          </Section>

          <Section title="Who We Serve" icon={Users}>
            <p className="mb-4">We partner with entrepreneurs and business owners who:</p>
            <div className="space-y-4">
              {[
                "Are launching a new venture and need a professional look, fast.",
                "Have an existing brand that needs a modern refresh.",
                "Want consistent social media presence but lack design skills or time.",
                "Seek an affordable, yet high-quality, web presence that's easy to maintain."
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <ChevronRight size={16} className="text-accent shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Our Strategic Packages" icon={Rocket}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  title: "Brand Foundation Package*",
                  target: "Best for: startups, new businesses",
                  includes: ["Logo design", "Brand colors & typography", "Basic brand guidelines", "Social media starter kit (DP, posts)"],
                  positioning: "We build your brand from scratch with a strong, modern identity."
                },
                {
                  title: "UI/UX & Website Design Package*",
                  target: "Best for: businesses going digital",
                  includes: ["UX research (basic)", "Wireframes", "UI design (Figma)", "Responsive layouts (mobile + desktop)", "Optional add-on: developer handoff"],
                  positioning: "We design clean, user-focused digital experiences that convert."
                },
                {
                  title: "Content & Video Package*",
                  target: "Best for: social media growth",
                  includes: ["Reel/video editing", "Motion graphics", "Thumbnails / covers", "Content styling aligned with brand"],
                  positioning: "We turn your content into scroll-stopping visuals."
                },
                {
                  title: "Growth Combo Package (High Value)*",
                  target: "Best for: serious clients",
                  includes: ["Branding + UI/UX + Content", "Monthly design support", "Ongoing video content"],
                  positioning: "A complete creative system to build, launch, and grow your brand."
                },
                {
                  title: "Monthly Retainer (Agency Mode)*",
                  target: "Best for: long-term clients",
                  includes: ["Fixed number of design tasks", "Continuous video editing", "Priority support"],
                  positioning: "Your dedicated creative team, on demand."
                }
              ].map((pkg, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-[var(--color-surface)]/85 dark:bg-[var(--color-surface)]/65 backdrop-blur-xl border-2 border-ink/20 dark:border-white/15 flex flex-col h-full hover:border-accent transition-all duration-500 shadow-xl shadow-black/10">
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">{pkg.target}</span>
                    <h3 className="text-2xl font-display font-bold leading-tight">{pkg.title}</h3>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm opacity-80">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6 border-t border-ink/10 italic text-ink/60 text-sm">
                    👉 {pkg.positioning}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Our Commitment" icon={Target}>
            <p>
              As the founder, my commitment is to translate your vision into strategic, beautiful, and most importantly, editable designs. We focus on clarity, consistency, and client empowerment, ensuring your brand not only looks good but works smarter for you.
            </p>
            <div className="mt-12 p-8 rounded-2xl bg-accent text-white border-2 border-accent shadow-xl shadow-black/10">
              <h3 className="text-2xl font-display font-medium mb-4">Let's build a brand that's truly yours, and truly manageable.</h3>
              <Link to="/contact" className="inline-flex items-center gap-2 group underline underline-offset-8">
                Explore our possibilities <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </PageTransition>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What makes your designs 'editable'?",
    answer: "We deliver Canva-powered design kits and clean Figma systems. Once we complete your branding, templates, or page layouts, we hand over full visual templates and links so you can edit text, swap images, or update posts instantly without needing a developer or professional software."
  },
  {
    question: "What platforms do you support for websites?",
    answer: "We design high-converting, fully customized landing pages and multi-page websites directly on Canva, Wix, or Figma for simple visual management. For more complex dynamic web applications or eCommerce platforms, we partner with specialized developers to bring our premium custom UI designs to life."
  },
  {
    question: "How does the Monthly Retainer (Agency Mode) work?",
    answer: "Our retainer works like your own on-demand creative team. For a transparent monthly flat fee, you gain priority access to continuous visual updates, custom social media designs, reel/video editing, and banner updates with predictable, rapid turnaround times."
  },
  {
    question: "Who owns the finalized brand assets?",
    answer: "You enjoy 100% full ownership. Once deliverables are completed, we share all final assets, Canva template master-links, source files, and brand guidelines with you. There are no ongoing licensing fees—they are yours to keep, scale, and edit forever."
  },
  {
    question: "What is the typical timeline for a Brand Foundation Package?",
    answer: "A standard Brand Foundation project typically takes 1 to 2 weeks. This includes initial brand strategy and visual research, custom logo concepts, typography curation, colorway selection, and the final deliverable handoff in your private design workspace."
  },
  {
    question: "Do you design for social media platforms specifically?",
    answer: "Absolutely. We specialize in producing thumb-stopping social media visual assets tailored for Instagram, LinkedIn, TikTok, and YouTube. This includes professionally edited short-form videos (Reels/TikToks), custom grid designs, stories, carousel templates, and high-CTR thumbnails."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-ink/5 pt-12 pb-20 group"
      id="faq-section"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Title and Intro */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent/5 text-accent">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-2xl font-display font-medium">FAQ</h2>
          </div>
          <p className="text-sm opacity-70 leading-relaxed max-w-sm mt-3">
            Have questions about our process, packages, or custom design templates? Read through our frequently asked questions. Still curious? Contact us anytime.
          </p>
        </div>

        {/* Accordion List */}
        <div className="md:col-span-2 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border-2 border-ink/10 dark:border-white/10 rounded-2xl bg-[var(--color-surface)]/80 dark:bg-[var(--color-surface)]/40 backdrop-blur-xl transition-all duration-300 hover:border-accent/40"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 font-display font-semibold text-lg text-ink hover:text-accent transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                  id={`faq-btn-${index}`}
                >
                  <span>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="shrink-0 text-accent bg-accent/5 p-2 rounded-full"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8 text-sm text-ink/70 leading-relaxed border-t border-ink/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

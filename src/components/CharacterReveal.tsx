import React from "react";
import { motion } from "motion/react";

interface CharacterRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export const CharacterReveal: React.FC<CharacterRevealProps> = ({ 
  text, 
  className, 
  delay = 0,
  stagger = 0.05 
}) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const characterAnimation = {
    hidden: {
      opacity: 0,
      y: `0.5em`,
    },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <motion.h2
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.3em]">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={characterAnimation}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h2>
  );
};

import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";

interface MarqueeProps {
  text: string;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export default function Marquee({ text, speed = 50, direction = "left", className }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const xTransform = useTransform(
    smoothProgress, 
    [0, 1], 
    direction === "left" ? [0, -500] : [0, 500]
  );

  return (
    <div className="relative w-full overflow-hidden whitespace-nowrap py-10 select-none">
      <motion.div 
        className={className}
        style={{ x: xTransform }}
      >
        <span className="inline-block px-10">{text}</span>
        <span className="inline-block px-10">{text}</span>
        <span className="inline-block px-10">{text}</span>
        <span className="inline-block px-10">{text}</span>
      </motion.div>
    </div>
  );
}

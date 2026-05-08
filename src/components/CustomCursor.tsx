import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (isHidden) setIsHidden(false);
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    const handleTouchStart = () => setIsHidden(true);

    const updateHoverState = () => {
      const hoveredElement = document.querySelectorAll("a, button, [role='button'], .hover-target");
      hoveredElement.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchstart", handleTouchStart);
    
    updateHoverState();

    // Create a MutationObserver to watch for new link/button elements (especially in SPAs)
    const observer = new MutationObserver(updateHoverState);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchstart", handleTouchStart);
      observer.disconnect();
    };
  }, [mouseX, mouseY, isHidden]);

  if (isHidden) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Expanding Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-accent rounded-full pointer-events-none z-[9998] hidden md:block"
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.3 : 0.6,
          backgroundColor: isHovering ? "var(--color-accent)" : "transparent",
        }}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
    </>
  );
};

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface EditableHeroTextProps {
  className?: string;
}

export const EditableHeroText: React.FC<EditableHeroTextProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("EDITABLE.");
  const [isEditing, setIsEditing] = useState(false);

  // Mouse positions for subtle background glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleTextChange = (e: React.FormEvent<HTMLSpanElement>) => {
    const rawText = e.currentTarget.textContent || "";
    setInputText(rawText);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative select-none py-10 w-full flex flex-col items-center justify-center overflow-visible group/container"
    >
      {/* Background Interactive Radial Glow */}
      <motion.div
        className="absolute -inset-40 pointer-events-none opacity-0 group-hover/container:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,rgba(255,77,0,0.08)_0%,rgba(0,242,255,0.03)_50%,transparent_100%)] rounded-full"
        style={{
          left: glowX,
          top: glowY,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Editable input area or styled characters */}
      <div className="relative z-10 flex flex-nowrap md:flex-wrap lg:justify-start justify-center items-center max-w-full">
        {!isEditing ? (
          <div 
            onClick={() => setIsEditing(true)}
            className={cn(
              "cursor-pointer outline-none relative flex flex-nowrap md:flex-wrap lg:justify-start justify-center items-center gap-x-[0.01em] whitespace-nowrap",
              className
            )}
            title="Click to edit text"
          >
            {inputText.split("").map((char, index) => {
              const isPeriod = char === ".";
              // Unique translation offset for each character to create chromatic split
              const shiftLeft = -3 - (index % 3);
              const shiftRight = 3 + (index % 3);

              return (
                <span 
                  key={index} 
                  className="relative group/letter inline-block px-[0.03em] transition-transform duration-300 ease-out hover:scale-110"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Chromatic Splitting Copy 1: Vermilion Accent (Leans Left) */}
                  <span 
                    className={cn(
                      "absolute inset-0 select-none pointer-events-none opacity-0 group-hover/letter:opacity-75 transition-all duration-300 ease-out",
                      isPeriod ? "text-accent-blue" : "text-accent"
                    )}
                    style={{
                      transform: `translateX(${shiftLeft}px) translateZ(-5px)`
                    }}
                  >
                    {char}
                  </span>

                  {/* Chromatic Splitting Copy 2: Tech Blue/Purple Accent (Leans Right) */}
                  <span 
                    className={cn(
                      "absolute inset-0 select-none pointer-events-none opacity-0 group-hover/letter:opacity-75 transition-all duration-300 ease-out",
                      isPeriod ? "text-accent" : "text-accent-blue"
                    )}
                    style={{
                      transform: `translateX(${shiftRight}px) translateZ(-5px)`
                    }}
                  >
                    {char}
                  </span>

                  {/* Foreground Main Copy */}
                  <span 
                    className={cn(
                      "relative block transition-all duration-300",
                      isPeriod 
                        ? "text-accent drop-shadow-[0_0_20px_rgba(255,77,0,0.6)] animate-pulse" 
                        : "text-ink group-hover/letter:text-accent"
                    )}
                    style={{ transform: "translateZ(10px)" }}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col lg:items-start items-center gap-4">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setIsEditing(false);
                }
              }}
              onInput={handleTextChange}
              className={cn(
                "inline-block min-w-[200px] lg:text-left text-center border-b border-dashed border-accent outline-none caret-accent text-ink whitespace-nowrap",
                className
              )}
              ref={(el) => {
                if (el && isEditing) {
                  el.focus();
                  // Put caret at end
                  const range = document.createRange();
                  const sel = window.getSelection();
                  range.selectNodeContents(el);
                  range.collapse(false);
                  sel?.removeAllRanges();
                  sel?.addRange(range);
                }
              }}
            >
              {inputText}
            </span>
            <span className="text-[10px] font-mono tracking-widest opacity-40 uppercase animate-pulse">
              Press Enter or click away to save
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Web Audio API Synthesis Engine for UI Sounds without external assets
let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Try to unlock suspended state
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Ultra-subtle, clean cursor "tick" sound for mouse haptics
 */
export function playHoverSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Smooth frequency decay
    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.012);
    
    // Extremely delicate volume curve to avoid sonic exhaustion
    gain.gain.setValueAtTime(0.002, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.012);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.015);
  } catch (e) {
    // Fail silently to prevent app crashing
  }
}

/**
 * Warm physical keyboard switch/accent click sound for interactive elements
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Use triangle wave for a warm woodblock-like tone
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.035);
    
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.045);
  } catch (e) {
    // Silence errors
  }
}

/**
 * Low frequency sweeping sweep/whoosh sound accompanying PageTransitions
 */
export function playTransitionSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.45);
    
    // Subtle low background curve
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Silence errors
  }
}

/**
 * Elegant Major Pentatonic Chime triggered upon successful user inputs / payments / triggers
 */
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 representing success arpeggio
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.025, now + idx * 0.06 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.28);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.35);
    });
  } catch (e) {
    // Silence errors
  }
}

/**
 * Gentle error alert detuned buzzer
 */
export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const freqs = [180, 177]; // Dual oscillator detuned pair
    
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.3);
    });
  } catch (e) {
    // Silence errors
  }
}

// Global Interaction Interceptor which dynamically hooks into the document to play haptic audio
export function initGlobalSounds() {
  if (typeof window === "undefined") return () => {};
  
  let lastHovered: Element | null = null;
  
  const handleClick = (e: MouseEvent) => {
    // Try to trigger context wakeup
    getAudioContext();
    
    const target = (e.target as Element).closest('button, a, [role="button"], input[type="submit"], input[type="button"], .cursor-pointer, [data-sound="click"]');
    if (target) {
      const customSound = target.getAttribute("data-sound");
      if (customSound === "success") {
        playSuccessSound();
      } else if (customSound === "error") {
        playErrorSound();
      } else if (customSound === "transition") {
        playTransitionSound();
      } else {
        playClickSound();
      }
    }
  };
  
  const handleMouseOver = (e: MouseEvent) => {
    const target = (e.target as Element).closest('button, a, [role="button"], .cursor-pointer, [data-sound="hover"], input[type="submit"]');
    if (target) {
      if (lastHovered === target) return;
      lastHovered = target;
      playHoverSound();
    } else {
      lastHovered = null;
    }
  };
  
  document.addEventListener("click", handleClick, { capture: true, passive: true });
  document.addEventListener("mouseover", handleMouseOver, { capture: true, passive: true });
  
  return () => {
    document.removeEventListener("click", handleClick, { capture: true });
    document.removeEventListener("mouseover", handleMouseOver, { capture: true });
  };
}

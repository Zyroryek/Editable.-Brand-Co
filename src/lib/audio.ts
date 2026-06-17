let audioCtx: AudioContext | null = null;

// Persistent getter/setter for state
export const getSoundEnabled = (): boolean => {
  const val = localStorage.getItem("sound_effects_enabled");
  return val === null ? true : val === "true";
};

export const setSoundEnabled = (enabled: boolean) => {
  localStorage.setItem("sound_effects_enabled", String(enabled));
};

export function playNavigationSound() {
  if (!getSoundEnabled()) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Helper to play an organic ambient synth tone
    const playTone = (frequency: number, delay: number, velocity: number) => {
      if (!audioCtx) return;
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      // Sine wave with soft triangle wave mix under-the-hood for warmth
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, now + delay);

      // Low pass filter sweeps are very retro and warm
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, now + delay);
      filter.frequency.exponentialRampToValueAtTime(150, now + delay + 0.3);

      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(velocity, now + delay + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.5);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.6);
    };

    // Minimal elegant interval chime sequence (Major pentatonic sparkle of C5 - E5 - G5)
    playTone(523.25, 0.00, 0.05); // C5 - Primary click root
    playTone(659.25, 0.04, 0.04); // E5 - Secondary third resonance
    playTone(783.99, 0.08, 0.03); // G5 - Ambient fifth shimmer
  } catch (err) {
    console.warn("Audio Context failed to play sound:", err);
  }
}

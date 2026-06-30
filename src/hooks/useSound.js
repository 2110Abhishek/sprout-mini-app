import { useCallback, useRef, useEffect } from 'react';

export const useSound = () => {
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // Initialize lazily to respect browser autoplay policies
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
    };
    window.addEventListener('touchstart', initAudio, { once: true });
    window.addEventListener('click', initAudio, { once: true });
    return () => {
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('click', initAudio);
    };
  }, []);

  const playTone = useCallback((frequency, type, duration, vol = 0.1, slideFreq = null) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Resume context if suspended
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(frequency, now);
    
    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideFreq, now + duration);
    }

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(vol, now + duration * 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  }, []);

  const playCorrect = useCallback(() => {
    const random = Math.floor(Math.random() * 3);
    if (random === 0) {
      // Cheerful double chime
      playTone(523.25, 'sine', 0.2, 0.2); 
      setTimeout(() => playTone(659.25, 'sine', 0.4, 0.2), 100); 
    } else if (random === 1) {
      // Triple arpeggio
      playTone(440, 'sine', 0.1, 0.2); 
      setTimeout(() => playTone(554.37, 'sine', 0.1, 0.2), 80); 
      setTimeout(() => playTone(659.25, 'sine', 0.3, 0.2), 160);
    } else {
      // High bell ping
      playTone(880, 'sine', 0.1, 0.2);
      setTimeout(() => playTone(1046.50, 'sine', 0.4, 0.15), 100);
    }
  }, [playTone]);

  const playWrong = useCallback(() => {
    const random = Math.floor(Math.random() * 3);
    if (random === 0) {
      // Funny slide down (boing)
      playTone(300, 'triangle', 0.5, 0.2, 100); 
    } else if (random === 1) {
      // Low buzz
      playTone(150, 'sawtooth', 0.3, 0.1);
    } else {
      // Two low descending tones (womp womp)
      playTone(200, 'square', 0.2, 0.1);
      setTimeout(() => playTone(150, 'square', 0.3, 0.1), 250);
    }
  }, [playTone]);

  const playPop = useCallback(() => {
    // A quick pop
    playTone(800, 'sine', 0.1, 0.1, 200); 
  }, [playTone]);
  
  const playCheer = useCallback(() => {
    // A little chord for celebrations
    playTone(440, 'sine', 0.6, 0.1); 
    playTone(554.37, 'sine', 0.6, 0.1); 
    playTone(659.25, 'sine', 0.6, 0.1);
  }, [playTone]);

  const playClick = useCallback(() => {
    // A very short, soft click for buttons
    playTone(600, 'sine', 0.05, 0.05, 300);
  }, [playTone]);

  const playSwoosh = useCallback(() => {
    // A soft swoosh for screen transitions or hovers
    playTone(200, 'sine', 0.3, 0.05, 400);
  }, [playTone]);

  return {
    playCorrect,
    playWrong,
    playPop,
    playCheer,
    playClick,
    playSwoosh
  };
};

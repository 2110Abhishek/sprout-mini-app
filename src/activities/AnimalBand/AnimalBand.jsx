import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../hooks/useSound';
import { useProgress } from '../../hooks/useProgress';
import { Music, ArrowLeft, Moon } from 'lucide-react';

const PENTATONIC_SCALE = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
];

const ANIMALS = [
  { id: 1, emoji: '🦁', color: '#FF9F1C', noteIndex: 0 },
  { id: 2, emoji: '🐘', color: '#2EC4B6', noteIndex: 1 },
  { id: 3, emoji: '🐒', color: '#FFBF69', noteIndex: 2 },
  { id: 4, emoji: '🐸', color: '#8AC926', noteIndex: 3 },
  { id: 5, emoji: '🐦', color: '#4CC9F0', noteIndex: 4 },
];

export default function AnimalBand() {
  const navigate = useNavigate();
  const { playTone, playSwoosh, playCheer, playClick } = useSound();
  const { addStars } = useProgress();
  
  const [activeAnimal, setActiveAnimal] = useState(null);
  const [isNightTime, setIsNightTime] = useState(false);
  
  const lullabyInterval = useRef(null);
  const songTimeout = useRef(null);

  // Play a beautiful, gentle lullaby sequence
  const playLullaby = useCallback(() => {
    let noteIndex = 0;
    const lullabyNotes = [392.0, 329.63, 261.63, 329.63, 392.0, 392.0, 392.0];
    
    lullabyInterval.current = setInterval(() => {
      if (noteIndex < lullabyNotes.length) {
        playTone(lullabyNotes[noteIndex], 'sine', 0.5, 0.1);
        noteIndex++;
      } else {
        clearInterval(lullabyInterval.current);
        // Reward and exit after lullaby
        addStars(5);
        playCheer();
        navigate('/activities');
      }
    }, 800);
  }, [playTone, addStars, playCheer, navigate]);

  // Play Twinkle Twinkle Little Star
  const playTwinkleTwinkle = useCallback(() => {
    let noteIndex = 0;
    const melody = [
      // Twinkle, twinkle, little star,
      { f: 261.63, d: 400 }, { f: 261.63, d: 400 }, // C C
      { f: 392.00, d: 400 }, { f: 392.00, d: 400 }, // G G
      { f: 440.00, d: 400 }, { f: 440.00, d: 400 }, // A A
      { f: 392.00, d: 800 },                        // G (hold)
      // How I wonder what you are!
      { f: 349.23, d: 400 }, { f: 349.23, d: 400 }, // F F
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, // E E
      { f: 293.66, d: 400 }, { f: 293.66, d: 400 }, // D D
      { f: 261.63, d: 800 },                        // C (hold)
      // Up above the world so high,
      { f: 392.00, d: 400 }, { f: 392.00, d: 400 }, // G G
      { f: 349.23, d: 400 }, { f: 349.23, d: 400 }, // F F
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, // E E
      { f: 293.66, d: 800 },                        // D (hold)
      // Like a diamond in the sky.
      { f: 392.00, d: 400 }, { f: 392.00, d: 400 }, // G G
      { f: 349.23, d: 400 }, { f: 349.23, d: 400 }, // F F
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, // E E
      { f: 293.66, d: 800 },                        // D (hold)
      // Twinkle, twinkle, little star,
      { f: 261.63, d: 400 }, { f: 261.63, d: 400 }, // C C
      { f: 392.00, d: 400 }, { f: 392.00, d: 400 }, // G G
      { f: 440.00, d: 400 }, { f: 440.00, d: 400 }, // A A
      { f: 392.00, d: 800 },                        // G (hold)
      // How I wonder what you are!
      { f: 349.23, d: 400 }, { f: 349.23, d: 400 }, // F F
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, // E E
      { f: 293.66, d: 400 }, { f: 293.66, d: 400 }, // D D
      { f: 261.63, d: 800 }                         // C (hold)
    ];
    
    // Disable clicks while playing
    setIsNightTime(true); 
    
    const playNextNote = () => {
      if (noteIndex < melody.length) {
        const note = melody[noteIndex];
        playTone(note.f, 'triangle', note.d / 1000, 0.2);
        
        // Visually animate the corresponding animal if it matches our pentatonic scale
        const animalMatch = ANIMALS.find(a => Math.abs(PENTATONIC_SCALE[a.noteIndex] - note.f) < 1);
        if (animalMatch) {
          setActiveAnimal(animalMatch.id);
          setTimeout(() => setActiveAnimal(null), note.d - 50);
        }

        noteIndex++;
        songTimeout.current = setTimeout(playNextNote, note.d + 50);
      } else {
        setIsNightTime(false); // Re-enable clicks
      }
    };
    
    playNextNote();
  }, [playTone]);

  useEffect(() => {
    playSwoosh();
    
    // Natural Sunset Timer (2 minutes = 120000ms, using 15s for quick testing right now)
    // In a real app, this would be 120000ms.
    const sunsetTimer = setTimeout(() => {
      setIsNightTime(true);
      playLullaby();
    }, 120000);

    return () => {
      clearTimeout(sunsetTimer);
      if (lullabyInterval.current) clearInterval(lullabyInterval.current);
      if (songTimeout.current) clearTimeout(songTimeout.current);
    };
  }, [playSwoosh, playLullaby]);

  const handleAnimalClick = (animal) => {
    if (isNightTime) {
      // Gentle chime if clicked during sleep mode
      playTone(880.0, 'sine', 0.2, 0.05);
      return;
    }

    setActiveAnimal(animal.id);
    
    // Determine instrument type based on animal
    const waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];
    const type = waveTypes[animal.id % waveTypes.length];
    
    // Play pentatonic note
    playTone(PENTATONIC_SCALE[animal.noteIndex], type, 0.4, 0.15);

    // Reset animation
    setTimeout(() => {
      setActiveAnimal(null);
    }, 200);
  };

  return (
    <div style={{...styles.container, backgroundColor: isNightTime ? '#1A1A2E' : '#87CEEB'}}>
      <div style={styles.header}>
        <button 
          className="btn-soft"
          style={styles.backButton}
          onClick={() => { 
            playClick(); 
            if (songTimeout.current) clearTimeout(songTimeout.current);
            navigate('/activities'); 
          }}
        >
          <ArrowLeft size={32} />
        </button>
        <div style={{...styles.titleBox, backgroundColor: isNightTime ? 'rgba(255,255,255,0.1)' : 'white'}}>
          <h1 style={{...styles.title, color: isNightTime ? '#EAEAEA' : '#333'}}>
            {isNightTime ? "The Band is Sleepy..." : "Animal Band!"}
          </h1>
        </div>
      </div>

      <AnimatePresence>
        {isNightTime && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.moon}
          >
            <Moon size={100} color="#F4D03F" fill="#F4D03F" />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.stage}>
        {ANIMALS.map(animal => (
          <motion.div
            key={animal.id}
            style={{...styles.animalBlock, backgroundColor: isNightTime ? '#2c3e50' : animal.color}}
            whileHover={!isNightTime ? { scale: 1.05 } : {}}
            whileTap={!isNightTime ? { scale: 0.95 } : {}}
            animate={activeAnimal === animal.id ? { y: -30, rotate: [0, -10, 10, 0] } : { y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={() => handleAnimalClick(animal)}
          >
            <span style={styles.emoji}>
              {isNightTime && activeAnimal !== animal.id ? '😴' : animal.emoji}
            </span>
          </motion.div>
        ))}
      </div>
      
      {!isNightTime && (
        <div style={styles.controls}>
          <button className="btn-soft btn-blue" onClick={playTwinkleTwinkle}>
            🎵 Play a Song!
          </button>
        </div>
      )}
      
      {/* Decorative Stage Floor */}
      <div style={{...styles.floor, backgroundColor: isNightTime ? '#0F3460' : '#7CFC00'}} />
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'background-color 5s ease-in-out',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    padding: '2rem',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    padding: '1rem',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#333',
  },
  titleBox: {
    padding: '1rem 2rem',
    borderRadius: '2rem',
    boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
    transition: 'background-color 5s ease-in-out',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 5s ease-in-out',
  },
  stage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: '20vh',
    zIndex: 2,
  },
  animalBlock: {
    width: '80px',
    height: '100px',
    borderRadius: '20px 20px 10px 10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '10px',
    cursor: 'pointer',
    boxShadow: '0 10px 0 rgba(0,0,0,0.2)',
    transition: 'background-color 5s ease-in-out',
  },
  emoji: {
    fontSize: '3rem',
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25vh',
    borderTopLeftRadius: '50% 20%',
    borderTopRightRadius: '50% 20%',
    zIndex: 1,
    transition: 'background-color 5s ease-in-out',
  },
  controls: {
    position: 'absolute',
    bottom: '5vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 10,
  },
  moon: {
    position: 'absolute',
    top: '20%',
    right: '20%',
    zIndex: 1,
  }
};

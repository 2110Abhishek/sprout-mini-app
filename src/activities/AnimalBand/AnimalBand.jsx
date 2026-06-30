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

const SONGS = [
  {
    title: "Twinkle Twinkle Little Star",
    melody: [
      { f: 261.63, d: 400 }, { f: 261.63, d: 400 }, // C C
      { f: 392.00, d: 400 }, { f: 392.00, d: 400 }, // G G
      { f: 440.00, d: 400 }, { f: 440.00, d: 400 }, // A A
      { f: 392.00, d: 800 },                        // G (hold)
      { f: 349.23, d: 400 }, { f: 349.23, d: 400 }, // F F
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, // E E
      { f: 293.66, d: 400 }, { f: 293.66, d: 400 }, // D D
      { f: 261.63, d: 800 },                        // C (hold)
      { f: 392.00, d: 400 }, { f: 392.00, d: 400 }, // G G
      { f: 349.23, d: 400 }, { f: 349.23, d: 400 }, // F F
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, // E E
      { f: 293.66, d: 800 },                        // D (hold)
      { f: 392.00, d: 400 }, { f: 392.00, d: 400 }, // G G
      { f: 349.23, d: 400 }, { f: 349.23, d: 400 }, // F F
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, // E E
      { f: 293.66, d: 800 },                        // D (hold)
      { f: 261.63, d: 400 }, { f: 261.63, d: 400 }, // C C
      { f: 392.00, d: 400 }, { f: 392.00, d: 400 }, // G G
      { f: 440.00, d: 400 }, { f: 440.00, d: 400 }, // A A
      { f: 392.00, d: 800 },                        // G (hold)
      { f: 349.23, d: 400 }, { f: 349.23, d: 400 }, // F F
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, // E E
      { f: 293.66, d: 400 }, { f: 293.66, d: 400 }, // D D
      { f: 261.63, d: 800 }                         // C (hold)
    ]
  },
  {
    title: "Mary Had a Little Lamb",
    melody: [
      { f: 329.63, d: 400 }, { f: 293.66, d: 400 }, { f: 261.63, d: 400 }, { f: 293.66, d: 400 }, // E D C D
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, { f: 329.63, d: 800 },                        // E E E
      { f: 293.66, d: 400 }, { f: 293.66, d: 400 }, { f: 293.66, d: 800 },                        // D D D
      { f: 329.63, d: 400 }, { f: 392.00, d: 400 }, { f: 392.00, d: 800 },                        // E G G
      { f: 329.63, d: 400 }, { f: 293.66, d: 400 }, { f: 261.63, d: 400 }, { f: 293.66, d: 400 }, // E D C D
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, // E E E E
      { f: 293.66, d: 400 }, { f: 293.66, d: 400 }, { f: 329.63, d: 400 }, { f: 293.66, d: 400 }, // D D E D
      { f: 261.63, d: 800 }                                                                       // C
    ]
  },
  {
    title: "Old MacDonald Had a Farm",
    melody: [
      { f: 392.00, d: 400 }, { f: 392.00, d: 400 }, { f: 392.00, d: 400 }, // G G G
      { f: 261.63, d: 400 }, { f: 261.63, d: 400 }, { f: 261.63, d: 800 }, // C C C
      { f: 293.66, d: 400 }, { f: 293.66, d: 400 }, { f: 261.63, d: 800 }, // D D C
      { f: 329.63, d: 400 }, { f: 329.63, d: 400 }, { f: 293.66, d: 400 }, { f: 293.66, d: 400 }, // E E D D
      { f: 261.63, d: 800 }                                                                       // C
    ]
  },
  {
    title: "Row Your Boat",
    melody: [
      { f: 261.63, d: 600 }, { f: 261.63, d: 600 }, { f: 261.63, d: 400 }, { f: 293.66, d: 200 }, { f: 329.63, d: 600 }, // C C C D E
      { f: 329.63, d: 400 }, { f: 293.66, d: 200 }, { f: 329.63, d: 400 }, { f: 349.23, d: 200 }, { f: 392.00, d: 800 }, // E D E F G
      { f: 523.25, d: 200 }, { f: 523.25, d: 200 }, { f: 523.25, d: 200 },                         // C C C (high)
      { f: 392.00, d: 200 }, { f: 392.00, d: 200 }, { f: 392.00, d: 200 },                         // G G G
      { f: 329.63, d: 200 }, { f: 329.63, d: 200 }, { f: 329.63, d: 200 },                         // E E E
      { f: 261.63, d: 200 }, { f: 261.63, d: 200 }, { f: 261.63, d: 200 },                         // C C C
      { f: 392.00, d: 400 }, { f: 349.23, d: 200 }, { f: 329.63, d: 400 }, { f: 293.66, d: 200 }, { f: 261.63, d: 800 }  // G F E D C
    ]
  },
  {
    title: "Brother John",
    melody: [
      { f: 261.63, d: 400 }, { f: 293.66, d: 400 }, { f: 329.63, d: 400 }, { f: 261.63, d: 400 }, // C D E C
      { f: 261.63, d: 400 }, { f: 293.66, d: 400 }, { f: 329.63, d: 400 }, { f: 261.63, d: 400 }, // C D E C
      { f: 329.63, d: 400 }, { f: 349.23, d: 400 }, { f: 392.00, d: 800 },                        // E F G
      { f: 329.63, d: 400 }, { f: 349.23, d: 400 }, { f: 392.00, d: 800 },                        // E F G
      { f: 392.00, d: 200 }, { f: 440.00, d: 200 }, { f: 392.00, d: 200 }, { f: 349.23, d: 200 }, { f: 329.63, d: 400 }, { f: 261.63, d: 400 }, // G A G F E C
      { f: 392.00, d: 200 }, { f: 440.00, d: 200 }, { f: 392.00, d: 200 }, { f: 349.23, d: 200 }, { f: 329.63, d: 400 }, { f: 261.63, d: 400 }  // G A G F E C
    ]
  }
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
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  
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

  // Play the currently selected auto song
  const playAutoSong = useCallback(() => {
    let noteIndex = 0;
    const melody = SONGS[currentSongIndex].melody;
    
    // Disable clicks while playing
    setIsPlayingSong(true); 
    
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
        setIsPlayingSong(false); // Re-enable clicks
      }
    };
    
    playNextNote();
  }, [playTone, currentSongIndex]);

  const changeSong = () => {
    playClick();
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
  };

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
    };
  }, [playSwoosh, playLullaby]);

  // Separate unmount cleanup for the song timeout
  useEffect(() => {
    return () => {
      if (songTimeout.current) clearTimeout(songTimeout.current);
    };
  }, []);

  const handleAnimalClick = (animal) => {
    if (isNightTime || isPlayingSong) {
      // Gentle chime if clicked during sleep mode or while song is playing
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
            whileHover={!isNightTime && !isPlayingSong ? { scale: 1.05 } : {}}
            whileTap={!isNightTime && !isPlayingSong ? { scale: 0.95 } : {}}
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
      
      {!isNightTime && !isPlayingSong && (
        <div style={styles.controls}>
          <div style={styles.songCard}>
            <div style={styles.songTitle}>🎵 {SONGS[currentSongIndex].title}</div>
            <div style={styles.buttonGroup}>
              <button className="btn-soft btn-blue" style={styles.songBtn} onClick={playAutoSong}>
                Play
              </button>
              <button className="btn-soft btn-green" style={styles.songBtn} onClick={changeSong}>
                Next Song 🔁
              </button>
            </div>
          </div>
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
  songCard: {
    background: 'white',
    padding: '1rem',
    borderRadius: '20px',
    boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    width: '80%',
    maxWidth: '300px',
  },
  songTitle: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
  },
  songBtn: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '12px',
    textTransform: 'none',
    letterSpacing: 'normal',
    boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
  },
  moon: {
    position: 'absolute',
    top: '20%',
    right: '20%',
    zIndex: 1,
  }
};

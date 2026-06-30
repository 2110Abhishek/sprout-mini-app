import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useProgress } from '../../hooks/useProgress';
import { useSound } from '../../hooks/useSound';
import { XCircle, CheckCircle2, RefreshCw } from 'lucide-react';

const COLORS = ['#FF4D4D', '#4DFF4D', '#4D4DFF', '#FFFF4D', '#FFB7B2', '#B5EAD7', '#C7CEEA', '#FFFFFF'];

// 1. Butterfly SVG (5 parts)
const ButterflySVG = ({ colors, onColorPath }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
    <motion.path d="M 100 100 C 60 50, 20 20, 10 60 C 0 100, 50 120, 100 100 Z" fill={colors.leftUpper || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('leftUpper')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 100 100 C 140 50, 180 20, 190 60 C 200 100, 150 120, 100 100 Z" fill={colors.rightUpper || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('rightUpper')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 100 100 C 70 140, 30 180, 40 190 C 70 200, 90 150, 100 100 Z" fill={colors.leftLower || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('leftLower')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 100 100 C 130 140, 170 180, 160 190 C 130 200, 110 150, 100 100 Z" fill={colors.rightLower || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('rightLower')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="100" cy="100" rx="10" ry="40" fill={colors.body || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('body')} whileTap={{ scale: 0.95 }} />
    <path d="M 100 60 C 90 40, 80 30, 70 40" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
    <path d="M 100 60 C 110 40, 120 30, 130 40" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// 2. Bird SVG (5 parts)
const BirdSVG = ({ colors, onColorPath }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
    <motion.path d="M 60 100 L 20 70 L 20 130 Z" fill={colors.tail || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('tail')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 100 90 C 120 40, 80 20, 60 50 Z" fill={colors.topWing || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('topWing')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="100" cy="100" rx="50" ry="40" fill={colors.body || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('body')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 100 110 C 120 160, 80 180, 60 150 Z" fill={colors.bottomWing || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('bottomWing')} whileTap={{ scale: 0.95 }} />
    <motion.polygon points="148,90 180,100 148,110" fill={colors.beak || '#f0f0f0'} stroke="#333" strokeWidth="4" strokeLinejoin="round" onClick={() => onColorPath('beak')} whileTap={{ scale: 0.95 }} />
    <circle cx="125" cy="85" r="5" fill="#333" />
  </svg>
);

// 3. Fish SVG (5 parts)
const FishSVG = ({ colors, onColorPath }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
    <motion.path d="M 50 100 L 10 50 L 10 150 Z" fill={colors.tail || '#f0f0f0'} stroke="#333" strokeWidth="4" strokeLinejoin="round" onClick={() => onColorPath('tail')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 100 70 C 120 30, 140 50, 150 70 Z" fill={colors.topFin || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('topFin')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 100 130 C 120 170, 140 150, 150 130 Z" fill={colors.bottomFin || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('bottomFin')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="110" cy="100" rx="60" ry="40" fill={colors.body || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('body')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="100" cy="100" rx="15" ry="35" fill={colors.stripe || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('stripe')} whileTap={{ scale: 0.95 }} />
    <circle cx="145" cy="90" r="5" fill="#333" />
    <path d="M 155 110 C 160 115, 165 115, 170 110" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// 4. Turtle SVG (6 parts)
const TurtleSVG = ({ colors, onColorPath }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
    <motion.circle cx="100" cy="40" r="20" fill={colors.head || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('head')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="50" cy="70" rx="25" ry="15" transform="rotate(-30 50 70)" fill={colors.topLeft || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('topLeft')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="150" cy="70" rx="25" ry="15" transform="rotate(30 150 70)" fill={colors.topRight || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('topRight')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="60" cy="150" rx="20" ry="15" transform="rotate(-60 60 150)" fill={colors.bottomLeft || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('bottomLeft')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="140" cy="150" rx="20" ry="15" transform="rotate(60 140 150)" fill={colors.bottomRight || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('bottomRight')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="100" cy="110" rx="50" ry="60" fill={colors.shell || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('shell')} whileTap={{ scale: 0.95 }} />
    <circle cx="90" cy="35" r="3" fill="#333" />
    <circle cx="110" cy="35" r="3" fill="#333" />
  </svg>
);

// 5. Elephant SVG (5 parts)
const ElephantSVG = ({ colors, onColorPath }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
    <motion.ellipse cx="110" cy="110" rx="45" ry="35" fill={colors.body || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('body')} whileTap={{ scale: 0.95 }} />
    <motion.circle cx="70" cy="90" r="25" fill={colors.head || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('head')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="95" cy="85" rx="15" ry="25" transform="rotate(-15 95 85)" fill={colors.ear || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('ear')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 50 100 C 30 110, 30 140, 50 150 C 60 155, 65 145, 55 140 C 45 130, 45 110, 60 105 Z" fill={colors.trunk || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('trunk')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 90 140 L 90 170 L 110 170 L 110 140 Z M 130 135 L 130 170 L 150 170 L 150 130 Z" fill={colors.legs || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('legs')} whileTap={{ scale: 0.95 }} />
    <circle cx="65" cy="85" r="3" fill="#333" />
  </svg>
);

// 6. Rabbit SVG (5 parts)
const RabbitSVG = ({ colors, onColorPath }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
    <motion.ellipse cx="100" cy="120" rx="40" ry="45" fill={colors.body || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('body')} whileTap={{ scale: 0.95 }} />
    <motion.circle cx="100" cy="70" r="30" fill={colors.head || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('head')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="85" cy="30" rx="10" ry="30" transform="rotate(-15 85 30)" fill={colors.leftEar || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('leftEar')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="115" cy="30" rx="10" ry="30" transform="rotate(15 115 30)" fill={colors.rightEar || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('rightEar')} whileTap={{ scale: 0.95 }} />
    <motion.circle cx="145" cy="140" r="15" fill={colors.tail || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('tail')} whileTap={{ scale: 0.95 }} />
    <circle cx="90" cy="65" r="3" fill="#333" />
    <circle cx="110" cy="65" r="3" fill="#333" />
    <path d="M 100 75 L 95 80 L 105 80 Z" fill="#FFB7B2" />
  </svg>
);

// 7. Frog SVG (5 parts)
const FrogSVG = ({ colors, onColorPath }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
    <motion.ellipse cx="100" cy="110" rx="45" ry="40" fill={colors.body || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('body')} whileTap={{ scale: 0.95 }} />
    <motion.circle cx="75" cy="70" r="15" fill={colors.leftEye || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('leftEye')} whileTap={{ scale: 0.95 }} />
    <motion.circle cx="125" cy="70" r="15" fill={colors.rightEye || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('rightEye')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="45" cy="130" rx="15" ry="30" transform="rotate(30 45 130)" fill={colors.leftLeg || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('leftLeg')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="155" cy="130" rx="15" ry="30" transform="rotate(-30 155 130)" fill={colors.rightLeg || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('rightLeg')} whileTap={{ scale: 0.95 }} />
    <circle cx="75" cy="70" r="5" fill="#333" />
    <circle cx="125" cy="70" r="5" fill="#333" />
    <path d="M 85 95 C 100 105, 115 95, 115 95" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// 8. Cat SVG (5 parts)
const CatSVG = ({ colors, onColorPath }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
    <motion.ellipse cx="100" cy="130" rx="40" ry="45" fill={colors.body || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('body')} whileTap={{ scale: 0.95 }} />
    <motion.circle cx="100" cy="70" r="35" fill={colors.head || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('head')} whileTap={{ scale: 0.95 }} />
    <motion.polygon points="75,45 60,10 90,40" fill={colors.leftEar || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('leftEar')} whileTap={{ scale: 0.95 }} />
    <motion.polygon points="125,45 140,10 110,40" fill={colors.rightEar || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('rightEar')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 140 140 C 160 140, 180 120, 160 100" fill="none" stroke={colors.tail || '#f0f0f0'} strokeWidth="12" strokeLinecap="round" onClick={() => onColorPath('tail')} whileTap={{ scale: 0.95 }} />
    <circle cx="85" cy="65" r="4" fill="#333" />
    <circle cx="115" cy="65" r="4" fill="#333" />
    <polygon points="95,75 105,75 100,80" fill="#FFB7B2" />
  </svg>
);

// 9. Bear SVG (5 parts)
const BearSVG = ({ colors, onColorPath }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
    <motion.ellipse cx="100" cy="130" rx="50" ry="55" fill={colors.body || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('body')} whileTap={{ scale: 0.95 }} />
    <motion.circle cx="100" cy="70" r="40" fill={colors.head || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('head')} whileTap={{ scale: 0.95 }} />
    <motion.circle cx="65" cy="40" r="15" fill={colors.leftEar || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('leftEar')} whileTap={{ scale: 0.95 }} />
    <motion.circle cx="135" cy="40" r="15" fill={colors.rightEar || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('rightEar')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="100" cy="85" rx="15" ry="10" fill={colors.snout || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('snout')} whileTap={{ scale: 0.95 }} />
    <circle cx="85" cy="60" r="4" fill="#333" />
    <circle cx="115" cy="60" r="4" fill="#333" />
    <circle cx="100" cy="82" r="3" fill="#333" />
  </svg>
);

// 10. Pig SVG (6 parts)
const PigSVG = ({ colors, onColorPath }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
    <motion.ellipse cx="100" cy="120" rx="50" ry="45" fill={colors.body || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('body')} whileTap={{ scale: 0.95 }} />
    <motion.circle cx="100" cy="70" r="35" fill={colors.head || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('head')} whileTap={{ scale: 0.95 }} />
    <motion.polygon points="75,45 60,25 90,45" fill={colors.leftEar || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('leftEar')} whileTap={{ scale: 0.95 }} />
    <motion.polygon points="125,45 140,25 110,45" fill={colors.rightEar || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('rightEar')} whileTap={{ scale: 0.95 }} />
    <motion.ellipse cx="100" cy="85" rx="12" ry="8" fill={colors.snout || '#f0f0f0'} stroke="#333" strokeWidth="4" onClick={() => onColorPath('snout')} whileTap={{ scale: 0.95 }} />
    <motion.path d="M 150 120 C 170 110, 160 90, 170 100 C 180 110, 190 90, 180 80" fill="none" stroke={colors.tail || '#f0f0f0'} strokeWidth="4" strokeLinecap="round" onClick={() => onColorPath('tail')} whileTap={{ scale: 0.95 }} />
    <circle cx="85" cy="65" r="3" fill="#333" />
    <circle cx="115" cy="65" r="3" fill="#333" />
    <circle cx="95" cy="85" r="2" fill="#333" />
    <circle cx="105" cy="85" r="2" fill="#333" />
  </svg>
);

const ANIMALS = [
  { id: 'butterfly', component: ButterflySVG, parts: 5 },
  { id: 'bird', component: BirdSVG, parts: 5 },
  { id: 'fish', component: FishSVG, parts: 5 },
  { id: 'turtle', component: TurtleSVG, parts: 6 },
  { id: 'elephant', component: ElephantSVG, parts: 5 },
  { id: 'rabbit', component: RabbitSVG, parts: 5 },
  { id: 'frog', component: FrogSVG, parts: 5 },
  { id: 'cat', component: CatSVG, parts: 5 },
  { id: 'bear', component: BearSVG, parts: 5 },
  { id: 'pig', component: PigSVG, parts: 6 }
];

export default function ColoringGame() {
  const navigate = useNavigate();
  const { addStars, completeActivity, unlockBadge } = useProgress();
  const { playPop, playCheer, playClick } = useSound();
  
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [pathColors, setPathColors] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);

  useEffect(() => {
    // Pick random animal on start
    setCurrentAnimalIndex(Math.floor(Math.random() * ANIMALS.length));
  }, []);

  const animal = ANIMALS[currentAnimalIndex];
  const CurrentSVG = animal ? animal.component : ButterflySVG;

  const handleColorPath = (pathId) => {
    if (isDone) return;
    
    setPathColors(prev => {
      const newColors = { ...prev, [pathId]: selectedColor };
      playPop();
      
      if (Object.keys(newColors).length === animal.parts) {
        setIsDone(true);
        setShowConfetti(true);
        addStars(2);
        playCheer();
        setTimeout(() => {
          completeActivity();
          unlockBadge('Little Artist');
          // Allow them to continue or leave
        }, 2000);
      }
      return newColors;
    });
  };

  const loadNextAnimal = () => {
    playClick();
    setIsDone(false);
    setShowConfetti(false);
    setPathColors({});
    setCurrentAnimalIndex((prev) => (prev + 1) % ANIMALS.length);
  };

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      
      <button style={styles.closeBtn} onClick={() => { playClick(); navigate('/activities'); }}>
        <XCircle size={40} color="var(--color-primary)" fill="white" />
      </button>
      
      {isDone && (
        <button style={styles.nextBtn} onClick={loadNextAnimal}>
          <RefreshCw size={32} color="var(--color-secondary)" fill="white" />
        </button>
      )}

      <div style={styles.header}>
        <h2>Magic Coloring Studio</h2>
      </div>

      <div style={styles.canvasArea}>
        <AnimatePresence>
          {isDone && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: 1, rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1, repeat: 3 }}
              style={styles.doneMessage}
            >
              It's alive!
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          animate={isDone ? { y: [-10, 10, -10], rotate: [0, 5, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <CurrentSVG colors={pathColors} onColorPath={handleColorPath} />
        </motion.div>
      </div>

      <div style={styles.paletteArea}>
        {COLORS.map(color => (
          <motion.div
            key={color}
            style={{
              ...styles.colorSwatch,
              backgroundColor: color,
              border: selectedColor === color ? '4px solid #333' : '4px solid transparent',
              transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)'
            }}
            onClick={() => {
              setSelectedColor(color);
              playPop();
            }}
            whileTap={{ scale: 0.9 }}
          >
            {selectedColor === color && <CheckCircle2 color="#333" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FAF3E0', // Soft paper color
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 10,
  },
  nextBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 10,
  },
  header: {
    paddingTop: '4rem',
    textAlign: 'center',
    color: '#333',
  },
  canvasArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '1rem',
  },
  doneMessage: {
    position: 'absolute',
    top: '-20px',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
    background: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '24px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    zIndex: 20,
  },
  paletteArea: {
    background: 'white',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
  },
  colorSwatch: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'border 0.2s, transform 0.2s',
  }
};

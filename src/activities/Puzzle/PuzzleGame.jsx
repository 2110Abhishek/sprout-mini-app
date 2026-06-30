import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useProgress } from '../../hooks/useProgress';
import { useSound } from '../../hooks/useSound';
import { XCircle } from 'lucide-react';

const SHAPES = [
  { id: 'circle', icon: '🔴', name: 'Circle' },
  { id: 'square', icon: '🟩', name: 'Square' },
  { id: 'star', icon: '⭐', name: 'Star' },
  { id: 'heart', icon: '❤️', name: 'Heart' },
  { id: 'moon', icon: '🌙', name: 'Moon' }
];

export default function PuzzleGame() {
  const navigate = useNavigate();
  const { addStars, completeActivity, unlockBadge } = useProgress();
  const { playCorrect, playWrong, playCheer } = useSound();
  
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [placed, setPlaced] = useState(false);

  const startRound = () => {
    let shuffled = [...SHAPES].sort(() => 0.5 - Math.random());
    let selectedTarget = shuffled[0];
    let selectedOptions = shuffled.slice(0, 3).sort(() => 0.5 - Math.random());
    
    setTarget(selectedTarget);
    setOptions(selectedOptions);
    setPlaced(false);
    setShowConfetti(false);
  };

  useEffect(() => {
    startRound();
  }, [score]);

  const handleSelect = (shape) => {
    if (placed) return;

    if (shape.id === target.id) {
      playCorrect();
      setPlaced(true);
      addStars(1);
      
      setTimeout(() => {
        if (score + 1 >= 5) {
          playCheer();
          setShowConfetti(true);
          completeActivity();
          unlockBadge('Master Builder');
          setTimeout(() => navigate('/rewards'), 3000);
        } else {
          setScore(s => s + 1);
        }
      }, 2000);
    } else {
      playWrong();
      const el = document.getElementById(`shape-${shape.id}`);
      if (el) {
        el.animate([
          { transform: 'translateX(0px)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(0px)' }
        ], { duration: 300 });
      }
    }
  };

  if (!target) return null;

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      
      <button style={styles.closeBtn} onClick={() => navigate('/activities')}>
        <XCircle size={40} color="var(--color-primary)" fill="white" />
      </button>

      <div style={styles.header}>
        <h2>Find the missing piece!</h2>
      </div>

      <div style={styles.puzzleArea}>
        <div style={styles.targetSlot}>
          <AnimatePresence>
            {!placed ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: '8rem', filter: 'brightness(0)' }}
              >
                {target.icon}
              </motion.div>
            ) : (
              <motion.div
                key="filled"
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                transition={{ type: "spring", bounce: 0.5 }}
                style={{ fontSize: '8rem' }}
              >
                {target.icon}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={styles.optionsArea}>
        {options.map((shape) => (
          <motion.div
            key={shape.id}
            id={`shape-${shape.id}`}
            style={{
              ...styles.optionPiece,
              opacity: placed && shape.id !== target.id ? 0.3 : 1
            }}
            whileHover={!placed ? { scale: 1.1 } : {}}
            whileTap={!placed ? { scale: 0.9 } : {}}
            onClick={() => handleSelect(shape)}
          >
            {shape.icon}
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
    backgroundColor: '#C7CEEA', // Pastel Purple
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
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
  header: {
    paddingTop: '4rem',
    textAlign: 'center',
    color: '#333',
  },
  puzzleArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetSlot: {
    width: '200px',
    height: '200px',
    border: '8px dashed rgba(255,255,255,0.5)',
    borderRadius: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  optionsArea: {
    height: '180px',
    background: 'white',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '1rem',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box'
  },
  optionPiece: {
    fontSize: '3.5rem',
    cursor: 'pointer',
    background: 'var(--color-background)',
    padding: '1rem',
    borderRadius: '24px',
    boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
  }
};

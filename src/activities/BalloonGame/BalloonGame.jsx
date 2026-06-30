import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useProgress } from '../../hooks/useProgress';
import { useSound } from '../../hooks/useSound';
import { XCircle } from 'lucide-react';

const BALLOON_DATA = [
  { id: 'red', color: '#FF4D4D', label: 'Red' },
  { id: 'green', color: '#4DFF4D', label: 'Green' },
  { id: 'blue', color: '#4D4DFF', label: 'Blue' },
  { id: 'yellow', color: '#FFFF4D', label: 'Yellow' },
  { id: 'dog', color: '#E2F0CB', label: 'Dog', emoji: '🐶' },
  { id: 'apple', color: '#FFB7B2', label: 'Apple', emoji: '🍎' },
];

export default function BalloonGame() {
  const navigate = useNavigate();
  const { addStars, completeActivity, unlockBadge } = useProgress();
  const { playCorrect, playWrong, playCheer } = useSound();
  const [target, setTarget] = useState(null);
  const [balloons, setBalloons] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);

  // Initialize round
  const startRound = () => {
    const shuffled = [...BALLOON_DATA].sort(() => 0.5 - Math.random());
    const selectedBalloons = shuffled.slice(0, 3 + Math.floor(score / 3)); // Increase difficulty slightly
    setBalloons(selectedBalloons);
    setTarget(selectedBalloons[Math.floor(Math.random() * selectedBalloons.length)]);
    setShowConfetti(false);
  };

  useEffect(() => {
    startRound();
  }, [score]);

  const handlePop = (balloon) => {
    if (balloon.id === target.id) {
      // Correct!
      playCorrect();
      setShowConfetti(true);
      addStars(1);
      
      setTimeout(() => {
        if (score + 1 >= 5) {
          playCheer();
          completeActivity();
          unlockBadge('Balloon Hero Trophy');
          navigate('/rewards');
        } else {
          setScore(s => s + 1);
        }
      }, 2000);
    } else {
      // Wrong - gentle wiggle animation (handled by framer motion below)
      playWrong();
      const el = document.getElementById(`balloon-${balloon.id}`);
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

      <div style={styles.mascotArea}>
        <span style={styles.mascot}>🐦</span>
        <div style={styles.bubble}>
          <h2>Can you find the {target.label}?</h2>
        </div>
      </div>

      <div style={styles.balloonArea}>
        <AnimatePresence>
          {balloons.map((b, i) => (
            <motion.div
              key={b.id}
              id={`balloon-${b.id}`}
              initial={{ y: 500, opacity: 0 }}
              animate={{ 
                y: [0, -20, 0], 
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                y: { repeat: Infinity, duration: 2 + Math.random(), ease: "easeInOut" },
                opacity: { duration: 0.5 }
              }}
              style={{
                ...styles.balloon,
                backgroundColor: b.color,
                left: `${10 + (i * (80 / balloons.length))}%` // Distribute evenly
              }}
              onClick={() => handlePop(b)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {b.emoji && <span style={styles.balloonEmoji}>{b.emoji}</span>}
              <div style={styles.string}></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#87CEEB', // Sky blue
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
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
  mascotArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '4rem',
    zIndex: 5,
  },
  mascot: {
    fontSize: '5rem',
  },
  bubble: {
    background: 'white',
    padding: '1rem 2rem',
    borderRadius: '24px',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  balloonArea: {
    flex: 1,
    position: 'relative',
  },
  balloon: {
    position: 'absolute',
    width: '80px',
    height: '100px',
    borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
    bottom: '20%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: 'inset -10px -10px 0 rgba(0,0,0,0.1)',
    zIndex: 2,
  },
  balloonEmoji: {
    fontSize: '2.5rem',
  },
  string: {
    position: 'absolute',
    bottom: '-40px',
    width: '2px',
    height: '40px',
    backgroundColor: 'rgba(255,255,255,0.8)',
  }
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../../hooks/useProgress';
import { useSound } from '../../hooks/useSound';
import { XCircle, Heart } from 'lucide-react';
import Confetti from 'react-confetti';

const FOOD_ITEMS = [
  { id: 'apple', emoji: '🍎', healthy: true },
  { id: 'banana', emoji: '🍌', healthy: true },
  { id: 'carrot', emoji: '🥕', healthy: true },
  { id: 'watermelon', emoji: '🍉', healthy: true },
  { id: 'grapes', emoji: '🍇', healthy: true },
  { id: 'donut', emoji: '🍩', healthy: false },
  { id: 'fries', emoji: '🍟', healthy: false },
  { id: 'chocolate', emoji: '🍫', healthy: false },
];

export default function PandaGame() {
  const navigate = useNavigate();
  const { addStars, completeActivity, unlockBadge } = useProgress();
  const { playCorrect, playWrong, playCheer } = useSound();
  const [currentFoods, setCurrentFoods] = useState([]);
  const [pandaState, setPandaState] = useState('hungry'); // hungry, eating, sad
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const startRound = () => {
    // Pick 3 random foods, ensure at least one is healthy
    let shuffled = [...FOOD_ITEMS].sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 3);
    
    if (!selected.some(f => f.healthy)) {
      const healthyItem = FOOD_ITEMS.find(f => f.healthy);
      selected[0] = healthyItem;
    }
    
    setCurrentFoods(selected.sort(() => 0.5 - Math.random()));
    setPandaState('hungry');
    setShowConfetti(false);
  };

  useEffect(() => {
    startRound();
  }, [score]);

  const handleFeed = (food) => {
    if (food.healthy) {
      playCorrect();
      setPandaState('eating');
      addStars(1);
      setTimeout(() => {
        if (score + 1 >= 5) {
          playCheer();
          setShowConfetti(true);
          completeActivity();
          unlockBadge('Healthy Hero');
          setTimeout(() => navigate('/rewards'), 3000);
        } else {
          setScore(s => s + 1);
        }
      }, 1500);
    } else {
      playWrong();
      setPandaState('sad');
      const el = document.getElementById(`food-${food.id}`);
      if (el) {
        el.animate([
          { transform: 'translateX(0px)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(0px)' }
        ], { duration: 300 });
      }
      setTimeout(() => setPandaState('hungry'), 2000);
    }
  };

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <button style={styles.closeBtn} onClick={() => navigate('/activities')}>
        <XCircle size={40} color="var(--color-primary)" fill="white" />
      </button>

      <div style={styles.header}>
        <h2>Help feed Panda healthy food!</h2>
      </div>

      <div style={styles.pandaArea}>
        <motion.div 
          animate={
            pandaState === 'eating' ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : 
            pandaState === 'sad' ? { x: [-10, 10, -10, 10, 0] } : 
            { y: [0, -10, 0] }
          }
          transition={{ repeat: pandaState === 'hungry' ? Infinity : 0, duration: 1.5 }}
          style={styles.panda}
        >
          {pandaState === 'hungry' && '🐼'}
          {pandaState === 'eating' && '😋'}
          {pandaState === 'sad' && '😖'}
          
          <AnimatePresence>
            {pandaState === 'eating' && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -50, scale: 1.5 }}
                exit={{ opacity: 0 }}
                style={styles.heartIcon}
              >
                <Heart fill="#FF4D4D" color="#FF4D4D" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div style={styles.foodArea}>
        {currentFoods.map((food, idx) => (
          <motion.div
            key={`${food.id}-${idx}`}
            id={`food-${food.id}`}
            style={styles.foodItem}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleFeed(food)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {food.emoji}
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
    backgroundColor: 'var(--color-secondary)',
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
    color: '#2D6A4F',
  },
  pandaArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panda: {
    fontSize: '10rem',
    position: 'relative',
  },
  heartIcon: {
    position: 'absolute',
    top: '0',
    right: '-20px',
  },
  foodArea: {
    height: '200px',
    background: 'rgba(255,255,255,0.5)',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '1rem',
    width: '100%',
    boxSizing: 'border-box'
  },
  foodItem: {
    fontSize: '3.5rem',
    background: 'white',
    padding: '1rem',
    borderRadius: '50%',
    boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
    cursor: 'pointer',
  }
};

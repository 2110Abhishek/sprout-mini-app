import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useSound } from '../hooks/useSound';
import { trackEvent } from '../utils/telemetry';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { playClick, playCheer } = useSound();
  
  React.useEffect(() => {
    // 1. TELEMETRY: Silent analytics to pinpoint drop-offs
    trackEvent('screen_view', { screen: 'WelcomeScreen' });
    
    // 2. IMMEDIATE REWARD: Hook the child instantly before they drop off!
    playCheer();
  }, []);

  return (
    <div style={styles.container}>
      <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <span style={{ fontSize: '6rem', display: 'block', textAlign: 'center' }}>🐥</span>
        <h1>Welcome to Sprout!</h1>
        <p>Let's learn and play together.</p>
      </motion.div>
      
      <motion.button 
        className="btn-soft btn-green"
        style={styles.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playClick();
          // 3. JUMP TO PLAY: Track bypass
          trackEvent('button_click', { button: 'Play', action: 'jump_to_play' });
          navigate('/activities');
        }}
      >
        Play!
      </motion.button>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--color-background)',
    padding: '2rem',
  },
  button: {
    marginTop: '3rem',
    fontSize: '2rem',
    padding: '1.5rem 4rem',
  }
};

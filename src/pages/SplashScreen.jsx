import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1, rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={styles.logoContainer}
      >
        <span style={styles.icon}>🌱</span>
        <h1 style={styles.title}>Sprout</h1>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--color-secondary)',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    fontSize: '6rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '4rem',
    color: '#2D6A4F',
    margin: 0,
  }
};

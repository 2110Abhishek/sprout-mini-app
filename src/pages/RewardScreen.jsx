import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Award, CheckCircle } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useSound } from '../hooks/useSound';

export default function RewardScreen() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { playClick } = useSound();

  return (
    <div style={styles.container}>
      <h1>Your Rewards</h1>
      
      <div style={styles.statsContainer}>
        <div style={styles.statBox}>
          <Star color="#F4D03F" fill="#F4D03F" size={48} />
          <h2>{progress.stars}</h2>
          <p>Stars</p>
        </div>
        <div style={styles.statBox}>
          <CheckCircle color="#2D6A4F" size={48} />
          <h2>{progress.activitiesCompleted}</h2>
          <p>Activities Done</p>
        </div>
      </div>

      <div style={styles.badgesContainer}>
        <h3>Badges Unlocked</h3>
        {progress.unlockedBadges.length === 0 ? (
          <p>Keep playing to unlock badges!</p>
        ) : (
          <div style={styles.badgesGrid}>
            {progress.unlockedBadges.map((badge, idx) => (
              <div key={idx} style={styles.badge}>
                <Award color="#FF9F1C" fill="#FF9F1C" size={40} />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <motion.button 
        className="btn-soft btn-blue"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playClick();
          navigate('/activities');
        }}
        style={styles.backButton}
      >
        Back to Play
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
    alignItems: 'center',
    backgroundColor: 'var(--color-yellow)',
    padding: '2rem',
    overflowY: 'auto',
  },
  statsContainer: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '3rem',
  },
  statBox: {
    background: 'white',
    padding: '2rem',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
    minWidth: '150px',
  },
  badgesContainer: {
    width: '100%',
    background: 'white',
    padding: '2rem',
    borderRadius: '24px',
    boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  badgesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  badge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    background: 'var(--color-background)',
    borderRadius: '16px',
  },
  backButton: {
    marginTop: 'auto',
    width: '100%',
  }
};

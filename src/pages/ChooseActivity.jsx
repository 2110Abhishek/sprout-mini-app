import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Award } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useSound } from '../hooks/useSound';

export default function ChooseActivity() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { playClick } = useSound();

  const activities = [
    { id: 'balloon', title: 'Pop Balloons', icon: '🎈', color: 'var(--color-primary)', path: '/balloon' },
    { id: 'panda', title: 'Feed Panda', icon: '🐼', color: 'var(--color-secondary)', path: '/panda' },
    { id: 'coloring', title: 'Coloring', icon: '🎨', color: 'var(--color-yellow)', path: '/coloring' },
    { id: 'puzzle', title: 'Puzzle', icon: '🧩', color: 'var(--color-tertiary)', path: '/puzzle' },
    { id: 'story', title: 'Story Time', icon: '📖', color: 'var(--color-blue)', path: '/story' },
    { id: 'hunt', title: 'AI Hunt', icon: '📸', color: '#A0E8AF', path: '/hunt' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.stat} onClick={() => { playClick(); navigate('/rewards'); }}>
          <Star color="#F4D03F" fill="#F4D03F" size={32} />
          <span style={styles.statText}>{progress.stars}</span>
        </div>
      </div>
      <h1 style={styles.title}>Choose Activity</h1>

      <div style={styles.grid}>
        {activities.map((act) => (
          <motion.div
            key={act.id}
            style={{
              ...styles.card,
              backgroundColor: act.color,
              opacity: act.locked ? 0.6 : 1,
            }}
            whileHover={!act.locked ? { scale: 1.05 } : {}}
            whileTap={!act.locked ? { scale: 0.95 } : {}}
            onClick={() => {
              if (!act.locked) {
                playClick();
                navigate(act.path);
              }
            }}
          >
            <span style={styles.icon}>{act.icon}</span>
            <h2 style={styles.cardTitle}>{act.title}</h2>
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
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-background)',
    padding: '2rem',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '1rem',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '2rem',
    color: '#333',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '16px',
    boxShadow: '0 4px 0 rgba(0,0,0,0.05)',
    cursor: 'pointer',
  },
  statText: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    flex: 1,
  },
  card: {
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
    padding: '0.5rem',
    textAlign: 'center',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
  }
};

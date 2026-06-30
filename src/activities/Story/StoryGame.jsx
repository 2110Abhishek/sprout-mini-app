import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useProgress } from '../../hooks/useProgress';
import { useSound } from '../../hooks/useSound';
import { XCircle } from 'lucide-react';

const STORIES = [
  {
    title: "Bunny's Picnic",
    scenes: [
      {
        text: "Bunny is going on a picnic! What should Bunny pack?",
        character: "🐰",
        options: [
          { id: 'apple', icon: '🍎', isCorrect: true, response: "Yummy apples!" },
          { id: 'carrot', icon: '🥕', isCorrect: false, response: "Carrots are good, but Bunny wants something sweet!" },
          { id: 'banana', icon: '🍌', isCorrect: false, response: "Maybe something red instead?" }
        ]
      },
      {
        text: "Bunny reached a river. How should Bunny cross?",
        character: "🐰 🏞️",
        options: [
          { id: 'bridge', icon: '🌉', isCorrect: true, response: "Walking over the bridge is safe!" },
          { id: 'boat', icon: '🛶', isCorrect: true, response: "Row, row, row the boat!" },
          { id: 'jump', icon: '🦘', isCorrect: false, response: "The river is too wide to jump!" }
        ]
      },
      {
        text: "Bunny met a friend! Who did Bunny share the picnic with?",
        character: "🐰 🧺",
        options: [
          { id: 'bird', icon: '🐦', isCorrect: true, response: "Tweet tweet! Thank you!" },
          { id: 'turtle', icon: '🐢', isCorrect: true, response: "Slow and steady eating!" },
          { id: 'fox', icon: '🦊', isCorrect: true, response: "Fox loves the apples!" }
        ]
      }
    ]
  },
  {
    title: "Puppy's Missing Bone",
    scenes: [
      {
        text: "Puppy lost a bone! Where should Puppy look first?",
        character: "🐶",
        options: [
          { id: 'bed', icon: '🛏️', isCorrect: false, response: "Not under the bed!" },
          { id: 'yard', icon: '🌳', isCorrect: true, response: "Let's check the yard!" },
          { id: 'sofa', icon: '🛋️', isCorrect: false, response: "Just some old coins here." }
        ]
      },
      {
        text: "Puppy sees three holes in the yard. Which one to dig?",
        character: "🐶 🌳",
        options: [
          { id: 'flower', icon: '🌸', isCorrect: false, response: "Oh no, don't dig up the flowers!" },
          { id: 'dirt', icon: '🕳️', isCorrect: true, response: "Dig, dig, dig!" },
          { id: 'bush', icon: '🌿', isCorrect: false, response: "Just a sleeping bug here." }
        ]
      },
      {
        text: "Puppy found the bone! Who helped Puppy dig?",
        character: "🐶 🦴",
        options: [
          { id: 'cat', icon: '🐱', isCorrect: true, response: "A very helpful kitty!" },
          { id: 'bird', icon: '🐦', isCorrect: true, response: "Bird spotted it from above!" },
          { id: 'frog', icon: '🐸', isCorrect: true, response: "Ribbit! Teamwork!" }
        ]
      }
    ]
  },
  {
    title: "Bear's Bedtime",
    scenes: [
      {
        text: "It's bedtime for Little Bear. What should Bear do first?",
        character: "🐻",
        options: [
          { id: 'brush', icon: '🪥', isCorrect: true, response: "Brush, brush, brush!" },
          { id: 'play', icon: '⚽', isCorrect: false, response: "It's too late to play ball." },
          { id: 'eat', icon: '🍯', isCorrect: false, response: "We already had dinner!" }
        ]
      },
      {
        text: "Time for a bedtime story! Which book should Bear pick?",
        character: "🐻 🛏️",
        options: [
          { id: 'space', icon: '🚀', isCorrect: true, response: "Zooming to the stars!" },
          { id: 'dino', icon: '🦕', isCorrect: true, response: "Roar! A dinosaur tale." },
          { id: 'magic', icon: '🪄', isCorrect: true, response: "A magical adventure!" }
        ]
      },
      {
        text: "Bear is sleepy. What does Bear cuddle with?",
        character: "🐻 💤",
        options: [
          { id: 'blanket', icon: '🛌', isCorrect: true, response: "So warm and cozy." },
          { id: 'teddy', icon: '🧸', isCorrect: true, response: "Goodnight, teddy." },
          { id: 'pillow', icon: '☁️', isCorrect: true, response: "Soft like a cloud." }
        ]
      }
    ]
  }
];

export default function StoryGame() {
  const navigate = useNavigate();
  const { addStars, completeActivity, unlockBadge } = useProgress();
  const { playCorrect, playWrong, playCheer } = useSound();
  
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Pick a random story when component mounts
    setCurrentStoryIndex(Math.floor(Math.random() * STORIES.length));
  }, []);

  const story = STORIES[currentStoryIndex];
  const scene = story?.scenes[currentScene];

  const handleChoice = (option) => {
    setFeedback(option.response);
    
    if (option.isCorrect) {
      playCorrect();
      addStars(1);
      
      setTimeout(() => {
        setFeedback("");
        if (currentScene + 1 < story.scenes.length) {
          setCurrentScene(s => s + 1);
        } else {
          // Finished
          playCheer();
          setShowConfetti(true);
          completeActivity();
          unlockBadge('Story Badge');
          setTimeout(() => navigate('/rewards'), 4000);
        }
      }, 2500);
    } else {
      playWrong();
      const el = document.getElementById(`opt-${option.id}`);
      if (el) {
        el.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(0.9)' },
          { transform: 'scale(1.1)' },
          { transform: 'scale(1)' }
        ], { duration: 400 });
      }
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      
      <button style={styles.closeBtn} onClick={() => navigate('/activities')}>
        <XCircle size={40} color="var(--color-primary)" fill="white" />
      </button>

      {!showConfetti && scene && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            style={styles.sceneContainer}
          >
            <div style={styles.characterArea}>
              <span style={styles.character}>{scene.character}</span>
            </div>
            
            <div style={styles.textArea}>
              <h3>{scene.text}</h3>
              {feedback && <p style={styles.feedback}>{feedback}</p>}
            </div>

            <div style={styles.optionsArea}>
              {scene.options.map(opt => (
                <motion.div
                  key={opt.id}
                  id={`opt-${opt.id}`}
                  style={styles.optionBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !feedback && handleChoice(opt)}
                >
                  <span style={styles.optIcon}>{opt.icon}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {showConfetti && (
        <div style={styles.endScreen}>
          <motion.h1 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            The End!
          </motion.h1>
          <span style={{ fontSize: '6rem' }}>🌟</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-blue)',
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
  sceneContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    width: '100%',
    boxSizing: 'border-box'
  },
  characterArea: {
    marginBottom: '1rem',
  },
  character: {
    fontSize: '6rem',
  },
  textArea: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '24px',
    textAlign: 'center',
    boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
    minHeight: '120px',
    marginBottom: '2rem',
    boxSizing: 'border-box'
  },
  feedback: {
    marginTop: '0.5rem',
    color: 'var(--color-primary)',
    fontWeight: '800',
  },
  optionsArea: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
  },
  optionBtn: {
    background: 'white',
    padding: '0.75rem',
    borderRadius: '20px',
    cursor: 'pointer',
    boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  optIcon: {
    fontSize: '3rem',
  },
  endScreen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#2D6A4F'
  }
};

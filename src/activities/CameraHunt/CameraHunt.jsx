import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useProgress } from '../../hooks/useProgress';
import { useSound } from '../../hooks/useSound';
import { XCircle, Camera, AlertCircle, RefreshCw } from 'lucide-react';

const TARGET_ITEMS = [
  { name: 'Cup', icon: '☕', keywords: ['cup', 'coffee mug', 'mug', 'teapot', 'pitcher', 'measuring cup'] },
  { name: 'Bottle', icon: '🍼', keywords: ['water bottle', 'bottle', 'pop bottle', 'beer bottle'] },
  { name: 'Book', icon: '📖', keywords: ['book', 'comic book', 'notebook', 'binder', 'menu'] },
  { name: 'Mouse', icon: '🖱️', keywords: ['mouse', 'computer mouse'] },
  { name: 'Keyboard', icon: '⌨️', keywords: ['keyboard', 'computer keyboard', 'typewriter'] },
  { name: 'Chair', icon: '🪑', keywords: ['chair', 'folding chair', 'rocking chair', 'dining table'] },
  { name: 'Shoe', icon: '👟', keywords: ['shoe', 'running shoe', 'sneaker', 'sandal', 'boot'] }
];

export default function CameraHunt() {
  const navigate = useNavigate();
  const { addStars, completeActivity, unlockBadge } = useProgress();
  const { playCheer, playClick, playPop } = useSound();
  
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [targetItem, setTargetItem] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  
  const predictInterval = useRef(null);

  useEffect(() => {
    // Pick a random target initially
    setTargetItem(TARGET_ITEMS[Math.floor(Math.random() * TARGET_ITEMS.length)]);
    
    // Load the model
    const loadModel = async () => {
      try {
        await window.tf.ready();
        const loadedModel = await window.mobilenet.load({ version: 2, alpha: 0.5 });
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (err) {
        console.error("Failed to load model", err);
      }
    };
    loadModel();

    return () => {
      if (predictInterval.current) clearInterval(predictInterval.current);
    };
  }, []);

  // Manage prediction interval reactively
  useEffect(() => {
    if (!model || !targetItem || isSuccess) {
      if (predictInterval.current) {
        clearInterval(predictInterval.current);
        predictInterval.current = null;
      }
      return;
    }

    if (predictInterval.current) {
      clearInterval(predictInterval.current);
    }

    predictInterval.current = setInterval(async () => {
      if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        try {
          const predictions = await model.classify(video);
          
          // Check if any prediction matches our target keywords
          const isMatch = predictions.some(p => {
             const pClasses = p.className.toLowerCase();
             return targetItem.keywords.some(kw => pClasses.includes(kw.toLowerCase()));
          });

          if (isMatch) {
            handleSuccess();
          }
        } catch (e) {
          console.error("Prediction error:", e);
        }
      }
    }, 1000); // Check every 1 second

    return () => {
      if (predictInterval.current) {
        clearInterval(predictInterval.current);
        predictInterval.current = null;
      }
    };
  }, [model, targetItem, isSuccess]);

  const shuffleTargetItem = () => {
    playPop();
    let newItem = targetItem;
    // Find a different item
    while (newItem === targetItem) {
      newItem = TARGET_ITEMS[Math.floor(Math.random() * TARGET_ITEMS.length)];
    }
    setTargetItem(newItem);
  };

  const handleSuccess = () => {
    if (predictInterval.current) clearInterval(predictInterval.current);
    setIsSuccess(true);
    setShowConfetti(true);
    playCheer();
    addStars(3);
    
    setTimeout(() => {
      completeActivity();
      unlockBadge('Explorer');
      navigate('/rewards');
    }, 4000);
  };

  const handleUserMediaError = () => {
    setHasCameraPermission(false);
  };

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      
      <button style={styles.closeBtn} onClick={() => { playClick(); navigate('/activities'); }}>
        <XCircle size={40} color="var(--color-primary)" fill="white" />
      </button>

      <div style={styles.header}>
        {targetItem && (
          <motion.div 
            style={styles.targetCard}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 style={styles.targetText}>Find a {targetItem.name}! {targetItem.icon}</h2>
            {!isSuccess && (
              <button 
                style={styles.shuffleBtn} 
                onClick={shuffleTargetItem}
                title="Find a different item"
              >
                <RefreshCw size={16} color="#666" />
                <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Shuffle</span>
              </button>
            )}
          </motion.div>
        )}
      </div>

      <div style={styles.cameraContainer}>
        {!hasCameraPermission ? (
          <div style={styles.errorBox}>
            <AlertCircle size={48} color="var(--color-primary)" />
            <p>Please allow camera access to play this game!</p>
          </div>
        ) : isModelLoading ? (
          <div style={styles.loadingBox}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Camera size={64} color="var(--color-secondary)" />
            </motion.div>
            <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Loading AI Scanner...</p>
          </div>
        ) : (
          <div style={styles.videoWrapper}>
            <Webcam
              audio={false}
              ref={webcamRef}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '24px',
                transform: 'scaleX(-1)' // Mirror effect
              }}
              videoConstraints={{ facingMode: 'environment' }} // Back camera if available
              onUserMediaError={handleUserMediaError}
            />
            {isSuccess && (
              <motion.div 
                style={styles.successOverlay}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div style={styles.successBadge}>
                  <span style={{ fontSize: '4rem' }}>🌟</span>
                  <h2>Found it!</h2>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B',
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
  header: {
    paddingTop: '5rem',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 5,
  },
  targetCard: {
    background: 'white',
    padding: '1rem 2rem',
    borderRadius: '30px',
    boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  targetText: {
    margin: '0 0 0.5rem 0',
    color: '#333',
    fontSize: '2rem'
  },
  shuffleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#f1f5f9',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 2px 0 rgba(0,0,0,0.05)',
  },
  cameraContainer: {
    flex: 1,
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    maxWidth: '500px',
    maxHeight: '600px',
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    border: '8px solid white'
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    background: 'rgba(255,255,255,0.1)',
    padding: '3rem',
    borderRadius: '24px'
  },
  errorBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--color-primary)',
    background: 'white',
    padding: '3rem',
    borderRadius: '24px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  successOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  successBadge: {
    background: 'white',
    padding: '2rem',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 0 40px rgba(255,255,255,0.5)'
  }
};

import { useState, useEffect } from 'react';

const PROGRESS_KEY = 'sprout_progress';

const defaultProgress = {
  stars: 0,
  activitiesCompleted: 0,
  playTimeMinutes: 0,
  lastPlayed: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  unlockedBadges: [],
};

export const useProgress = () => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reset daily stats if it's a new day
        const today = new Date().toISOString().split('T')[0];
        if (parsed.lastPlayed !== today) {
          return {
            ...parsed,
            activitiesCompleted: 0,
            playTimeMinutes: 0,
            lastPlayed: today,
          };
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse progress', e);
        return defaultProgress;
      }
    }
    return defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const addStars = (amount) => {
    setProgress((prev) => ({
      ...prev,
      stars: prev.stars + amount,
    }));
  };

  const completeActivity = () => {
    setProgress((prev) => ({
      ...prev,
      activitiesCompleted: prev.activitiesCompleted + 1,
    }));
  };

  const addPlayTime = (minutes) => {
    setProgress((prev) => ({
      ...prev,
      playTimeMinutes: prev.playTimeMinutes + minutes,
    }));
  };

  const unlockBadge = (badgeName) => {
    setProgress((prev) => {
      if (!prev.unlockedBadges.includes(badgeName)) {
        return {
          ...prev,
          unlockedBadges: [...prev.unlockedBadges, badgeName],
        };
      }
      return prev;
    });
  };

  return {
    progress,
    addStars,
    completeActivity,
    addPlayTime,
    unlockBadge,
  };
};

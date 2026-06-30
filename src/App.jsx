import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import ChooseActivity from './pages/ChooseActivity';
import RewardScreen from './pages/RewardScreen';
import BalloonGame from './activities/BalloonGame/BalloonGame';
import PandaGame from './activities/PandaGame/PandaGame';
import ColoringGame from './activities/Coloring/ColoringGame';
import PuzzleGame from './activities/Puzzle/PuzzleGame';
import StoryGame from './activities/Story/StoryGame';
import CameraHunt from './activities/CameraHunt/CameraHunt';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/activities" element={<ChooseActivity />} />
        <Route path="/rewards" element={<RewardScreen />} />
        <Route path="/balloon" element={<BalloonGame />} />
        <Route path="/panda" element={<PandaGame />} />
        <Route path="/coloring" element={<ColoringGame />} />
        <Route path="/puzzle" element={<PuzzleGame />} />
        <Route path="/story" element={<StoryGame />} />
        <Route path="/hunt" element={<CameraHunt />} />
      </Routes>
    </Router>
  );
}

export default App;

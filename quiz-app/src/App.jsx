// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import ModeSelect from "./components/ModeSelect";
import CategoryDifficultySelect from "./components/CategoryDifficultySelect";
import QuizScreen from "./components/QuizScreen";
import PlayerSetupMultiplayer from "./components/PlayerSetupMultiplayer";
import ResultScreen from "./components/ResultScreen";
import BlogSection from "./components/BlogSection";

const App = () => {
  const [user, setUser] = useState(null); // logged-in user info

  return (
    <Router>
      <div>
        {/* Render BlogSection on all pages except ResultScreen */}
        <Routes>
          <Route
            path="/result"
            element={null} // no BlogSection
          />
          <Route
            path="*"
            element={<BlogSection />}
          />
        </Routes>

        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route
            path="/login"
            element={<LoginScreen onAuth={setUser} />}
          />
          <Route
            path="/select"
            element={<ModeSelect user={user} />}
          />
          <Route
            path="/category"
            element={<CategoryDifficultySelect user={user} />}
          />
          <Route
            path="/player-setup-multiplayer"
            element={<PlayerSetupMultiplayer onSetup={() => {}} />}
          />
          <Route
            path="/quiz"
            element={<QuizScreen user={user} />}
          />
          <Route
            path="/result"
            element={<ResultScreen />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

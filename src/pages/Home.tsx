import React from 'react';

export default function Home() {
  const handleNavigate = (path:string) => {
    window.location.href = path;
  };

  return (
    <div className="hero">
      <h1 className="hero-title">🎯 Donkey Quiz</h1>
      
      <p className="hero-subtitle">
        Challenge your friends in real-time! Create custom quizzes, join live sessions, 
        and compete for the top spot on the leaderboard.
      </p>
      
      <div>
        <button 
          className="button primary"
          onClick={() => handleNavigate('/join')}
        >
          🎮 Join Game
        </button>
        
        <button 
          className="button secondary"
          onClick={() => handleNavigate('/admin')}
        >
          👑 Create Quiz
        </button>
      </div>

      <div className="feature-grid">
        <div className="card">
          <div>🚀</div>
          <h3>Real-time Gaming</h3>
          <p>Compete with friends in real-time quiz sessions</p>
        </div>
        
        <div className="card">
          <div>🎨</div>
          <h3>Custom Quizzes</h3>
          <p>Create your own quiz questions and categories</p>
        </div>
        
        <div className="card">
          <div>🏆</div>
          <h3>Leaderboards</h3>
          <p>Track scores and compete for the top position</p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero-container">
      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="hero-title"
          whileHover={{ scale: 1.05 }}
        >
          🎯 Donkey Quiz
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Challenge your friends in real-time! Create custom quizzes, join live sessions, 
          and compete for the top spot. Don't be the last donkey! 🐴
        </motion.p>
        
        <div className="button-group">
          <motion.button 
            className="primary-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/join')}
          >
            🎮 Join Game
          </motion.button>
          
          <motion.button 
            className="secondary-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin')}
          >
            👑 Create Quiz
          </motion.button>
        </div>

        <div className="feature-grid">
          {[
            { icon: '🚀', title: 'Real-time Gaming', desc: 'Compete with friends in real-time quiz sessions' },
            { icon: '🎨', title: 'Custom Quizzes', desc: 'Create your own quiz questions and categories' },
            { icon: '🏆', title: 'Leaderboards', desc: 'Track scores and compete for the top position' },
            { icon: '🎵', title: 'Sound Effects', desc: 'Engaging audio feedback for correct and wrong answers' }
          ].map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1) }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
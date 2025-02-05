import React from 'react';
import { motion } from 'framer-motion';
import './QuestionCard.css';

interface QuestionCardProps {
  question: {
    id:string
    text: string;
    options: string[];
    correctAnswer: string;
  };
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
}

export default function QuestionCard({ 
  question, 
  selectedAnswer, 
  onAnswer 
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="question-card"
    >
      <h2 className="question-text">{question.text}</h2>
      
      <div className="options-grid">
        {question.options.map((option) => {
          const isCorrect = selectedAnswer && option === question.correctAnswer;
          const isWrong = selectedAnswer && option === selectedAnswer && !isCorrect;
          
          return (
            <motion.button
              key={option}
              whileHover={{ scale: selectedAnswer ? 1 : 1.05 }}
              whileTap={{ scale: selectedAnswer ? 1 : 0.95 }}
              className={`option-button ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              onClick={() => onAnswer(option)}
              disabled={!!selectedAnswer}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
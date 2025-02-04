import { motion } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'

interface QuestionCardProps {
  question: {
    text: string
    options: string[]
    correctAnswer: string
  }
  selectedAnswer: string | null
  onAnswer: (answer: string) => void
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
      className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-6">{question.text}</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {question.options.map((option) => {
          const isCorrect = selectedAnswer && option === question.correctAnswer
          const isWrong = selectedAnswer && option === selectedAnswer && !isCorrect
          
          return (
            <motion.button
              key={option}
              whileHover={{ scale: selectedAnswer ? 1 : 1.05 }}
              whileTap={{ scale: selectedAnswer ? 1 : 0.95 }}
              className={`p-4 rounded-xl text-left transition-all ${
                isCorrect 
                  ? 'bg-green-500/20 border-green-500'
                  : isWrong
                  ? 'bg-red-500/20 border-red-500'
                  : 'bg-slate-700/50 border-slate-600 hover:border-cyan-400'
              } border relative overflow-hidden`}
              onClick={() => onAnswer(option)}
              disabled={!!selectedAnswer}
            >
              {selectedAnswer && (
                <div className="absolute top-2 right-2">
                  {isCorrect ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  ) : isWrong ? (
                    <XCircleIcon className="w-6 h-6 text-red-500" />
                  ) : null}
                </div>
              )}
              {option}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
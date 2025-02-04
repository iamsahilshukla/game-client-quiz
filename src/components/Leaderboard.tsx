import { motion, AnimatePresence } from 'framer-motion'

interface LeaderboardProps {
  data: Array<{ name: string; score: number }>
  className?: string
}

export default function Leaderboard({ data, className }: LeaderboardProps) {
  return (
    <div className={`bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-slate-700/50 ${className}`}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        🏆 Leaderboard
      </h3>
      
      <AnimatePresence>
        {data.sort((a, b) => b.score - a.score).map((user, index) => (
          <motion.div
            key={user.name}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-between items-center p-2 hover:bg-slate-700/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">
                {index === 0 ? '👑' : `#${index + 1}`}
              </span>
              {user.name}
            </div>
            <span className="text-cyan-400">{user.score}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
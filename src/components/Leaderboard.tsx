import { motion, AnimatePresence } from "framer-motion";
import "./leaderboard.css"; // Import the CSS file

interface LeaderboardProps {
  data: Array<{ name: string; score: number }>;
  className?: string;
}

export default function Leaderboard({ data, className }: LeaderboardProps) {
  return (
    <div className={`leaderboard-container ${className}`}>
      <h3 className="leaderboard-title">🏆 Leaderboard</h3>

      <AnimatePresence>
        {data.sort((a, b) => b.score - a.score).map((user, index) => (
          <motion.div
            key={user.name}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`leaderboard-item ${index === 0 ? "first-place" : ""}`}
          >
            <div className="leaderboard-rank">
              <span className={`rank-icon rank-${index}`}>
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
              </span>
              <span className="player-name">{user.name}</span>
            </div>
            <motion.span
              layout
              className="player-score"
              animate={{ scale: 1.2 }}
              transition={{ duration: 0.2, yoyo: Infinity }}
            >
              {user.score}
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

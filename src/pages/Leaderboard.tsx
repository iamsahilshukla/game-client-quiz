// Leaderboard.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { socket } from '../lib/socket'
import Leaderboard from '../components/Leaderboard'
import { motion } from 'framer-motion'

interface PlayerScore {
  playerId: string
  name: string
  score: number
}

export default function SessionLeaderBoard() {
  const { roomId } = useParams()
  const [leaderboard, setScores] = useState<PlayerScore[]>([])
  const [players, setPlayers] = useState<string[]>([])
  const[gameEnded,setGameEnded] = useState(false)

  const handleStartGame = () => {
    socket.emit('start_game', JSON.stringify({ roomId }));
  };

  useEffect(() => {
    socket.on('participant_joined', (player: any) => {
      console.log("------------>session joined", player.name);
      setPlayers(prev => [...prev, player.name])
    })

    socket.on('leaderboard_update', (newScores: any) => {
      setScores(newScores)
    })

    socket.on('game_ended', (finalScores: any) => {
      setScores(finalScores)
      setGameEnded(true)

    })

    return () => {
      socket.off('participant_joined')
      socket.off('leaderboard_update')
      socket.off('game_ended')
    }
  }, [roomId])

  return (
    <div className="game-container">
      <motion.div 
        className="game-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-center">🎮 Room: {roomId}</h1>
          {players.length > 0 && (
            <motion.button
              className="start-game-button"
              onClick={handleStartGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Game 🎯
            </motion.button>
          )}
        </div>

        {players.length > 0 && (
          <div className="players-grid mb-8">
            <h2 className="text-xl font-semibold mb-4">Players Joined ({players.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {players.map((playerName, index) => (
                <motion.div
                  key={playerName}
                  className="player-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="player-avatar">👤</div>
                  <div className="player-info">
                    <span className="player-name">{playerName}</span>
                    <span className="player-status">Ready</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <motion.h1 
          className="text-center mb-8"
          animate={{ scale: gameEnded ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          {gameEnded ? '🎮 Game Over!' : `🏆 Live Leaderboard - Room ${roomId}`}
        </motion.h1>

        {leaderboard.length > 0 ? (
          <motion.div 
            className="w-full max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Leaderboard 
              data={leaderboard.map(player => ({
                name: player.name,
                score: player.score
              }))} 
              className="glass-card"
            />
          </motion.div>
        ) : (
          <motion.div 
            className="text-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Waiting for players to join...
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
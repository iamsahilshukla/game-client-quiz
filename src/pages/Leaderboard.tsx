// Leaderboard.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { socket } from '../lib/socket'
import Leaderboard from '../components/Leaderboard';

interface PlayerScore {
  playerId: string
  name: string
  score: number
}

export default function SessionLeaderBoard() {
  const { roomId } = useParams()
  const [leaderboard, setScores] = useState<PlayerScore[]>([])

  useEffect(() => {
    socket.on('leaderboard_update', (newScores:any) => {
      setScores(newScores)
    })

    return () => {
      socket.off('leaderboard_update')
    }
  }, [roomId])

  return (
    <div className="container">
      <h1>Live Leaderboard - Room {roomId}</h1>
      {leaderboard.length > 0 && (
        <div className="w-full max-w-md mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Players in Room</h3>
          <Leaderboard data={leaderboard} className="bg-white rounded-lg shadow-md" />
        </div>
      )}
    </div>
  )
}
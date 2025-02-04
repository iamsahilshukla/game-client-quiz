import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { socket } from '../lib/socket'
import QuestionCard from '../components/QuestionCard'
import Leaderboard from '../components/Leaderboard'
import TimerBar from '../components/TimeBar'

export default function GameScreen() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const roomId = params.get('roomId')!

  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<Array<{ name: string; score: number }>>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [gameEnded, setGameEnded] = useState<boolean>(false)

  useEffect(() => {
    socket.on('new_question', (question: any) => {
      setCurrentQuestion(question)
      setSelectedAnswer(null)
    })

    socket.on('leaderboard_update', (updatedLeaderboard: any) => {
      setLeaderboard(updatedLeaderboard)
    })

    socket.on('game_ended', (finalLeaderboard: any) => {
      setLeaderboard(finalLeaderboard)
      setGameEnded(true)
    })

    return () => {
      socket.off('new_question')
      socket.off('leaderboard_update')
      socket.off('game_ended')
    }
  }, [])

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return
    setSelectedAnswer(answer)
    socket.emit('submit_answer', { roomId, answer})
  }

  return (
    <div className="container">
      <div className="card">
        {currentQuestion && !gameEnded && (
          <>
            <TimerBar duration={currentQuestion.timeLimit} />
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onAnswer={handleAnswer}
            />
          </>
        )}
        {gameEnded && (
          <div>
            <h2>Game Ended</h2>
            <Leaderboard data={leaderboard} className="card" />
          </div>
        )}
      </div>
    </div>
  )
}
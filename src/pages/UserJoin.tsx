import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../lib/socket'

interface Question {
  question: string
  options: string[]
  timeLimit: number
}

export default function UserJoin() {
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    socket.on('session_joined', () => {
    navigate(`/game?roomId=${roomId}&username=${username}`)
    })

    socket.on('new_question', (question: Question) => {
      setCurrentQuestion(question)
    })

    return () => {
      socket.off('session_joined')
      socket.off('new_question')
    }
  }, [navigate, roomId, username])

  const handleJoin = () => {
    if (!username || !roomId) return
    
    socket.emit('join_session', JSON.stringify({ roomId, username }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 w-96 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent text-center">
          Join Quiz Session
        </h1>
        
        <input
          type="text"
          placeholder="Your Name"
          className="w-full mb-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          type="text"
          placeholder="Room ID"
          className="w-full mb-6 p-3 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-400"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
        />
        
        <button
          onClick={handleJoin}
          className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity"
        >
          🚀 Join Now
        </button>

        {currentQuestion && (
          <div className="mt-6 p-4 bg-slate-700 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
            <ul>
              {currentQuestion.options.map((option: string, index: number) => (
                <li key={index} className="mb-2">
                  <button className="w-full py-2 bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors">
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
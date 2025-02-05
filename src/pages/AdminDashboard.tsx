import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { createSession, getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../api'

interface Question {
  _id?: string
  text: string
  options: string[]
  correctAnswer: string
  timeLimit: number
  points: number
}

const validateQuestion = (question: Question) => {
  if (!question.text.trim()) return 'Question text is required'
  if (question.options.some(option => !option.trim())) return 'All options are required'
  if (!question.options.includes(question.correctAnswer)) return 'Correct answer must match one of the options'
  if (question.timeLimit < 5) return 'Time limit must be at least 5 seconds'
  if (question.points <= 0) return 'Points must be greater than 0'
  return null
}

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [newQuestion, setNewQuestion] = useState<Question>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    timeLimit: 30,
    points: 10,
  })
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const navigate = useNavigate()

const [loading, setLoading] = useState(false)

// Update your useEffect
useEffect(() => {
  const loadQuestions = async () => {
    setLoading(true)
    try {
      const fetchedQuestions = await getQuestions()
      setQuestions(fetchedQuestions)
    } catch (error) {
      toast.error('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  loadQuestions()
}, [])

const handleSelectQuestion = (questionId: string) => {
  setSelectedQuestions(prev => {
    const newSelection = prev.includes(questionId)
      ? prev.filter(id => id !== questionId)
      : [...prev, questionId]
      
    // Ensure we only keep valid question IDs
    return newSelection.filter(id => 
      questions.some(q => q._id === id)
    )
  })
}

  const handleCreateSession = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question')
      return
    }

    try {
      const session = await createSession(selectedQuestions)
      setSessionId(session.roomId)
      toast.success(`Session created with ID: ${session.roomId}`)
    } catch (error) {
      toast.error('Failed to create session')
    }
  }

  const handleStartGame = () => {
    if (sessionId) {
      // socket.emit('start_game', JSON.stringify({ roomId: sessionId }))
      navigate(`/leaderboard/${sessionId}`)
    }
  }

const handleCreateQuestion = async () => {
  const validationError = validateQuestion(newQuestion)
  if (validationError) {
    toast.error(validationError)
    return
  }

  try {
    const question = await createQuestion({
      ...newQuestion,
      options: newQuestion.options.filter(opt => opt.trim()) // Remove empty options
    })
    setQuestions([...questions, question])
    setNewQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      timeLimit: 30,
      points: 10,
    })
    toast.success('Question created successfully')
  } catch (error) {
    toast.error('Failed to create question')
    console.error('Creation error:', error)
  }
}

const handleUpdateQuestion = async () => {
  if (!editingQuestion || !editingQuestion._id) return
  
  const validationError = validateQuestion(editingQuestion)
  if (validationError) {
    toast.error(validationError)
    return
  }

  try {
    const updatedQuestion = await updateQuestion(editingQuestion._id, {
      ...editingQuestion,
      options: editingQuestion.options.filter(opt => opt.trim())
    })
    
    setQuestions(questions.map(q => 
      q._id === updatedQuestion._id ? updatedQuestion : q
    ))
    setEditingQuestion(null)
    toast.success('Question updated successfully')
  } catch (error) {
    toast.error('Failed to update question')
    console.error('Update error:', error)
  }
}

const handleDeleteQuestion = async (questionId: string) => {
  if (!window.confirm('Are you sure you want to delete this question?')) return
  
  try {
    await deleteQuestion(questionId)
    setQuestions(questions.filter(q => q._id !== questionId))
    setSelectedQuestions(prev => prev.filter(id => id !== questionId))
    toast.success('Question deleted successfully')
  } catch (error) {
    toast.error('Failed to delete question')
    console.error('Deletion error:', error)
  }
}

  return (
    <div className="container">
      <div className="card">
        <h1>Create Quiz Session</h1>
        {loading ? (
          <div className="loading">Loading questions...</div>
        ) : (
          <><div className="question-list">
            {questions.map(question => (
              <div key={question._id} className="question-item">
                <input
                  type="checkbox"
                  id={question._id}
                  checked={selectedQuestions.includes(question._id!)}
                  onChange={() => handleSelectQuestion(question._id!)} />
                <label htmlFor={question._id}>{question.text}</label>
                <button onClick={() => setEditingQuestion(question)}>Edit</button>
                <button onClick={() => handleDeleteQuestion(question._id!)}>Delete</button>
              </div>
            ))}
          </div><button onClick={handleCreateSession} className="button">
              Create Session
            </button></>
        )}

        {sessionId && (
          <div className="session-info">
            <p>Session ID: {sessionId}</p>
            <button onClick={handleStartGame} className="button" style={{ background: 'linear-gradient(to right, #10b981, #22c55e)' }}>
              Start Game
            </button>
          </div>
        )}

        <div className="create-question">
          <h2>Create New Question</h2>
          <input
            type="text"
            value={newQuestion.text}
            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            placeholder="Enter question text"
          />
          {newQuestion.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const options = [...newQuestion.options]
                options[index] = e.target.value
                setNewQuestion({ ...newQuestion, options })
              }}
              placeholder={`Option ${index + 1}`}
            />
          ))}
          <input
            type="text"
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            placeholder="Enter correct answer"
          />
          <input
            type="number"
            value={newQuestion.timeLimit}
            onChange={(e) => setNewQuestion({ ...newQuestion, timeLimit: parseInt(e.target.value) })}
            placeholder="Enter time limit (seconds)"
          />
          <input
            type="number"
            value={newQuestion.points}
            onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })}
            placeholder="Enter points"
          />
          <button onClick={handleCreateQuestion} className="button">Create Question</button>
        </div>

        {editingQuestion && (
          <div className="edit-question">
            <h2>Edit Question</h2>
            <input
              type="text"
              value={editingQuestion.text}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
              placeholder="Enter question text"
            />
            {editingQuestion.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => {
                  const options = [...editingQuestion.options]
                  options[index] = e.target.value
                  setEditingQuestion({ ...editingQuestion, options })
                }}
                placeholder={`Option ${index + 1}`}
              />
            ))}
            <input
              type="text"
              value={editingQuestion.correctAnswer}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })}
              placeholder="Enter correct answer"
            />
            <input
              type="number"
              value={editingQuestion.timeLimit}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, timeLimit: parseInt(e.target.value) })}
              placeholder="Enter time limit (seconds)"
            />
            <input
              type="number"
              value={editingQuestion.points}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, points: parseInt(e.target.value) })}
              placeholder="Enter points"
            />
            <button onClick={handleUpdateQuestion} className="button">Update Question</button>
            <button onClick={() => setEditingQuestion(null)} className="button">Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}
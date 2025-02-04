import { useState, useEffect } from 'react'
import { Question } from '../api/question'
import { createQuestion, updateQuestion } from '../api/question'

export default function QuestionForm({ 
  initialData,
  onSuccess 
}: {
  initialData?: Question | null
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    timeLimit: 30,
    points: 100
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (initialData?._id) {
        await updateQuestion(initialData._id, formData)
      } else {
        await createQuestion(formData)
      }
      onSuccess()
      setFormData({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        timeLimit: 30,
        points: 100
      })
    } catch (error) {
      console.error('Error saving question:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Question Text</label>
        <textarea
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="w-full bg-slate-700/50 rounded-lg p-2 border border-slate-600 focus:border-cyan-400"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Options</label>
        <div className="space-y-2">
          {formData.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.correctAnswer === option}
                onChange={() => setFormData({ ...formData, correctAnswer: option })}
                className="h-4 w-4 text-cyan-400 border-slate-600"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...formData.options!]
                  newOptions[index] = e.target.value
                  setFormData({ ...formData, options: newOptions })
                }}
                className="w-full bg-slate-700/50 rounded-lg p-2 border border-slate-600 focus:border-cyan-400"
                required
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Time Limit (sec)</label>
          <input
            type="number"
            value={formData.timeLimit}
            onChange={(e) => setFormData({ ...formData, timeLimit: +e.target.value })}
            className="w-full bg-slate-700/50 rounded-lg p-2 border border-slate-600"
            min="10"
            max="120"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Points</label>
          <input
            type="number"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: +e.target.value })}
            className="w-full bg-slate-700/50 rounded-lg p-2 border border-slate-600"
            min="50"
            max="500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
      >
        {initialData?._id ? 'Update Question' : 'Create Question'}
      </button>
    </form>
  )
}
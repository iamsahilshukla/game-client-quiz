import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import UserJoin from './pages/UserJoin'
import GameScreen from './pages/GameScreen'
import './App.css'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/join" element={<UserJoin />} />
          <Route path="/game" element={<GameScreen />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" />
    </div>
  )
}
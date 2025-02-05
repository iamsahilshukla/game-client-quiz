import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../lib/socket';
import { motion } from 'framer-motion';

export default function UserJoin() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !roomId.trim()) return;

    socket.emit('join_session', JSON.stringify({ roomId, username }))
    socket.on('session_joined', () => {
      navigate(`/game?roomId=${roomId}`);
    });
  };

  return (
    <div className="hero-container">
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-8">Join Quiz Session</h1>
        
        <form onSubmit={handleJoin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">
              Your Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="create-question input"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="roomId" className="block text-sm font-medium">
              Room Code
            </label>
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="create-question input"
              placeholder="Enter room code"
              required
            />
          </div>

          <motion.button
            type="submit"
            className="button w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Game 🎮
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
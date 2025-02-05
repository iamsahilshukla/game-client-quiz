import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { socket } from '../lib/socket';
import QuestionCard from '../components/QuestionCard';
import Leaderboard from '../components/Leaderboard';
import TimerBar from '../components/TimeBar';
import { Loader2 } from 'lucide-react';

export default function GameScreen() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roomId = params.get('roomId')!;

  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<Array<{ name: string; score: number }>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    socket.on('new_question', (question: any) => {
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
    });

    socket.on('leaderboard_update', (updatedLeaderboard: any) => {
      setLeaderboard(updatedLeaderboard);
    });

    socket.on('game_ended', (finalLeaderboard: any) => {
      setLeaderboard(finalLeaderboard);
      setGameEnded(true);
    });

    return () => {
      socket.off('new_question');
      socket.off('leaderboard_update');
      socket.off('game_ended');
    };
  }, []);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    socket.emit('submit_answer', { roomId, answer });
  };

  const renderWaitingScreen = () => (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center animate-fade-in">
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      <h2 className="text-2xl font-bold text-gray-800">Waiting for the Game to Start</h2>
      <p className="text-gray-600">The quiz will begin once the admin starts the game...</p>
      {leaderboard.length > 0 && (
        <div className="w-full max-w-md mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Players in Room</h3>
          <Leaderboard data={leaderboard} className="bg-white rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );

  const renderGameContent = () => (
    <div className="space-y-6 animate-fade-in">
      <TimerBar 
        key={questionStartTime}
        duration={currentQuestion.timeLimit} 
      />
      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswer={handleAnswer}
      />
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Standings</h3>
        <Leaderboard data={leaderboard} className="bg-white rounded-lg shadow-md" />
      </div>
    </div>
  );

  const renderGameEnd = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
        <p className="text-gray-600 mb-8">Here are the final results</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Final Leaderboard</h3>
        <Leaderboard data={leaderboard} className="bg-gray-50 rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
          {!currentQuestion && !gameEnded && renderWaitingScreen()}
          {currentQuestion && !gameEnded && renderGameContent()}
          {gameEnded && renderGameEnd()}
        </div>
      </div>
    </div>
  );
}
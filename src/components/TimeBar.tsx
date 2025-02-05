import React, { useEffect, useState } from 'react';
import '../App.css';

interface TimerBarProps {
  duration: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration); // Reset timeLeft whenever duration changes
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerId); // Clear interval on cleanup
    };
  }, [timeLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const progress = (timeLeft / duration) * 100;
  const isEnding = timeLeft <= 5;

  return (
    <div className="timer-bar">
      <div 
        className={`timer-progress ${isEnding ? 'ending' : ''}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default TimerBar;
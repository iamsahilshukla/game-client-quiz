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
  }, [timeLeft]);

  return (
    <div className="timer-bar">
      <div className="timer-bar-inner" style={{ width: `${(timeLeft / duration) * 100}%` }} />
    </div>
  );
};

export default TimerBar;
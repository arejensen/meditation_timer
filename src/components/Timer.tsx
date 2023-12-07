import React, { useEffect, useState, useRef } from 'react';

type TimerProps = {
  initialTime: number;
  triple: boolean;
  alarmSound: string;
  isActive: boolean;
  onTimerFinish: () => void;
};

const Timer: React.FC<TimerProps> = ({ initialTime, triple, alarmSound, isActive, onTimerFinish }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [playCount, setPlayCount] = useState(0);
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft; // Update ref value whenever timeLeft changes

  useEffect(() => {
    if (isActive) {
      setTimeLeft(initialTime);
      setPlayCount(0);
    }
  }, [isActive, initialTime]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setPlayCount(triple ? 3 : 1);
    }
  }, [timeLeft, isActive, triple]);

  useEffect(() => {
    if (playCount > 0) {
      const audio = new Audio(alarmSound);
      audio.play().then(() => {
        setTimeout(() => setPlayCount(playCount - 1), 3500);
      }).catch(e => console.error('Error playing sound:', e));
    } else if (playCount === 0 && timeLeftRef.current === 0) {
      onTimerFinish();
    }
  }, [playCount, alarmSound, onTimerFinish]);

  if (!isActive) return null;

  return (
    <div>
      <p>Time Left: {timeLeft} seconds</p>
    </div>
  );
};

export default Timer;

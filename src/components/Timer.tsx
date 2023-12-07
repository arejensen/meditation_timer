import React, { useState, useEffect, useCallback } from 'react';

type TimerProps = {
  alarmSound: string;
};

const Timer: React.FC<TimerProps> = ({ alarmSound }) => {
  const [initialTime, setInitialTime] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [triple, setTriple] = useState<boolean>(false);
  const [playCount, setPlayCount] = useState<number>(0);

  useEffect(() => {
    if (playCount > 0) {
      const audio = new Audio(alarmSound);
      audio.play().then(() => {
        setTimeout(() => setPlayCount(playCount - 1), 3500);
      }).catch(e => console.error('Error playing sound:', e));
    }
  }, [playCount, alarmSound]);

  const playSound = useCallback(() => {
    setPlayCount(triple ? 3 : 1);
  }, [triple]);

  useEffect(() => {
    let intervalId: number;

    if (isRunning && timeLeft > 0) {
      intervalId = window.setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playSound();
    }

    return () => clearInterval(intervalId);
  }, [timeLeft, isRunning, playSound]);

  const handleStart = () => {
    setTimeLeft(initialTime);
    setIsRunning(true);
    setPlayCount(0);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInitialTime(Math.max(0, Number(event.target.value)));
  };

  const handleTripleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTriple(event.target.checked);
  };

  return (
    <div>
      <p>Time Left: {timeLeft} seconds</p>
      <input 
        type="number" 
        value={initialTime} 
        onChange={handleTimeChange} 
        disabled={isRunning} 
      />
      <label>
        <input 
          type="checkbox" 
          checked={triple} 
          onChange={handleTripleChange} 
          disabled={isRunning} 
        />
        Play Sound Triple
      </label>
      <button onClick={handleStart} disabled={isRunning}>
        Start Timer
      </button>
    </div>
  );
};

export default Timer;

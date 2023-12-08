import React, { useEffect, useState, useCallback } from 'react';

type TimerProps = {
  initialTime: number;
  triple: boolean;
  alarmSound: string;
  isActive: boolean;
  onTimerFinish: () => void;
};

const Timer: React.FC<TimerProps> = ({ initialTime, triple, alarmSound, isActive, onTimerFinish }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const playSound = useCallback(() => {
    if (triple) {
      let playCount = 0;

      const playInterval = () => {
        if (playCount < 3) {
          const audio = new Audio(alarmSound);
          audio.play().catch(e => console.error('Error playing sound:', e));
          playCount++;
        } else {
          clearInterval(interval);
          onTimerFinish();
        }
      };

      const interval = setInterval(playInterval, 3500);
      playInterval();
    } else {
      const audio = new Audio(alarmSound);
      audio.play().then(() => {
        onTimerFinish();
      }).catch(e => console.error('Error playing sound:', e));
    }
  }, [alarmSound, triple, onTimerFinish]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(initialTime);
      return;
    }

    const interval = isActive && timeLeft > 0
      ? setInterval(() => setTimeLeft(t => t - 1), 1000)
      : null;

    if (timeLeft === 0) {
      playSound(); // Play the sound when the countdown reaches zero
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, initialTime, playSound]); 

  return (
    <div>
      <p>Time Left: {isActive ? timeLeft : initialTime} seconds</p>
    </div>
  );
};

export default Timer;

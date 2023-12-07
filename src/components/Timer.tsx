import React, { useEffect, useState } from 'react';

type TimerProps = {
  initialTime: number;
  triple: boolean;
  alarmSound: string;
  isActive: boolean;
  onTimerFinish: () => void;
};

const Timer: React.FC<TimerProps> = ({ initialTime, triple, alarmSound, isActive, onTimerFinish }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(initialTime); // Reset the timer whenever it becomes inactive
      return;
    }

    const interval = isActive && timeLeft > 0
      ? setInterval(() => setTimeLeft(t => t - 1), 1000)
      : null;

    const playSound = () => {
      if (triple) {
        let playCount = 0;

        const playInterval = () => {
          if (playCount < 3) {
            const audio = new Audio(alarmSound); // audio source each time due to missing sound when reusing
            audio.play().catch(e => console.error('Error playing sound:', e));
            playCount++;
          } else {
            clearInterval(interval);
            onTimerFinish();
          }
        };

        const interval = setInterval(playInterval, 3500);
        playInterval(); // Play the first sound immediately
      } else {
        const audio = new Audio(alarmSound);
        audio.play().then(() => {
          onTimerFinish();
        }).catch(e => console.error('Error playing sound:', e));
      }
    };

    if (timeLeft === 0) {
      playSound(); // Play the sound when the countdown reaches zero
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, initialTime]);


  return (
    <div>
      <p>Time Left: {isActive ? timeLeft : initialTime} seconds</p>
    </div>
  );
};

export default Timer;

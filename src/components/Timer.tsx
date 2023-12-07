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
      const audio = new Audio(alarmSound);
      audio.play().then(() => {
        if (triple) {
          let playCount = 1;
          const interval = setInterval(() => {
            playCount++;
            audio.play();
            if (playCount >= 3) {
              clearInterval(interval);
              onTimerFinish();
            }
          }, 3500);
        } else {
          onTimerFinish();
        }
      }).catch(e => console.error('Error playing sound:', e));
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

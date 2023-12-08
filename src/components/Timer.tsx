import React, { useEffect, useState, useCallback } from "react";

type TimerProps = {
  initialTime: number;
  triple: boolean;
  alarmSound: string;
  isActive: boolean;
  paused: boolean;
  updateDisplayTime: (time: number) => void;
  onTimerFinish: () => void;
};

const Timer: React.FC<TimerProps> = ({
  initialTime,
  triple,
  alarmSound,
  isActive,
  paused,
  updateDisplayTime,
  onTimerFinish,
}) => {
  const [timeLeft, setTimeLeftState] = useState(initialTime);

  const playSound = useCallback(() => {
    const soundPlayHandler = () => {
      const audio = new Audio(alarmSound);
      audio.play().catch((e) => console.error("Error playing sound:", e));
    };

    if (triple) {
      let playCount = 0;

      const playInterval = setInterval(() => {
        if (playCount < 3) {
          soundPlayHandler();
          playCount++;
        } else {
          clearInterval(playInterval);
          onTimerFinish();
        }
      }, 3500);

      soundPlayHandler();
    } else {
      soundPlayHandler();
      onTimerFinish();
    }
  }, [alarmSound, triple, onTimerFinish]);

  useEffect(() => {
    if (paused || !isActive) {
      setTimeLeftState(initialTime);
      return;
    }

    const interval = timeLeft > 0
      ? setInterval(() => {
          const newTime = timeLeft - 1;
          setTimeLeftState(newTime);
          updateDisplayTime(newTime);
        }, 1000)
      : null;

    if (timeLeft === 0) {
      playSound();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paused, isActive, timeLeft, initialTime, playSound, updateDisplayTime]);

  return null;  // Or your desired JSX
};

export default Timer;

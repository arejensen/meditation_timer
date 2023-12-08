import React, { useEffect, useState, useCallback } from "react";
import alarmSound from "../assets/gong.mp3";

type TimerProps = {
  initialTime: number;
  triple: boolean;
  isActive: boolean;
  paused: boolean;
  updateDisplayTime: (time: number) => void;
  onTimerFinish: () => void;
};

const Timer: React.FC<TimerProps> = ({
  initialTime,
  triple,
  isActive,
  paused,
  updateDisplayTime,
  onTimerFinish,
}) => {
  const [timeLeft, setTimeLeftState] = useState(initialTime);

  const playSound = useCallback(() => {

    const soundPlayHandler = () => {
      const audio = new Audio(alarmSound);
      audio.preload = "auto";
      audio.play().catch((e) => console.error("Error playing sound:", e));
    };

    if (triple) {
      let playCount = 1;

      const playInterval = setInterval(() => {
        if (playCount < 3) {
          soundPlayHandler();
          playCount++;
        } else {
          clearInterval(playInterval);
          onTimerFinish();
        }
      }, 5000);

      soundPlayHandler();
    } else {
      soundPlayHandler();
      onTimerFinish();
    }
  }, [triple, onTimerFinish]);

  useEffect(() => {
    if (paused || !isActive) {
      setTimeLeftState(initialTime);
      return;
    }

    const interval =
      timeLeft > 0
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

  return null;
};

export default Timer;

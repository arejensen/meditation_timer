import { useState } from "react";
import Timer from "./SingleTimer";
import alarmSound from "../assets/gong.mp3";

const DefaultTimerLength = 600;

const Timers = () => {
  const [timers, setTimers] = useState([
    { id: 1, initialTime: DefaultTimerLength, triple: false, displayTime: DefaultTimerLength },
  ]);
  const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState<boolean>(false);

  const startSequence = () => {
    setTimers(
      timers.map((timer) => ({ ...timer, displayTime: timer.initialTime }))
    );
    setActiveTimerIndex(0);
  };

  const updateDisplayTime = (id: number, time: number) => {
    setTimers(
      timers.map((timer) =>
        timer.id === id ? { ...timer, displayTime: time } : timer
      )
    );
  };

  const handleTimerFinish = () => {
    setActiveTimerIndex((prevIndex) => {
      if (prevIndex !== null && prevIndex < timers.length - 1) {
        return prevIndex + 1;
      } else {
        checkAndResetTimersIfSequenceCompleted();
        return null;
      }
    });
  };

  const checkAndResetTimersIfSequenceCompleted = () => {
    if (activeTimerIndex === timers.length - 1) {
      setTimers(
        timers.map((timer) => ({ ...timer, displayTime: timer.initialTime }))
      );
    }
  };

  const stopSequence = () => {
    setActiveTimerIndex(null);
    setTimers(
      timers.map((timer) => ({ ...timer, displayTime: timer.initialTime }))
    );
  };

  const addTimer = () => {
    const newId = Math.max(0, ...timers.map((timer) => timer.id)) + 1;
    setTimers([
      ...timers,
      {
        id: newId,
        initialTime: getLastTimerInitialTime(),
        triple: false,
        displayTime: getLastTimerInitialTime(),
      },
    ]);
  };

  const getLastTimerInitialTime = () => {
    if (timers.length === 0) {
      return DefaultTimerLength;
    }

    const lastTimer = timers[timers.length - 1];
    return lastTimer.initialTime;
  };

  const updateTimerConfig = (
    id: number,
    field: keyof (typeof timers)[0],
    value: number | boolean
  ) => {
    setTimers(
      timers.map((timer) =>
        timer.id === id ? { ...timer, [field]: value } : timer
      )
    );
  };

  const removeTimer = (id: number) => {
    if (timers.length > 1) {
      setTimers(timers.filter((timer) => timer.id !== id));
    }
  };

  const pauseSequence = () => {
    setPaused(!paused);
  };

  const handleInitialTimeChange = (id: number, newTime: number) => {
    setTimers(
      timers.map((timer) =>
        timer.id === id
          ? { ...timer, initialTime: Math.max(1, newTime) }
          : timer
      )
    );
  };

  return (
    <div className="App">
      {timers.map((timer, index) => (
        <div key={timer.id} className="timer-container">
          <Timer
            alarmSound={alarmSound}
            isActive={index === activeTimerIndex}
            onTimerFinish={handleTimerFinish}
            initialTime={timer.initialTime}
            triple={timer.triple}
            paused={paused}
            updateDisplayTime={(time) => updateDisplayTime(timer.id, time)}
          />
          <div className="timer-config">
            <input
              type="number"
              min="1"
              value={
                activeTimerIndex !== null
                  ? timer.displayTime
                  : timer.initialTime
              }
              onChange={(e) =>
                handleInitialTimeChange(timer.id, Number(e.target.value))
              }
              disabled={activeTimerIndex !== null}
            />
            <label>
              <input
                type="checkbox"
                checked={timer.triple}
                onChange={(e) =>
                  updateTimerConfig(timer.id, "triple", e.target.checked)
                }
                disabled={activeTimerIndex !== null}
              />
              Triple
            </label>
            {timers.length > 1 && (
              <button
                onClick={() => removeTimer(timer.id)}
                disabled={activeTimerIndex !== null}
              >
                Remove Timer
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="timer-controls">
        {activeTimerIndex === null && (
          <>
            <button onClick={addTimer}>Add New Timer</button>
            <button onClick={startSequence}>Start Sequence</button>
          </>
        )}
        {activeTimerIndex !== null && (
          <>
            <button onClick={stopSequence}>Stop Sequence</button>
            <button onClick={pauseSequence}>
              {paused ? "Resume" : "Pause"} Sequence
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Timers;

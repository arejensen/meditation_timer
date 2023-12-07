import React, { useState } from 'react';
import Timer from './components/Timer';
import alarmSound from './assets/gong.mp3'; // Adjust this path as needed

const App = () => {
  const [timers, setTimers] = useState([
    { id: 1, initialTime: 60, triple: false },
  ]);
  const [activeTimerId, setActiveTimerId] = useState<number | null>(null);

  const startSequence = () => {
    setActiveTimerId(timers[0]?.id || null);
  };

  const handleTimerFinish = (id: number) => {
    const currentTimerIndex = timers.findIndex(timer => timer.id === id);
    const nextTimer = timers[currentTimerIndex + 1];
    if (nextTimer) {
      setActiveTimerId(nextTimer.id);
    } else {
      setActiveTimerId(null); // Sequence finished
    }
  };

  const addTimer = () => {
    const newId = timers.length > 0 ? Math.max(...timers.map(t => t.id)) + 1 : 1;
    setTimers([...timers, { id: newId, initialTime: 60, triple: false }]);
  };

  const updateTimer = (id: number, field: string, value: number | boolean) => {
    setTimers(timers.map(timer => {
      if (timer.id === id) {
        return { ...timer, [field]: value };
      }
      return timer;
    }));
  };

  return (
    <div className="App">
      {timers.map((timer) => (
        <div key={timer.id}>
          <Timer 
            initialTime={timer.initialTime} 
            triple={timer.triple} 
            alarmSound={alarmSound} 
            isActive={timer.id === activeTimerId} 
            onTimerFinish={() => handleTimerFinish(timer.id)} 
          />
          <input 
            type="number" 
            value={timer.initialTime} 
            onChange={(e) => updateTimer(timer.id, 'initialTime', Number(e.target.value))}
            disabled={activeTimerId !== null} 
          />
          <label>
            <input 
              type="checkbox" 
              checked={timer.triple} 
              onChange={(e) => updateTimer(timer.id, 'triple', e.target.checked)}
              disabled={activeTimerId !== null} 
            />
            Play Sound Triple
          </label>
        </div>
      ))}
      <button onClick={addTimer} disabled={activeTimerId !== null}>Add New Timer</button>
      {activeTimerId === null && (
        <button onClick={startSequence}>Start Timers</button>
      )}
    </div>
  );
};

export default App;

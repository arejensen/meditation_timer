import React, { useState } from 'react';
import Timer from './components/Timer';
import alarmSound from './assets/gong.mp3';

const App = () => {
  const [timers, setTimers] = useState([
    { id: 1, initialTime: 2, triple: false },
    { id: 2, initialTime: 2, triple: false },
    { id: 3, initialTime: 2, triple: false },
    { id: 4, initialTime: 2, triple: true },
    // ...additional timers
  ]);
  const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null);

  const startSequence = () => {
    setActiveTimerIndex(0);
  };

  const handleTimerFinish = () => {
    setActiveTimerIndex(prevIndex => 
      prevIndex !== null && prevIndex < timers.length - 1 ? prevIndex + 1 : null
    );
  };

  const addTimer = () => {
    const newId = Math.max(0, ...timers.map(timer => timer.id)) + 1;
    setTimers([...timers, { id: newId, initialTime: 60, triple: false }]);
  };

  const updateTimerConfig = (id: number, field: keyof typeof timers[0], value: number | boolean) => {
    setTimers(timers.map(timer => timer.id === id ? { ...timer, [field]: value } : timer));
  };

  return (
    <div className="App">
      {timers.map((timer, index) => (
        <div key={timer.id}>
          <Timer
            alarmSound={alarmSound}
            isActive={index === activeTimerIndex}
            onTimerFinish={handleTimerFinish}
            initialTime={timer.initialTime}
            triple={timer.triple}
          />
          <div>
            <input 
              type="number"
              min="1"
              value={timer.initialTime}
              onChange={(e) => updateTimerConfig(timer.id, 'initialTime', Math.max(1, Number(e.target.value)))}
              disabled={activeTimerIndex !== null}
            />
            <label>
              <input 
                type="checkbox"
                checked={timer.triple}
                onChange={(e) => updateTimerConfig(timer.id, 'triple', e.target.checked)}
                disabled={activeTimerIndex !== null}
              />
              Triple
            </label>
          </div>
        </div>
      ))}
      <button onClick={addTimer} disabled={activeTimerIndex !== null}>Add New Timer</button>
      <button onClick={startSequence} disabled={activeTimerIndex !== null}>Start Sequence</button>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import Timer from './components/Timer';
import alarmSound from './assets/gong.mp3'; // Adjust this path as needed

const App = () => {
  const [timers, setTimers] = useState<Array<{ id: number; }>>([
    { id: 1 },
  ]);
  const [nextId, setNextId] = useState<number>(2);

  const addTimer = () => {
    setTimers([...timers, { id: nextId }]);
    setNextId(nextId + 1);
  };

  return (
    <div className="App">
      {timers.map(timer => (
        <Timer key={timer.id} alarmSound={alarmSound} />
      ))}
      <button onClick={addTimer}>Add New Timer</button>
    </div>
  );
};

export default App;

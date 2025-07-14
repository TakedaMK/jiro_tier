import React from 'react';
import './App.css';
import TierList from './components/TierList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ラーメン二郎 Tier表</h1>
      </header>
      <main>
        <TierList />
      </main>
    </div>
  );
}

export default App;
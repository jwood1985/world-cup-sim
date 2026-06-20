import React, { useState, useCallback, useRef } from 'react';
import { computeCurrentStandings } from './engine/simulator.js';
import GroupStageView from './components/GroupStageView.jsx';
import KnockoutBracket from './components/KnockoutBracket.jsx';
import ProbabilityTable from './components/ProbabilityTable.jsx';

const CURRENT_STANDINGS = computeCurrentStandings();

export default function App() {
  const [nSims, setNSims] = useState(10000);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mcResults, setMcResults] = useState(null);
  const [activeTab, setActiveTab] = useState('groups');
  const workerRef = useRef(null);

  const runSim = useCallback(() => {
    // Terminate any previous worker
    if (workerRef.current) workerRef.current.terminate();

    setRunning(true);
    setProgress(0);
    setMcResults(null);

    const worker = new Worker(
      new URL('./engine/simWorker.js', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data.type === 'progress') {
        setProgress(e.data.progress);
      } else if (e.data.type === 'done') {
        setMcResults(e.data.results);
        setRunning(false);
        setProgress(1);
        setActiveTab('bracket');
        worker.terminate();
      }
    };

    worker.onerror = () => {
      // Fallback: run on main thread if Worker fails (e.g. local file://)
      worker.terminate();
      import('./engine/simulator.js').then(({ runMonteCarlo }) => {
        const results = runMonteCarlo(nSims, (p) => setProgress(p));
        setMcResults(results);
        setRunning(false);
        setProgress(1);
        setActiveTab('bracket');
      });
    };

    worker.postMessage({ N: nSims });
  }, [nSims]);

  const tabs = [
    { id:'groups',  label:'Group Stage' },
    { id:'bracket', label:'Bracket' },
    { id:'probs',   label:'Probabilities' },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>⚽ 2026 FIFA World Cup</h1>
          <p className="subtitle">Monte Carlo Simulator · Standings as of June 20, 2026</p>
        </div>
        <div className="sim-controls">
          <label className="ctrl-label">
            Simulations:
            <input
              type="number"
              className="n-input"
              value={nSims}
              min={100}
              max={100000}
              step={1000}
              onChange={e => setNSims(Number(e.target.value))}
              disabled={running}
            />
          </label>
          <button className="run-btn" onClick={runSim} disabled={running}>
            {running
              ? `Simulating… ${(progress * 100).toFixed(0)}%`
              : '▶ Run Simulation'}
          </button>
        </div>
      </header>

      {running && (
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: `${(progress * 100).toFixed(1)}%` }} />
        </div>
      )}

      <nav className="tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab ${activeTab === t.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'groups' && (
          <GroupStageView standings={CURRENT_STANDINGS} mcResults={mcResults} />
        )}
        {activeTab === 'bracket' && (
          <>
            {!mcResults && (
              <div className="empty-state">
                <p>Run the simulation to generate the bracket.</p>
                <button className="run-btn" onClick={runSim}>▶ Run Simulation</button>
              </div>
            )}
            {mcResults && (
              <KnockoutBracket sim={mcResults.lastSim} mcResults={mcResults} />
            )}
          </>
        )}
        {activeTab === 'probs' && (
          <>
            {!mcResults && (
              <div className="empty-state">
                <p>Run the simulation to see probabilities.</p>
                <button className="run-btn" onClick={runSim}>▶ Run Simulation</button>
              </div>
            )}
            {mcResults && <ProbabilityTable mcResults={mcResults} />}
          </>
        )}
      </main>

      <footer className="app-footer">
        Data: FIFA rankings (Jun 11 2026) · Results via public sports data ·
        Model: independent Poisson goals, λ from FIFA pts (scale=600) ·
        Tiebreakers: Pts → GD → GF → H2H Pts → H2H GD → H2H GF → FIFA rank
      </footer>
    </div>
  );
}

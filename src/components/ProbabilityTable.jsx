import React, { useState } from 'react';
import { TeamName } from './GroupStageView.jsx';

export default function ProbabilityTable({ mcResults }) {
  const [sortKey, setSortKey] = useState('champion');
  if (!mcResults) return null;

  const cols = [
    { key:'champion',  label:'🏆 Champion' },
    { key:'finalist',  label:'Final' },
    { key:'semiFinal', label:'Semi-F' },
    { key:'quartFinal',label:'Quarter-F' },
    { key:'r16',       label:'R16' },
    { key:'r32',       label:'R32' },
    { key:'first',     label:'Grp 1st' },
    { key:'second',    label:'Grp 2nd' },
  ];

  const sorted = [...mcResults.teams].sort((a, b) => b[sortKey] - a[sortKey]);

  const bar = (v) => {
    const w = Math.min(100, v);
    const color = v > 20 ? '#22c55e' : v > 8 ? '#3b82f6' : v > 2 ? '#f59e0b' : '#6b7280';
    return (
      <div className="bar-cell">
        <div className="bar-bg">
          <div className="bar-fill" style={{width:`${w}%`, background:color}} />
        </div>
        <span className="bar-label">{v.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="prob-table-wrap">
      <h3>Probability Table ({mcResults.N.toLocaleString()} simulations)</h3>
      <div className="prob-table-scroll">
        <table className="prob-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th title="Pre-tournament FIFA points">FIFA pts</th>
              {cols.map(c => (
                <th key={c.key}
                    className={sortKey === c.key ? 'sorted-col' : ''}
                    onClick={() => setSortKey(c.key)}
                    style={{cursor:'pointer'}}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.team} className={i % 2 === 0 ? 'even' : ''}>
                <td>{i + 1}</td>
                <td><TeamName team={row.team} /></td>
                <td>{row.fifaPoints}</td>
                {cols.map(c => (
                  <td key={c.key} className={sortKey === c.key ? 'sorted-col' : ''}>
                    {c.key === 'champion' ? bar(row[c.key]) : `${row[c.key].toFixed(1)}%`}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

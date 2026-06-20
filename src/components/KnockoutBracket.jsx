import React from 'react';
import { R32_BRACKET, R16_PAIRS, QF_PAIRS, SF_PAIRS } from '../data/worldCupData.js';
import { TeamName } from './GroupStageView.jsx';

function pct(v, n) { return n ? ((v / n) * 100).toFixed(1) : '—'; }

function MatchSlot({ teamA, teamB, winner, className = '' }) {
  return (
    <div className={`match-slot ${className}`}>
      <div className={`match-team ${winner === teamA ? 'match-winner' : ''}`}>
        {teamA ? <TeamName team={teamA} /> : <span className="tbd">TBD</span>}
      </div>
      <div className={`match-team ${winner === teamB ? 'match-winner' : ''}`}>
        {teamB ? <TeamName team={teamB} /> : <span className="tbd">TBD</span>}
      </div>
    </div>
  );
}

export default function KnockoutBracket({ sim, mcResults }) {
  if (!sim) return null;

  const { r32Results, r32Participants, r16Winners, qfWinners, sfWinners, champion } = sim;

  // R16 bracket built from R16_PAIRS
  const r16 = R16_PAIRS.map(([idA, idB], i) => ({
    a: r32Results[idA], b: r32Results[idB], winner: r16Winners[i]
  }));

  const qf = QF_PAIRS.map(([i, j], k) => ({
    a: r16Winners[i], b: r16Winners[j], winner: qfWinners[k]
  }));

  const sf = SF_PAIRS.map(([i, j], k) => ({
    a: qfWinners[i], b: qfWinners[j], winner: sfWinners[k]
  }));

  const mcMap = {};
  if (mcResults) mcResults.teams.forEach(t => { mcMap[t.team] = t; });

  return (
    <div className="bracket-outer">
      {/* ── R32 ── */}
      <section className="bracket-section">
        <h3 className="bracket-round-title">Round of 32</h3>
        <div className="bracket-round r32-grid">
          {(r32Participants || R32_BRACKET.map(m => ({ id: m.id, a: null, b: null }))).map((m) => (
            <MatchSlot key={m.id} teamA={m.a} teamB={m.b} winner={r32Results?.[m.id]} />
          ))}
        </div>
      </section>

      {/* ── R16 ── */}
      <section className="bracket-section">
        <h3 className="bracket-round-title">Round of 16</h3>
        <div className="bracket-round r16-grid">
          {r16.map((m, i) => (
            <MatchSlot key={i} teamA={m.a} teamB={m.b} winner={m.winner} />
          ))}
        </div>
      </section>

      {/* ── QF ── */}
      <section className="bracket-section">
        <h3 className="bracket-round-title">Quarter-Finals</h3>
        <div className="bracket-round qf-grid">
          {qf.map((m, i) => (
            <div key={i}>
              <MatchSlot teamA={m.a} teamB={m.b} winner={m.winner} />
              {mcResults && m.a && m.b && (
                <div className="mc-hint">
                  {mcMap[m.a]?.quartFinal?.toFixed(1)}% / {mcMap[m.b]?.quartFinal?.toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── SF ── */}
      <section className="bracket-section">
        <h3 className="bracket-round-title">Semi-Finals</h3>
        <div className="bracket-round sf-grid">
          {sf.map((m, i) => (
            <div key={i}>
              <MatchSlot teamA={m.a} teamB={m.b} winner={m.winner} />
              {mcResults && m.a && m.b && (
                <div className="mc-hint">
                  {mcMap[m.a]?.semiFinal?.toFixed(1)}% / {mcMap[m.b]?.semiFinal?.toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final ── */}
      <section className="bracket-section final-section">
        <h3 className="bracket-round-title">Final</h3>
        <MatchSlot teamA={sfWinners[0]} teamB={sfWinners[1]} winner={champion} className="final-match" />
        {mcResults && sfWinners[0] && sfWinners[1] && (
          <div className="mc-hint center">
            {mcMap[sfWinners[0]]?.finalist?.toFixed(1)}% / {mcMap[sfWinners[1]]?.finalist?.toFixed(1)}% reach final
          </div>
        )}
      </section>

      {/* ── Champion ── */}
      {champion && (
        <section className="champion-banner">
          <div className="champion-label">🏆 Simulated Champion</div>
          <div className="champion-team">
            <TeamName team={champion} />
          </div>
          {mcResults && mcMap[champion] && (
            <div className="champion-pct">
              Champion in {mcMap[champion].champion.toFixed(1)}% of {mcResults.N.toLocaleString()} simulations
            </div>
          )}
        </section>
      )}
    </div>
  );
}

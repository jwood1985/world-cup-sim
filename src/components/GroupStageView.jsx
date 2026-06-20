import React from 'react';
import { FIFA_POINTS } from '../data/worldCupData.js';

const FLAG = {
  Mexico:'🇲🇽','South Africa':'🇿🇦','South Korea':'🇰🇷',Czechia:'🇨🇿',
  Canada:'🇨🇦',Bosnia:'🇧🇦',Qatar:'🇶🇦',Switzerland:'🇨🇭',
  Brazil:'🇧🇷',Morocco:'🇲🇦',Scotland:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',Haiti:'🇭🇹',
  USA:'🇺🇸',Paraguay:'🇵🇾',Australia:'🇦🇺',Turkey:'🇹🇷',
  Germany:'🇩🇪','Ivory Coast':'🇨🇮',Ecuador:'🇪🇨','Curaçao':'🇨🇼',
  Netherlands:'🇳🇱',Japan:'🇯🇵',Sweden:'🇸🇪',Tunisia:'🇹🇳',
  Belgium:'🇧🇪',Egypt:'🇪🇬',Iran:'🇮🇷','New Zealand':'🇳🇿',
  Spain:'🇪🇸','Cape Verde':'🇨🇻','Saudi Arabia':'🇸🇦',Uruguay:'🇺🇾',
  France:'🇫🇷',Senegal:'🇸🇳',Iraq:'🇮🇶',Norway:'🇳🇴',
  Argentina:'🇦🇷',Algeria:'🇩🇿',Austria:'🇦🇹',Jordan:'🇯🇴',
  Portugal:'🇵🇹','DR Congo':'🇨🇩',Uzbekistan:'🇺🇿',Colombia:'🇨🇴',
  England:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',Croatia:'🇭🇷',Ghana:'🇬🇭',Panama:'🇵🇦',
};

export function TeamName({ team, showFlag = true }) {
  return (
    <span className="team-name">
      {showFlag && <span className="flag">{FLAG[team] || '🏳'}</span>}
      {team}
    </span>
  );
}

export default function GroupStageView({ standings, mcResults }) {
  return (
    <div className="groups-grid">
      {Object.entries(standings).map(([gId, rows]) => (
        <div key={gId} className="group-card">
          <h3 className="group-title">Group {gId}</h3>
          <table className="standings-table">
            <thead>
              <tr>
                <th>#</th><th className="team-col">Team</th>
                <th title="Played">P</th><th title="Wins">W</th>
                <th title="Draws">D</th><th title="Losses">L</th>
                <th title="Goal Difference">GD</th><th title="Goals For">GF</th>
                <th title="Points">Pts</th>
                {mcResults && <th title="Advance %">Adv%</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const mc = mcResults?.teams.find(t => t.team === row.team);
                const advPct = mc ? (mc.first + mc.second + mc.thirdBest) : null;
                const rowClass = i < 2 ? 'qualify-auto' : i === 2 ? 'qualify-maybe' : '';
                return (
                  <tr key={row.team} className={rowClass}>
                    <td className="rank-num">{i + 1}</td>
                    <td className="team-col">
                      <TeamName team={row.team} />
                      <span className="fifa-rank">#{Object.entries(FIFA_POINTS).sort(([,a],[,b])=>b-a).findIndex(([k])=>k===row.team)+1}</span>
                    </td>
                    <td>{row.p}</td><td>{row.w}</td><td>{row.d}</td><td>{row.l}</td>
                    <td className={row.gd > 0 ? 'pos' : row.gd < 0 ? 'neg' : ''}>{row.gd > 0 ? '+' : ''}{row.gd}</td>
                    <td>{row.gf}</td>
                    <td className="pts">{row.pts}</td>
                    {mcResults && (
                      <td className="adv-pct">
                        {advPct !== null ? (
                          <span style={{color: advPct > 70 ? '#22c55e' : advPct > 40 ? '#f59e0b' : '#ef4444'}}>
                            {advPct.toFixed(1)}%
                          </span>
                        ) : '—'}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {mcResults && (
            <div className="group-footer">
              <span className="legend qualify-auto-dot">■</span> Auto qualify &nbsp;
              <span className="legend qualify-maybe-dot">■</span> Best 3rd race
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

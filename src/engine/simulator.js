import {
  FIFA_POINTS, COMPLETED_RESULTS, GROUPS, FIXTURES,
  R32_BRACKET, R16_PAIRS, QF_PAIRS, SF_PAIRS,
} from '../data/worldCupData.js';

// ── Poisson RNG (Knuth) ───────────────────────────────────────────────────────
function poisson(lambda) {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

// ── Simulate one match, return { goalsA, goalsB } ────────────────────────────
// SCALE: points diff / 600 drives the Poisson means. Calibrated so that
// equal teams each expect ~1.1 goals and a 900-pt gap gives ~3.9 vs 0.3.
const BASE = 1.1;
const SCALE = 600;

export function simulateMatch(teamA, teamB) {
  const diff = (FIFA_POINTS[teamA] - FIFA_POINTS[teamB]) / SCALE;
  const lambdaA = BASE * Math.exp(diff);
  const lambdaB = BASE * Math.exp(-diff);
  return { goalsA: poisson(lambdaA), goalsB: poisson(lambdaB) };
}

// Knockout: simulate with ET+PKs – returns winner
export function simulateKnockout(teamA, teamB) {
  const r = simulateMatch(teamA, teamB);
  if (r.goalsA !== r.goalsB) return r.goalsA > r.goalsB ? teamA : teamB;
  // Extra time – half-strength poisson
  const diff = (FIFA_POINTS[teamA] - FIFA_POINTS[teamB]) / SCALE;
  const etA = poisson(BASE * 0.4 * Math.exp(diff));
  const etB = poisson(BASE * 0.4 * Math.exp(-diff));
  if (etA !== etB) return etA > etB ? teamA : teamB;
  // Penalties – slight edge to stronger team (55/45 max)
  const pA = 0.5 + (FIFA_POINTS[teamA] - FIFA_POINTS[teamB]) / 20000;
  return Math.random() < Math.max(0.3, Math.min(0.7, pA)) ? teamA : teamB;
}

// ── Group-stage standings ─────────────────────────────────────────────────────
function blankRecord(team) {
  return { team, p:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0 };
}

function applyResult(recs, home, away, gh, ga) {
  const h = recs[home], a = recs[away];
  h.p++; a.p++;
  h.gf += gh; h.ga += ga; h.gd += gh - ga;
  a.gf += ga; a.ga += gh; a.gd += ga - gh;
  if (gh > ga) { h.w++; h.pts += 3; a.l++; }
  else if (gh < ga) { a.w++; a.pts += 3; h.l++; }
  else { h.d++; h.pts++; a.d++; a.pts++; }
}

// Head-to-head pts/gd/gf among a subset of teams from completed+simulated matches
function h2hStats(teams, results) {
  const set = new Set(teams);
  const stat = {};
  teams.forEach(t => { stat[t] = { pts:0, gd:0, gf:0 }; });
  for (const r of results) {
    if (!set.has(r.home) || !set.has(r.away)) continue;
    const h = stat[r.home], a = stat[r.away];
    h.gf += r.gh; h.gd += r.gh - r.ga;
    a.gf += r.ga; a.gd += r.ga - r.gh;
    if (r.gh > r.ga) { h.pts += 3; }
    else if (r.ga > r.gh) { a.pts += 3; }
    else { h.pts++; a.pts++; }
  }
  return stat;
}

// Compare two teams within a group by official tiebreaking order
function compareTeams(a, b, groupResults, useFIFA = true) {
  if (b.pts !== a.pts) return b.pts - a.pts;
  if (b.gd !== a.gd) return b.gd - a.gd;
  if (b.gf !== a.gf) return b.gf - a.gf;
  // Head-to-head
  const h2h = h2hStats([a.team, b.team], groupResults);
  const [ha, hb] = [h2h[a.team], h2h[b.team]];
  if (hb.pts !== ha.pts) return hb.pts - ha.pts;
  if (hb.gd !== ha.gd) return hb.gd - ha.gd;
  if (hb.gf !== ha.gf) return hb.gf - ha.gf;
  // FIFA ranking (lower index = better)
  if (useFIFA) return (FIFA_POINTS[b.team] || 0) - (FIFA_POINTS[a.team] || 0);
  return 0;
}

// Sort a group's standings with full tiebreaking
function sortGroup(records, groupResults) {
  return Object.values(records).sort((a, b) => compareTeams(a, b, groupResults));
}

// Simulate all remaining matches in a group given already-played ones
function simulateGroup(groupId, completedForGroup) {
  const teams = GROUPS[groupId];
  const recs = {};
  teams.forEach(t => { recs[t] = blankRecord(t); });

  const allResults = [];

  // Apply completed results
  for (const r of completedForGroup) {
    applyResult(recs, r.home, r.away, r.goalsHome, r.goalsAway);
    allResults.push({ home:r.home, away:r.away, gh:r.goalsHome, ga:r.goalsAway });
  }

  // Build set of already-played pairs
  const played = new Set(completedForGroup.map(r => `${r.home}|${r.away}`));

  // Simulate remaining fixtures
  for (const [home, away] of FIXTURES[groupId]) {
    if (played.has(`${home}|${away}`) || played.has(`${away}|${home}`)) continue;
    const { goalsA, goalsB } = simulateMatch(home, away);
    applyResult(recs, home, away, goalsA, goalsB);
    allResults.push({ home, away, gh:goalsA, ga:goalsB });
  }

  return { recs, results: allResults };
}

// ── Simulate full group stage ─────────────────────────────────────────────────
function simulateGroupStage() {
  const completedByGroup = {};
  for (const g of Object.keys(GROUPS)) completedByGroup[g] = [];
  for (const r of COMPLETED_RESULTS) completedByGroup[r.group].push(r);

  const groupStandings = {};   // groupId → sorted array of records
  const thirds = [];           // all 3rd-place finishers

  for (const [gId] of Object.entries(GROUPS)) {
    const { recs, results } = simulateGroup(gId, completedByGroup[gId]);
    const sorted = sortGroup(recs, results);
    groupStandings[gId] = sorted;
    thirds.push({ group: gId, ...sorted[2] });
  }

  // Best 8 third-place teams
  thirds.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return (FIFA_POINTS[b.team] || 0) - (FIFA_POINTS[a.team] || 0);
  });
  const best8Thirds = thirds.slice(0, 8);

  return { groupStandings, best8Thirds };
}

// ── Assign 3rd-place teams to R32 slots ──────────────────────────────────────
// Uses a simple bipartite greedy with backtracking for correctness.
function assignThirds(best8Thirds, r32Bracket) {
  const thirdSlots = r32Bracket.filter(m => m.b.type === 'third');
  const pool = [...best8Thirds]; // already sorted best→worst
  const assignment = {};         // slotId → team name

  function backtrack(slotIdx, remaining) {
    if (slotIdx === thirdSlots.length) return true;
    const slot = thirdSlots[slotIdx];
    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      if (slot.b.eligible.includes(candidate.group)) {
        assignment[slot.id] = candidate.team;
        const next = remaining.filter((_, j) => j !== i);
        if (backtrack(slotIdx + 1, next)) return true;
        delete assignment[slot.id];
      }
    }
    return false;
  }

  backtrack(0, pool);
  return assignment;
}

// ── Simulate knockout rounds ──────────────────────────────────────────────────
function simulateKnockoutBracket(groupStandings, best8Thirds) {
  const winner = (g) => groupStandings[g][0].team;
  const runner = (g) => groupStandings[g][1].team;

  const thirdAssign = assignThirds(best8Thirds, R32_BRACKET);

  // Build R32 matchups
  const r32Teams = R32_BRACKET.map(m => {
    const getTeam = (slot) => {
      if (slot.type === 'winner') return winner(slot.group);
      if (slot.type === 'runner') return runner(slot.group);
      return thirdAssign[m.id] || null;
    };
    return { id: m.id, a: getTeam(m.a), b: getTeam(m.b) };
  });

  const r32Results = {};
  for (const match of r32Teams) {
    if (!match.a || !match.b) { r32Results[match.id] = match.a || match.b; continue; }
    r32Results[match.id] = simulateKnockout(match.a, match.b);
  }

  // R16
  const r16Winners = R16_PAIRS.map(([idA, idB]) =>
    simulateKnockout(r32Results[idA], r32Results[idB])
  );

  // QF
  const qfWinners = QF_PAIRS.map(([i, j]) =>
    simulateKnockout(r16Winners[i], r16Winners[j])
  );

  // SF
  const sfWinners = SF_PAIRS.map(([i, j]) =>
    simulateKnockout(qfWinners[i], qfWinners[j])
  );

  // Final
  const champion = simulateKnockout(sfWinners[0], sfWinners[1]);

  return { r32Results, r16Winners, qfWinners, sfWinners, champion, thirdAssign, r32Participants: r32Teams };
}

// ── One full tournament simulation ───────────────────────────────────────────
function simulateOnce() {
  const { groupStandings, best8Thirds } = simulateGroupStage();
  const ko = simulateKnockoutBracket(groupStandings, best8Thirds);
  return { groupStandings, best8Thirds, ...ko };
}

// ── Monte Carlo – returns aggregated probabilities ────────────────────────────
export function runMonteCarlo(N = 10000, onProgress) {
  const championCounts = {};
  const groupAdvance = {};   // team → { first, second, third_best, out }
  const r32Counts = {};
  const r16Counts = {};
  const qfCounts  = {};
  const sfCounts  = {};
  const finalCounts = {};

  const allTeams = Object.values(GROUPS).flat();
  allTeams.forEach(t => {
    championCounts[t] = 0;
    r32Counts[t] = 0; r16Counts[t] = 0;
    qfCounts[t] = 0; sfCounts[t] = 0; finalCounts[t] = 0;
    groupAdvance[t] = { first:0, second:0, third_best:0, eliminated:0 };
  });

  const REPORT_EVERY = Math.max(1, Math.floor(N / 100));

  for (let i = 0; i < N; i++) {
    const sim = simulateOnce();

    // Group advancement
    for (const [gId, standings] of Object.entries(sim.groupStandings)) {
      groupAdvance[standings[0].team].first++;
      groupAdvance[standings[1].team].second++;
      groupAdvance[standings[2].team].third_best += sim.best8Thirds.some(t => t.team === standings[2].team) ? 1 : 0;
      groupAdvance[standings[2].team].eliminated  += sim.best8Thirds.some(t => t.team === standings[2].team) ? 0 : 1;
      groupAdvance[standings[3].team].eliminated++;
    }

    // KO round accumulation
    Object.values(sim.r32Results).forEach(t => { if (t) r32Counts[t]++; });
    sim.r16Winners.forEach(t => { if (t) r16Counts[t]++; });
    sim.qfWinners.forEach(t => { if (t) qfCounts[t]++; });
    sim.sfWinners.forEach(t => { if (t) sfCounts[t]++; });
    // Final participants
    if (sim.sfWinners[0]) finalCounts[sim.sfWinners[0]]++;
    if (sim.sfWinners[1]) finalCounts[sim.sfWinners[1]]++;
    if (sim.champion) championCounts[sim.champion]++;

    if (onProgress && i % REPORT_EVERY === 0) onProgress((i + 1) / N);
  }

  const pct = (v) => (v / N) * 100;

  // Build team summary sorted by champion probability
  const teams = allTeams.map(t => ({
    team: t,
    champion:  pct(championCounts[t]),
    finalist:  pct(finalCounts[t]),
    semiFinal: pct(sfCounts[t]),
    quartFinal:pct(qfCounts[t]),
    r16:       pct(r16Counts[t]),
    r32:       pct(r32Counts[t]),
    first:     pct(groupAdvance[t].first),
    second:    pct(groupAdvance[t].second),
    thirdBest: pct(groupAdvance[t].third_best),
    eliminated:pct(groupAdvance[t].eliminated),
    fifaPoints: FIFA_POINTS[t] || 0,
  })).sort((a, b) => b.champion - a.champion);

  // One concrete bracket for display (last simulation)
  const lastSim = simulateOnce();

  return { teams, N, lastSim };
}

// ── Compute current standings from completed results only ─────────────────────
export function computeCurrentStandings() {
  const standings = {};
  for (const [gId, teams] of Object.entries(GROUPS)) {
    const recs = {};
    teams.forEach(t => { recs[t] = blankRecord(t); });
    const played = COMPLETED_RESULTS.filter(r => r.group === gId);
    const allR = played.map(r => ({ home:r.home, away:r.away, gh:r.goalsHome, ga:r.goalsAway }));
    for (const r of played) applyResult(recs, r.home, r.away, r.goalsHome, r.goalsAway);
    standings[gId] = sortGroup(recs, allR);
  }
  return standings;
}

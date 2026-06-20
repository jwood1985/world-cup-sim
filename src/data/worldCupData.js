// FIFA ranking points (June 11, 2026 official release)
export const FIFA_POINTS = {
  Argentina:   1890, France:       1880, Spain:        1875,
  England:     1770, Portugal:     1760, Brazil:       1740,
  Netherlands: 1720, Belgium:      1690, Germany:      1670,
  Uruguay:     1655, Croatia:      1625, Morocco:      1595,
  Switzerland: 1570, Mexico:       1565, Colombia:     1555,
  Japan:       1545, USA:          1510, 'South Korea': 1495,
  Sweden:      1480, Ecuador:      1460, Senegal:      1445,
  Norway:      1430, Scotland:     1415, Turkey:       1400,
  Algeria:     1390, Iran:         1380, Australia:    1375,
  Austria:     1360, Ghana:        1345, Canada:       1335,
  Paraguay:    1320, 'Ivory Coast': 1310, 'Saudi Arabia': 1300,
  Egypt:       1290, 'South Africa': 1280, Iraq:       1265,
  Bosnia:      1250, 'DR Congo':   1240, Tunisia:      1230,
  Panama:      1215, Czechia:      1205, Uzbekistan:   1185,
  'Cape Verde': 1155, Qatar:       1145, Haiti:        1130,
  Jordan:      1115, 'New Zealand': 1050, Curaçao:    980,
};

// Completed match results as of June 20, 2026 end of day
// Format: { home, away, goalsHome, goalsAway }
export const COMPLETED_RESULTS = [
  // GROUP A – MD1 (Jun 11)
  { group:'A', home:'Mexico',       away:'South Africa', goalsHome:2, goalsAway:0 },
  { group:'A', home:'South Korea',  away:'Czechia',      goalsHome:1, goalsAway:0 },
  // GROUP A – MD2 (Jun 17)
  { group:'A', home:'Mexico',       away:'South Korea',  goalsHome:1, goalsAway:0 },
  { group:'A', home:'South Africa', away:'Czechia',      goalsHome:1, goalsAway:1 },

  // GROUP B – MD1 (Jun 12–13)
  { group:'B', home:'Canada',       away:'Bosnia',       goalsHome:1, goalsAway:1 },
  { group:'B', home:'Switzerland',  away:'Qatar',        goalsHome:1, goalsAway:1 },
  // GROUP B – MD2 (Jun 18)
  { group:'B', home:'Switzerland',  away:'Bosnia',       goalsHome:4, goalsAway:1 },
  { group:'B', home:'Canada',       away:'Qatar',        goalsHome:6, goalsAway:0 },

  // GROUP C – MD1 (Jun 13)
  { group:'C', home:'Brazil',       away:'Morocco',      goalsHome:1, goalsAway:1 },
  { group:'C', home:'Scotland',     away:'Haiti',        goalsHome:1, goalsAway:0 },
  // GROUP C – MD2 (Jun 19)
  { group:'C', home:'Morocco',      away:'Scotland',     goalsHome:1, goalsAway:0 },
  { group:'C', home:'Brazil',       away:'Haiti',        goalsHome:3, goalsAway:0 },

  // GROUP D – MD1 (Jun 12–13)
  { group:'D', home:'USA',          away:'Paraguay',     goalsHome:2, goalsAway:1 },
  { group:'D', home:'Australia',    away:'Turkey',       goalsHome:2, goalsAway:1 },
  // GROUP D – MD2 (Jun 19)
  { group:'D', home:'USA',          away:'Australia',    goalsHome:2, goalsAway:0 },
  { group:'D', home:'Paraguay',     away:'Turkey',       goalsHome:1, goalsAway:0 },

  // GROUP E – MD1 (Jun 14)
  { group:'E', home:'Germany',      away:'Curaçao',      goalsHome:7, goalsAway:1 },
  { group:'E', home:'Ivory Coast',  away:'Ecuador',      goalsHome:1, goalsAway:0 },

  // GROUP F – MD1 (Jun 14)
  { group:'F', home:'Netherlands',  away:'Japan',        goalsHome:2, goalsAway:2 },
  { group:'F', home:'Sweden',       away:'Tunisia',      goalsHome:5, goalsAway:1 },
  // GROUP F – MD2 (Jun 20, confirmed)
  { group:'F', home:'Netherlands',  away:'Sweden',       goalsHome:5, goalsAway:1 },

  // GROUP G – MD1 (Jun 15)
  { group:'G', home:'Belgium',      away:'Egypt',        goalsHome:1, goalsAway:1 },
  { group:'G', home:'Iran',         away:'New Zealand',  goalsHome:2, goalsAway:2 },

  // GROUP H – MD1 (Jun 15)
  { group:'H', home:'Spain',        away:'Cape Verde',   goalsHome:0, goalsAway:0 },
  { group:'H', home:'Saudi Arabia', away:'Uruguay',      goalsHome:1, goalsAway:1 },

  // GROUP I – MD1 (Jun 16)
  { group:'I', home:'France',       away:'Senegal',      goalsHome:3, goalsAway:1 },
  { group:'I', home:'Norway',       away:'Iraq',         goalsHome:4, goalsAway:1 },

  // GROUP J – MD1 (Jun 16–17)
  { group:'J', home:'Argentina',    away:'Algeria',      goalsHome:3, goalsAway:0 },
  { group:'J', home:'Austria',      away:'Jordan',       goalsHome:3, goalsAway:1 },

  // GROUP K – MD1 (Jun 17)
  { group:'K', home:'Portugal',     away:'DR Congo',     goalsHome:1, goalsAway:1 },
  { group:'K', home:'Colombia',     away:'Uzbekistan',   goalsHome:3, goalsAway:1 },

  // GROUP L – MD1 (Jun 17)
  { group:'L', home:'England',      away:'Croatia',      goalsHome:4, goalsAway:2 },
  { group:'L', home:'Ghana',        away:'Panama',       goalsHome:1, goalsAway:0 },
];

// All 12 groups with team lists (order = draw seeding)
export const GROUPS = {
  A: ['Mexico',    'South Africa', 'South Korea', 'Czechia'],
  B: ['Canada',    'Bosnia',       'Qatar',        'Switzerland'],
  C: ['Brazil',    'Morocco',      'Scotland',     'Haiti'],
  D: ['USA',       'Paraguay',     'Australia',    'Turkey'],
  E: ['Germany',   'Ivory Coast',  'Ecuador',      'Curaçao'],
  F: ['Netherlands','Japan',       'Sweden',       'Tunisia'],
  G: ['Belgium',   'Egypt',        'Iran',         'New Zealand'],
  H: ['Spain',     'Cape Verde',   'Saudi Arabia', 'Uruguay'],
  I: ['France',    'Senegal',      'Iraq',         'Norway'],
  J: ['Argentina', 'Algeria',      'Austria',      'Jordan'],
  K: ['Portugal',  'DR Congo',     'Uzbekistan',   'Colombia'],
  L: ['England',   'Croatia',      'Ghana',        'Panama'],
};

// All group-stage fixture pairs (home, away) for each group
export const FIXTURES = {
  A: [['Mexico','South Africa'],['South Korea','Czechia'],
      ['Mexico','South Korea'],['South Africa','Czechia'],
      ['South Korea','South Africa'],['Czechia','Mexico']],
  B: [['Canada','Bosnia'],['Switzerland','Qatar'],
      ['Switzerland','Bosnia'],['Canada','Qatar'],
      ['Canada','Switzerland'],['Bosnia','Qatar']],
  C: [['Brazil','Morocco'],['Scotland','Haiti'],
      ['Morocco','Scotland'],['Brazil','Haiti'],
      ['Scotland','Brazil'],['Morocco','Haiti']],
  D: [['USA','Paraguay'],['Australia','Turkey'],
      ['USA','Australia'],['Paraguay','Turkey'],
      ['USA','Turkey'],['Paraguay','Australia']],
  E: [['Germany','Curaçao'],['Ivory Coast','Ecuador'],
      ['Germany','Ivory Coast'],['Ecuador','Curaçao'],
      ['Germany','Ecuador'],['Ivory Coast','Curaçao']],
  F: [['Netherlands','Japan'],['Sweden','Tunisia'],
      ['Netherlands','Sweden'],['Tunisia','Japan'],
      ['Netherlands','Tunisia'],['Japan','Sweden']],
  G: [['Belgium','Egypt'],['Iran','New Zealand'],
      ['Belgium','Iran'],['New Zealand','Egypt'],
      ['Belgium','New Zealand'],['Iran','Egypt']],
  H: [['Spain','Cape Verde'],['Saudi Arabia','Uruguay'],
      ['Spain','Saudi Arabia'],['Uruguay','Cape Verde'],
      ['Spain','Uruguay'],['Saudi Arabia','Cape Verde']],
  I: [['France','Senegal'],['Norway','Iraq'],
      ['France','Norway'],['Iraq','Senegal'],
      ['France','Iraq'],['Norway','Senegal']],
  J: [['Argentina','Algeria'],['Austria','Jordan'],
      ['Argentina','Austria'],['Algeria','Jordan'],
      ['Argentina','Jordan'],['Austria','Algeria']],
  K: [['Portugal','DR Congo'],['Colombia','Uzbekistan'],
      ['Portugal','Uzbekistan'],['Colombia','DR Congo'],
      ['Portugal','Colombia'],['DR Congo','Uzbekistan']],
  L: [['England','Croatia'],['Ghana','Panama'],
      ['England','Ghana'],['Croatia','Panama'],
      ['England','Panama'],['Croatia','Ghana']],
};

// Round of 32 bracket – fixed matchups
// 3rd-place slots list the eligible source groups
export const R32_BRACKET = [
  // Slot id, teamA source, teamB source (or {thirdFrom: [...groups]})
  { id:'M73', a:{type:'runner', group:'A'}, b:{type:'runner', group:'B'} },
  { id:'M74', a:{type:'winner', group:'E'}, b:{type:'third', eligible:['A','B','C','D','F']} },
  { id:'M75', a:{type:'winner', group:'F'}, b:{type:'runner', group:'C'} },
  { id:'M76', a:{type:'winner', group:'C'}, b:{type:'runner', group:'F'} },
  { id:'M77', a:{type:'winner', group:'I'}, b:{type:'third', eligible:['C','D','F','G','H']} },
  { id:'M78', a:{type:'runner', group:'E'}, b:{type:'runner', group:'I'} },
  { id:'M79', a:{type:'winner', group:'A'}, b:{type:'third', eligible:['C','E','F','H','I']} },
  { id:'M80', a:{type:'winner', group:'L'}, b:{type:'third', eligible:['E','H','I','J','K']} },
  { id:'M81', a:{type:'winner', group:'D'}, b:{type:'third', eligible:['B','E','F','I','J']} },
  { id:'M82', a:{type:'winner', group:'G'}, b:{type:'third', eligible:['A','E','H','I','J']} },
  { id:'M83', a:{type:'runner', group:'K'}, b:{type:'runner', group:'L'} },
  { id:'M84', a:{type:'winner', group:'H'}, b:{type:'runner', group:'J'} },
  { id:'M85', a:{type:'winner', group:'B'}, b:{type:'third', eligible:['E','F','G','I','J']} },
  { id:'M86', a:{type:'winner', group:'J'}, b:{type:'runner', group:'H'} },
  { id:'M87', a:{type:'winner', group:'K'}, b:{type:'third', eligible:['D','E','I','J','L']} },
  { id:'M88', a:{type:'runner', group:'D'}, b:{type:'runner', group:'G'} },
];

// R16: pairs of R32 match ids whose winners meet
export const R16_PAIRS = [
  ['M73','M74'], ['M75','M76'], ['M77','M78'], ['M79','M80'],
  ['M81','M82'], ['M83','M84'], ['M85','M86'], ['M87','M88'],
];

export const QF_PAIRS = [
  [0,1],[2,3],[4,5],[6,7]   // indices into R16_PAIRS results
];

export const SF_PAIRS = [
  [0,1],[2,3]               // indices into QF results
];

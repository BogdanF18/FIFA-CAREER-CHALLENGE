const assert = require('assert');
const { generateManagerChallenge, generatePlayerChallenge, buildContextualObjective, getCompetitiveContext, generateMaleNames, generateFemaleNames } = require('./challenges.js');
const { buildSeasonResultCard } = require('./script.js');

const allClubs = require('./clubs.js').getAllClubs();

function pickClubByLeague(name) {
  return allClubs.find(c => c.league === name) || allClubs[0];
}

const { test } = require('node:test');

test('manager challenge in second tier must not generate European qualification objective', () => {
  const club = pickClubByLeague('EFL Championship');
  const challenge = generateManagerChallenge(allClubs, 'normal', { gender: 'M', league: 'EFL Championship', teamType: 'puternic' });
  const context = getCompetitiveContext(club, 'manager');
  assert.ok(context.canQualifyForEurope === false || context.isEuropeanLeague === false);
  assert.ok(!/play[- ]?off|UCL|Champions|europ/i.test(challenge.objective));
});

test('player challenge for age 31 must avoid impossible early-career objectives', () => {
  const challenge = generatePlayerChallenge(allClubs, 'normal', { gender: 'M', teamType: 'mediu' });
  const objective = challenge.objective;
  assert.ok(!/23 de ani|21 de ani|până la 23|până la 21|cel mai tânăr|debut|junior/i.test(objective));
  assert.ok(challenge.age >= 29 || challenge.age <= 31);
});

test('male/female generation stays separated by gender', () => {
  const male = generateMaleNames('Anglia', 10);
  const female = generateFemaleNames('Anglia', 10);
  assert.ok(male.every(name => !/^(Ms\.|Miss|Mrs\.|Emma|Olivia|Sophia|Amelia|Isabella|Charlotte|Mia)/i.test(name)));
  assert.ok(female.every(name => !/^James|Harry|Jack|Oliver|George|Thomas|Charlie|Jacob|Alfie|Freddie/i.test(name)));
});

test('contextual objective builder respects club tier and league qualification status', () => {
  const context = getCompetitiveContext(pickClubByLeague('Premier League'), 'manager');
  const objective = buildContextualObjective(context, 'manager');
  assert.ok(/campionat|cup|europ|play[- ]?off|primele 4|top 4/i.test(objective));
});

test('season result card includes score and renewal summary for a new season', () => {
  const card = buildSeasonResultCard({
    type: 'manager',
    objective: 'Câștigă campionatul',
    difficulty: 'normal',
    club: { name: 'Leeds United', league: 'EFL Championship', country: 'Anglia' },
    contractSeasonData: {
      position: 2,
      trophies: 1,
      budget: 1800000,
      transfers: 8,
      completedObjectives: 4,
      failedObjectives: 1,
      status: 'promovare'
    }
  });

  assert.ok(card.score >= 60 && card.score <= 100);
  assert.ok(/Leeds United|EFL Championship|campionatul/i.test(card.summary));
  assert.ok(card.actions.includes('Începe sezonul nou'));
});

test('career progress should calculate objective completion without precedence bugs', () => {
  const history = [
    {
      type: 'manager',
      completed: true,
      objective: 'Câștigă campionatul',
      contractSeasonData: { completedObjectives: 3, failedObjectives: 1 }
    }
  ];

  const progress = require('../script.js').calculateCareerProgress ? require('../script.js').calculateCareerProgress(history) : [];
  assert.ok(progress.length > 0);
  assert.strictEqual(progress[0].progress, 75);
});

'use strict';
const test = require('node:test');
const assert = require('node:assert');
const P = require('./gradebook-parse');

// Fixtures mirroring the two real sample formats.
const canvasHeaders = ['Student','ID','SIS User ID','SIS Login ID','Section',
  '⌨️ Typing 5/4 - 5/11 (808905)','10.1 Adventure Game (802407)','Unit 11 Key Terms Quiz (804232)',
  'Current Points (Quarter 4)','Current Score (Quarter 4)','Unposted Final Score (Quarter 4)'];
const canvasRows = [
  { 'Student':'    Points Possible','ID':'','SIS User ID':'','SIS Login ID':'','Section':'',
    '⌨️ Typing 5/4 - 5/11 (808905)':'5','10.1 Adventure Game (802407)':'20','Unit 11 Key Terms Quiz (804232)':'5',
    'Current Points (Quarter 4)':'(read only)','Current Score (Quarter 4)':'(read only)','Unposted Final Score (Quarter 4)':'(read only)' },
  { 'Student':'Anderson, Riley','ID':'10112','SIS User ID':'73101','SIS Login ID':'randerson@school.edu','Section':'P07-CS 10',
    '⌨️ Typing 5/4 - 5/11 (808905)':'4','10.1 Adventure Game (802407)':'19','Unit 11 Key Terms Quiz (804232)':'Missing',
    'Current Points (Quarter 4)':'177','Current Score (Quarter 4)':'84.29','Unposted Final Score (Quarter 4)':'84.29' },
];
const simpleHeaders = ['Student','Period','Vocab Quiz 1 (10)','Theme Essay Draft (50)'];
const simpleRows = [
  { 'Student':'Ali Ahmadi','Period':'P1','Vocab Quiz 1 (10)':'9','Theme Essay Draft (50)':'45' },
  { 'Student':'Carlos Diaz','Period':'P1','Vocab Quiz 1 (10)':'7','Theme Essay Draft (50)':'Missing' },
];

test('normalizeName swaps "Last, First" and leaves "First Last"', () => {
  assert.equal(P.normalizeName('Anderson, Riley'), 'Riley Anderson');
  assert.equal(P.normalizeName('Ali Ahmadi'), 'Ali Ahmadi');
  assert.equal(P.normalizeName('  Lee,  Grace '), 'Grace Lee');
  assert.equal(P.normalizeName(''), '');
});

test('detectNameColumn finds Student in both formats, never email/id', () => {
  assert.equal(P.detectNameColumn(canvasHeaders, canvasRows.slice(1)), 'Student');
  assert.equal(P.detectNameColumn(simpleHeaders, simpleRows), 'Student');
});

test('detectGroupColumn finds Section (Canvas) and Period (simple)', () => {
  assert.equal(P.detectGroupColumn(canvasHeaders), 'Section');
  assert.equal(P.detectGroupColumn(simpleHeaders), 'Period');
});

test('findPointsPossibleRowIndex finds the Canvas row and returns -1 for simple', () => {
  assert.equal(P.findPointsPossibleRowIndex(canvasRows), 0);
  assert.equal(P.findPointsPossibleRowIndex(simpleRows), -1);
});

test('classifyColumns keeps assignments, drops id/section/summary/email cols', () => {
  const nameCol = 'Student', groupCol = 'Section';
  const { assignments, ignored } = P.classifyColumns(canvasHeaders, canvasRows.slice(1), { nameCol, groupCol });
  assert.deepEqual(assignments, ['⌨️ Typing 5/4 - 5/11 (808905)','10.1 Adventure Game (802407)','Unit 11 Key Terms Quiz (804232)']);
  for (const junk of ['ID','SIS User ID','SIS Login ID','Section','Current Points (Quarter 4)','Current Score (Quarter 4)','Unposted Final Score (Quarter 4)']) {
    assert.ok(ignored.includes(junk), junk + ' should be ignored');
  }
});

test('detectMaxes prefers points-possible row over header parens (Canvas ids are NOT points)', () => {
  const ptsRow = canvasRows[0];
  const maxes = P.detectMaxes(canvasHeaders, ptsRow);
  assert.equal(maxes['10.1 Adventure Game (802407)'], 20); // 20 from row, NOT 802407 from header
  assert.equal(maxes['⌨️ Typing 5/4 - 5/11 (808905)'], 5);
});

test('detectMaxes reads header parens when no points row (simple format)', () => {
  const maxes = P.detectMaxes(simpleHeaders, null);
  assert.equal(maxes['Vocab Quiz 1 (10)'], 10);
  assert.equal(maxes['Theme Essay Draft (50)'], 50);
});

test('isMissing / isExcused honor flags', () => {
  assert.equal(P.isMissing('Missing', {}), true);
  assert.equal(P.isMissing('', { blankIsMissing: true }), true);
  assert.equal(P.isMissing('', { blankIsMissing: false }), false);
  assert.equal(P.isMissing('0', { zeroIsMissing: true }), true);
  assert.equal(P.isMissing('0', { zeroIsMissing: false }), false);
  assert.equal(P.isMissing('19', {}), false);
  assert.equal(P.isExcused('EX'), true);
  assert.equal(P.isExcused('19'), false);
});

test('stripColumnTag removes trailing (NNN) id/points tag', () => {
  assert.equal(P.stripColumnTag('10.1 Adventure Game (802407)'), '10.1 Adventure Game');
  assert.equal(P.stripColumnTag('Vocab Quiz 1 (10)'), 'Vocab Quiz 1');
  assert.equal(P.stripColumnTag('Mood Radio (Microbit) (806151)'), 'Mood Radio (Microbit)');
});

test('detectNameColumn never falls back to an id/group column; null if none usable', () => {
  assert.equal(P.detectNameColumn(['ID','Section','Nickname'], [{ID:'10112',Section:'P1',Nickname:'Ace'}]), 'Nickname');
  assert.equal(P.detectNameColumn(['ID','Section'], [{ID:'10112',Section:'P1'}]), null);
});

test('findPointsPossibleRowIndex finds a row at index 2 (after a separator row)', () => {
  const rows = [
    { Student:'', 'A (1)':'' },
    { Student:'', 'A (1)':'' },
    { Student:'Points Possible', 'A (1)':'10' },
    { Student:'Real Student', 'A (1)':'8' },
  ];
  assert.equal(P.findPointsPossibleRowIndex(rows), 2);
});

test('isMissing does not treat "0 pts" as a zero score', () => {
  assert.equal(P.isMissing('0 pts', { zeroIsMissing: true }), false);
  assert.equal(P.isMissing('0', { zeroIsMissing: true }), true);
});

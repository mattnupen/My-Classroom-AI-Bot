'use strict';
/* ============================================================================
 * gradebook-parse.js — CANONICAL gradebook parsing logic.
 * DEV SOURCE-OF-TRUTH + NODE TEST TARGET ONLY. Never loaded at runtime.
 * Its function bodies are pasted INLINE into each local-tools HTML app so the
 * apps stay single-file and double-click-runnable. Keep every inline copy
 * BYTE-IDENTICAL to this file (grep banner: "BEGIN canonical gradebook-parse").
 * ==========================================================================*/

const _EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const _ID_HEADER_RE = /^(id|.*\bsis\b.*|.*login.*|.*user\s*id.*)$/i;
const _SUMMARY_HEADER_RE = /\b(current|final|unposted|imported)\b.*\b(score|points)\b/i;
const _GROUP_HEADER_RE = /^(period|section|class|hour|block|homeroom)$/i;

// "Last, First" -> "First Last"; trims and collapses whitespace.
function normalizeName(raw) {
  const s = String(raw == null ? '' : raw).trim().replace(/\s+/g, ' ');
  if (!s) return '';
  // 3+ comma-separated parts (e.g. "Smith, John, Jr") are intentionally left unchanged due to ambiguity.
  const parts = s.split(',');
  if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
    return parts[1].trim() + ' ' + parts[0].trim();
  }
  return s;
}

// Most name-like column: prefer a literal Student/Name header, else the first
// column whose sampled values are mostly non-numeric, non-email text.
function detectNameColumn(headers, rows) {
  const named = headers.find(h => /^(student|name|student name|full name)$/i.test(String(h).trim()));
  if (named) return named;
  const sample = rows.slice(0, 10);
  for (const h of headers) {
    if (_ID_HEADER_RE.test(String(h)) || _GROUP_HEADER_RE.test(String(h))) continue;
    const vals = sample.map(r => String(r[h] == null ? '' : r[h]).trim()).filter(Boolean);
    if (!vals.length) continue;
    const nameish = vals.filter(v => !_EMAIL_RE.test(v) && isNaN(parseFloat(v)) && /[a-z]/i.test(v)).length;
    if (nameish >= Math.ceil(vals.length * 0.6)) return h;
  }
  const firstUsable = headers.find(h => !_ID_HEADER_RE.test(String(h)) && !_GROUP_HEADER_RE.test(String(h)));
  return firstUsable == null ? null : firstUsable;
}

function detectGroupColumn(headers) {
  return headers.find(h => _GROUP_HEADER_RE.test(String(h).trim())) || null;
}

// Index of the "Points Possible" row (Canvas puts it first), else -1.
function findPointsPossibleRowIndex(rows) {
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const hit = Object.values(rows[i]).some(v => /points\s*possible/i.test(String(v == null ? '' : v).trim()));
    if (hit) return i;
  }
  return -1;
}

// Split columns into assignment columns vs ignored metadata/summary columns.
function classifyColumns(headers, rows, opts) {
  const nameCol = opts && opts.nameCol, groupCol = opts && opts.groupCol;
  const sample = rows.slice(0, 12);
  const assignments = [], ignored = [];
  for (const h of headers) {
    if (h === nameCol || h === groupCol ||
        _ID_HEADER_RE.test(String(h)) || _SUMMARY_HEADER_RE.test(String(h)) || _GROUP_HEADER_RE.test(String(h))) {
      ignored.push(h); continue;
    }
    const vals = sample.map(r => String(r[h] == null ? '' : r[h]).trim()).filter(Boolean);
    const emails = vals.filter(v => _EMAIL_RE.test(v)).length;
    if (vals.length && emails >= Math.ceil(vals.length * 0.6)) { ignored.push(h); continue; }
    assignments.push(h);
  }
  return { assignments, ignored };
}

// Point maxima per header. Prefer the points-possible row when present, because
// Canvas assignment headers carry an assignment ID in parens (NOT points).
function detectMaxes(headers, pointsRow) {
  const maxes = {};
  for (const h of headers) {
    if (pointsRow) {
      const v = parseFloat(String(pointsRow[h] == null ? '' : pointsRow[h]).trim());
      maxes[h] = isNaN(v) ? null : v;
    } else {
      const m = String(h).match(/\((\d+(?:\.\d+)?)\)\s*$/);
      maxes[h] = m ? parseFloat(m[1]) : null;
    }
  }
  return maxes;
}

function isExcused(v) {
  return ['excused','exempt','ex','exc'].includes(String(v == null ? '' : v).trim().toLowerCase());
}

function isMissing(v, opts) {
  const blankIsMissing = !!(opts && opts.blankIsMissing);
  const zeroIsMissing = !!(opts && opts.zeroIsMissing);
  if (v === '' || v === null || v === undefined) return blankIsMissing;
  const s = String(v).trim().toLowerCase();
  if (s === '') return blankIsMissing;
  if (isExcused(s)) return false;
  if (['missing','m','mi','mis'].includes(s)) return true;
  if (/^-?\d+(?:\.\d+)?$/.test(s)) return zeroIsMissing && parseFloat(s) === 0;
  return false;
}

// Display label for an assignment column: strip a trailing (NNN) id/points tag.
function stripColumnTag(h) {
  return String(h).replace(/\s*\((?:\d+(?:\.\d+)?)\)\s*$/, '').trim();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { normalizeName, detectNameColumn, detectGroupColumn, findPointsPossibleRowIndex,
    classifyColumns, detectMaxes, isExcused, isMissing, stripColumnTag };
}

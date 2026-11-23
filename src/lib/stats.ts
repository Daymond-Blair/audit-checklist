import type { Audit, Criterion, CriterionResult, Status } from '../types';
import { DEFAULT_RESULT } from '../types';

const PDF_NA = /^N\/A\b/i;
const NA_DEFAULT: CriterionResult = { status: 'na', checked: false };

/**
 * Saved result for a criterion, or its default. For PDF audits, criteria whose
 * PDF check is "N/A ..." default to N/A until the auditor changes them.
 */
export function resultFor(audit: Audit, c: Criterion): CriterionResult {
  const saved = audit.results[c.key];
  if (saved) return saved;
  if (audit.kind === 'PDF' && PDF_NA.test(c.pdfCheck)) return NA_DEFAULT;
  return DEFAULT_RESULT;
}

export interface Stats {
  total: number;
  applicable: number;
  checked: number;
  counts: Record<Status, number>;
  percent: number;
}

/** N/A criteria are excluded from the "applicable" total used for progress. */
export function getStats(audit: Audit, criteria: Criterion[]): Stats {
  const counts: Record<Status, number> = { 'not-tested': 0, pass: 0, fail: 0, na: 0 };
  let checked = 0;
  for (const c of criteria) {
    const r = resultFor(audit, c);
    counts[r.status]++;
    if (r.checked && r.status !== 'na') checked++;
  }
  const applicable = criteria.length - counts.na;
  return {
    total: criteria.length,
    applicable,
    checked,
    counts,
    percent: applicable === 0 ? 100 : Math.round((checked / applicable) * 100),
  };
}

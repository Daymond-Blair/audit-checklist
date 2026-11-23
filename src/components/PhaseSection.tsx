import { useState } from 'react';
import type { Audit, CriterionResult, Phase } from '../types';
import { getStats, resultFor } from '../lib/stats';
import { CriterionRow } from './CriterionRow';

interface Props {
  phase: Phase;
  index: number;
  audit: Audit;
  onChange: (key: string, patch: Partial<CriterionResult>) => void;
}

export function PhaseSection({ phase, index, audit, onChange }: Props) {
  const [open, setOpen] = useState(true);
  const stats = getStats(audit, phase.criteria);
  const panelId = `phase-${phase.id}`;

  return (
    <section aria-labelledby={`${panelId}-heading`} className="mt-10">
      <h2 id={`${panelId}-heading`}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2 py-2 text-left focus-visible:outline-2 focus-visible:outline-red-600 dark:focus-visible:outline-teal-300"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className={`size-4 shrink-0 text-neutral-600 transition-transform dark:text-slate-400 ${open ? 'rotate-90' : ''}`}
          >
            <path d="M6 3.5L10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex-1 text-base font-semibold text-neutral-900 dark:text-slate-200">
            <span className="text-neutral-600 dark:text-teal-300">Phase {index + 1}: </span>
            {phase.title}
          </span>
          <span className="shrink-0 text-sm text-neutral-600 tabular-nums dark:text-slate-400">
            {stats.checked}/{stats.applicable}
            <span className="sr-only"> checked</span>
            {stats.counts.fail > 0 && <span className="ml-2 font-medium text-red-700 dark:text-rose-300">{stats.counts.fail} fail</span>}
          </span>
        </button>
      </h2>
      <div id={panelId} hidden={!open} className="border-t-2 border-neutral-200 dark:border-slate-800">
        {phase.tools.length > 0 && (
          <p className="px-2 pt-3 pb-1 text-xs text-neutral-600 dark:text-slate-400">
            <span className="font-semibold text-neutral-700 dark:text-slate-300">Tools:</span> {phase.tools.join(' · ')}
          </p>
        )}
        <ul>
          {phase.criteria.map((c) => (
            <CriterionRow key={c.key} criterion={c} result={resultFor(audit, c)} kind={audit.kind} onChange={onChange} />
          ))}
        </ul>
      </div>
    </section>
  );
}

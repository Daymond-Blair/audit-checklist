import { useCallback, useMemo, useState } from 'react';
import type { Audit, AuditDetails, CriterionResult, Phase } from '../types';
import { getStats } from '../lib/stats';
import { AuditForm } from './AuditForm';
import { formatDate } from './AuditList';
import { PhaseSection } from './PhaseSection';

interface Props {
  audit: Audit;
  phases: Phase[];
  onUpdateDetails: (id: string, details: AuditDetails) => void;
  onSetResult: (id: string, key: string, patch: Partial<CriterionResult>) => void;
  onDelete: (id: string) => void;
}

export function AuditView({ audit, phases, onUpdateDetails, onSetResult, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const allCriteria = useMemo(() => phases.flatMap((p) => p.criteria), [phases]);
  const stats = getStats(audit, allCriteria);

  const handleChange = useCallback(
    (key: string, patch: Partial<CriterionResult>) => onSetResult(audit.id, key, patch),
    [audit.id, onSetResult],
  );

  const handleDelete = () => {
    if (window.confirm(`Delete the audit "${audit.title}"? This cannot be undone.`)) onDelete(audit.id);
  };

  const isUrl = /^https?:\/\//i.test(audit.location);

  return (
    <article>
      {editing ? (
        <AuditForm
          initial={audit}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
          onSubmit={(d) => {
            onUpdateDetails(audit.id, d);
            setEditing(false);
          }}
        />
      ) : (
        <header>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 break-words dark:text-slate-200">{audit.title}</h1>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:outline-teal-300"
              >
                Edit<span className="sr-only"> audit details</span>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-md px-2.5 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 dark:text-rose-300 dark:hover:bg-rose-400/10 dark:focus-visible:outline-teal-300"
              >
                Delete<span className="sr-only"> audit</span>
              </button>
            </div>
          </div>
          <p className="mt-1 flex flex-wrap gap-x-2 text-sm text-neutral-600 dark:text-slate-400">
            <span>{audit.kind}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={audit.date}>{formatDate(audit.date)}</time>
            {audit.location && (
              <>
                <span aria-hidden="true">·</span>
                {isUrl ? (
                  <a href={audit.location} target="_blank" rel="noreferrer" className="break-all text-red-700 underline hover:text-red-800 dark:text-teal-300 dark:hover:text-teal-200">
                    {audit.location}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="break-all">{audit.location}</span>
                )}
              </>
            )}
          </p>
        </header>
      )}

      <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-medium text-neutral-900 dark:text-slate-200">
            {stats.checked} of {stats.applicable} checked
          </span>
          <span className="text-neutral-600 tabular-nums dark:text-slate-400">{stats.percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-label="Audit progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stats.percent}
          className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-slate-700"
        >
          <div className="h-full rounded-full bg-red-700 transition-all dark:bg-teal-300" style={{ width: `${stats.percent}%` }} />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          {(
            [
              ['Pass', stats.counts.pass, 'bg-green-700 dark:bg-emerald-300'],
              ['Fail', stats.counts.fail, 'bg-red-700 dark:bg-rose-300'],
              ['N/A', stats.counts.na, 'bg-neutral-500 dark:bg-slate-500'],
              ['Not tested', stats.counts['not-tested'], 'bg-neutral-300 dark:bg-slate-700'],
            ] as const
          ).map(([label, count, dot]) => (
            <div key={label} className="flex items-center gap-2">
              <span aria-hidden="true" className={`size-2 rounded-full ${dot}`} />
              <dt className="text-neutral-600 dark:text-slate-400">{label}</dt>
              <dd className="font-semibold text-neutral-900 tabular-nums dark:text-slate-200">{count}</dd>
            </div>
          ))}
        </dl>
      </div>

      {phases.map((phase, i) => (
        <PhaseSection key={phase.id} phase={phase} index={i} audit={audit} onChange={handleChange} />
      ))}
    </article>
  );
}

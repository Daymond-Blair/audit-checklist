import { memo } from 'react';
import type { ReactNode } from 'react';
import type { AuditKind, Criterion, CriterionResult, Status } from '../types';

const STATUS_OPTIONS: { value: Status; label: string; selected: string }[] = [
  {
    value: 'not-tested',
    label: 'Not Tested',
    selected: 'bg-neutral-800 text-white border-neutral-800 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-500',
  },
  {
    value: 'pass',
    label: 'Pass',
    selected: 'bg-green-700 text-white border-green-700 dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-300/60',
  },
  {
    value: 'fail',
    label: 'Fail',
    selected: 'bg-red-700 text-white border-red-700 dark:bg-rose-400/15 dark:text-rose-300 dark:border-rose-300/60',
  },
  {
    value: 'na',
    label: 'N/A',
    selected: 'bg-neutral-500 text-white border-neutral-500 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400',
  },
];

interface Props {
  criterion: Criterion;
  result: CriterionResult;
  kind: AuditKind;
  onChange: (key: string, patch: Partial<CriterionResult>) => void;
}

function Badge({ children, label }: { children: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center rounded bg-neutral-200/70 px-1.5 py-0.5 text-[0.6875rem] font-medium text-neutral-700 dark:rounded-full dark:bg-teal-400/10 dark:px-2.5 dark:text-teal-300">
      <span className="sr-only">{label}: </span>
      {children}
    </span>
  );
}

export const CriterionRow = memo(function CriterionRow({ criterion, result, kind, onChange }: Props) {
  const { key, sc, name, level, section508, andiModule, webCheck, pdfCheck, hints } = criterion;
  const na = result.status === 'na';
  const checked = result.checked && !na;
  const cbId = `cb-${key}`;
  const descId = `desc-${key}`;

  const checks: { label: string; text: string }[] =
    kind === 'Web page'
      ? [{ label: 'Web', text: webCheck }]
      : kind === 'PDF'
        ? [{ label: 'PDF', text: pdfCheck }]
        : [
            { label: 'Web', text: webCheck },
            { label: 'PDF', text: pdfCheck },
          ];
  const visibleChecks = checks.filter((c) => c.text);
  const showCheckLabels = visibleChecks.length > 1;

  return (
    <li
      className={`flex flex-col gap-3 border-b border-neutral-200 px-2 py-4 transition-colors sm:flex-row sm:items-start dark:border-slate-800 ${
        na ? 'bg-neutral-100 dark:bg-slate-800/60' : 'dark:hover:bg-slate-800/30'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="relative mt-0.5 flex size-5 shrink-0">
          <input
            id={cbId}
            type="checkbox"
            checked={checked}
            disabled={na}
            aria-describedby={visibleChecks.length ? descId : undefined}
            onChange={(e) => onChange(key, { checked: e.target.checked })}
            className="peer size-5 cursor-pointer appearance-none rounded-full border-2 border-neutral-500 bg-white transition-colors checked:border-red-700 checked:bg-red-700 hover:border-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 dark:border-slate-400 dark:bg-transparent dark:checked:border-teal-300 dark:checked:bg-teal-300 dark:hover:border-teal-300 dark:focus-visible:outline-teal-300 dark:disabled:border-slate-600 dark:disabled:bg-slate-700"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="pointer-events-none absolute inset-0 m-auto hidden size-3 text-white peer-checked:block dark:text-slate-900"
          >
            <path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        <div className="min-w-0">
          <label
            htmlFor={cbId}
            className={`block cursor-pointer text-sm font-medium ${
              na
                ? 'text-neutral-600 line-through dark:text-slate-400'
                : checked
                  ? 'text-neutral-600 dark:text-slate-400'
                  : 'text-neutral-900 dark:text-slate-200'
            }`}
          >
            <span className="mr-1.5 tabular-nums">{sc}</span>
            {name}
          </label>

          <div className="mt-1.5 flex flex-wrap gap-1">
            {level && <Badge label="Level">{level}</Badge>}
            {section508 && <Badge label="Section 508">508: {section508}</Badge>}
            {andiModule && <Badge label="ANDI module">ANDI: {andiModule}</Badge>}
          </div>

          {visibleChecks.length > 0 && (
            <div id={descId} className="mt-2 space-y-1 text-sm text-neutral-700 dark:text-slate-400">
              {visibleChecks.map((c) => (
                <p key={c.label}>
                  {showCheckLabels && <span className="font-semibold dark:text-slate-300">{c.label}: </span>}
                  {c.text}
                </p>
              ))}
            </div>
          )}

          {hints.length > 0 && (
            <ul className="mt-2 space-y-1">
              {hints.map((h) => (
                <li key={h} className="flex gap-1.5 text-xs text-neutral-600 dark:text-slate-400">
                  <span className="font-semibold text-neutral-700 dark:text-teal-300">Tip:</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <fieldset className="shrink-0 pl-8 sm:pl-0">
        <legend className="sr-only">
          Result for {sc} {name}
        </legend>
        <div className="grid grid-cols-4 gap-1">
          {STATUS_OPTIONS.map((opt) => {
            const selected = result.status === opt.value;
            return (
              <label key={opt.value} className="cursor-pointer">
                <input
                  type="radio"
                  name={`status-${key}`}
                  value={opt.value}
                  checked={selected}
                  onChange={() => onChange(key, { status: opt.value })}
                  className="peer sr-only"
                />
                <span
                  className={`block rounded-md border px-2 py-1.5 text-center text-xs font-medium whitespace-nowrap transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red-600 dark:peer-focus-visible:outline-teal-300 ${
                    selected
                      ? opt.selected
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-slate-700 dark:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </li>
  );
});

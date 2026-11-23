import type { Audit, Criterion } from '../types';
import { getStats } from '../lib/stats';

interface Props {
  audits: Audit[];
  activeId: string | null;
  criteria: Criterion[];
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return isNaN(d.getTime())
    ? date
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function AuditList({ audits, activeId, criteria, onSelect, onNew }: Props) {
  return (
    <nav aria-label="Audits" className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <h2 className="text-xs font-semibold tracking-wide text-neutral-600 uppercase dark:text-slate-200">Audits</h2>
        <span className="text-xs text-neutral-600 dark:text-slate-400">{audits.length}</span>
      </div>

      <div className="px-2">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 dark:text-teal-300 dark:hover:bg-teal-400/10 dark:focus-visible:outline-teal-300"
        >
          <span aria-hidden="true" className="flex size-5 items-center justify-center rounded-full bg-red-700 text-white dark:bg-teal-300 dark:text-slate-900">
            +
          </span>
          New audit
        </button>
      </div>

      <ul className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {audits.map((a) => {
          const { percent } = getStats(a, criteria);
          const active = a.id === activeId;
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => onSelect(a.id)}
                aria-current={active ? 'page' : undefined}
                className={`w-full rounded-md px-2 py-2 text-left focus-visible:outline-2 focus-visible:outline-red-600 dark:focus-visible:outline-teal-300 ${
                  active ? 'bg-red-50 dark:bg-teal-400/10' : 'hover:bg-neutral-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="block truncate text-sm font-medium text-neutral-900 dark:text-slate-200">{a.title}</span>
                <span className="mt-0.5 flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-slate-400">
                  <span className="truncate">
                    {a.kind} · {formatDate(a.date)}
                  </span>
                  <span>{percent}%</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

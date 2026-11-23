import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { AUDIT_KINDS } from '../types';
import type { AuditDetails, AuditKind } from '../types';
import { today } from '../lib/useAudits';

interface Props {
  initial?: AuditDetails;
  submitLabel: string;
  onSubmit: (details: AuditDetails) => void;
  onCancel?: () => void;
}

const input =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:placeholder:text-slate-400 dark:focus:border-teal-300 dark:focus:ring-teal-300/30';
const labelCls = 'mb-1 block text-xs font-medium text-neutral-700 dark:text-slate-300';

export function AuditForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const id = useId();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [kind, setKind] = useState<AuditKind>(initial?.kind ?? 'Web page');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [date, setDate] = useState(initial?.date ?? today());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), kind, location: location.trim(), date: date || today() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/40 dark:shadow-none">
      <div>
        <label htmlFor={`${id}-title`} className={labelCls}>
          Page or document title <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${id}-title`}
          className={input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
          placeholder="e.g. Checkout page"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-kind`} className={labelCls}>
            Type
          </label>
          <select id={`${id}-kind`} className={input} value={kind} onChange={(e) => setKind(e.target.value as AuditKind)}>
            {AUDIT_KINDS.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-date`} className={labelCls}>
            Audit date
          </label>
          <input id={`${id}-date`} type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-loc`} className={labelCls}>
          URL or file name <span className="font-normal text-neutral-600 dark:text-slate-400">(optional)</span>
        </label>
        <input
          id={`${id}-loc`}
          className={input}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="https://… or report.pdf"
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:outline-teal-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-teal-300 dark:text-slate-900 dark:hover:bg-teal-200 dark:focus-visible:outline-teal-300"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

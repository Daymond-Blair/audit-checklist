import { useCallback, useEffect, useState } from 'react';
import type { Audit, AuditDetails, CriterionResult } from '../types';
import { DEFAULT_RESULT } from '../types';

const STORAGE_KEY = 'a11y-checklist:v1';

interface Stored {
  audits: Audit[];
  activeId: string | null;
}

function load(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.audits)) {
        return { audits: parsed.audits, activeId: parsed.activeId ?? null };
      }
    }
  } catch {
    /* corrupt or unavailable storage: start fresh */
  }
  return { audits: [], activeId: null };
}

export const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useAudits() {
  const [state, setState] = useState<Stored>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked */
    }
  }, [state]);

  const patchAudit = useCallback((id: string, fn: (a: Audit) => Audit) => {
    setState((s) => ({
      ...s,
      audits: s.audits.map((a) => (a.id === id ? { ...fn(a), updatedAt: Date.now() } : a)),
    }));
  }, []);

  const createAudit = useCallback((details: AuditDetails) => {
    const now = Date.now();
    const audit: Audit = { ...details, id: newId(), createdAt: now, updatedAt: now, results: {} };
    setState((s) => ({ audits: [audit, ...s.audits], activeId: audit.id }));
  }, []);

  const updateDetails = useCallback(
    (id: string, details: AuditDetails) => patchAudit(id, (a) => ({ ...a, ...details })),
    [patchAudit],
  );

  const setResult = useCallback(
    (id: string, key: string, patch: Partial<CriterionResult>) =>
      patchAudit(id, (a) => ({
        ...a,
        results: { ...a.results, [key]: { ...DEFAULT_RESULT, ...a.results[key], ...patch } },
      })),
    [patchAudit],
  );

  const deleteAudit = useCallback((id: string) => {
    setState((s) => {
      const audits = s.audits.filter((a) => a.id !== id);
      return { audits, activeId: s.activeId === id ? (audits[0]?.id ?? null) : s.activeId };
    });
  }, []);

  const selectAudit = useCallback((id: string | null) => setState((s) => ({ ...s, activeId: id })), []);

  const active = state.audits.find((a) => a.id === state.activeId) ?? null;

  return { audits: state.audits, active, createAudit, updateDetails, setResult, deleteAudit, selectAudit };
}

export type Status = 'not-tested' | 'pass' | 'fail' | 'na';

export interface Criterion {
  /** Stable id from the checklist source, e.g. "p3-2.1.1". Used as the storage key. */
  key: string;
  sc: string;
  name: string;
  level: string;
  section508: string;
  andiModule: string;
  webCheck: string;
  pdfCheck: string;
  hints: string[];
}

export interface Phase {
  id: string;
  title: string;
  tools: string[];
  criteria: Criterion[];
}

export interface Checklist {
  title: string;
  subtitle: string;
  phases: Phase[];
}

export interface CriterionResult {
  status: Status;
  checked: boolean;
}

export const AUDIT_KINDS = ['Web page', 'PDF', 'Document'] as const;
export type AuditKind = (typeof AUDIT_KINDS)[number];

export interface AuditDetails {
  title: string;
  kind: AuditKind;
  /** URL or file name */
  location: string;
  /** YYYY-MM-DD */
  date: string;
}

export interface Audit extends AuditDetails {
  id: string;
  createdAt: number;
  updatedAt: number;
  results: Record<string, CriterionResult>;
}

export const DEFAULT_RESULT: CriterionResult = { status: 'not-tested', checked: false };

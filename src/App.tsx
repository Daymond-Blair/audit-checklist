import { useMemo, useState } from 'react';
import checklistMd from './checklist.md?raw';
import { parseChecklist } from './lib/parseChecklist';
import { useAudits } from './lib/useAudits';
import { AuditForm } from './components/AuditForm';
import { AuditList } from './components/AuditList';
import { AuditView } from './components/AuditView';
import { Spotlight, ThemeToggle } from './components/ThemeChrome';
import { useTheme } from './lib/useTheme';

export default function App() {
  const checklist = useMemo(() => parseChecklist(checklistMd), []);
  const { phases } = checklist;
  const allCriteria = useMemo(() => phases.flatMap((p) => p.criteria), [phases]);
  const { audits, active, createAudit, updateDetails, setResult, deleteAudit, selectAudit } = useAudits();
  const [creating, setCreating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const showForm = creating || audits.length === 0;

  const sidebar = (
    <AuditList
      audits={audits}
      activeId={showForm ? null : (active?.id ?? null)}
      criteria={allCriteria}
      onSelect={(id) => {
        selectAudit(id);
        setCreating(false);
        setMenuOpen(false);
      }}
      onNew={() => {
        setCreating(true);
        setMenuOpen(false);
      }}
    />
  );

  return (
    <div className="relative isolate min-h-screen bg-white font-sans text-neutral-900 dark:bg-slate-900 dark:text-slate-400">
      <Spotlight />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 dark:focus:bg-slate-800 dark:focus:text-teal-300 focus:py-2 focus:text-sm focus:font-medium focus:shadow"
      >
        Skip to checklist
      </a>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-900/90 dark:backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold dark:text-slate-200">A11y Checklist</span>
          <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={toggle} />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-audits"
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-red-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:outline-teal-300"
          >
            {menuOpen ? 'Close' : 'Audits'}
          </button>
          </div>
        </div>
        <div id="mobile-audits" hidden={!menuOpen} className="max-h-[60vh] overflow-y-auto border-t border-neutral-200 bg-neutral-50 dark:border-slate-800 dark:bg-slate-900">
          {sidebar}
        </div>
      </div>

      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-neutral-200 bg-neutral-50 md:block dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center justify-between px-4 pt-4">
            <span className="text-sm font-semibold dark:text-slate-200">A11y Checklist</span>
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
          {sidebar}
        </aside>

        <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-4 py-8 focus:outline-none sm:px-6 md:py-12">
          <div className="mx-auto max-w-3xl">
            {showForm ? (
              <>
                <h1 className="mb-1 text-2xl font-bold tracking-tight dark:text-slate-200">New audit</h1>
                <p className="mb-6 text-sm text-neutral-600 dark:text-slate-400">
                  Create a checklist for a web page, PDF, or document. Progress is saved in this browser.
                  {checklist.title && (
                    <>
                      <br />
                      <span className="text-neutral-700 dark:text-slate-300">
                        {checklist.title} · {allCriteria.length} checks across {phases.length} phases.
                      </span>
                    </>
                  )}
                </p>
                <AuditForm
                  submitLabel="Create audit"
                  onCancel={audits.length > 0 ? () => setCreating(false) : undefined}
                  onSubmit={(d) => {
                    createAudit(d);
                    setCreating(false);
                  }}
                />
              </>
            ) : active ? (
              <AuditView
                key={active.id}
                audit={active}
                phases={phases}
                onUpdateDetails={updateDetails}
                onSetResult={setResult}
                onDelete={deleteAudit}
              />
            ) : (
              <p className="text-neutral-600 dark:text-slate-400">Select an audit from the list.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

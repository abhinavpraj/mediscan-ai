import type { ReactNode } from 'react';
import { FileSearch } from 'lucide-react';

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center dark:border-white/10 dark:bg-white/5">
      <div className="mb-4 rounded-2xl bg-blue-50 p-4 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
        <FileSearch size={28} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

import { cn } from '../../lib/utils';

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'blue',
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone?: 'blue' | 'cyan' | 'green' | 'amber' | 'red';
}) {
  const tones = {
    blue: 'from-blue-600 to-blue-400 shadow-blue-600/20',
    cyan: 'from-cyan-500 to-sky-400 shadow-cyan-500/20',
    green: 'from-emerald-500 to-teal-400 shadow-emerald-500/20',
    amber: 'from-amber-500 to-orange-400 shadow-amber-500/20',
    red: 'from-red-500 to-rose-400 shadow-red-500/20',
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
            </div>
            <div className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg', tones[tone])}>
              <Icon size={22} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

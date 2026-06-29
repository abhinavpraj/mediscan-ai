import { AlertTriangle, CheckCircle2, Clock3, Eye, FileText } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { EmptyState } from '../components/ui/empty-state';
import { formatDate } from '../lib/utils';
import type { PageProps } from '../types/app';

export default function HistoryPage({ reports, setSelected, setPage }: PageProps) {
  const ordered = [...reports].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Processing Timeline</CardTitle>
        <Badge tone="cyan">{ordered.length} completed</Badge>
      </CardHeader>
      <CardContent>
        {ordered.length === 0 ? (
          <EmptyState title="No processing history" description="Uploaded reports and manual text extractions will appear here after processing." />
        ) : (
          <ol className="relative space-y-5 border-l border-slate-200 pl-6 dark:border-white/10">
            {ordered.map((report) => {
              const risky = report.structured_json.risk_flags.length > 0;
              return (
                <li key={report.id} className="relative">
                  <span className="absolute -left-[35px] grid h-7 w-7 place-items-center rounded-full bg-white text-blue-600 ring-4 ring-slate-100 dark:bg-slate-900 dark:text-blue-200 dark:ring-slate-950">
                    {risky ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
                  </span>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{report.patient_name}</h3>
                          <Badge tone={risky ? 'red' : 'green'}>{risky ? 'Review' : 'Complete'}</Badge>
                        </div>
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <FileText size={15} /> {report.report_type} from {report.source_filename || 'manual entry'}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <Clock3 size={14} /> {formatDate(report.created_at)}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => { setSelected(report); setPage('viewer'); }}>
                        <Eye size={15} /> Open
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

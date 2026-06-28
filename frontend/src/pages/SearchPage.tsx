import { AlertTriangle, Eye, RefreshCw, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { EmptyState } from '../components/ui/empty-state';
import { Input } from '../components/ui/form';
import { formatDate } from '../lib/utils';
import type { PageProps } from '../types/app';

export default function SearchPage({ reports, query, setQuery, setSelected, setPage, onRefresh }: PageProps) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onRefresh(query);
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Search Local Records</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patient name, report type, filename, or OCR text"
              aria-label="Search reports"
            />
            <Button type="submit">
              <Search size={16} /> Search
            </Button>
            <Button type="button" variant="outline" onClick={() => { setQuery(''); void onRefresh(''); }}>
              <RefreshCw size={16} /> Reset
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Results</CardTitle>
          <Badge tone="blue">{reports.length} records</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {reports.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No matching reports" description="Try a broader search or upload a sample report to create local records." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5">
                  <tr>
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Source</th>
                    <th className="px-5 py-3">Risk</th>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {reports.map((report) => {
                    const risky = report.structured_json.risk_flags.length > 0;
                    return (
                      <tr key={report.id} className="transition hover:bg-blue-50/60 dark:hover:bg-white/5">
                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{report.patient_name}</td>
                        <td className="px-5 py-4">{report.report_type}</td>
                        <td className="max-w-[220px] truncate px-5 py-4 text-slate-500">{report.source_filename}</td>
                        <td className="px-5 py-4">
                          <Badge tone={risky ? 'red' : 'green'}>
                            {risky && <AlertTriangle size={13} />}
                            {risky ? `${report.structured_json.risk_flags.length} flags` : 'Normal'}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-slate-500">{formatDate(report.created_at)}</td>
                        <td className="px-5 py-4 text-right">
                          <Button size="sm" variant="outline" onClick={() => { setSelected(report); setPage('viewer'); }}>
                            <Eye size={15} /> View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

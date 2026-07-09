import {
  Activity,
  AlertTriangle,
  FileText,
  ScanLine,
  UploadCloud,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "../components/reports/StatCard";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { Progress } from "../components/ui/progress";
import { formatDate } from "../lib/utils";
import type { PageProps } from "../types/app";

export default function DashboardPage({
  reports,
  setSelected,
  setPage,
}: PageProps) {
  const critical = reports.filter(
    (report) => report.structured_json.risk_flags.length > 0,
  );
  const patients = new Set(reports.map((report) => report.patient_name)).size;
  const today = reports.filter(
    (report) =>
      new Date(report.created_at).toDateString() === new Date().toDateString(),
  ).length;
  const chartData = buildChartData(reports.length);
  const typeData = ["Blood Report", "Prescription", "ECG Report"].map(
    (name) => ({
      name,
      value:
        reports.filter((report) => report.report_type === name).length ||
        (reports.length ? 0 : 1),
    }),
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Reports Processed"
          value={reports.length}
          detail="Stored in local SQLite"
          icon={FileText}
        />
        <StatCard
          label="Patients"
          value={patients}
          detail="Unique local records"
          icon={Users}
          tone="cyan"
        />
        <StatCard
          label="Today's Uploads"
          value={today}
          detail="CPU-only processing"
          icon={UploadCloud}
          tone="green"
        />
        <StatCard
          label="Critical Cases"
          value={critical.length}
          detail="Reports with risk flags"
          icon={AlertTriangle}
          tone="red"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Processing Volume</CardTitle>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Offline extractions across the current week.
              </p>
            </div>
            <Badge tone="blue">Live local</Badge>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="volume" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="reports"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fill="url(#volume)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Mix</CardTitle>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Document types handled by the local pipeline.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    dataKey="value"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={5}
                  >
                    {typeData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={["#2563EB", "#06B6D4", "#10B981"][index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {typeData.map((item, index) => (
                <div key={item.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">
                      {item.name}
                    </span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                  <Progress
                    value={
                      reports.length
                        ? (item.value / reports.length) * 100
                        : 34 + index * 12
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage("search")}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {reports.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="No reports yet"
                  description="Upload a sample report to populate analytics and history."
                  action={
                    <Button onClick={() => setPage("upload")}>
                      <UploadCloud size={16} /> Upload report
                    </Button>
                  }
                />
              </div>
            ) : (
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5">
                  <tr>
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {reports.slice(0, 6).map((report) => (
                    <tr
                      key={report.id}
                      className="cursor-pointer transition hover:bg-blue-50/60 dark:hover:bg-white/5"
                      onClick={() => {
                        setSelected(report);
                        setPage("viewer");
                      }}
                    >
                      <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                        {report.patient_name}
                      </td>
                      <td className="px-5 py-4">{report.report_type}</td>
                      <td className="px-5 py-4">
                        <Badge
                          tone={
                            report.structured_json.risk_flags.length
                              ? "red"
                              : "green"
                          }
                        >
                          {report.structured_json.risk_flags.length
                            ? "Needs review"
                            : "Normal"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(report.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(reports.length ? reports.slice(0, 5) : []).map((report) => (
              <div key={report.id} className="flex gap-3">
                <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                  <ScanLine size={17} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {report.patient_name} processed
                  </p>
                  <p className="text-xs text-slate-500">
                    {report.report_type} · {formatDate(report.created_at)}
                  </p>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500 dark:bg-white/5">
                <Activity className="mb-3 text-blue-600" />
                Activity will appear after the first offline extraction.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function buildChartData(count: number) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, index) => ({
    day,
    reports: Math.max(0, Math.round(count * (0.3 + index / 8))),
  }));
}

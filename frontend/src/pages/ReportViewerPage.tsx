import {
  AlertTriangle,
  CalendarClock,
  FileText,
  Search,
  UploadCloud,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { JsonBlock } from "../components/reports/JsonBlock";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { formatDate } from "../lib/utils";
import type { PageProps } from "../types/app";
import type { Parameter } from "../types/report";

export default function ReportViewerPage({ selected, setPage }: PageProps) {
  if (!selected) {
    return (
      <EmptyState
        title="No report selected"
        description="Open a report from search or upload a new document to review extracted clinical data."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => setPage("upload")}>
              <UploadCloud size={16} /> Upload
            </Button>
            <Button variant="outline" onClick={() => setPage("search")}>
              <Search size={16} /> Search
            </Button>
          </div>
        }
      />
    );
  }

  const risks = selected.structured_json.risk_flags;

  const getParamStatus = (name: string) => {
    const params =
      selected.structured_json.parameters || selected.parameters || [];
    const param = params.find(
      (p: Parameter) => p.name.toLowerCase() === name.toLowerCase(),
    );
    return param ? param.status : "Normal";
  };

  const overallRisk =
    selected.overall_risk || selected.structured_json.overall_risk || "Low";
  const clinicalSummary =
    selected.clinical_summary ||
    selected.structured_json.clinical_summary ||
    [];
  const recommendations =
    selected.recommendations || selected.structured_json.recommendations || [];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Clinical Summary</CardTitle>
              <Badge
                tone={
                  overallRisk === "Critical"
                    ? "red"
                    : overallRisk === "High"
                      ? "red"
                      : overallRisk === "Moderate"
                        ? "amber"
                        : "green"
                }
              >
                {overallRisk} Risk
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                Clinical Overview
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {clinicalSummary.length > 0 ? (
                  clinicalSummary.map((bullet: string, i: number) => (
                    <li key={i}>{bullet}</li>
                  ))
                ) : (
                  <li>No clinical summary generated.</li>
                )}
              </ul>
            </div>

            {recommendations.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                  Recommendations
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs italic text-slate-400 dark:text-slate-500 mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
              This is an AI-generated clinical summary and should not replace
              professional medical advice.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Patient Summary</CardTitle>
              <Badge
                tone={
                  overallRisk === "Critical" || overallRisk === "High"
                    ? "red"
                    : overallRisk === "Moderate"
                      ? "amber"
                      : "green"
                }
              >
                {overallRisk || (risks.length ? "Needs review" : "Normal")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <SummaryRow
              icon={<UserRound size={18} />}
              label="Patient"
              value={selected.patient_name}
            />
            <SummaryRow
              icon={<FileText size={18} />}
              label="Report type"
              value={selected.report_type}
            />
            <SummaryRow
              icon={<CalendarClock size={18} />}
              label="Created"
              value={formatDate(selected.created_at)}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Metric label="Age" value={selected.age ?? "Unknown"} />
              <Metric label="Gender" value={selected.gender ?? "Unknown"} />
              <Metric
                label="Hemoglobin"
                value={formatNullable(
                  selected.structured_json.hemoglobin,
                  "g/dL",
                )}
                status={getParamStatus("hemoglobin")}
              />
              <Metric
                label="Glucose"
                value={formatNullable(
                  selected.structured_json.glucose,
                  "mg/dL",
                )}
                status={getParamStatus("glucose")}
              />
              <Metric
                label="Cholesterol"
                value={selected.structured_json.cholesterol ?? "Not found"}
                status={getParamStatus("cholesterol")}
              />
              <Metric
                label="Blood pressure"
                value={selected.structured_json.blood_pressure ?? "Not found"}
                status={getParamStatus("blood pressure")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinical Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {risks.length > 0 ? (
              <div className="space-y-2">
                {risks.map((risk) => (
                  <div
                    key={risk}
                    className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200"
                  >
                    <AlertTriangle className="mt-0.5 shrink-0" size={16} />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                No risk flags were detected by the local extractor.
              </p>
            )}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                Recommendation
              </h3>
              <p className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                {selected.structured_json.recommendation ||
                  "No recommendation captured."}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                Medications
              </h3>
              <div className="flex flex-wrap gap-2">
                {selected.structured_json.medications.length > 0 ? (
                  selected.structured_json.medications.map((medication) => (
                    <Badge key={medication} tone="cyan">
                      {medication}
                    </Badge>
                  ))
                ) : (
                  <Badge>No medications found</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Original OCR Text</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-cyan-50">
              {selected.raw_text || "No OCR text available."}
            </pre>
          </CardContent>
        </Card>
        <JsonBlock
          payload={selected.structured_json}
          filename={`report-${selected.id}.json`}
        />
      </div>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  status,
}: {
  label: string;
  value: string | number;
  status?: string;
}) {
  const getIndicator = (status: string) => {
    switch (status) {
      case "Normal":
        return "🟢";
      case "Low":
        return "🟡";
      case "High":
        return "🟠";
      case "Critical":
        return "🔴";
      default:
        return "🟢";
    }
  };

  return (
    <div className="rounded-xl border border-slate-100 p-3 dark:border-white/10 flex justify-between items-center">
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
      {status && (
        <span className="text-base select-none" title={status}>
          {getIndicator(status)}
        </span>
      )}
    </div>
  );
}

function formatNullable(value: number | null, suffix: string) {
  return value === null ? "Not found" : `${value} ${suffix}`;
}

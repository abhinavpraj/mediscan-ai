import { Cpu, Database, Moon, RefreshCw, ShieldCheck, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input, Label } from "../components/ui/form";
import type { PageProps } from "../types/app";

export default function SettingsPage({ reports, onRefresh }: PageProps) {
  const dark = document.documentElement.classList.contains("dark");

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Runtime Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatusRow
            icon={<ShieldCheck size={18} />}
            label="Privacy mode"
            value="Offline CPU processing"
            tone="green"
          />
          <StatusRow
            icon={<Database size={18} />}
            label="Local records"
            value={`${reports.length} reports in SQLite`}
            tone="blue"
          />
          <StatusRow
            icon={<Cpu size={18} />}
            label="Model backend"
            value="Deterministic extractor ready"
            tone="cyan"
          />
          <Button variant="outline" onClick={() => void onRefresh()}>
            <RefreshCw size={16} /> Refresh records
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Profile</Label>
            <Input id="profile-name" value="Clinic Admin" readOnly />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="api-base">API base</Label>
            <Input
              id="api-base"
              value={import.meta.env.VITE_API_BASE ?? "/api"}
              readOnly
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model-path">Local model path</Label>
            <Input
              id="model-path"
              value="models/mediscan-local.gguf"
              readOnly
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Theme
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use the header toggle to change appearance.
              </p>
            </div>
            <Badge tone={dark ? "blue" : "amber"}>
              {dark ? <Moon size={13} /> : <Sun size={13} />}
              {dark ? "Dark" : "Light"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "blue" | "cyan" | "green";
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4 dark:border-white/10">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {label}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {value}
        </p>
      </div>
      <Badge tone={tone}>Ready</Badge>
    </div>
  );
}

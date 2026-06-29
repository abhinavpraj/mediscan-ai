import { AlertCircle, Bot, FileJson, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { UploadZone } from '../components/reports/UploadZone';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/form';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import type { PageProps } from '../types/app';

export default function UploadPage({
  busy,
  error,
  uploadProgress,
  previewUrl,
  manualText,
  setManualText,
  onUploadFile,
  onIngestText,
}: PageProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-6">
        <UploadZone busy={busy} progress={uploadProgress} previewUrl={previewUrl} onFile={onUploadFile} />
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
            <AlertCircle size={18} /> {error}
          </div>
        )}
      </div>
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Paste OCR Text</CardTitle>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Useful for demos when you want instant offline extraction without a file.</p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={manualText}
              onChange={(event) => setManualText(event.target.value)}
              rows={10}
              placeholder="Patient: John Doe&#10;Age: 45&#10;Gender: Male&#10;Hemoglobin: 11.2 g/dL"
            />
            <Button className="mt-4 w-full" disabled={busy || !manualText.trim()} onClick={onIngestText}>
              <Bot size={17} /> Extract structured JSON
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Offline Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Step icon={<ShieldCheck size={18} />} title="Privacy first" text="No cloud APIs, no external inference, local SQLite only." tone="green" />
            <Step icon={<FileJson size={18} />} title="Structured output" text="OCR text becomes validated JSON for downstream systems." tone="blue" />
            <Step icon={<Bot size={18} />} title="CPU optimized" text="Deterministic extraction works immediately; local GGUF model can enrich results." tone="cyan" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Step({ icon, title, text, tone }: { icon: ReactNode; title: string; text: string; tone: 'blue' | 'cyan' | 'green' }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
      <Badge tone={tone} className="mb-3">{icon}{title}</Badge>
      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

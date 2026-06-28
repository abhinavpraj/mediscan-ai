import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CloudUpload, FileText, Image, Loader2 } from 'lucide-react';
import { DragEvent, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';

export function UploadZone({
  busy,
  progress,
  previewUrl,
  onFile,
}: {
  busy: boolean;
  progress: number;
  previewUrl: string;
  onFile: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void onFile(file);
  }

  return (
    <div
      onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-dashed p-8 text-center transition-all',
        dragging
          ? 'border-blue-500 bg-blue-50 shadow-xl shadow-blue-600/10 dark:bg-blue-500/10'
          : 'border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5',
      )}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_40%)]" />
      <motion.div animate={{ y: busy ? [0, -6, 0] : 0 }} transition={{ repeat: busy ? Infinity : 0, duration: 1.4 }} className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-xl shadow-blue-600/25">
        {busy ? <Loader2 className="animate-spin" size={34} /> : <CloudUpload size={36} />}
      </motion.div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Drop medical report here</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
        Upload a PDF, JPG, or PNG. OCR and extraction run offline on CPU, then the structured result is stored locally.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={() => inputRef.current?.click()} disabled={busy}>
          <CloudUpload size={18} /> Choose file
        </Button>
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onFile(file);
          event.target.value = '';
        }} />
        <Button variant="outline" size="lg" disabled>
          <CheckCircle2 size={18} /> Offline ready
        </Button>
      </div>
      <AnimatePresence>
        {progress > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto mt-6 max-w-md text-left">
            <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
              <span>{progress === 100 ? 'Processing complete' : 'Processing locally'}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </motion.div>
        )}
      </AnimatePresence>
      {previewUrl && (
        <div className="mx-auto mt-6 max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-slate-900">
          <img src={previewUrl} alt="Uploaded report preview" className="max-h-60 w-full object-contain" />
        </div>
      )}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Format icon={<FileText size={18} />} label="PDF reports" />
        <Format icon={<Image size={18} />} label="JPG scans" />
        <Format icon={<Image size={18} />} label="PNG images" />
      </div>
    </div>
  );
}

function Format({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
      {icon}
      {label}
    </div>
  );
}

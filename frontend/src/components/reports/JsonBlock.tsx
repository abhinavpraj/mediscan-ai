import { Check, Copy, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { downloadJson } from '../../lib/utils';

export function JsonBlock({ payload, filename }: { payload: unknown; filename: string }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(payload, null, 2);

  async function copy() {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner dark:border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-slate-200 hover:bg-white/10 hover:text-white" onClick={copy}>
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-200 hover:bg-white/10 hover:text-white" onClick={() => downloadJson(filename, payload)}>
            <Download size={15} /> JSON
          </Button>
        </div>
      </div>
      <pre className="max-h-[620px] overflow-auto p-5 text-xs leading-6 text-cyan-50 sm:text-sm">{json}</pre>
    </div>
  );
}

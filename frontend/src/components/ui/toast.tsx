import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export type ToastState = {
  tone: "success" | "error";
  message: string;
} | null;

export function Toast({ toast }: { toast: ToastState }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-sm text-slate-800 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 dark:text-white"
          role="status"
        >
          {toast.tone === "success" ? (
            <CheckCircle2 className="text-emerald-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

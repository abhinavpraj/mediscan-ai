import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bell,
  Clock3,
  Database,
  FileSearch,
  Home,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  UploadCloud,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

export type PageKey =
  "dashboard" | "upload" | "viewer" | "search" | "history" | "settings";

const navItems: Array<{ key: PageKey; label: string; icon: typeof Home }> = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "upload", label: "Upload", icon: UploadCloud },
  { key: "viewer", label: "Report Viewer", icon: FileSearch },
  { key: "search", label: "Search", icon: Search },
  { key: "history", label: "History", icon: Clock3 },
  { key: "settings", label: "Settings", icon: Settings },
];

type Props = {
  page: PageKey;
  setPage: (page: PageKey) => void;
  title: string;
  subtitle: string;
  dark: boolean;
  setDark: (value: boolean) => void;
  children: ReactNode;
};

export function AppShell({
  page,
  setPage,
  title,
  subtitle,
  dark,
  setDark,
  children,
}: Props) {
  const [mobileOpen, setMobileOpen] = useMobileDrawer();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.16),transparent_28%)]" />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/40 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/20 lg:block">
        <SidebarContent page={page} setPage={setPage} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="h-full w-[min(86vw,320px)] border-r border-white/70 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-slate-950"
            >
              <div className="mb-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </Button>
              </div>
              <SidebarContent
                page={page}
                setPage={(next) => {
                  setPage(next);
                  setMobileOpen(false);
                }}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu size={20} />
              </Button>
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>MediScan AI</span>
                  <span>/</span>
                  <span className="truncate font-medium text-blue-600 dark:text-blue-300">
                    {title}
                  </span>
                </div>
                <h1 className="truncate text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                  {title}
                </h1>
                <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="green" className="hidden sm:inline-flex">
                <ShieldCheck size={13} /> Offline CPU
              </Badge>
              <Button variant="outline" size="icon" aria-label="Notifications">
                <Bell size={18} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDark(!dark)}
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 dark:border-white/10 dark:bg-white/5 md:flex">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-sm font-bold text-white">
                  M
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">Clinic Admin</div>
                  <div className="text-xs text-slate-500">Local session</div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <motion.main
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 xl:px-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

function SidebarContent({
  page,
  setPage,
}: {
  page: PageKey;
  setPage: (page: PageKey) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-600/20">
          <Activity size={24} />
        </div>
        <div>
          <div className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
            MediScan AI
          </div>
          <div className="text-xs font-medium text-slate-500">
            CPU-first clinical AI
          </div>
        </div>
      </div>
      <nav className="space-y-1" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = page === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              <Icon size={19} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto space-y-4">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 dark:border-blue-400/20 dark:from-blue-500/10 dark:to-cyan-500/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Database size={16} /> Local vault
          </div>
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            Reports, OCR text, and JSON stay on this device.
          </p>
        </div>
      </div>
    </div>
  );
}

function useMobileDrawer(): [boolean, (value: boolean) => void] {
  return useState(false);
}

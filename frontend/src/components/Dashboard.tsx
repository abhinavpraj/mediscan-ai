import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import { AppShell, type PageKey } from "./layout/AppShell";
import { Skeleton } from "./ui/skeleton";
import { Toast, type ToastState } from "./ui/toast";
import { api } from "../services/api";
import type { Report } from "../types/report";
import type { PageProps } from "../types/app";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const UploadPage = lazy(() => import("../pages/UploadPage"));
const ReportViewerPage = lazy(() => import("../pages/ReportViewerPage"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const HistoryPage = lazy(() => import("../pages/HistoryPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));

type Props = {
  dark: boolean;
  setDark: (value: boolean) => void;
  onLogout: () => void;
};

const pageMeta: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Clinical Intelligence Dashboard",
    subtitle:
      "Offline report processing, risk triage, and local patient records.",
  },
  upload: {
    title: "Upload Medical Report",
    subtitle:
      "Drag, drop, preview, and process blood reports, prescriptions, or ECG files.",
  },
  viewer: {
    title: "Report Viewer",
    subtitle: "Review original OCR text beside structured clinical JSON.",
  },
  search: {
    title: "Search Records",
    subtitle: "Filter, sort, and inspect locally stored report extractions.",
  },
  history: {
    title: "Processing History",
    subtitle: "Trace every offline extraction in a clean clinical timeline.",
  },
  settings: {
    title: "Settings",
    subtitle:
      "Manage profile, theme, model path, offline status, and database controls.",
  },
};

const pageComponents: Record<
  PageKey,
  LazyExoticComponent<ComponentType<PageProps>>
> = {
  dashboard: DashboardPage,
  upload: UploadPage,
  viewer: ReportViewerPage,
  search: SearchPage,
  history: HistoryPage,
  settings: SettingsPage,
};

export function Dashboard({ dark, setDark, onLogout }: Props) {
  const [page, setPage] = useState<PageKey>("dashboard");
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [query, setQuery] = useState("");
  const [manualText, setManualText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [toast, setToast] = useState<ToastState>(null);

  const refresh = useCallback(
    async (search = query) => {
      const items = await api.listReports(search);
      setReports(items);
      setSelected((current) => {
        if (current && items.some((report) => report.id === current.id))
          return current;
        return items[0] ?? null;
      });
    },
    [query],
  );

  useEffect(() => {
    refresh().catch((err) =>
      setError(err instanceof Error ? err.message : "Unable to load reports"),
    );
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleUpload = useCallback(
    async (file: File) => {
      setBusy(true);
      setError("");
      setUploadProgress(14);
      setPreviewUrl(
        file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      );
      const timer = window.setInterval(
        () => setUploadProgress((value) => Math.min(value + 18, 92)),
        280,
      );
      try {
        const report = await api.uploadReport(file);
        await refresh();
        setSelected(report);
        setPage("viewer");
        setUploadProgress(100);
        setToast({
          tone: "success",
          message: "Report processed locally and saved to SQLite.",
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        setToast({ tone: "error", message });
      } finally {
        window.clearInterval(timer);
        setBusy(false);
        window.setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [refresh],
  );

  const ingestText = useCallback(async () => {
    if (!manualText.trim()) return;
    setBusy(true);
    setError("");
    setUploadProgress(22);
    const timer = window.setInterval(
      () => setUploadProgress((value) => Math.min(value + 20, 92)),
      240,
    );
    try {
      const report = await api.ingestText(manualText);
      await refresh();
      setManualText("");
      setSelected(report);
      setPage("viewer");
      setUploadProgress(100);
      setToast({
        tone: "success",
        message: "Text extracted into structured JSON.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Extraction failed";
      setError(message);
      setToast({ tone: "error", message });
    } finally {
      window.clearInterval(timer);
      setBusy(false);
      window.setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [manualText, refresh]);

  const CurrentPage = pageComponents[page];
  const props = useMemo<PageProps>(
    () => ({
      reports,
      selected,
      setSelected,
      setPage,
      query,
      setQuery,
      manualText,
      setManualText,
      busy,
      error,
      uploadProgress,
      previewUrl,
      onUploadFile: handleUpload,
      onIngestText: ingestText,
      onRefresh: refresh,
    }),
    [
      reports,
      selected,
      query,
      manualText,
      busy,
      error,
      uploadProgress,
      previewUrl,
      handleUpload,
      ingestText,
      refresh,
    ],
  );

  return (
    <>
      <AppShell
        page={page}
        setPage={setPage}
        title={pageMeta[page].title}
        subtitle={pageMeta[page].subtitle}
        dark={dark}
        setDark={setDark}
        onLogout={onLogout}
      >
        <Suspense fallback={<PageSkeleton />}>
          <CurrentPage {...props} />
        </Suspense>
      </AppShell>
      <Toast toast={toast} />
    </>
  );
}

function PageSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-4">
      <Skeleton className="h-36" />
      <Skeleton className="h-36" />
      <Skeleton className="h-36" />
      <Skeleton className="h-36" />
      <Skeleton className="h-96 lg:col-span-4" />
    </div>
  );
}

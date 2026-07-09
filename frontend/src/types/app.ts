import type { Report } from "./report";
import type { PageKey } from "../components/layout/AppShell";

export type PageProps = {
  reports: Report[];
  selected: Report | null;
  setSelected: (report: Report | null) => void;
  setPage: (page: PageKey) => void;
  query: string;
  setQuery: (query: string) => void;
  manualText: string;
  setManualText: (value: string) => void;
  busy: boolean;
  error: string;
  uploadProgress: number;
  previewUrl: string;
  onUploadFile: (file: File) => Promise<void>;
  onIngestText: () => Promise<void>;
  onRefresh: (query?: string) => Promise<void>;
};

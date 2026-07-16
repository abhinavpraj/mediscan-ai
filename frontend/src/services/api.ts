import type { Report } from "../types/report";

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "/api" : "https://mediscan-ai-2faj.onrender.com/api");

export class ApiClient {
  async listReports(query = ""): Promise<Report[]> {
    const suffix = query ? `?q=${encodeURIComponent(query)}` : "";
    const response = await this.request(`${API_BASE}/reports${suffix}`);
    const payload = (await response.json()) as { reports: Report[] };
    return payload.reports;
  }

  async uploadReport(file: File): Promise<Report> {
    const data = new FormData();
    data.append("file", file);
    const response = await this.request(`${API_BASE}/reports/upload`, {
      method: "POST",
      body: data,
    });
    return (await response.json()) as Report;
  }

  async ingestText(text: string): Promise<Report> {
    const response = await this.request(`${API_BASE}/reports/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source_filename: "manual-entry.txt" }),
    });
    return (await response.json()) as Report;
  }

  private async request(
    input: RequestInfo | URL,
    init: RequestInit = {},
  ): Promise<Response> {
    const response = await fetch(input, init);
    if (!response.ok) {
      const payload = await response
        .json()
        .catch(() => ({ detail: "Request failed" }));
      throw new Error(String(payload.detail ?? "Request failed"));
    }
    return response;
  }
}

export const api = new ApiClient();

import type { Report } from "../types/report";

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "/api" : "http://localhost:8000/api");

export class ApiClient {
  private token = localStorage.getItem("mediscan_token") ?? "";

  isAuthenticated(): boolean {
    return this.token.length > 0;
  }

  async login(username: string, password: string): Promise<void> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error("Invalid username or password");
    const payload = (await response.json()) as { access_token: string };
    this.token = payload.access_token;
    localStorage.setItem("mediscan_token", this.token);
  }

  logout(): void {
    this.token = "";
    localStorage.removeItem("mediscan_token");
  }

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
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${this.token}`);
    const response = await fetch(input, { ...init, headers });
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

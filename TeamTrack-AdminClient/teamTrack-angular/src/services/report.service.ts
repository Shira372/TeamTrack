import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import type { ReportData, ChartData } from "../models/report.model";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/api/reports`; // ✅ עדכון ל־environment
  private http = inject(HttpClient);

  getReports(): Observable<ReportData[]> {
    return this.http.get<ReportData[]>(this.apiUrl);
  }

  getUsersReport(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.apiUrl}/users`);
  }

  getMeetingsReport(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.apiUrl}/meetings`);
  }

  getActivityReport(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.apiUrl}/activity`);
  }
}

import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import type { ChartData } from "../models/report.model";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/api/reports`;
  private http = inject(HttpClient);

  getUsersReport(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.apiUrl}/users`);
  }

  getActivityReport(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.apiUrl}/activity`);
  }
}

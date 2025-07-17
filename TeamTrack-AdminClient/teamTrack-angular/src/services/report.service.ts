import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../environments/environment";
import type { User, Meeting } from "../models/report.model"

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private readonly API_BASE_URL = `${environment.apiUrl}/api`; 
  private http = inject(HttpClient)

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_BASE_URL}/Users`)
  }

  getMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.API_BASE_URL}/Meetings`)
  }
}

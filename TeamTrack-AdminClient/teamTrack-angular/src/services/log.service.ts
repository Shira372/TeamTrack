import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Log {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  source?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/logs`;

  // שליפת כל הלוגים
  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(this.apiUrl);
  }

  // שליפת לוגים עם פילטר לפי רמה
  getLogsByLevel(level: string): Observable<Log[]> {
    const params = new HttpParams().set('level', level);
    return this.http.get<Log[]>(this.apiUrl, { params });
  }
}

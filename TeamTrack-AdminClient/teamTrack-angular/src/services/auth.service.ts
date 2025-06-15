import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, type Observable, tap } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../environments/environment";
import type { User, LoginRequest, SignupRequest, AuthResponse } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`; // ✅ הותאם לפי environment
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private http = inject(HttpClient);
  private jwtHelper = new JwtHelperService();

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.setCurrentUser(response.user, response.token);
      }),
    );
  }

  signup(userData: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData).pipe(
      tap((response) => {
        this.setCurrentUser(response.user, response.token);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setCurrentUser(user: User, token: string): void {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }
}

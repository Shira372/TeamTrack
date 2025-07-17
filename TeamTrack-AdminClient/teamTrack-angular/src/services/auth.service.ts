import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject } from "rxjs"
import { User, LoginRequest, SignupRequest, AuthResponse } from "../models/user.model"
import { environment } from "../environments/environment"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/users`
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        this.currentUserSubject.next(user)
      } catch (error) {
        console.error("שגיאה בטעינת נתוני משתמש:", error)
        this.logout()
      }
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).toPromise()

    if (response) {
      // 🔥 בדיקה שהמשתמש הוא ADMIN
      if (response.user.role !== "ADMIN") {
        throw new Error("רק מנהלים יכולים להתחבר לאפליקציה זו")
      }

      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      this.currentUserSubject.next(response.user)

      console.log("✅ התחברות מוצלחת כמנהל:", response.user.userName)
      return response
    }

    throw new Error("שגיאה בהתחברות")
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    // 🔥 וידוא שההרשמה מ-Angular תמיד עם ADMIN
    const signupData = {
      ...userData,
      role: "ADMIN",
    }

    const response = await this.http.post<AuthResponse>(`${this.API_URL}/signup`, signupData).toPromise()

    if (response) {
      // בדיקה שהמשתמש נוצר כ-ADMIN
      if (response.user.role !== "ADMIN") {
        throw new Error("שגיאה: המשתמש לא נוצר כמנהל")
      }

      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      this.currentUserSubject.next(response.user)

      console.log("✅ הרשמה מוצלחת כמנהל:", response.user.userName)
      return response
    }

    throw new Error("שגיאה בהרשמה")
  }

  // 🔥 פונקציה חדשה לקבלת המשתמש הנוכחי
  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token")
    const user = this.getCurrentUser()

    // בדיקה שיש טוקן ושהמשתמש הוא ADMIN
    return !!(token && user && user.role === "ADMIN")
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
    console.log("✅ התנתקות בוצעה")
  }
}

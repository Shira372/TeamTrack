import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { ToastrService } from "ngx-toastr"
import { AuthService } from "../../services/auth.service"
import type { LoginRequest } from "../../models/user.model"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)
  private toastr = inject(ToastrService)

  loginForm = this.fb.group({
    userName: ["", [Validators.required]],
    passwordHash: ["", [Validators.required, Validators.minLength(6)]],
  })

  isLoading = false
  hidePassword = true
  errorMessage?: string

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.errorMessage = undefined

      const loginData: LoginRequest = {
        userName: this.loginForm.get("userName")!.value!,
        passwordHash: this.loginForm.get("passwordHash")!.value!,
      }

      try {
        const response = await this.authService.login(loginData)

        if (response.user.role !== "ADMIN") {
          throw new Error("רק מנהלים יכולים להתחבר לאפליקציה זו")
        }

        this.toastr.success(`ברוך הבא ${response.user.userName}!`, "התחברות מוצלחת")
        console.log("✅ התחברות מוצלחת כמנהל:", response.user.userName)

        // ניווט לעמוד הבית במקום dashboard
        this.router.navigate(["/"])
      } catch (error: any) {
        this.isLoading = false

        // טיפול בשגיאות ספציפיות
        if (error.message.includes("מנהלים")) {
          this.errorMessage = "רק מנהלים יכולים להתחבר לאפליקציה זו"
        } else if (error.status === 401) {
          this.errorMessage = "שם משתמש או סיסמה שגויים"
        } else if (error.status === 404) {
          this.errorMessage = "משתמש לא נמצא במערכת"
        } else {
          this.errorMessage = error.message || "שגיאה בהתחברות. אנא בדוק את הפרטים ונסה שוב"
        }

        this.toastr.error(this.errorMessage, "שגיאה בהתחברות")
        console.error("❌ שגיאה בהתחברות:", error)
      } finally {
        this.isLoading = false
      }
    } else {
      this.loginForm.markAllAsTouched()
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword
  }
}

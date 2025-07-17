import { Component, type OnInit, inject } from "@angular/core"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { AuthService } from "../../services/auth.service"
import type { SignupRequest } from "../../models/user.model"

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  userForm!: FormGroup
  loading = false
  error = ""

  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      passwordHash: ["", [Validators.required, Validators.minLength(6)]],
      company: [""],
      // 🔥 הוספה חשובה: role קבוע ל-ADMIN
      role: ["ADMIN"], 
    })
  }

  async submit(): Promise<void> {
    if (this.userForm.valid) {
      this.loading = true
      this.error = ""

      try {
        const signupData: SignupRequest = {
          ...this.userForm.value,
          role: "ADMIN", // 🔥 וידוא שזה תמיד ADMIN
        }

        const response = await this.authService.signup(signupData)

        // בדיקה שהמשתמש שנוצר הוא באמת ADMIN
        if (response.user.role !== "ADMIN") {
          throw new Error("שגיאה: המשתמש לא נוצר כמנהל")
        }

        console.log("הרשמה בוצעה בהצלחה כמנהל:", response.user)
        this.router.navigateByUrl("/")
      } catch (error: any) {
        this.error = error.message || "שגיאה בהרשמה"
        console.error("שגיאה בהרשמה:", error)
      } finally {
        this.loading = false
      }
    }
  }
}

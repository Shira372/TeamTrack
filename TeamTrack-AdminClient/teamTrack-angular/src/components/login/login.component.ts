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
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  })
  
  isLoading = false
  hidePassword = true

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.authService.login(this.loginForm.value as any).subscribe({
        next: () => {
          this.toastr.success("התחברת בהצלחה!")
          this.router.navigate(["/dashboard"])
        },
        error: () => {
          this.toastr.error("שגיאה בהתחברות. אנא בדוק את הפרטים ונסה שוב.")
          this.isLoading = false
        },
      })
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword
  }
}

import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { ToastrService } from "ngx-toastr"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-signup",
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
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)
  private toastr = inject(ToastrService)
  
  signupForm = this.fb.group(
    {
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  )
  
  isLoading = false
  hidePassword = true
  hideConfirmPassword = true

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")
    const confirmPassword = form.get("confirmPassword")
    return password && confirmPassword && password.value === confirmPassword.value ? null : { passwordMismatch: true }
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true
      this.authService.signup(this.signupForm.value as any).subscribe({
        next: () => {
          this.toastr.success("נרשמת בהצלחה!")
          this.router.navigate(["/dashboard"])
        },
        error: () => {
          this.toastr.error("שגיאה בהרשמה. אנא נסה שוב.")
          this.isLoading = false
        },
      })
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword
  }
}

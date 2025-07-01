import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  userForm: FormGroup;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required],
      company: ['']
    });
  }

  submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();  
      return;
    }

    this.error = null;
    this.loading = true;

    this.authService.signup(this.userForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'שגיאה ברישום המשתמש';
      }
    });
  }
}

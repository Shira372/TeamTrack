import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditUserComponent implements OnInit {
  userId!: number;
  isLoading = false;
  error: string | null = null;

  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.isLoading = true;
      this.userService.getUser(this.userId).subscribe({
        next: (user: User) => {
          this.form.patchValue({
            fullName: user.name ?? '',
            email: user.email ?? '',
            role: user.role ?? '',
          });
          this.isLoading = false;
        },
        error: () => {
          this.error = 'שגיאה בטעינת משתמש';
          this.isLoading = false;
        },
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.userService.updateUser(this.userId, this.form.value).subscribe({
      next: () => this.router.navigate(['/users']),
      error: () => (this.error = 'שגיאה בעדכון המשתמש'),
    });
  }
}

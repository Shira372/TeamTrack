import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit {
  form!: FormGroup;
  userId!: number;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      company: [''],
    });

    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.isLoading = true;
      this.userService.getUser(this.userId).subscribe({
        next: (user: User) => {
          this.form.patchValue({
            userName: user.userName ?? '',
            email: user.email ?? '',
            role: user.role ?? '',
            company: user.company ?? '',
          });
          this.isLoading = false;
        },
        error: () => {
          this.error = 'שגיאה בטעינת המשתמש';
          this.isLoading = false;
        },
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const updatedUser: Partial<User> = {
      userName: this.form.value.userName ?? '',
      email: this.form.value.email ?? '',
      role: this.form.value.role ?? '',
      company: this.form.value.company ?? '',
    };

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: () => this.router.navigate(['/users']),
      error: () => (this.error = 'שגיאה בעדכון המשתמש'),
    });
  }
}

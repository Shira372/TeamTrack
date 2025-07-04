import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateUserComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      company: [''],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.userForm.invalid) return;

    const newUser = this.userForm.value;

    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.toastr.success('המשתמש נוצר בהצלחה');
        this.router.navigate(['/users']);
      },
      error: () => {
        this.toastr.error('אירעה שגיאה בעת יצירת המשתמש');
      },
    });
  }
}

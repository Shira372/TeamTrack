import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../services/user.service";
import type { User } from "../../models/user.model";

@Component({
  selector: "app-user-management",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ["userName", "email", "role", "actions"];
  isLoading = true;
  errorMessage = "";

  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "אירעה שגיאה בעת טעינת המשתמשים.";
        this.toastr.error(this.errorMessage);
      },
    });
  }

  editUser(user: User): void {
    // עריכה רק למשתמשים בדרגת User (אות U גדולה)
    if (user.role === "User") {
      this.router.navigate(["/users/edit", user.id]);
    } else {
      this.toastr.warning("ניתן לערוך רק משתמשים בדרגת User");
    }
  }

  deleteUser(user: User): void {
    if (user.role === "ADMIN") {
      const msg = "לא ניתן למחוק משתמש בדרגת ADMIN. מדובר בהרשאות ניהול!";
      this.errorMessage = msg;
      this.toastr.warning(msg);
      return;
    }

    if (confirm(`האם אתה בטוח שברצונך למחוק את ${user.userName}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== user.id);
          this.toastr.success("המשתמש נמחק בהצלחה");
          this.errorMessage = "";
        },
        error: () => {
          const msg = "שגיאה במחיקת המשתמש. נסה שוב מאוחר יותר.";
          this.errorMessage = msg;
          this.toastr.error(msg);
        },
      });
    }
  }
}

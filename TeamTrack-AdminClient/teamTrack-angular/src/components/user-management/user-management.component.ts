import { Component, OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatChipsModule } from "@angular/material/chips"
import { ToastrService } from "ngx-toastr"
import { UserService } from "../../services/user.service"
import type { User } from "../../models/user.model"
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule
  ],
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"],
})
export class UserManagementComponent implements OnInit {
  users: User[] = []
  displayedColumns: string[] = ["name", "email", "role", "status", "actions"]
  isLoading = true
  errorMessage = ""

  private userService = inject(UserService)
  private toastr = inject(ToastrService)

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.isLoading = true
    this.errorMessage = ""

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users
        this.isLoading = false
      },
      error: () => {
        this.errorMessage = "אירעה שגיאה בעת טעינת המשתמשים. מוצגים נתונים לדוגמה."
        // Mock data for demonstration
        this.users = [
          {
            id: 1,
            name: "יוסי כהן",
            email: "yossi@example.com",
            role: "מנהל",
            isActive: true,
            createdAt: new Date("2024-01-15"),
          },
          {
            id: 2,
            name: "שרה לוי",
            email: "sara@example.com",
            role: "עובד",
            isActive: true,
            createdAt: new Date("2024-02-10"),
          },
          {
            id: 3,
            name: "דוד אברהם",
            email: "david@example.com",
            role: "עובד",
            isActive: false,
            createdAt: new Date("2024-01-20"),
          },
        ]
        this.isLoading = false
      },
    })
  }

  editUser(user: User): void {
    this.toastr.info(`עריכת משתמש: ${user.name}`)
  }

  deleteUser(user: User): void {
    if (confirm(`האם אתה בטוח שברצונך למחוק את ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== user.id)
          this.toastr.success("המשתמש נמחק בהצלחה")
        },
        error: () => {
          this.toastr.error("שגיאה במחיקת המשתמש")
        },
      })
    }
  }

  toggleUserStatus(user: User): void {
    const updatedUser = { ...user, isActive: !user.isActive }
    this.userService.updateUser(user.id, updatedUser).subscribe({
      next: () => {
        user.isActive = !user.isActive
        const status = user.isActive ? "הופעל" : "הושבת"
        this.toastr.success(`המשתמש ${status} בהצלחה`)
      },
      error: () => {
        this.toastr.error("שגיאה בעדכון סטטוס המשתמש")
      },
    })
  }
}

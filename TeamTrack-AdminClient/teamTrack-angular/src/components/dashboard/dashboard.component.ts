import { Component, OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatTooltipModule } from "@angular/material/tooltip" // ✅ תיקון
import { AuthService } from "../../services/auth.service"
import type { User } from "../../models/user.model"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule, // ✅ חשוב מאוד
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null
  private authService = inject(AuthService)

  dashboardCards = [
    {
      title: "ניהול משתמשים",
      description: "נהל משתמשים, הרשאות וגישות למערכת",
      icon: "people",
      route: "/users",
      color: "#d32f2f",
    },
    {
      title: "דוחות גרפיים",
      description: "צפה בדוחות ונתונים גרפיים מפורטים",
      icon: "bar_chart",
      route: "/reports",
      color: "#ff5722",
    },
    {
      title: "ישיבות",
      description: "תעד וסכם ישיבות צוות",
      icon: "event_note",
      route: "/meetings",
      color: "#ff9800",
    },
    {
      title: "הגדרות",
      description: "נהל הגדרות המערכת והפרופיל האישי",
      icon: "settings",
      route: "/settings",
      color: "#795548",
    },
  ]

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })
  }

  logout(): void {
    this.authService.logout()
  }
}

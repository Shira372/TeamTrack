import { Component, OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import { MatCardModule } from "@angular/material/card"
import { MatDividerModule } from "@angular/material/divider"
import { AuthService } from "../../services/auth.service"
import type { User } from "../../models/user.model"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null
  isLoaded = false
  activeFeature: number | null = null
  
  private authService = inject(AuthService)

  features = [
    {
      icon: "event_note",
      title: "תיעוד ישיבות",
      description: "תעד את כל הישיבות במקום אחד עם אפשרות לחיפוש וסינון מהיר",
      bullets: ["ארגון אוטומטי", "תיוג משתתפים", "חיפוש מהיר"],
    },
    {
      icon: "assignment",
      title: "דוחות וסיכומים",
      description: "הפק דוחות מותאמים אישית וקבל תובנות על פעילות הצוות",
      bullets: ["ניתוח מגמות", "מעקב החלטות", "יצוא לפורמטים שונים"],
    },
    {
      icon: "people",
      title: "ניהול משתמשים",
      description: "נהל את חברי הצוות, הרשאות וגישה למערכת",
      bullets: ["הגדרת הרשאות", "מעקב פעילות", "ניהול קבוצות"],
    },
  ]

  metrics = [
    { value: "87%", label: "חיסכון בזמן", icon: "access_time" },
    { value: "1000+", label: "לקוחות מרוצים", icon: "emoji_people" },
    { value: "3X", label: "שיפור בתפוקה", icon: "speed" },
  ]

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })

    setTimeout(() => {
      this.isLoaded = true
    }, 100)
  }

  onFeatureHover(index: number): void {
    this.activeFeature = index
  }

  onFeatureLeave(): void {
    this.activeFeature = null
  }

  logout(): void {
    this.authService.logout()
  }
}

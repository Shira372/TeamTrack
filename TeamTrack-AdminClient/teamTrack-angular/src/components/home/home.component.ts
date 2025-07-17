import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { AuthService } from "../../services/auth.service";
import type { User } from "../../models/user.model";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  isLoaded = false;
  activeFeature: number | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  features = [
    {
      icon: "groups",
      title: "משתמשים",
      description: "נהל משתמשים, עדכן והרשאות דרך ממשק נוח ואינטואיטיבי",
      bullets: ["הוספת משתמשים", "שינוי תפקידים", "מחיקה וניהול הרשאות"],
    },
    {
      icon: "bar_chart",
      title: "דוחות גרפיים",
      description: "נתח פעילות משתמשים ודוחות מותאמים אישית",
      bullets: ["נתונים סטטיסטיים", "השוואות משתמשים", "פילוחים לפי תפקיד"],
    },
    {
      icon: "vpn_key",
      title: "גישה מאובטחת",
      description: "כניסה עם JWT, פרטיות וניהול גישה",
      bullets: ["אימות עם Token", "גישה לפי הרשאות", "שמירה על אבטחת מידע"],
    },
  ];

  metrics = [
    { value: "99%", label: "אבטחת מידע", icon: "security" },
    { value: "120+", label: "משתמשים פעילים", icon: "groups" },
    { value: "5", label: "דוחות פעילים", icon: "insert_chart" },
  ];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  }

  onFeatureHover(index: number): void {
    this.activeFeature = index;
  }

  onFeatureLeave(): void {
    this.activeFeature = null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }

  goToLogin(): void {
    this.router.navigateByUrl("/login");
  }

  goToSignup(): void {
    this.router.navigateByUrl("/signup");
  }
}

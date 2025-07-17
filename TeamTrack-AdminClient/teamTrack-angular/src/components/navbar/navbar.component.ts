import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { AuthService } from "../../services/auth.service"
import type { User } from "../../models/user.model"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="toolbar" fxLayout="row" fxLayoutAlign="space-between center">
      <div class="logo">
        <mat-icon>groups</mat-icon>
        <span class="title">TeamTrack</span>
      </div>
      
      <!-- סרגל ניווט קישורים, רק כשהמשתמש מחובר -->
      <nav class="nav-links" *ngIf="currentUser">
        <button mat-button routerLink="/">בית</button>
        <button mat-button routerLink="/users">ניהול משתמשים</button>
        <button mat-button routerLink="/reports">דוחות</button>
      </nav>
      
      <div class="actions" *ngIf="currentUser; else guestActions">
        <span class="user-greeting">
          שלום, <span class="user-name">{{ currentUser.userName }}</span>
        </span>
        <button mat-raised-button class="custom-red-button" (click)="logout()">
          <mat-icon>logout</mat-icon> התנתקות
        </button>
      </div>
      
      <ng-template #guestActions>
        <div class="auth-buttons">
          <button mat-raised-button class="custom-red-button" (click)="goToLogin()">
            <mat-icon>login</mat-icon> התחברות
          </button>
          <button mat-raised-button class="custom-red-button" (click)="goToSignup()">
            <mat-icon>person_add</mat-icon> הרשמה
          </button>
        </div>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [
    `
    /* === Toolbar === */
    .toolbar {
      background: white;
      color: #b71c1c;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      padding-inline: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 8px; /* רווח בין האייקון לטקסט TeamTrack */
    }
    
    .logo mat-icon {
      color: #b71c1c;
    }
    
    .title {
      background: linear-gradient(45deg, #b71c1c, #f44336);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 20px;
      font-weight: bold;
      margin-inline-start: 8px;
    }
    
    /* === Nav links === */
    .nav-links {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-inline-start: 24px; /* רווח משמאל ללוגו */
    }
    
    .nav-links button {
      color: #b71c1c;
      font-weight: 600;
    }
    
    /* === Actions === */
    .actions {
      display: flex;
      align-items: center;
    }
    
    .user-greeting {
      font-weight: 600;
      margin-inline-end: 16px; /* רווח בין "שלום, שם" לכפתור התנתקות */
      white-space: nowrap; /* למנוע שבירת שורה */
    }
    
    .user-name {
      font-weight: 700;
    }
    
    button[mat-raised-button] {
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
    
    /* אדום אחיד מותאם אישית */
    .custom-red-button {
      background-color: #b71c1c !important;
      color: white !important;
    }
    
    .custom-red-button:hover {
      background-color: #a31818 !important;
      box-shadow: 0 4px 12px rgba(183, 28, 28, 0.4);
      transform: translateY(-1px);
    }
    
    /* === Auth buttons for guests === */
    .auth-buttons button {
      margin-inline-start: 12px;
    }
  `,
  ],
})
export class NavbarComponent {
  currentUser: User | null = null

  private authService = inject(AuthService)
  private router = inject(Router)

  constructor() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })
  }

  logout(): void {
    this.authService.logout()
    this.router.navigateByUrl("/login")
  }

  goToLogin(): void {
    this.router.navigateByUrl("/login")
  }

  goToSignup(): void {
    this.router.navigateByUrl("/signup")
  }
}

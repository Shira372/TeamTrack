import type { Routes } from "@angular/router";
import { LoginComponent } from "../components/login/login.component";
import { UserManagementComponent } from "../components/user-management/user-management.component";
import { ReportsComponent } from "../components/reports/reports.component";
import { EditUserComponent } from "../components/edit-user/edit-user.component";
import { SettingsComponent } from "../components/settings/settings.component";
import { authGuard } from "../guards/auth.guard";
import { LogsComponent } from "../components/logs/logs.component";


export const routes: Routes = [
  // התחברות
  { path: "login", component: LoginComponent },

  // ניהול משתמשים
  { path: "users", component: UserManagementComponent, canActivate: [authGuard] },
  { path: "users/edit/:id", component: EditUserComponent, canActivate: [authGuard] },

  // דוחות
  { path: "reports", component: ReportsComponent, canActivate: [authGuard] },

  // הגדרות מערכת
  { path: "settings", component: SettingsComponent, canActivate: [authGuard] },
  { path: "logs", component: LogsComponent, canActivate: [authGuard] },


  // ברירת מחדל ונתיב שגוי
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "**", redirectTo: "login" },
];

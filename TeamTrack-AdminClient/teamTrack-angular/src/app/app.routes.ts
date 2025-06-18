import type { Routes } from "@angular/router";
import { LoginComponent } from "../components/login/login.component";
import { UserManagementComponent } from "../components/user-management/user-management.component";
import { ReportsComponent } from "../components/reports/reports.component";
import { EditUserComponent } from "../components/edit-user/edit-user.component";
import { authGuard } from "../guards/auth.guard";


export const routes: Routes = [
  // התחברות
  { path: "login", component: LoginComponent },

  // ניהול משתמשים
  { path: "users", component: UserManagementComponent, canActivate: [authGuard] },
  { path: "users/edit/:id", component: EditUserComponent, canActivate: [authGuard] },

  // דוחות
  { path: "reports", component: ReportsComponent, canActivate: [authGuard] },

  // ברירת מחדל ונתיב שגוי
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "**", redirectTo: "login" },
];

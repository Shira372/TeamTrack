import type { Routes } from "@angular/router"
import { HomeComponent } from "../components/home/home.component"
import { LoginComponent } from "../components/login/login.component"
import { SignupComponent } from "../components/signup/signup.component"
import { DashboardComponent } from "../components/dashboard/dashboard.component"
import { UserManagementComponent } from "../components/user-management/user-management.component"
import { ReportsComponent } from "../components/reports/reports.component"
import { authGuard } from "../guards/auth.guard"

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [authGuard] },
  { path: "users", component: UserManagementComponent, canActivate: [authGuard] },
  { path: "reports", component: ReportsComponent, canActivate: [authGuard] },
  { path: "**", redirectTo: "" },
]

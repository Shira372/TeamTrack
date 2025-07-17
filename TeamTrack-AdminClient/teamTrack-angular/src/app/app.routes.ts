// src/app/app.routes.ts
import { Routes } from "@angular/router"

import { LoginComponent } from "../components/login/login.component"
import { SignupComponent } from "../components/signup/signup.component"
import { UserManagementComponent } from "../components/user-management/user-management.component"
import { ReportsComponent } from "../components/reports/reports.component"
import { EditUserComponent } from "../components/edit-user/edit-user.component"
import { HomeComponent } from "../components/home/home.component"

import { authGuard } from "../guards/auth.guard"

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  {
    path: "users",
    canActivate: [authGuard],
    children: [
      { path: "", component: UserManagementComponent },
      { path: "edit/:id", component: EditUserComponent },
    ],
  },
  { path: "reports", component: ReportsComponent, canActivate: [authGuard] },
  { path: "**", redirectTo: "", pathMatch: "full" },
]

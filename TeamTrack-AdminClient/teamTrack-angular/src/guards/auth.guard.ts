import { inject } from "@angular/core"
import { Router, type CanActivateFn } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  // בדיקה שהמשתמש מחובר
  if (!authService.isAuthenticated()) {
    console.log("❌ משתמש לא מחובר - מפנה להתחברות")
    router.navigate(["/login"])
    return false
  }

  // 🔥 בדיקה חשובה: שהמשתמש הוא ADMIN
  const currentUser = authService.getCurrentUser()
  if (!currentUser || currentUser.role !== "ADMIN") {
    console.log("❌ משתמש לא מורשה - רק מנהלים יכולים להכנס")
    authService.logout()
    router.navigate(["/login"])
    return false
  }

  console.log("✅ משתמש מורשה:", currentUser.userName, "תפקיד:", currentUser.role)
  return true
}

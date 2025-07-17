import { Component, inject } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { CommonModule } from "@angular/common"
import { NavbarComponent } from "../components/navbar/navbar.component"
import { AuthService } from "../services/auth.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  authService = inject(AuthService)
  title = "TeamTrack"
}

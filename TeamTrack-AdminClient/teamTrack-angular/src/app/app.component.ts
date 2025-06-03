// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, RouterOutlet,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    // הוסיפי כל קומפוננטה רלוונטית כאן
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }

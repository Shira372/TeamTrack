import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { authInterceptor } from './services/auth.interceptor';
import { provideToastr } from 'ngx-toastr';

// Bootstrap the main Angular application with all required providers
bootstrapApplication(AppComponent, {
  providers: [
    // Routing configuration
    provideRouter(routes),

    // Enable Angular animations (required for some UI libraries)
    provideAnimations(),

    // HTTP client with global auth interceptor
    provideHttpClient(withInterceptors([authInterceptor])),

    // Toastr configuration for user notifications
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
})
  .then(() => console.log('Application bootstrap successful'))
  .catch((err) => console.error('Application bootstrap failed:', err));

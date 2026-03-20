import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './auth/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    // Verificar se há token salvo ao iniciar app
    if (this.authService.isLoggedIn() && this.authService.isTokenExpired()) {
      // Tentar renovar token
      this.authService.refreshToken().subscribe({
        error: () => {
          // Falha na renovação - usuário será redirecionado para login pelo guard
          this.authService.logout();
        }
      });
    }
  }
}
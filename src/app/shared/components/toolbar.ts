import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
  <header class="toolbar">

    <div class="left">
      <span class="title">Hexagon Skill Test</span>
    </div>

    <div class="right">
      <span class="user">{{ username }}</span>

      <button (click)="logout()">
        Logout
      </button>
    </div>

  </header>
  `,
  styles: [`
    .toolbar {
      height: 60px;
      background: #1976d2;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }

    .title {
      font-weight: bold;
      font-size: 18px;
    }

    .right {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    button {
      background: white;
      color: #1976d2;
      border: none;
      padding: 6px 12px;
      cursor: pointer;
      border-radius: 4px;
    }
  `]
})
export class Toolbar {

  username = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.username = this.getUserNameFromToken();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private getUserNameFromToken(): string {
    const token = this.auth.getToken();

    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.unique_name || payload?.name || 'Usuário';
    } catch {
      return 'Usuário';
    }
  }
}

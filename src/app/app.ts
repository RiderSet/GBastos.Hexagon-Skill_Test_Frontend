import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Toolbar } from './shared/components/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Toolbar],
  template: `
    <div class="layout">

      <!-- Toolbar aparece em todas as rotas, exceto login -->
      <app-toolbar *ngIf="showToolbar"></app-toolbar>

      <main class="content" [class.full]="!showToolbar">
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
  styles: [`
    .layout {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f5f7fa;
    }

    .content {
      flex: 1;
      padding: 20px;
      overflow: auto;
    }

    .content.full {
      padding: 0;
    }
  `]
})
export class AppComponent {

  showToolbar = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Esconde a toolbar quando a rota contém "login"
        this.showToolbar = !event.url.includes('login');
      });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ToolbarComponent } from './shared/components/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent],
  template: `
    <div class="layout">

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
      .subscribe((event: any) => {

        // esconder toolbar no login
        this.showToolbar = !event.url.includes('login');

      });
  }
}
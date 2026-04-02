import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar" [class.success]="data?.type === 'success'"
                           [class.error]="data?.type === 'error'"
                           [class.warning]="data?.type === 'warning'">

      <span class="message">
        {{ data?.message }}
      </span>

      <button *ngIf="data?.action" (click)="action()">
        {{ data.action }}
      </button>

    </div>
  `,
  styles: [`
    .snackbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      min-width: 280px;
      padding: 12px 16px;
      color: white;
      background: #323232;
      border-radius: 4px;
      font-size: 14px;
    }

    .success {
      background: #2e7d32;
    }

    .error {
      background: #d32f2f;
    }

    .warning {
      background: #ed6c02;
    }

    .message {
      flex: 1;
    }

    button {
      background: transparent;
      border: 1px solid white;
      color: white;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    button:hover {
      background: rgba(255,255,255,0.2);
    }
  `]
})
export class Snackbar {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackRef: MatSnackBarRef<Snackbar>
  ) {}

  action() {
    this.snackRef.dismissWithAction();
  }
}
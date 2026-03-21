import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog.component';
import { LoginDialogComponent } from '../shared/components/login-dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: MatDialog) {}

  abrirConfirm(message: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message }
    }).afterClosed();
  }

  abrirLogin() {
    return this.dialog.open(LoginDialogComponent, {
      width: '400px'
    }).afterClosed();
  }
}
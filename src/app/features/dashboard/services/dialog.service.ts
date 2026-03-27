import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog';
import { LoginDialog } from '../../../shared/components/login-dialog';

@Injectable({ providedIn: 'root' })
export class DialogService {

  constructor(private dialog: MatDialog) {}

  abrirConfirm(message: string) {
    return this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { message }
    }).afterClosed();
  }

  abrirLogin() {
    return this.dialog.open(LoginDialog, {
      width: '400px'
    }).afterClosed();
  }
}
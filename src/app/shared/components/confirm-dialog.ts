import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Confirmação</h2>

    <mat-dialog-content>
      {{ data.message }}
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close="false">
        Cancelar
      </button>

      <button mat-raised-button color="warn" mat-dialog-close="true">
        Confirmar
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
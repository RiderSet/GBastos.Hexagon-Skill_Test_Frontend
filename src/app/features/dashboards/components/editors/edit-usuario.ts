import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-edit-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <h2 mat-dialog-title>Editar Usuário</h2>

    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>

      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit">
          Salvar
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class EditUsuario implements OnInit {

  form!: FormGroup;

constructor(
  private fb: FormBuilder,
  private dialogRef: MatDialogRef<EditUsuario>,
  @Inject(MAT_DIALOG_DATA) public data: any
) {}

ngOnInit() {
  this.form = this.fb.group({
    nome: [''],
    email: ['']
  });

  if (this.data) {
    this.form.patchValue(this.data);
  }
}

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
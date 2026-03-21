// src/app/features/dashboard/components/edit-usuario.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  template: `
<h2 mat-dialog-title>Editar Usuário</h2>

<form [formGroup]="form" (ngSubmit)="save()">

<mat-dialog-content>

<input formControlName="nome" placeholder="Nome">
<input formControlName="idade" placeholder="Idade">
<input formControlName="estadoCivil" placeholder="Estado Civil">
<input formControlName="cpf" placeholder="CPF">
<input formControlName="cidade" placeholder="Cidade">
<input formControlName="estado" placeholder="Estado">

</mat-dialog-content>

<mat-dialog-actions align="end">
<button mat-button (click)="close()">Cancelar</button>
<button mat-raised-button color="primary" type="submit">Salvar</button>
</mat-dialog-actions>

</form>
`
})
export class EditUsuarioComponent {

  form = this.fb.group({
    id: [''],
    nome: [''],
    idade: [''],
    estadoCivil: [''],
    cpf: [''],
    cidade: [''],
    estado: ['']
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form.patchValue(data);
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
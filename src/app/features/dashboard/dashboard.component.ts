// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TableGridComponent } from './components/tables/table-grid.component';
import { EditUsuarioComponent } from './components/editors/edit-usuario.component';

import { DashboardService } from './services/dashboard.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TableGridComponent,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
  <div class="dashboard">

    <div class="top-bar">

      <button (click)="exportCSV()">Exportar CSV</button>
      <button (click)="exportExcel()">Exportar Excel</button>

      <button
        (click)="deleteSelected()"
        [disabled]="!selected.length">
        Excluir Selecionados
      </button>

    </div>

    <div *ngIf="loading()" class="loading">
      Carregando...
    </div>

    <app-table-grid
      [data]="data"
      [columns]="columns"
      (edit)="openEdit($event)"
      (delete)="delete($event)"
      (selectionChange)="selected=$event"
      (filterChange)="applyFilters($event)">
    </app-table-grid>

  </div>
  `,
  styles: [`
  .dashboard {
    padding: 20px;
  }

  .top-bar {
    margin-bottom: 15px;
    display: flex;
    gap: 10px;
  }

  .top-bar button {
    padding: 6px 12px;
    border: none;
    background: #1976d2;
    color: white;
    cursor: pointer;
    border-radius: 4px;
  }

  .top-bar button:disabled {
    background: #ccc;
  }

  .loading {
    margin-bottom: 10px;
    color: #1976d2;
    font-weight: bold;
  }

  /* MATERIAL TABLE STYLE */

  .material-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,.08);
  }

  .material-table th {
    background: #fafafa;
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
    font-weight: 600;
  }

  .material-table td {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .material-table tr:hover {
    background: #f5f9ff;
  }

  .material-table tr.selected {
    background: #e3f2fd;
  }

  .material-table .checkbox {
    width: 40px;
  }

  .material-table .actions {
    width: 150px;
  }

  .material-table button {
    margin-right: 5px;
    padding: 4px 8px;
    border: none;
    cursor: pointer;
    background: #1976d2;
    color: white;
    border-radius: 3px;
  }

  .filters input {
    width: 100%;
    padding: 4px;
    border: 1px solid #ddd;
  }
  `]
})
export class DashboardComponent implements OnInit {

  data: User[] = [];
  selected: User[] = [];

  loading = signal(false);

  columns = [
    { field: 'nome', header: 'Nome' },
    { field: 'idade', header: 'Idade' },
    { field: 'estadoCivil', header: 'Estado Civil' },
    { field: 'cpf', header: 'CPF' },
    { field: 'cidade', header: 'Cidade' },
    { field: 'estado', header: 'Estado' }
  ];

  filters: any = {};

  constructor(
    private service: DashboardService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);

    this.service.getUsuarios(this.filters)
      .subscribe({
        next: res => {
          this.data = res;
          this.loading.set(false);
        },
        error: () => {
          this.snack.open('Erro ao carregar dados', 'OK', { duration: 3000 });
          this.loading.set(false);
        }
      });
  }

  applyFilters(filters: any) {
    this.filters = filters;
    this.load();
  }

  openEdit(usuario: User) {

    const dialogRef = this.dialog.open(EditUsuarioComponent, {
      width: '500px',
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) return;

      this.service.updateUsuario(result)
        .subscribe(() => {
          this.snack.open('Usuário atualizado', 'OK', { duration: 2000 });
          this.load();
        });
    });
  }

  delete(usuario: User) {

    if (!confirm('Deseja excluir este usuário?'))
      return;

    this.service.deleteUsuario(usuario.id)
      .subscribe(() => {
        this.snack.open('Usuário excluído', 'OK', { duration: 2000 });
        this.load();
      });
  }

  deleteSelected() {

    if (!this.selected.length) return;

    if (!confirm(`Excluir ${this.selected.length} registros?`))
      return;

    const ids = this.selected.map(x => x.id);

    this.service.deleteMany(ids)
      .subscribe(() => {
        this.snack.open('Registros excluídos', 'OK', { duration: 2000 });
        this.selected = [];
        this.load();
      });
  }

  exportCSV() {

    const csv = [
      this.columns.map(c => c.header).join(','),
      ...this.data.map(row =>
        this.columns.map(c => row[c.field as keyof User]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'usuarios.csv';
    link.click();
  }

  exportExcel() {

    import('xlsx').then(xlsx => {

      const worksheet = xlsx.utils.json_to_sheet(this.data);
      const workbook = xlsx.utils.book_new();

      xlsx.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
      xlsx.writeFile(workbook, 'usuarios.xlsx');

    });
  }
}
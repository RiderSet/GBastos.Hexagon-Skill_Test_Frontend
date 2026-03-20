import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

interface TableColumn {
  key: string;
  label: string;
  editable?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatPaginatorModule
  ]
})
export class DashboardComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  selectedRow: any = null;
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  columns: TableColumn[] = [
    { key: 'field1', label: 'Campo 1', editable: true },
    { key: 'field2', label: 'Campo 2', editable: true }
  ];

  constructor(
    private api: ApiService,
    private snack: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getAll().subscribe(res => {
      this.data = res;
      this.applyFilter();
    });
  }

  selectRow(row: any) {
    this.selectedRow = row;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(row =>
      this.columns.some(col => String(row[col.key]).toLowerCase().includes(term))
    );
    this.pageIndex = 0;
    this.applySort();
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get pagedData() {
    const start = this.pageIndex * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  sort(column: TableColumn) {
    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  applySort() {
    if (!this.sortColumn) return;
    this.filteredData.sort((a, b) => {
      const valA = a[this.sortColumn!];
      const valB = b[this.sortColumn!];
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  updateRow(row: any) {
    this.api.update(row.id, row).subscribe({
      next: () => { this.snack.open('Atualizado com sucesso!', '', { duration: 2000 }); this.loadData(); },
      error: () => this.snack.open('Erro ao atualizar!', '', { duration: 3000 })
    });
  }

  deleteRow(id: string) {
    this.api.delete(id).subscribe({
      next: () => { this.snack.open('Registro excluído!', '', { duration: 2000 }); this.loadData(); },
      error: () => this.snack.open('Erro ao excluir!', '', { duration: 3000 })
    });
  }
}
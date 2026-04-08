import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TableGrid } from './components/tables/table-grid';

interface Usuario {
  id: string;
  nome: string;
  idade: number;
  cpf: string;
  cidade: string;
  estado: string;
  username: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableGrid],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly http = inject(HttpClient);

  editForm: FormGroup;
  items: Usuario[] = [];
  selectedItem: Usuario | null = null;

  columns = [
    { field: 'nome', header: 'Nome' },
    { field: 'idade', header: 'Idade' },
    { field: 'cpf', header: 'CPF' },
    { field: 'cidade', header: 'Cidade' },
    { field: 'estado', header: 'Estado' },
    { field: 'username', header: 'Username' }
  ];

  constructor() {
    this.editForm = this.fb.group({
      cidade: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const user = this.getUserFromToken();
    if (user) {
      this.items = [user];
    }
  }

  getUserFromToken(): Usuario | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));

    return {
      id: payload.nameid,
      username: payload.unique_name,
      nome: payload.nome,
      idade: +payload.idade,
      cpf: payload.cpf,
      cidade: payload.cidade,
      estado: payload.estado
    };
  }

  onSelectionChange(selection: any[]) {
  console.log('Selecionados:', selection);
}

onFilterChange(filters: any) {
  console.log('Filtros:', filters);
}

  edit(item: Usuario) {
    this.selectedItem = item;

    this.editForm.patchValue({
      cidade: item.cidade,
      estado: item.estado
    });
  }

  save() {
    if (this.editForm.invalid || !this.selectedItem) return;

    Object.assign(this.selectedItem, this.editForm.value);

    // opcional: PUT no backend
    /*
    this.http.put(`https://localhost:7248/api/usuarios/${this.selectedItem.id}`, this.selectedItem)
      .subscribe();
    */
  }

  remove(item: Usuario) {
    if (!confirm('Deseja remover este usuário?')) return;

    this.http
      .delete(`https://localhost:7248/api/usuarios/${item.id}`)
      .subscribe(() => {
        this.items = this.items.filter(i => i.id !== item.id);
      });
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TableGridComponent } from './components/tables/table-grid';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableGridComponent
  ]
})
export class DashboardComponent implements OnInit {
  createForm!: FormGroup;
  items: any[] = [];
  dados: any; // ✅ declarada
  columns = [
    { field: 'nome', header: 'Nome' },
    { field: 'idade', header: 'Idade' },
    { field: 'cpf', header: 'CPF' },
    { field: 'cidade', header: 'Cidade' },
    { field: 'estado', header: 'Estado' },
    { field: 'username', header: 'Username' }
  ];

  preview: string | null = null;
  fileName: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // ✅ inicializa o formulário corretamente
    this.createForm = this.fb.group({
      nome: ['', Validators.required],
      idade: ['', Validators.required],
      cpf: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      username: ['', Validators.required],
    });
    
    this.authService.getDados().subscribe({
      next: (res) => {
        this.dados = res;
        console.log('Dados carregados:', res);
      },
      error: (err) => {
        console.error('Erro ao carregar dados', err);
      }
    });

    this.loadUsuarios(); // carrega lista de usuários
  }

  loadUsuarios(): void {
    this.authService.getAllUsuarios().subscribe({
      next: (res) => {
        this.items = res.data ?? res;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
      }
    });
  }

addUser(): void {
  if (this.createForm.invalid) return;

  const novoUsuario = this.createForm.value;

  // adiciona o novo registro
  this.items = [...this.items, novoUsuario];

  // reordena conforme critério (exemplo: nome)
  this.items.sort((a, b) => a.nome.localeCompare(b.nome));

  this.resetForm();
}

update(usuario: any): void {
  // encontra o índice do usuário no array
  const index = this.items.findIndex(u => u.username === usuario.username);
  if (index !== -1) {
    this.items[index] = { ...usuario }; 
    console.log('Usuário alterado:', usuario);
  }
}

  edit(usuario: any): void {
    this.createForm.patchValue(usuario);
  }

  remove(usuario: any): void {
    console.log('Remover usuário:', usuario);
  }

  resetForm(): void {
    this.createForm.reset();
    this.preview = null;
    this.fileName = null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.fileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

onRowSelected(usuario: any): void {
  this.createForm.patchValue({
    nome: usuario.nome,
    idade: usuario.idade,
    email: usuario.email,
    username: usuario.username,
    password: usuario.password
  });
}
}
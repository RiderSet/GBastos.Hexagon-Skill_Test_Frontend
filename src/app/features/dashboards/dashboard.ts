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
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      nome: ['', Validators.required],
      idade: ['', Validators.required],
      cpf: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      username: ['', Validators.required]
    });

    this.loadUsuarios(); // ✅ carrega registros ao abrir
  }

  loadUsuarios(): void {
    this.authService.getAllUsuarios().subscribe({
      next: (res) => {
        // adapta ao formato real do backend
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
    // Aqui você pode chamar um endpoint de criação, ex: this.authService.register()
    console.log('Novo usuário:', novoUsuario);

    this.resetForm();
    this.loadUsuarios(); // recarrega lista
  }

  edit(usuario: any): void {
    this.createForm.patchValue(usuario); // coloca em evidência no formulário
  }

  remove(usuario: any): void {
    console.log('Remover usuário:', usuario);
    // aqui você pode chamar um endpoint de exclusão
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
    console.log('Selecionado:', usuario);
    this.createForm.patchValue(usuario); // destaca registro no formulário
  }
}

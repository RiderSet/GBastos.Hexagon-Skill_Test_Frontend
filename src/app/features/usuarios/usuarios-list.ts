import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="users-container">
      <h1>Usuários</h1>
      
      @if (isLoading) {
        <p>Carregando...</p>
      } @else if (users.length === 0) {
        <p>Nenhum usuário encontrado</p>
      } @else {
        <table class="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users; track user.id) {
              <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <a [routerLink]="['/users', user.id]">Ver</a>
                  <a [routerLink]="['/users', user.id, 'edit']">Editar</a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [`
    .users-container { padding: 20px; }
    .users-table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; }
    a { margin-right: 10px; }
  `]
})
export class UsersListComponent implements OnInit {
  private readonly userService = inject(UserService);
  
  users: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.isLoading = false;
      }
    });
  }
}
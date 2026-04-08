import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="user-detail-container">
      <a routerLink="/users">← Voltar</a>
      
      @if (isLoading) {
        <p>Carregando...</p>
      } @else if (user) {
        <div class="user-card">
          <h1>{{ user.username }}</h1>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>ID:</strong> {{ user.id }}</p>
          <a [routerLink]="['/users', user.id, 'edit']" class="btn-edit">Editar</a>
        </div>
      } @else {
        <p>Usuário não encontrado</p>
      }
    </div>
  `,
  styles: [`
    .user-detail-container { padding: 20px; }
    .user-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .btn-edit { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; }
  `]
})
export class UserDetailComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  
  user: any;
  isLoading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (data) => {
          this.user = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar usuário:', err);
          this.isLoading = false;
        }
      });
    }
  }
}
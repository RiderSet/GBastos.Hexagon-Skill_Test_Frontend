import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="user-edit-container">
      <a routerLink="/users">← Voltar</a>
      
      @if (isLoading) {
        <p>Carregando...</p>
      } @else {
        <form [formGroup]="form" (ngSubmit)="save()" class="user-form">
          <div class="form-group">
            <label for="username">Usuário</label>
            <input id="username" type="text" formControlName="username" class="form-input" />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" class="form-input" />
          </div>
          
          <button type="submit" [disabled]="form.invalid || isSaving" class="btn-save">
            {{ isSaving ? 'Salvando...' : 'Salvar' }}
          </button>
        </form>
      }
    </div>
  `,
  styles: [`
    .user-edit-container { padding: 20px; max-width: 600px; }
    .user-form { background: white; padding: 20px; border-radius: 8px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .btn-save { padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class UserEditComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  
  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  isLoading = true;
  isSaving = false;
  userId: string | null = null;

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (data) => {
          this.form.patchValue(data);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar usuário:', err);
          this.isLoading = false;
        }
      });
    }
  }

  save(): void {
    if (this.form.invalid || !this.userId) return;
    
    this.isSaving = true;
    this.userService.updateUser(this.userId, this.form.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/users', this.userId]);
      },
      error: (err) => {
        console.error('Erro ao salvar usuário:', err);
        this.isSaving = false;
      }
    });
  }
}
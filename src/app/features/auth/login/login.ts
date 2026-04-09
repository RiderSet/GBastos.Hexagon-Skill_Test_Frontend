import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '@services/storage.service';
import { AuthService, LoginResponse, AuthError } from '@services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  host: { 'class': 'login-wrapper' }
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly authService = inject(AuthService);

  form = this.fb.group({
    username: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)])
  });

  errorMessage = '';
  isLoading = false;
  showPassword = false;

  ngOnInit(): void {
    this.form.statusChanges.subscribe(() => {
      if (this.form.valid) this.errorMessage = '';
    });
  }

  login(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      return;
    }

    const { username, password } = this.form.getRawValue();
    if (!username || !password) {
      this.errorMessage = 'Usuário e senha são obrigatórios';
      return;
    }

    this.isLoading = true;
    console.log('🔐 Enviando login...', { username, password });

    this.authService.login({ username, password }).subscribe({
      next: (res: LoginResponse) => {
        console.log('✅ Login sucesso:', res);

        if (res.token) this.storage.setToken(res.token);
        if (res.refreshToken) this.storage.setItem('refresh_token', res.refreshToken);

        this.form.reset();
        this.router.navigate(['/dashboard']); // ✅ abre dashboard já carregando usuários
      },
      error: (error: AuthError) => {
        console.error('❌ Erro no login:', error);
        this.handleLoginError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleLoginError(error: any): void {
    if (error.status === 401) {
      this.errorMessage = 'Usuário ou senha inválidos';
    } else if (error.status === 0) {
      this.errorMessage = 'Erro de conexão. Verifique sua internet';
    } else if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'Erro ao fazer login. Tente novamente';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}

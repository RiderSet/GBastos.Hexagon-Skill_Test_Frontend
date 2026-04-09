import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, AuthError } from '@services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
  host: {
    'class': 'reset-password-wrapper'
  }
})
export class ResetPasswordComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  errorMessage = '';
  successMessage = '';
  isLoading = false;
  token = '';

  isInvalidToken = false;

  constructor() {
    // Captura o token da URL (ex: /reset-password?token=XYZ)
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();

    if (!password || !confirmPassword) {
      this.errorMessage = 'Senha e confirmação são obrigatórias';
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    this.isLoading = true;

    console.log('🔐 Enviando reset de senha...', { token: this.token, password });

    this.authService.resetPassword(this.token, password).subscribe({
      next: (response: any) => {
        console.log('✅ Senha resetada com sucesso:', response);
        this.successMessage = 'Senha redefinida com sucesso! Faça login novamente.';
        this.form.reset();
        this.router.navigate(['/login']);
      },
      error: (error: AuthError) => {
        console.error('❌ Erro ao resetar senha:', error);
        this.handleResetError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleResetError(error: any): void {
    if (error.status === 400) {
      this.errorMessage = 'Token inválido ou expirado';
      this.isInvalidToken = true;
    } else if (error.status === 0) {
      this.errorMessage = 'Erro de conexão. Verifique sua internet';
    } else if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'Erro ao redefinir senha. Tente novamente';
    }
  }
}
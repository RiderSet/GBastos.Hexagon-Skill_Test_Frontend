import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss']
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordMatchValidator }
  );

  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  token: string | null = null;
  isInvalidToken = false;

  ngOnInit(): void {
    // Obter token da URL
    const tokenParam = this.route.snapshot.paramMap.get('token');
    
    if (!tokenParam) {
      this.isInvalidToken = true;
      this.errorMessage = 'Token inválido ou expirado. Solicite um novo reset de senha.';
      return;
    }

    this.token = tokenParam;
    this.setupErrorClearing();
  }

  private setupErrorClearing(): void {
    this.form.statusChanges.subscribe(() => {
      if (this.form.valid) {
        this.errorMessage = '';
      }
    });
  }

  private passwordMatchValidator(form: any): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.token) {
      this.errorMessage = 'Token inválido. Tente novamente.';
      return;
    }

    if (this.form.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      return;
    }

    if (this.form.hasError('passwordMismatch')) {
      this.errorMessage = 'As senhas não conferem';
      return;
    }

    this.isLoading = true;
    const { password } = this.form.value;

    // ✅ Type guard: password é garantido ser string aqui
    if (!password) {
      this.errorMessage = 'Senha inválida';
      this.isLoading = false;
      return;
    }

    this.authService.resetPassword(this.token, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Senha redefinida com sucesso! Redirecionando para login...';
        this.form.reset();

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.status === 400 || error.status === 404) {
          this.errorMessage = 'Token expirado ou inválido. Solicite um novo reset de senha.';
          this.isInvalidToken = true;
        } else {
          this.errorMessage = error.message || 'Erro ao redefinir senha. Tente novamente.';
        }
      }
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
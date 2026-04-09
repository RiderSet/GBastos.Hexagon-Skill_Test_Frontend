import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthError } from '@services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  ngOnInit(): void {
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

  register(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      return;
    }

    if (this.form.hasError('passwordMismatch')) {
      this.errorMessage = 'As senhas não conferem';
      return;
    }

    this.isLoading = true;

    const { username, email, password } = this.form.getRawValue();

    this.authService.register({ username, password }).subscribe({
      next: (response: any) => {
        console.log('✅ Registro sucesso:', response);
        this.router.navigate(['/login']);
      },
      error: (error: AuthError) => {
        console.error('❌ Erro no registro:', error);
        this.handleRegisterError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  requestReset(): void {
  this.errorMessage = '';
  this.successMessage = '';

  if (this.form.invalid) {
    this.errorMessage = 'Por favor, informe um email válido';
    return;
  }

  const { email } = this.form.getRawValue();
  this.isLoading = true;

  this.authService.forgotPassword(email).subscribe({
    next: (response: any) => {
      console.log('Resposta do backend:', response);
      this.isLoading = false;
      this.successMessage = response?.message || 'Email de recuperação enviado!';
      this.form.reset();
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    },
    error: (error: AuthError) => {
      this.isLoading = false;
      this.errorMessage = error?.message || 'Erro ao solicitar recuperação de senha. Tente novamente.';
    }
  });
}

  goToRegister(): void {
  this.router.navigate(['/register']);
}

  private handleRegisterError(error: AuthError): void {
    if (error.status === 409) {
      this.errorMessage = 'Já existe um usuário com este nome ou email';
    } else if (error.status === 0) {
      this.errorMessage = 'Erro de conexão. Verifique sua internet';
    } else if (error.message) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'Erro ao registrar. Tente novamente';
    }
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
}
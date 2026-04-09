import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthError } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
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

    // ✅ Ajuste: passa objeto, não múltiplos argumentos
    this.authService.register({ username, password }).subscribe({
      next: (res: any) => {
        console.log('✅ Registro sucesso:', res);
        this.router.navigate(['/login']);
      },
      error: (err: AuthError) => {
        console.error('❌ Erro no registro:', err);
        this.handleRegisterError(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleRegisterError(error: any): void {
    if (error.status === 409) {
      this.errorMessage = 'Já existe um usuário com este nome ou CPF';
    } else if (error.status === 0) {
      this.errorMessage = 'Erro de conexão. Verifique sua internet';
    } else if (error.error?.message) {
      this.errorMessage = error.error.message;
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

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  ngOnInit(): void {
    this.setupMessageClearing();
  }

  private setupMessageClearing(): void {
    this.form.statusChanges.subscribe(() => {
      if (this.form.valid) {
        this.errorMessage = '';
      }
    });
  }

  requestReset(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Por favor, digite um email válido';
      return;
    }

    this.isLoading = true;
    const { email } = this.form.value;

    // ✅ Type guard: email é garantido ser string aqui
    if (!email) {
      this.errorMessage = 'Email inválido';
      this.isLoading = false;
      return;
    }

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Email de recuperação enviado! Verifique sua caixa de entrada.';
        this.form.reset();
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erro ao solicitar recuperação de senha. Tente novamente.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
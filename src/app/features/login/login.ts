import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  errorMessage = '';

  login() {
    if (this.form.invalid) {
      this.errorMessage = 'Preencha todos os campos';
      return;
    }

    // Simulação de login bem-sucedido
    localStorage.setItem('auth_token', 'fake-token');
    this.router.navigate(['/dashboard']);
  }
}

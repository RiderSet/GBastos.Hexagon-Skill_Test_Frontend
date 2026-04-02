import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  template: `
  <div class="login-container">

    <form [formGroup]="form" (ngSubmit)="login()" class="login-form">

      <h2>Login</h2>

<input
  type="text"
  placeholder="Usuário"
  formControlName="loginUser"
  autocomplete="off"
  aria-label="Usuário"
/>

<input
  type="password"
  placeholder="Senha"
  formControlName="loginPass"
  autocomplete="off"
  aria-label="Senha"
/>

      <button type="submit" [disabled]="form.invalid || loading()">
        {{ loading() ? 'Entrando...' : 'Entrar' }}
      </button>

    </form>

  </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f5f5;
    }

    .login-form {
      width: 300px;
      padding: 30px;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,.1);
      display: flex;
      flex-direction: column;
      gap: 10px;
      border-radius: 8px;
    }

    input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 10px;
      background: #1976d2;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }

    button:disabled {
      background: #ccc;
    }
  `]
})
export class LoginComponent {

  loading = signal(false);

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.nonNullable.group({
      loginUser: ['', Validators.required],
      loginPass: ['', Validators.required]
    });
  }

login() {
  const { username, password } = this.form.value;

  fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    if (!res.ok) throw new Error("Usuário ou senha inválidos de novo!");
    return res.json();
  })
  .then(data => {
    alert(data.message);
    localStorage.setItem("token", data.token);
    this.router.navigate(['/dashboard']);
  })
  .catch(err => alert(err.message));
}
}

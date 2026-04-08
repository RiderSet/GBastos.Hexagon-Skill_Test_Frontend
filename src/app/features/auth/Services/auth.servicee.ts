import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '@services/storage.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface AuthError {
  status: number;
  message: string;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage: StorageService = inject(StorageService);  // ✅ Type assertion
  private readonly router = inject(Router);

  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'auth_token' as const;
  private readonly REFRESH_TOKEN_KEY = 'refresh_token' as const;
  private readonly USER_KEY = 'current_user' as const;
  private readonly REQUEST_TIMEOUT = 10000;

  /**
   * Realiza login com username e password
   */
  login(username: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = { username, password };

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, request).pipe(
      timeout(this.REQUEST_TIMEOUT),
      tap((response) => {
        this.storeTokens(response);
        this.storeUser(response.user);
      }),
      catchError((error) => {
        return throwError(() => this.formatError(error));
      })
    );
  }

  /**
   * Realiza logout
   */
  logout(): void {
    this.http.post(`${this.API_URL}/logout`, {}).subscribe({
      error: (err) => console.error('Erro ao fazer logout no servidor:', err)
    });

    this.clearTokens();
    this.clearUser();
    this.router.navigate(['/login']);
  }

  /**
   * Realiza refresh do token
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('Refresh token não disponível'));
    }

    return this.http.post<LoginResponse>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      timeout(this.REQUEST_TIMEOUT),
      tap((response) => {
        this.storeTokens(response);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => this.formatError(error));
      })
    );
  }

  /**
   * Registra novo usuário
   */
  register(username: string, email: string, password: string): Observable<LoginResponse> {
    const request = { username, email, password };

    return this.http.post<LoginResponse>(`${this.API_URL}/register`, request).pipe(
      timeout(this.REQUEST_TIMEOUT),
      tap((response) => {
        this.storeTokens(response);
        this.storeUser(response.user);
      }),
      catchError((error) => {
        return throwError(() => this.formatError(error));
      })
    );
  }

  /**
   * Solicita reset de senha
   */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/forgot-password`, { email }).pipe(
      timeout(this.REQUEST_TIMEOUT),
      catchError((error) => {
        return throwError(() => this.formatError(error));
      })
    );
  }

  /**
   * Reset de senha com token
   */
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/reset-password`, { token, newPassword }).pipe(
      timeout(this.REQUEST_TIMEOUT),
      catchError((error) => {
        return throwError(() => this.formatError(error));
      })
    );
  }

  /**
   * Obtém o token de autenticação
   */
  getToken(): string | null {
    return this.storage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtém o refresh token (público para uso no interceptador)
   */
  getRefreshToken(): string | null {
    return this.storage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Verifica se o token está expirado (decodifica JWT)
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      const payload = JSON.parse(atob(parts[1]));
      const expirationTime = payload.exp * 1000;
      
      // Buffer de 60 segundos
      return Date.now() >= (expirationTime - 60000);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return true;
    }
  }

  /**
   * Obtém dados do usuário armazenado
   */
  getCurrentUser(): any {
    const userJson = this.storage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Armazena tokens
   */
  private storeTokens(response: LoginResponse): void {
    if (response.token) {
      this.storage.setItem(this.TOKEN_KEY, response.token);
    }
    if (response.refreshToken) {
      this.storage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    }
  }

  /**
   * Armazena dados do usuário
   */
  private storeUser(user: any): void {
    if (user) {
      this.storage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Limpa tokens
   */
  private clearTokens(): void {
    this.storage.removeItem(this.TOKEN_KEY);
    this.storage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Limpa dados do usuário
   */
  private clearUser(): void {
    this.storage.removeItem(this.USER_KEY);
  }

  /**
   * Formata erros padronizados
   */
  private formatError(error: any): AuthError {
    const authError: AuthError = {
      status: error.status || 0,
      message: 'Erro desconhecido'
    };

    if (error.status === 0) {
      authError.message = 'Erro de conexão. Verifique sua internet';
    } else if (error.status === 401) {
      authError.message = 'Usuário ou senha inválidos';
    } else if (error.status === 403) {
      authError.message = 'Acesso negado';
    } else if (error.status === 404) {
      authError.message = 'Usuário não encontrado';
    } else if (error.status === 409) {
      authError.message = 'Usuário ou email já existe';
    } else if (error.status === 422) {
      authError.message = error.error?.message || 'Dados inválidos';
    } else if (error.status >= 500) {
      authError.message = 'Erro no servidor. Tente novamente mais tarde';
    } else if (error.error?.message) {
      authError.message = error.error.message;
    }

    authError.error = error.error;
    return authError;
  }
}
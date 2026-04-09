import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, timeout } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
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
  private readonly API_URL = 'https://localhost:7248/api/auth'; // ajuste conforme seu backend
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_KEY = 'refresh_token';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, request).pipe(
      tap(res => {
        this.setToken(res.token);
        if (res.refreshToken) {
          localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
        }
      }),
      catchError(err => this.handleError(err)),
      timeout(5000)
    );
  }

  // REGISTRO
  register(request: { username: string; password: string; email?: string; cpf?: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/register`, request).pipe(
      tap(res => console.log('✅ Registro sucesso:', res)),
      catchError(err => this.handleError(err)),
      timeout(5000)
    );
  }

  // ESQUECI SENHA
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/forgot-password`, { email }).pipe(
      tap(res => console.log('✅ Solicitação de recuperação enviada:', res)),
      catchError(err => this.handleError(err)),
      timeout(5000)
    );
  }

  // RESETAR SENHA
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/reset-password`, { token, newPassword }).pipe(
      tap(res => console.log('✅ Senha redefinida com sucesso:', res)),
      catchError(err => this.handleError(err)),
      timeout(5000)
    );
  }

  // REFRESH TOKEN
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    return this.http.post<LoginResponse>(`${this.API_URL}/refresh-token`, { refreshToken }).pipe(
      tap(res => {
        if (res.token) {
          this.setToken(res.token);
        }
        if (res.refreshToken) {
          localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  // LOGOUT
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  // VERIFICA SE ESTÁ LOGADO
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  // VERIFICA SE TOKEN EXPIROU
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (e) {
      console.error('Erro ao verificar expiração do token:', e);
      return true;
    }
  }

  // LISTAR USUÁRIOS (para dashboard)
  getAllUsuarios(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getAll?page=${page}&pageSize=${pageSize}`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  // UTILITÁRIOS
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private handleError(err: any): Observable<never> {
    const error: AuthError = {
      status: err.status,
      message: err.error?.message || 'Erro de autenticação',
      error: err.error
    };
    return throwError(() => error);
  }
}
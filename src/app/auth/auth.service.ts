import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:5017/api/auth/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { username, password }).pipe(
      map(res => {
        localStorage.setItem('token', res.token);
        return res;
      }),
      catchError(err => throwError(() => new Error(err.status === 401 ? 'Usuário ou senha inválidos' : err.message)))
    );
  }

  logout() { localStorage.removeItem('token'); }
  getToken() { return localStorage.getItem('token'); }
  isLoggedIn() { return !!this.getToken(); }
}
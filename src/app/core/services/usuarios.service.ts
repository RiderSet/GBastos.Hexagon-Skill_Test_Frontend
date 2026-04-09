import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://localhost:7248/api/auth';

  // Listar usuários
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getAll`);
  }

  // Buscar por ID
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getById/${id}`);
  }

  // Atualizar
  updateUser(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/update/${id}`, data);
  }

  // Deletar
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/remote/${id}`);
  }

  // Criar usuário
  createUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/create`, data);
  }
}
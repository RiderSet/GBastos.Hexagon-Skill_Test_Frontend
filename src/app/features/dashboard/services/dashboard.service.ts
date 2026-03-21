// src/app/features/dashboard/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private api = 'https://localhost:5017/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(filters?: any): Observable<User[]> {

    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<User[]>(this.api, { params });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  createUsuario(usuario: User): Observable<User> {
    return this.http.post<User>(this.api, usuario);
  }

  updateUsuario(usuario: User): Observable<void> {
    return this.http.put<void>(`${this.api}/${usuario.id}`, usuario);
  }

  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  deleteMany(ids: string[]): Observable<void> {
    return this.http.post<void>(`${this.api}/delete-many`, ids);
  }
}
// src/app/features/dashboard/services/dashboard.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../../shared/models/Usuario.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUsuarios(page = 1, pageSize = 10, search = ''): Observable<any> {
    let url = `${environment.apiUrl}/api/auth/GetAll?page=${page}&pageSize=${pageSize}`;
    if (search) url += `&search=${search}`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  createUsuario(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.apiUrl}/api/auth/Create`, usuario, { headers: this.headers });
  }

  updateUsuario(id: string, usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${environment.apiUrl}/api/auth/Update/${id}`, usuario, { headers: this.headers });
  }

  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/auth/Remote/${id}`, { headers: this.headers });
  }
}
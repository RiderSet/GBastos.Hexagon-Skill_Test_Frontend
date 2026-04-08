import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/users';

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://localhost:5017/api/items';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.baseUrl); }
  update(id: string, data: any) { return this.http.put(`${this.baseUrl}/${id}`, data); }
  delete(id: string) { return this.http.delete(`${this.baseUrl}/${id}`); }
}
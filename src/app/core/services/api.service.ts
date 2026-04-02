import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
<<<<<<< HEAD
  private baseUrl = 'http://localhost:5100/items';
=======
  private baseUrl = 'http://localhost:5100/api/items';
>>>>>>> d69daaf86ccde21b828aa24b756982f8cf5f4e91

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.baseUrl); }
  update(id: string, data: any) { return this.http.put(`${this.baseUrl}/${id}`, data); }
  delete(id: string) { return this.http.delete(`${this.baseUrl}/${id}`); }
}

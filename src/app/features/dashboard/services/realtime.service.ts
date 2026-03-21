// src/app/features/dashboard/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardItem {
  id: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'https://localhost:5017/api/items';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DashboardItem[]> {
    return this.http.get<DashboardItem[]>(this.apiUrl);
  }

  getById(id: number): Observable<DashboardItem> {
    return this.http.get<DashboardItem>(`${this.apiUrl}/${id}`);
  }

  create(item: DashboardItem): Observable<DashboardItem> {
    return this.http.post<DashboardItem>(this.apiUrl, item);
  }

  update(item: DashboardItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${item.id}`, item);
  }

  updateField(id: number, field: string, value: any): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, {
      [field]: value
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(term: string): Observable<DashboardItem[]> {
    return this.http.get<DashboardItem[]>(`${this.apiUrl}?search=${term}`);
  }
}
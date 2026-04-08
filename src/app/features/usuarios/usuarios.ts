import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss']
})
export class UsuariosComponent implements OnInit {

  private readonly http = inject(HttpClient);

  usuarios: any[] = [];
  loading = false;
  error = '';

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.loading = true;

    this.http.get<any[]>(`${environment.apiUrl}/usuarios`)
      .subscribe({
        next: (res) => {
          this.usuarios = res;
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar usuários';
          this.loading = false;
        }
      });
  }
}

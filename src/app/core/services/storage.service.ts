import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';

  private isBrowser = typeof window !== 'undefined' && !!window.localStorage;

  // Salvar token JWT
  setToken(token: string): void {
    this.setItem(this.TOKEN_KEY, token);
  }

  // Recuperar token JWT
  getToken(): string | null {
    return this.getItem(this.TOKEN_KEY);
  }

  // Remover token JWT
  clearToken(): void {
    this.removeItem(this.TOKEN_KEY);
  }

  // Métodos genéricos para outros dados
  setItem(key: string, value: string): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
      }
    }
  }

  getItem(key: string): string | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Erro ao remover do localStorage:', error);
      }
    }
  }

  clear(): void {
    if (this.isBrowser) {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Erro ao limpar localStorage:', error);
      }
    }
  }
}
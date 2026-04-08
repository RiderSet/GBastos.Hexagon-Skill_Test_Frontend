import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private isBrowser = typeof window !== 'undefined' && !!window.localStorage;

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
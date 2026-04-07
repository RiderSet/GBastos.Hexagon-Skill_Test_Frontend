// src/app/shared/models/user.model.ts
export interface UserLogin {
  username: string;
  cpf: string;
  password: string;
}

export interface UsuarioCreateDto {
  nome: string;
  idade: number;
  estadoCivil: string;
  cpf: string;
  cidade: string;
  estado: string;
  username: string;
  password: string;
}

export interface Usuario {
  id: string; // Guid
  nome: string;
  idade: number;
  estadoCivil: string;
  cpf: string;
  cidade: string;
  estado: string;
  username: string;
  passwordHash: string;
}

export interface UsuarioPage {
  total: number;
  page: number;
  pageSize: number;
  data: Usuario[];
}
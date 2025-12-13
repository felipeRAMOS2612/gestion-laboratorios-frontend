export interface Usuario {
  id?: number;
  username: string;
  email: string;
  nombre: string;
  apellido?: string;
  tipoUsuario: 'MEDICO' | 'PACIENTE';
  activo?: boolean;
  telefono?: string;
  direccion?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: Usuario;
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  nombre: string;
  apellido: string;
  tipoUsuario: 'MEDICO' | 'PACIENTE';
}

export interface RecoverPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  nuevaPassword: string;
}
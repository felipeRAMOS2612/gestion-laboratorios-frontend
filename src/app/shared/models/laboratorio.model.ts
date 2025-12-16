export interface Laboratorio {
  id: number;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  direccion?: string;
  capacidadMaxima?: number;
  capacidad?: number;
  estado?: 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO' | 'FUERA_DE_SERVICIO';
  activo?: boolean;
  disponible?: boolean;
  asignacionesActivas?: number;
  especialidad?: string;
  equipamiento?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface TipoAnalisis {
  id: number;
  nombre: string;
  descripcion?: string;
  duracionEstimada?: number;
  costo?: number;
  precio?: number;
  requisitos?: string;
  activo: boolean;
}

export interface Asignacion {
  id: number;
  usuarioId: number;
  nombrePaciente?: string;
  laboratorio: Laboratorio;
  tipoAnalisis: TipoAnalisis;
  fechaHoraInicio: string;
  fechaHoraFin?: string;
  estado: 'PROGRAMADA' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA' | 'REPROGRAMADA';
  observaciones?: string;
  resultados?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface AsignacionRequest {
  usuarioId: number;
  nombrePaciente?: string;
  laboratorioId: number;
  tipoAnalisisId: number;
  fechaHoraInicio: string;
  observaciones?: string;
}
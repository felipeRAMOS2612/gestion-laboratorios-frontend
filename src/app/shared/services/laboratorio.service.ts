import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laboratorio, TipoAnalisis, Asignacion, AsignacionRequest } from '../models/laboratorio.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  private readonly API_URL = environment.laboratoriosApiUrl || 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // Laboratorios
  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.API_URL}/laboratorios`);
  }

  crearLaboratorio(payload: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(`${this.API_URL}/laboratorios`, payload);
  }

  getLaboratoriosDisponibles(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.API_URL}/laboratorios/disponibles`);
  }

  getLaboratorio(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.API_URL}/laboratorios/${id}`);
  }

  // Tipos de análisis
  getTiposAnalisis(): Observable<TipoAnalisis[]> {
    return this.http.get<TipoAnalisis[]>(`${this.API_URL}/tipos-analisis`);
  }

  crearTipoAnalisis(payload: Partial<TipoAnalisis>): Observable<TipoAnalisis> {
    return this.http.post<TipoAnalisis>(`${this.API_URL}/tipos-analisis`, payload);
  }

  getTiposAnalisisActivos(): Observable<TipoAnalisis[]> {
    return this.http.get<TipoAnalisis[]>(`${this.API_URL}/tipos-analisis/activos`);
  }

  getTipoAnalisis(id: number): Observable<TipoAnalisis> {
    return this.http.get<TipoAnalisis>(`${this.API_URL}/tipos-analisis/${id}`);
  }

  // Asignaciones
  getAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.API_URL}/asignaciones`);
  }

  getAsignacionesPorUsuario(usuarioId: number): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.API_URL}/asignaciones/usuario/${usuarioId}`);
  }

  getAsignacionesByUsuario(usuarioId: number): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.API_URL}/asignaciones/usuario/${usuarioId}`);
  }

  getAsignacionesPorLaboratorio(laboratorioId: number): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.API_URL}/asignaciones/laboratorio/${laboratorioId}`);
  }

  getAsignacion(id: number): Observable<Asignacion> {
    return this.http.get<Asignacion>(`${this.API_URL}/asignaciones/${id}`);
  }

  crearAsignacion(asignacion: AsignacionRequest): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${this.API_URL}/asignaciones`, asignacion);
  }

  actualizarAsignacion(id: number, asignacion: Partial<Asignacion>): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.API_URL}/asignaciones/${id}`, asignacion);
  }

  cancelarAsignacion(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/asignaciones/${id}/cancelar`, {});
  }

  iniciarAnalisis(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/asignaciones/${id}/iniciar`, {});
  }

  completarAnalisis(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/asignaciones/${id}/completar`, {});
  }

  // ADMIN: asignación médico <-> laboratorio
  asignarLaboratorioAMedico(medicoId: number, laboratorioId: number): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/medicos/${medicoId}/laboratorios/${laboratorioId}`, {});
  }

  desasignarLaboratorioDeMedico(medicoId: number, laboratorioId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/medicos/${medicoId}/laboratorios/${laboratorioId}`);
  }

  getLaboratoriosDeMedico(medicoId: number): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.API_URL}/medicos/${medicoId}/laboratorios`);
  }
}
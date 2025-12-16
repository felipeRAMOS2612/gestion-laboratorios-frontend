import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, Usuario, RecoverPasswordRequest, ResetPasswordRequest } from '../models/usuario.model';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:8080/api/usuarios';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    // Cargar usuario desde localStorage si existe (solo en el navegador)
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          this.currentUserSubject.next(response.usuario);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/register`, userData);
  }

  createMedicoByAdmin(userData: RegisterRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/admin/medicos`, userData);
  }

  recoverPassword(email: RecoverPasswordRequest): Observable<{mensaje: string; token?: string}> {
    return this.http.post<{mensaje: string; token?: string}>(`${this.API_URL}/recover-password`, email);
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<{mensaje: string}> {
    return this.http.post<{mensaje: string}>(`${this.API_URL}/reset-password`, resetData);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return !!this.getCurrentUser();
    }
    return !!localStorage.getItem('token') && !!this.getCurrentUser();
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  updateProfile(userData: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${userData.id}`, userData);
  }

  updateCurrentUser(user: Usuario): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  isMedico(): boolean {
    const user = this.getCurrentUser();
    return user?.tipoUsuario === 'MEDICO';
  }

  isPaciente(): boolean {
    const user = this.getCurrentUser();
    return user?.tipoUsuario === 'PACIENTE';
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.tipoUsuario === 'ADMIN';
  }
}
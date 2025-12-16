import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LaboratorioService } from '../shared/services/laboratorio.service';
import { AuthService } from '../shared/services/auth.service';
import { Asignacion } from '../shared/models/laboratorio.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.css'
})
export class ResultListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  asignaciones: Asignacion[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private laboratorioService: LaboratorioService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUserAssignments();
  }

  loadUserAssignments() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Usuario no autenticado';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();
    this.laboratorioService.getAsignacionesByUsuario(currentUser.id!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (asignaciones) => {
        this.asignaciones = asignaciones.sort((a, b) => 
          new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime()
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las asignaciones';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading assignments:', error);
      }
    });
  }

  getStatusClass(estado: string): string {
    switch (estado) {
      case 'COMPLETADA': return 'status-completed';
      case 'EN_PROGRESO': return 'status-processing';
      case 'PROGRAMADA': return 'status-pending';
      case 'CANCELADA': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusLabel(estado: string): string {
    switch (estado) {
      case 'COMPLETADA': return 'Completado';
      case 'EN_PROGRESO': return 'En Proceso';
      case 'PROGRAMADA': return 'Programado';
      case 'CANCELADA': return 'Cancelado';
      default: return estado;
    }
  }

  downloadResult(asignacion: Asignacion) {
    if (asignacion.estado === 'COMPLETADA') {
      // Simulate file download
      alert(`Descargando resultados de ${asignacion.tipoAnalisis.nombre}`);
    }
  }

  canDownload(asignacion: Asignacion): boolean {
    return asignacion.estado === 'COMPLETADA';
  }
}

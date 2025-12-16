import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LaboratorioService } from '../shared/services/laboratorio.service';
import { AuthService } from '../shared/services/auth.service';
import { Laboratorio, TipoAnalisis, Asignacion, AsignacionRequest } from '../shared/models/laboratorio.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-lab-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './lab-list.component.html',
  styleUrl: './lab-list.component.css'
})
export class LabListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  laboratorios: Laboratorio[] = [];
  tiposAnalisis: TipoAnalisis[] = [];
  loadingLabs = false;
  loadingAssignment = false;
  pageErrorMessage = '';
  assignmentErrorMessage = '';
  assignmentSuccessMessage = '';
  selectedLaboratorio: Laboratorio | null = null;
  showAssignmentModal = false;
  assignmentForm: FormGroup;

  constructor(
    private laboratorioService: LaboratorioService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.assignmentForm = this.fb.group({
      tipoAnalisisId: ['', Validators.required],
      fechaHoraInicio: ['', Validators.required],
      observaciones: ['']
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isLaboratorioDisponible(lab: Laboratorio): boolean {
    if (typeof lab.disponible === 'boolean') return lab.disponible;
    if (typeof lab.activo === 'boolean') return lab.activo;
    if (lab.estado) return lab.estado === 'DISPONIBLE';
    return false;
  }

  getCapacidadLabel(lab: Laboratorio): string {
    const capacidad = lab.capacidadMaxima ?? lab.capacidad;
    return typeof capacidad === 'number' ? String(capacidad) : 'No definida';
  }

  ngOnInit() {
    this.loadLaboratorios();
    this.loadTiposAnalisis();
  }

  loadLaboratorios() {
    this.loadingLabs = true;
    this.pageErrorMessage = '';
    this.laboratorioService.getLaboratorios().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (labs) => {
        this.laboratorios = labs;
        this.loadingLabs = false;
      },
      error: (error) => {
        this.pageErrorMessage = 'Error al cargar laboratorios';
        this.loadingLabs = false;
        console.error('Error loading labs:', error);
      }
    });
  }

  loadTiposAnalisis() {
    this.laboratorioService.getTiposAnalisis().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (tipos) => {
        this.tiposAnalisis = tipos;
      },
      error: (error) => {
        console.error('Error loading analysis types:', error);
      }
    });
  }

  openAssignmentModal(laboratorio: Laboratorio) {
    this.selectedLaboratorio = laboratorio;
    this.showAssignmentModal = true;
    this.assignmentForm.reset();
    this.assignmentErrorMessage = '';
    this.assignmentSuccessMessage = '';
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().slice(0, 16);
    
    // Espera al render del modal antes de buscar el input
    setTimeout(() => {
      const dateInput = document.getElementById('fechaHoraInicio') as HTMLInputElement | null;
      if (dateInput) dateInput.min = minDate;
    }, 0);
  }

  closeAssignmentModal() {
    this.showAssignmentModal = false;
    this.selectedLaboratorio = null;
    this.assignmentForm.reset();
    this.assignmentErrorMessage = '';
    this.assignmentSuccessMessage = '';
  }

  submitAssignment() {
    if (this.assignmentForm.valid && this.selectedLaboratorio) {
      this.loadingAssignment = true;
      this.assignmentErrorMessage = '';
      this.assignmentSuccessMessage = '';

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.assignmentErrorMessage = 'Usuario no autenticado';
        this.loadingAssignment = false;
        return;
      }

      const assignmentData: AsignacionRequest = {
        usuarioId: currentUser.id!,
        laboratorioId: this.selectedLaboratorio.id,
        tipoAnalisisId: parseInt(this.assignmentForm.value.tipoAnalisisId),
        fechaHoraInicio: this.assignmentForm.value.fechaHoraInicio,
        observaciones: this.assignmentForm.value.observaciones
      };

      this.laboratorioService
        .crearAsignacion(assignmentData)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.loadingAssignment = false;
          })
        )
        .subscribe({
        next: (response) => {
          this.assignmentSuccessMessage = 'Asignación creada exitosamente';
          setTimeout(() => {
            this.closeAssignmentModal();
          }, 2000);
        },
        error: (error) => {
          this.assignmentErrorMessage = error.error?.message || 'Error al crear la asignación';
        }
      });
    }
  }
}

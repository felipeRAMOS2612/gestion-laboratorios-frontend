import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LaboratorioService } from '../shared/services/laboratorio.service';
import { AuthService } from '../shared/services/auth.service';
import { Laboratorio, TipoAnalisis, Asignacion, AsignacionRequest } from '../shared/models/laboratorio.model';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-lab-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './lab-list.component.html',
  styleUrl: './lab-list.component.css'
})
export class LabListComponent implements OnInit {
  laboratorios: Laboratorio[] = [];
  tiposAnalisis: TipoAnalisis[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedLaboratorio: Laboratorio | null = null;
  showAssignmentModal = false;
  assignmentForm: FormGroup;

  constructor(
    private laboratorioService: LaboratorioService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.assignmentForm = this.fb.group({
      tipoAnalisisId: ['', Validators.required],
      fechaHoraInicio: ['', Validators.required],
      observaciones: ['']
    });
  }

  ngOnInit() {
    this.loadLaboratorios();
    this.loadTiposAnalisis();
  }

  loadLaboratorios() {
    this.loading = true;
    this.laboratorioService.getLaboratorios().subscribe({
      next: (labs) => {
        this.laboratorios = labs;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar laboratorios';
        this.loading = false;
        console.error('Error loading labs:', error);
      }
    });
  }

  loadTiposAnalisis() {
    this.laboratorioService.getTiposAnalisis().subscribe({
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
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().slice(0, 16);
    
    const dateInput = document.getElementById('fechaHoraInicio') as HTMLInputElement;
    if (dateInput) {
      dateInput.min = minDate;
    }
  }

  closeAssignmentModal() {
    this.showAssignmentModal = false;
    this.selectedLaboratorio = null;
    this.assignmentForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  submitAssignment() {
    if (this.assignmentForm.valid && this.selectedLaboratorio) {
      this.loading = true;
      this.errorMessage = '';

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.errorMessage = 'Usuario no autenticado';
        this.loading = false;
        return;
      }

      const assignmentData: AsignacionRequest = {
        usuarioId: currentUser.id!,
        laboratorioId: this.selectedLaboratorio.id,
        tipoAnalisisId: parseInt(this.assignmentForm.value.tipoAnalisisId),
        fechaHoraInicio: this.assignmentForm.value.fechaHoraInicio,
        observaciones: this.assignmentForm.value.observaciones
      };

      this.laboratorioService.crearAsignacion(assignmentData).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Asignación creada exitosamente';
          setTimeout(() => {
            this.closeAssignmentModal();
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al crear la asignación';
        }
      });
    }
  }
}

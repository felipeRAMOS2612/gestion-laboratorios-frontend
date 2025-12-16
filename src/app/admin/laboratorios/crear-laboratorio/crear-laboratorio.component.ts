import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LaboratorioService } from '../../../shared/services/laboratorio.service';

const ESTADOS_LABORATORIO = [
  'DISPONIBLE',
  'OCUPADO',
  'MANTENIMIENTO',
  'FUERA_DE_SERVICIO'
] as const;

type EstadoLaboratorio = (typeof ESTADOS_LABORATORIO)[number];

@Component({
  selector: 'app-crear-laboratorio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-laboratorio.component.html',
  styleUrls: ['./crear-laboratorio.component.css']
})
export class CrearLaboratorioComponent {
  readonly estados = ESTADOS_LABORATORIO;

  private readonly fb = inject(FormBuilder);
  private readonly laboratorioService = inject(LaboratorioService);

  loading = false;
  successMessage = '';
  errorMessage = '';

  laboratorioForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(500)]],
    ubicacion: ['', [Validators.required, Validators.maxLength(200)]],
    capacidadMaxima: [null as number | null, [Validators.min(1)]],
    estado: ['DISPONIBLE' as EstadoLaboratorio, [Validators.required]],
    equipamiento: ['', [Validators.maxLength(200)]]
  });

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.laboratorioForm.invalid) {
      this.laboratorioForm.markAllAsTouched();
      return;
    }

    const raw = this.laboratorioForm.getRawValue();
    const nombre = (raw.nombre ?? '').trim();
    const ubicacion = (raw.ubicacion ?? '').trim();
    const estado = (raw.estado ?? 'DISPONIBLE') as EstadoLaboratorio;

    const payload = {
      nombre,
      descripcion: this.emptyToUndefined(raw.descripcion),
      ubicacion,
      capacidadMaxima: raw.capacidadMaxima ?? undefined,
      estado,
      equipamiento: this.emptyToUndefined(raw.equipamiento)
    };

    this.loading = true;
    this.laboratorioService
      .crearLaboratorio(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (created) => {
          this.successMessage = `Laboratorio creado: ${created.nombre}`;
          this.laboratorioForm.reset({
            nombre: '',
            descripcion: '',
            ubicacion: '',
            capacidadMaxima: null,
            estado: 'DISPONIBLE',
            equipamiento: ''
          });
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message ||
            err?.error?.error ||
            'No se pudo crear el laboratorio.';
        }
      });
  }

  private emptyToUndefined(value: string | null | undefined): string | undefined {
    const trimmed = (value ?? '').trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
}

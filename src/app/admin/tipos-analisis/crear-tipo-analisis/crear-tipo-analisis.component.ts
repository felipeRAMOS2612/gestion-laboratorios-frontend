import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LaboratorioService } from '../../../shared/services/laboratorio.service';

@Component({
  selector: 'app-crear-tipo-analisis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-tipo-analisis.component.html',
  styleUrls: ['./crear-tipo-analisis.component.css']
})
export class CrearTipoAnalisisComponent {
  private readonly fb = inject(FormBuilder);
  private readonly laboratorioService = inject(LaboratorioService);

  loading = false;
  successMessage = '';
  errorMessage = '';

  tipoAnalisisForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(500)]],
    duracionEstimada: [null as number | null, [Validators.min(1)]],
    costo: [null as number | null, [Validators.min(0.01)]],
    requisitos: ['', [Validators.maxLength(200)]]
  });

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.tipoAnalisisForm.invalid) {
      this.tipoAnalisisForm.markAllAsTouched();
      return;
    }

    const raw = this.tipoAnalisisForm.getRawValue();
    const nombre = (raw.nombre ?? '').trim();

    const payload = {
      nombre,
      descripcion: this.emptyToUndefined(raw.descripcion),
      duracionEstimada: raw.duracionEstimada ?? undefined,
      costo: raw.costo ?? undefined,
      requisitos: this.emptyToUndefined(raw.requisitos)
    };

    this.loading = true;
    this.laboratorioService
      .crearTipoAnalisis(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (created) => {
          this.successMessage = `Tipo de análisis creado: ${created.nombre}`;
          this.tipoAnalisisForm.reset({
            nombre: '',
            descripcion: '',
            duracionEstimada: null,
            costo: null,
            requisitos: ''
          });
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message ||
            err?.error?.error ||
            'No se pudo crear el tipo de análisis.';
        }
      });
  }

  private emptyToUndefined(value: string | null | undefined): string | undefined {
    const trimmed = (value ?? '').trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
}

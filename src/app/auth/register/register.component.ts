import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { LaboratorioService } from '../../shared/services/laboratorio.service';
import { Laboratorio } from '../../shared/models/laboratorio.model';
import { forkJoin, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  successMessage: string = '';

  adminMode = false;
  loadingLaboratorios = false;
  laboratorios: Laboratorio[] = [];
  selectedLaboratorioIds = new Set<number>();

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService,
    private laboratorioService: LaboratorioService,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tipoUsuario: ['PACIENTE', Validators.required], // Solo PACIENTE (médicos los crea un ADMIN)
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.adminMode = this.route.snapshot.data?.['mode'] === 'admin-medico';

    if (this.adminMode) {
      this.registerForm.get('tipoUsuario')?.setValue('MEDICO');
      this.registerForm.get('tipoUsuario')?.disable();
      this.cargarLaboratorios();
    }
  }

  private cargarLaboratorios(): void {
    this.loadingLaboratorios = true;
    this.laboratorioService.getLaboratorios().subscribe({
      next: (labs) => {
        this.laboratorios = labs ?? [];
        this.loadingLaboratorios = false;
      },
      error: (err) => {
        this.loadingLaboratorios = false;
        this.errorMessage = err?.error?.message || 'No se pudieron cargar los laboratorios.';
      }
    });
  }

  toggleLaboratorio(labId: number, checked: boolean): void {
    if (checked) {
      this.selectedLaboratorioIds.add(labId);
    } else {
      this.selectedLaboratorioIds.delete(labId);
    }
  }

  // Custom validator for password matching
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData: any = { ...this.registerForm.getRawValue() };
      delete formData.confirmPassword;

      if (!this.adminMode) {
        // Seguridad/consistencia: el endpoint público /register siempre debe ser PACIENTE.
        formData.tipoUsuario = 'PACIENTE';
        this.authService.register(formData).subscribe({
          next: () => {
            this.loading = false;
            this.successMessage = 'Usuario registrado exitosamente. Puede iniciar sesión.';
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 1500);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.error?.message || 'Error al registrar usuario. Intente nuevamente.';
          }
        });
        return;
      }

      // ADMIN mode: crear médico y asignar laboratorios seleccionados
      formData.tipoUsuario = 'MEDICO';

      this.authService.createMedicoByAdmin(formData).pipe(
        switchMap((medico) => {
          const medicoId = medico?.id;
          if (!medicoId) {
            return of(medico);
          }

          const laboratorioIds = Array.from(this.selectedLaboratorioIds.values());
          if (laboratorioIds.length === 0) {
            return of(medico);
          }

          return forkJoin(
            laboratorioIds.map((labId) => this.laboratorioService.asignarLaboratorioAMedico(medicoId, labId))
          ).pipe(map(() => medico));
        })
      ).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Médico creado y laboratorios asignados.';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1200);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al crear médico/asignar laboratorios.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, corrija los errores en el formulario.';
    }
  }
}

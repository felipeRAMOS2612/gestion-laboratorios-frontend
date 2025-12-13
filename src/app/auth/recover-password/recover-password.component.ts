import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  recoverForm: FormGroup;
  resetForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  isResetMode: boolean = false;
  token: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Verificar si tenemos un token en la URL
    this.token = this.route.snapshot.queryParams['token'] || '';
    this.isResetMode = !!this.token;

    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: any) {
    const password = group.get('nuevaPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.isResetMode) {
      this.onSubmitReset();
    } else {
      this.onSubmitRecover();
    }
  }

  onSubmitRecover() {
    if (this.recoverForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.recoverPassword(this.recoverForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = response.mensaje;
          this.recoverForm.reset();
          
          // En desarrollo, mostrar el token
          if (response.token) {
            this.successMessage += ` Token de desarrollo: ${response.token}`;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.mensaje || 'Error al enviar la solicitud de recuperación.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, ingrese un email válido.';
    }
  }

  onSubmitReset() {
    if (this.resetForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const resetData = {
        token: this.token,
        nuevaPassword: this.resetForm.get('nuevaPassword')?.value
      };

      this.authService.resetPassword(resetData).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = response.mensaje;
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.mensaje || 'Error al restablecer la contraseña.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete el formulario correctamente.';
    }
  }
}

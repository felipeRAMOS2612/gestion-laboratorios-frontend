import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

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

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tipoUsuario: ['PACIENTE', Validators.required], // Default role
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
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

      const formData = { ...this.registerForm.value };
      delete formData.confirmPassword; // No enviar confirmPassword al backend

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Usuario registrado exitosamente. Puede iniciar sesión.';
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al registrar usuario. Intente nuevamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, corrija los errores en el formulario.';
    }
  }
}

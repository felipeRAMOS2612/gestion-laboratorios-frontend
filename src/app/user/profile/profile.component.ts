import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Usuario } from '../../shared/models/usuario.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  loading = false;
  currentUser: Usuario | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9]{8,15}$')]],
      direccion: [''],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  ngOnInit() {
    // Subscribe to current user
    this.authService.currentUser$.subscribe((user: Usuario | null) => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono || '',
          direccion: user.direccion || '',
          tipoDocumento: user.tipoDocumento,
          numeroDocumento: user.numeroDocumento
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const updateData = {
        ...this.currentUser,
        ...this.profileForm.value
      };

      this.authService.updateProfile(updateData).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Perfil actualizado correctamente.';
          // Update current user in service
          this.authService.updateCurrentUser(response);
          setTimeout(() => this.successMessage = '', 4000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar el perfil. Inténtalo de nuevo.';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      this.profileForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `${fieldName} muy corto`;
      if (field.errors['pattern']) return `${fieldName} inválido`;
    }
    return '';
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  recoverForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.recoverForm.valid) {
      console.log('Recover password for:', this.recoverForm.value);
      // Simulate recovery email sent
      this.successMessage = 'Se ha enviado un enlace de recuperación a su correo.';
      this.errorMessage = '';
      this.recoverForm.reset();
    } else {
      this.errorMessage = 'Por favor, ingrese un correo válido.';
      this.successMessage = '';
    }
  }
}

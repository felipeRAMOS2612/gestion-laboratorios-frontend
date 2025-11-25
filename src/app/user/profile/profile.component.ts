import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]], // Email usually not editable or requires special process
      phone: ['', [Validators.pattern('^[0-9]{9}$')]],
      address: ['']
    });
  }

  ngOnInit() {
    // Mock loading user data
    this.profileForm.patchValue({
      fullName: 'Usuario Ejemplo',
      email: 'usuario@ejemplo.com',
      phone: '987654321',
      address: 'Calle Falsa 123'
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Profile update:', this.profileForm.getRawValue());
      this.successMessage = 'Perfil actualizado correctamente.';
      setTimeout(() => this.successMessage = '', 3000);
    }
  }
}

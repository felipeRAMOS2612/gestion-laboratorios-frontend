import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Result {
  id: number;
  testName: string;
  date: Date;
  status: 'Completado' | 'Pendiente' | 'En Proceso';
  labName: string;
  downloadUrl?: string;
}

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.css'
})
export class ResultListComponent {
  results: Result[] = [
    {
      id: 101,
      testName: 'Hemograma Completo',
      date: new Date('2023-10-15'),
      status: 'Completado',
      labName: 'Laboratorio Central',
      downloadUrl: '#'
    },
    {
      id: 102,
      testName: 'Perfil Lipídico',
      date: new Date('2023-11-01'),
      status: 'En Proceso',
      labName: 'BioTech Solutions'
    },
    {
      id: 103,
      testName: 'Glucosa en Ayunas',
      date: new Date('2023-11-20'),
      status: 'Pendiente',
      labName: 'Salud Integral'
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completado': return 'status-completed';
      case 'En Proceso': return 'status-processing';
      case 'Pendiente': return 'status-pending';
      default: return '';
    }
  }

  downloadResult(id: number) {
    alert(`Descargando resultado ID: ${id}`);
  }
}

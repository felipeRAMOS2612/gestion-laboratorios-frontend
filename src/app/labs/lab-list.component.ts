import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Lab {
  id: number;
  name: string;
  address: string;
  specialty: string;
  image: string;
}

@Component({
  selector: 'app-lab-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lab-list.component.html',
  styleUrl: './lab-list.component.css'
})
export class LabListComponent {
  labs: Lab[] = [
    {
      id: 1,
      name: 'Laboratorio Central',
      address: 'Av. Principal 123',
      specialty: 'Análisis General',
      image: 'https://via.placeholder.com/150?text=Lab+Central'
    },
    {
      id: 2,
      name: 'BioTech Solutions',
      address: 'Calle Innovación 456',
      specialty: 'Genética Molecular',
      image: 'https://via.placeholder.com/150?text=BioTech'
    },
    {
      id: 3,
      name: 'Salud Integral',
      address: 'Plaza Médica 789',
      specialty: 'Hematología',
      image: 'https://via.placeholder.com/150?text=Salud+Integral'
    }
  ];

  scheduleAppointment(labId: number) {
    alert(`Cita agendada en laboratorio ID: ${labId}`);
  }
}

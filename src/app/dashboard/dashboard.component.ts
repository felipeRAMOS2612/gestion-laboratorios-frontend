import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { LaboratorioService } from '../shared/services/laboratorio.service';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { Usuario } from '../shared/models/usuario.model';
import { Asignacion } from '../shared/models/laboratorio.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: Usuario | null = null;
  recentAssignments: Asignacion[] = [];
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private laboratorioService: LaboratorioService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadRecentAssignments();
  }

  loadRecentAssignments(): void {
    if (this.currentUser) {
      this.loading = true;
      this.laboratorioService.getAsignacionesPorUsuario(this.currentUser.id!).subscribe({
        next: (assignments) => {
          this.recentAssignments = assignments.slice(0, 5); // Solo las 5 más recientes
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading assignments:', error);
          this.loading = false;
        }
      });
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}

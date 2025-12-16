import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  user: Usuario | null = null;
  isMenuOpen = false;
  private authSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe((user: Usuario | null) => {
      this.user = user;
      this.isLoggedIn = !!user;

      if (!this.isLoggedIn) {
        this.isMenuOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    if (!this.isLoggedIn) return;
    this.isMenuOpen = !this.isMenuOpen;
  }

  getUserDisplayName(): string {
    if (!this.user) return '';
    return `${this.user.nombre ?? ''} ${this.user.apellido ?? ''}`.trim();
  }

  getRoleDisplayName(): string {
    if (!this.user?.tipoUsuario) return 'Usuario';
    const roleMap: Record<Usuario['tipoUsuario'], string> = {
      ADMIN: 'Admin',
      MEDICO: 'Médico',
      PACIENTE: 'Paciente'
    };
    return roleMap[this.user.tipoUsuario] ?? 'Usuario';
  }

  logout(): void {
    this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/auth/login']);
  }
}
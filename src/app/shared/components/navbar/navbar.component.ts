import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  user: any = null;
  isMenuOpen = false;
  private authSubscription: Subscription | null = null;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication changes
    // this.authSubscription = this.authService.currentUser.subscribe(user => {
    //   this.user = user;
    //   this.isLoggedIn = !!user;
    // });
    
    // Temporary mock data for demonstration
    this.isLoggedIn = true;
    this.user = {
      name: 'Usuario Demo',
      email: 'usuario@lab.com',
      role: 'Administrador'
    };
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getUserInitials(): string {
    if (!this.user?.name) return 'U';
    const names = this.user.name.split(' ');
    return names.length > 1 
      ? names[0][0] + names[1][0] 
      : names[0][0];
  }

  getRoleDisplayName(): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrador',
      'student': 'Estudiante',
      'teacher': 'Docente',
      'technician': 'Técnico'
    };
    return roleMap[this.user?.role] || this.user?.role || 'Usuario';
  }

  logout(): void {
    // this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
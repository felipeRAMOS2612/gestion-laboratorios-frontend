import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './user/profile/profile.component';
import { LabListComponent } from './labs/lab-list.component';
import { ResultListComponent } from './results/result-list.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { CrearLaboratorioComponent } from './admin/laboratorios/crear-laboratorio/crear-laboratorio.component';
import { CrearTipoAnalisisComponent } from './admin/tipos-analisis/crear-tipo-analisis/crear-tipo-analisis.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'recover-password', component: RecoverPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'labs', 
    component: LabListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'results', 
    component: ResultListComponent, 
    canActivate: [AuthGuard] 
  },

  {
    path: 'admin/medicos/nuevo',
    component: RegisterComponent,
    canActivate: [AdminGuard],
    data: { mode: 'admin-medico' }
  },

  {
    path: 'admin/laboratorios/nuevo',
    component: CrearLaboratorioComponent,
    canActivate: [AdminGuard]
  },

  {
    path: 'admin/tipos-analisis/nuevo',
    component: CrearTipoAnalisisComponent,
    canActivate: [AdminGuard]
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];

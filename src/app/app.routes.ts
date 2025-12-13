import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './user/profile/profile.component';
import { LabListComponent } from './labs/lab-list.component';
import { ResultListComponent } from './results/result-list.component';
import { AuthGuard } from './shared/guards/auth.guard';

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
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];

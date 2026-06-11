import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [  
    {
        path: 'login',
        component: LoginComponent
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];

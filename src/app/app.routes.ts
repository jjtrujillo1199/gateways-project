import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [  
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'gateways',
        canActivate: [authGuard],
        loadChildren: () => import('./gateway/gateway.routes')
            .then(m => m.GATEWAY_ROUTES)
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];

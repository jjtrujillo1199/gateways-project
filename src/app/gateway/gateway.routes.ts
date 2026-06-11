import { Routes } from '@angular/router';
import { GatewayListComponent } from './components/gateway-list/gateway-list.component';
import { GatewayDetailComponent } from './components/gateway-detail/gateway-detail.component';
import { GatewayFormComponent } from './components/gateway-form/gateway-form.component';

export const GATEWAY_ROUTES: Routes = [
    { path: '', component: GatewayListComponent },
    { path: 'create', component: GatewayFormComponent },
    { path: ':id', component: GatewayDetailComponent },
    { path: ':id/edit', component: GatewayFormComponent }
];

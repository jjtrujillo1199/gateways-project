import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../common/material.module';
import { GatewayService } from '../../services/gateway.service';
import { AuthService } from '../../../core/services/auth.service';

interface GatewayFilters {
    field: string;
    value: string;
}

@Component({
    standalone: true,
    selector: 'app-gateway-list',
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MaterialModule
    ],
    providers: [GatewayService],
    templateUrl: './gateway-list.component.html',
    styleUrl: './gateway-list.component.scss'
})
export class GatewayListComponent {
    private router      = inject(Router);
    private authService = inject(AuthService);

    service = inject(GatewayService);
    displayedColumns = ['name', 'status', 'type'];

    filters: GatewayFilters = {
        field: 'name',
        value: ''
    };

    ngOnInit() {
        this.service.loadGateways();
    }

    onSearch() {
        const params: any = {};
        if (this.filters.value) {
            params[this.filters.field] = this.filters.value;
        }
        this.service.loadGateways(params);
    }

    clearFilters() {
        this.filters.value = '';
        this.onSearch();
    }
    
    onLogout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../../../common/material.module';
import { GatewayService } from '../../services/gateway.service';
import { GatewayResponseDetail } from '../../models/gateway.model';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    standalone: true,
    selector: 'app-gateway-detail',
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    templateUrl: './gateway-detail.component.html',
    styleUrl: './gateway-detail.component.scss'
})
export class GatewayDetailComponent {
    private service     = inject(GatewayService);
    private route       = inject(ActivatedRoute);
    private router      = inject(Router);
    private authService = inject(AuthService);

    gateway$!: Observable<any>;
    displayedColumns = ['name', 'commissionRate'];

    ngOnInit() {
        this.gateway$ = this.route.paramMap.pipe(
            switchMap(params => this.service.getGateway(params.get('id')!)),
            map((res: GatewayResponseDetail) => res.data)
        );
    }

    onLogout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}

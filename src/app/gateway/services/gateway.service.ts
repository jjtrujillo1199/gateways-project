import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Gateway, GatewayResponse, GatewayResponseList, GatewayResponseDetail } from '../models/gateway.model';
import { GatewayState } from '../state/gateway.state';

@Injectable({
    providedIn: 'root'
})
export class GatewayService {
    private api = inject(ApiService);
    private _state = new GatewayState();

    // getter público para acceder al estado
    get state() {
        return this._state;
    }

    /**
     * Cargar la lista de gateways con parámetros opcionales para filtrado.
     *
     * @param {(Record<string, string | number | boolean>)} [params]
     * @memberof GatewayService
     */
    loadGateways(params?: Record<string, string | number | boolean>) {
        this._state.isLoading.set(true);
        this.api.get<GatewayResponseList>('/gateways', params).subscribe({
            next: res => {
                this._state.items.set(res.data);
                this._state.isLoading.set(false);
            },
            error: () => this._state.isLoading.set(false)
        });
    }

    /**
     * Obtener un gateway por su ID.
     *
     * @param {string} id
     * @return {*} 
     * @memberof GatewayService
     */
    getGateway(id: string) {
        return this.api.get<GatewayResponse>(`/gateways/${id}`);
    }

    /**
     * Crear o actualizar un gateway dependiendo de si tiene ID o no.
     *
     * @param {Gateway} gateway
     * @return {*} 
     * @memberof GatewayService
     */
    saveGateway(gateway: Gateway) {
        if (gateway.id) {
            return this.api.patch(`/gateways/${gateway.id}`, gateway);
        }
        return this.api.post('/gateways', gateway);
    }
}

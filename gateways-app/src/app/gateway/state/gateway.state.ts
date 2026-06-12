import { signal, computed } from '@angular/core';
import { Gateway } from '../models/gateway.model';

export class GatewayState {
    items = signal<Gateway[]>([]);
    isLoading = signal(false);
    filters = signal({ name: '', status: '', type: '' });

    filteredItems = computed(() => {
        const { name, status, type } = this.filters();
        return this.items().filter(g =>
            (!name || g.name.includes(name)) &&
            (!status || g.status === status) &&
            (!type || g.type === type)
        );
    });
}

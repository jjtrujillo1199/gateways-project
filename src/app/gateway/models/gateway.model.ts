export interface PaymentMethod {
    name: string;
    commissionRate: number;
}

export interface Gateway {
    id?: string;
    name: string;
    type: string;
    status: string;
    country?: string;
    commissionRate?: number;
    createdAt?: string;
    paymentMethods: PaymentMethod[];
}

export interface GatewayResponse {
    success: boolean;
    message: string;
    data: Gateway;
}

export interface GatewayResponseList {
    success: boolean;
    message: string;
    data: Gateway[];
}

export interface GatewayResponseDetail {
    success: boolean;
    message: string;
    data: Gateway;
}

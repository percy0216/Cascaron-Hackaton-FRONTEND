// src/types/index.ts

export interface ProductFormData {
    nombre: string;
    precio_venta: string | number;
    costo_unitario: string | number;
    stock_actual: string | number;
    stock_minimo: number;
}

export interface ProductResponse extends ProductFormData {
    id: number;
    odoo_id: number | null;
}

export interface DashboardKPIs {
    ventas_hoy: string;
    ganancia_hoy: string;
    pedidos_hoy: number;
    productos_stock_bajo: number;
    // CAMBIO VITAL:
    low_stock_names: string[]; 
}

export interface SunatStatus {
    estado: string;
    mensaje: string;
}

export interface DashboardResponse {
    kpis: DashboardKPIs;
    sunat: SunatStatus;
}

export interface ChatMessage {
    sender: 'bot' | 'user';
    text: string;
}
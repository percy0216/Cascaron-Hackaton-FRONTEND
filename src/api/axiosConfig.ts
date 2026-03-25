import axios from 'axios';

type SaleType = 'MENOR' | 'MAYOR';

interface DemoProduct {
  id: number;
  nombre: string;
  precio_venta: string;
  costo_unitario: string;
  stock_actual: number;
  stock_minimo: number;
  odoo_id: number | null;
}

interface DemoSale {
  id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: string;
  total: string;
  fecha: string;
  tipo: SaleType;
  odoo_invoice_id: string | null;
}

type ApiResponse<T> = Promise<{ data: T }>;
type ApiClient = {
  get: <T = any>(url: string) => ApiResponse<T>;
  post: <T = any>(url: string, payload?: unknown) => ApiResponse<T>;
  patch: <T = any>(url: string, payload?: unknown) => ApiResponse<T>;
  delete: <T = any>(url: string) => ApiResponse<T>;
};

const DEMO_PRODUCTS_KEY = 'demo_products';
const DEMO_SALES_KEY = 'demo_sales';
const DEMO_LAST_PRODUCT_ID_KEY = 'demo_last_product_id';
const DEMO_LAST_SALE_ID_KEY = 'demo_last_sale_id';
const DEMO_TOKEN_KEY = 'token';

export const DEMO_CREDENTIALS = {
  username: 'demo',
  password: 'demo123',
};

export const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';

const round2 = (value: number) => (Math.round(value * 100) / 100).toFixed(2);

const getTodayIsoDate = () => new Date().toISOString().slice(0, 10);

const parseNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const ensureDemoSeedData = () => {
  const existingProducts = localStorage.getItem(DEMO_PRODUCTS_KEY);
  const existingSales = localStorage.getItem(DEMO_SALES_KEY);

  if (!existingProducts) {
    const seedProducts: DemoProduct[] = [
      {
        id: 1,
        nombre: 'Laptop Lenovo IdeaPad',
        precio_venta: '2499.00',
        costo_unitario: '1890.00',
        stock_actual: 12,
        stock_minimo: 5,
        odoo_id: 3401,
      },
      {
        id: 2,
        nombre: 'Monitor Samsung 24"',
        precio_venta: '699.00',
        costo_unitario: '490.00',
        stock_actual: 8,
        stock_minimo: 4,
        odoo_id: 3402,
      },
      {
        id: 3,
        nombre: 'Teclado Mecanico RGB',
        precio_venta: '229.00',
        costo_unitario: '140.00',
        stock_actual: 20,
        stock_minimo: 6,
        odoo_id: null,
      },
    ];
    localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(seedProducts));
    localStorage.setItem(DEMO_LAST_PRODUCT_ID_KEY, String(seedProducts.length));
  }

  if (!existingSales) {
    const now = new Date();
    const seedSales: DemoSale[] = [
      {
        id: 1,
        producto_nombre: 'Laptop Lenovo IdeaPad',
        cantidad: 1,
        precio_unitario: '2499.00',
        total: '2499.00',
        fecha: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
        tipo: 'MENOR',
        odoo_invoice_id: '9001',
      },
      {
        id: 2,
        producto_nombre: 'Monitor Samsung 24"',
        cantidad: 2,
        precio_unitario: '699.00',
        total: '1328.10',
        fecha: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        tipo: 'MAYOR',
        odoo_invoice_id: '9002',
      },
    ];
    localStorage.setItem(DEMO_SALES_KEY, JSON.stringify(seedSales));
    localStorage.setItem(DEMO_LAST_SALE_ID_KEY, String(seedSales.length));
  }
};

export const resetDemoData = () => {
  localStorage.removeItem(DEMO_PRODUCTS_KEY);
  localStorage.removeItem(DEMO_SALES_KEY);
  localStorage.removeItem(DEMO_LAST_PRODUCT_ID_KEY);
  localStorage.removeItem(DEMO_LAST_SALE_ID_KEY);
  localStorage.removeItem(DEMO_TOKEN_KEY);
  ensureDemoSeedData();
};

const readProducts = (): DemoProduct[] => JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
const writeProducts = (products: DemoProduct[]) => localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products));
const readSales = (): DemoSale[] => JSON.parse(localStorage.getItem(DEMO_SALES_KEY) || '[]');
const writeSales = (sales: DemoSale[]) => localStorage.setItem(DEMO_SALES_KEY, JSON.stringify(sales));

const nextId = (storageKey: string) => {
  const current = parseNumber(localStorage.getItem(storageKey), 0);
  const next = current + 1;
  localStorage.setItem(storageKey, String(next));
  return next;
};

const endpoint = (url: string) => url.replace(/^\/+|\/+$/g, '');

const throwHttpError = (message: string) => Promise.reject(new Error(message));

const buildDemoChatReply = (message: string) => {
  const text = message.toLowerCase();
  if (text.includes('impuesto') || text.includes('sunat')) {
    return 'Para esta demo, te recomiendo reservar entre **18% y 30%** de tus ingresos para obligaciones tributarias y revisar tu flujo semanal.';
  }
  if (text.includes('deuda')) {
    return 'No se detectan alertas criticas en modo demo. Puedes revisar tu estado tributario en el panel del dashboard.';
  }
  if (text.includes('stock')) {
    return 'Revisa productos con stock bajo en el dashboard. Te sugiero reponer antes de llegar al stock minimo.';
  }
  if (text.includes('venta')) {
    return 'Tus ventas del dia se actualizan automaticamente al registrar transacciones en Inventario.';
  }
  return 'Estoy en modo demo. Puedo ayudarte con **impuestos**, **ventas** y **alertas de stock**.';
};

const demoApi: ApiClient = {
  async get<T = unknown>(url: string) {
    ensureDemoSeedData();
    const path = endpoint(url);

    if (path === 'productos') {
      return { data: readProducts() as T };
    }

    if (path === 'ventas') {
      const sales = readSales().sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));
      return { data: sales as T };
    }

    if (path === 'dashboard') {
      const sales = readSales();
      const products = readProducts();
      const today = getTodayIsoDate();
      const salesToday = sales.filter((s) => s.fecha.slice(0, 10) === today);

      const ventasHoyNumber = salesToday.reduce((acc, s) => acc + parseNumber(s.total), 0);
      const gananciaHoyNumber = salesToday.reduce((acc, s) => {
        const product = products.find((p) => p.nombre === s.producto_nombre);
        const cost = parseNumber(product?.costo_unitario, 0);
        return acc + (parseNumber(s.total) - cost * s.cantidad);
      }, 0);
      const lowStock = products.filter((p) => p.stock_actual <= p.stock_minimo);

      return {
        data: {
          kpis: {
            ventas_hoy: `S/ ${round2(ventasHoyNumber)}`,
            ganancia_hoy: `S/ ${round2(gananciaHoyNumber)}`,
            pedidos_hoy: salesToday.length,
            productos_stock_bajo: lowStock.length,
            low_stock_names: lowStock.map((p) => p.nombre),
          },
          sunat: {
            estado: 'ESTADO NORMAL',
            mensaje: 'Modo demo activo. Todo en regla para presentacion comercial.',
          },
        } as T,
      };
    }

    return throwHttpError(`Endpoint GET no soportado en demo: ${url}`);
  },

  async post<T = unknown>(url: string, payload?: unknown) {
    ensureDemoSeedData();
    const path = endpoint(url);

    if (path === 'login') {
      const body = (payload || {}) as { username?: string; password?: string };
      if (
        body.username !== DEMO_CREDENTIALS.username ||
        body.password !== DEMO_CREDENTIALS.password
      ) {
        return throwHttpError('Credenciales demo invalidas');
      }
      return { data: { token: 'demo-token' } as T };
    }

    if (path === 'productos') {
      const body = (payload || {}) as Partial<DemoProduct>;
      const products = readProducts();
      const newProduct: DemoProduct = {
        id: nextId(DEMO_LAST_PRODUCT_ID_KEY),
        nombre: String(body.nombre || 'Producto demo'),
        precio_venta: round2(parseNumber(body.precio_venta)),
        costo_unitario: round2(parseNumber(body.costo_unitario)),
        stock_actual: parseNumber(body.stock_actual),
        stock_minimo: parseNumber(body.stock_minimo, 5),
        odoo_id: Math.floor(5000 + Math.random() * 4000),
      };
      products.push(newProduct);
      writeProducts(products);
      return { data: newProduct as T };
    }

    if (path === 'vender') {
      const body = (payload || {}) as { producto_id?: number; cantidad?: number; tipo?: SaleType };
      const products = readProducts();
      const sales = readSales();
      const product = products.find((p) => p.id === Number(body.producto_id));

      if (!product) return throwHttpError('Producto no encontrado');
      const cantidad = parseNumber(body.cantidad, 0);
      if (cantidad <= 0) return throwHttpError('Cantidad invalida');
      if (product.stock_actual < cantidad) return throwHttpError('Stock insuficiente');

      product.stock_actual -= cantidad;
      writeProducts(products);

      const tipo: SaleType = body.tipo === 'MAYOR' ? 'MAYOR' : 'MENOR';
      const price = parseNumber(product.precio_venta);
      const subtotal = price * cantidad;
      const total = tipo === 'MAYOR' ? subtotal * 0.95 : subtotal;

      const sale: DemoSale = {
        id: nextId(DEMO_LAST_SALE_ID_KEY),
        producto_nombre: product.nombre,
        cantidad,
        precio_unitario: round2(price),
        total: round2(total),
        fecha: new Date().toISOString(),
        tipo,
        odoo_invoice_id: String(Math.floor(9000 + Math.random() * 500)),
      };

      sales.push(sale);
      writeSales(sales);
      return { data: sale as T };
    }

    if (path === 'chat') {
      const body = (payload || {}) as { mensaje?: string };
      const reply = buildDemoChatReply(body.mensaje || '');
      return { data: { bot_response: reply } as T };
    }

    return throwHttpError(`Endpoint POST no soportado en demo: ${url}`);
  },

  async patch<T = unknown>(url: string, payload?: unknown) {
    ensureDemoSeedData();
    const path = endpoint(url);
    const match = path.match(/^productos\/(\d+)$/);
    if (!match) return throwHttpError(`Endpoint PATCH no soportado en demo: ${url}`);

    const id = Number(match[1]);
    const body = (payload || {}) as { stock_actual?: number };
    const products = readProducts();
    const product = products.find((p) => p.id === id);
    if (!product) return throwHttpError('Producto no encontrado');

    product.stock_actual = parseNumber(body.stock_actual, product.stock_actual);
    writeProducts(products);
    return { data: product as T };
  },

  async delete<T = unknown>(url: string) {
    ensureDemoSeedData();
    const path = endpoint(url);
    const match = path.match(/^productos\/(\d+)$/);
    if (!match) return throwHttpError(`Endpoint DELETE no soportado en demo: ${url}`);

    const id = Number(match[1]);
    const products = readProducts();
    const filtered = products.filter((p) => p.id !== id);
    writeProducts(filtered);
    return { data: { ok: true } as T };
  },
};

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const backendApi = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const api: ApiClient = isDemoMode ? demoApi : (backendApi as unknown as ApiClient);

export default api;
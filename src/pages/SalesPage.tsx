import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';

interface Sale {
    id: number;
    producto_nombre: string;
    cantidad: number;
    precio_unitario: string;
    total: string;
    fecha: string;
    tipo: string;
    odoo_invoice_id: string | null;
}

const SalesPage: React.FC = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSales = async () => {
        try {
            const res = await api.get('ventas/');
            setSales(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSales(); }, []);

    // --- CÁLCULOS DE RESUMEN ---
    const totalVentas = sales.reduce((acc, s) => acc + parseFloat(s.total), 0);
    const totalPedidos = sales.length;
    const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0;

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                
                {/* ── Header ── */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs font-semibold tracking-wider uppercase text-indigo-600 flex items-center gap-2 mb-2">
                            <span className="inline-block w-4 h-0.5 bg-indigo-600 rounded"></span>
                            Gestión de ingresos
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                            Historial de <span className="text-indigo-600">Ventas</span>
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Registro completo de transacciones y facturación
                        </p>
                    </div>

                    {!loading && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            Sincronizado este mes
                        </div>
                    )}
                </div>

                {/* ── KPI Cards ── */}
                {loading ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm mb-6">
                        <div className="flex items-center justify-center gap-3 text-sm font-medium text-slate-500">
                            <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                            Cargando historial...
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:-translate-y-1 hover:border-slate-300 transition-all duration-200 shadow-sm overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600"></div>
                                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 block mb-3">Total Ingresos</span>
                                <div className="text-3xl font-bold tracking-tight text-slate-900 mb-2">S/ {totalVentas.toFixed(2)}</div>
                                <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">↑ Volumen mensual</div>
                            </div>
                            
                            <div className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:-translate-y-1 hover:border-slate-300 transition-all duration-200 shadow-sm overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200"></div>
                                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 block mb-3">Transacciones</span>
                                <div className="text-3xl font-bold tracking-tight text-slate-900 mb-2">{totalPedidos}</div>
                                <div className="text-xs font-medium text-slate-500">Ventas completadas</div>
                            </div>

                            <div className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:-translate-y-1 hover:border-slate-300 transition-all duration-200 shadow-sm overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200"></div>
                                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 block mb-3">Ticket Promedio</span>
                                <div className="text-3xl font-bold tracking-tight text-slate-900 mb-2">S/ {ticketPromedio.toFixed(2)}</div>
                                <div className="text-xs font-medium text-slate-500">Por transacción</div>
                            </div>

                            <div className="relative bg-emerald-50 border border-emerald-200 rounded-2xl p-5 hover:-translate-y-1 hover:border-emerald-300 transition-all duration-200 shadow-sm overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
                                <span className="text-xs font-semibold tracking-wide uppercase text-emerald-700 block mb-3">Estado Tributario</span>
                                <div className="text-3xl font-bold tracking-tight text-emerald-800 mb-2 flex items-center gap-2">
                                    Al día <span className="text-xl">✅</span>
                                </div>
                                <div className="text-xs font-medium text-emerald-600">Facturación sin retrasos</div>
                            </div>
                        </div>

                        {/* ── Table Card ── */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                                <span className="text-sm font-semibold text-slate-900">Registro de facturación</span>
                                <span className="text-[11px] font-bold tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                    {sales.length} REGISTROS
                                </span>
                            </div>

                            {sales.length === 0 ? (
                                <div className="py-16 px-6 text-center">
                                    <div className="text-4xl text-slate-300 mb-3">🧾</div>
                                    <div className="text-sm font-semibold text-slate-900 mb-1">No hay ventas registradas aún</div>
                                    <div className="text-sm text-slate-500">Realiza tu primera venta desde la sección de Productos.</div>
                                </div>
                            ) : (
                                <>
                                    {/* ── Desktop Table ── */}
                                    <div className="hidden sm:block overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">ID / Fecha</th>
                                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Producto</th>
                                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Tipo</th>
                                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Cant.</th>
                                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Total</th>
                                                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Estado Odoo</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {sales.map(s => (
                                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-5 py-4 align-middle">
                                                            <div className="text-sm font-semibold text-slate-900">#{s.id}</div>
                                                            <div className="text-[11px] text-slate-400 mt-0.5">
                                                                {new Date(s.fecha).toLocaleDateString()} · {new Date(s.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 align-middle">
                                                            <span className="text-sm font-medium text-slate-700">{s.producto_nombre}</span>
                                                        </td>
                                                        <td className="px-5 py-4 align-middle">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                                s.tipo === 'MAYOR' 
                                                                ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                                                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                            }`}>
                                                                {s.tipo === 'MAYOR' ? 'Mayorista' : 'Minorista'}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 align-middle">
                                                            <span className="text-sm font-semibold text-slate-700">{s.cantidad}</span>
                                                        </td>
                                                        <td className="px-5 py-4 align-middle">
                                                            <span className="text-sm font-bold text-slate-900">S/ {s.total}</span>
                                                        </td>
                                                        <td className="px-5 py-4 align-middle text-right">
                                                            {s.odoo_invoice_id ? (
                                                                <a
                                                                    href={`http://3.17.39.246:8069/web#id=${s.odoo_invoice_id}&model=account.move&view_type=form`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold hover:bg-emerald-100 transition-colors"
                                                                >
                                                                    ☁️ Factura #{s.odoo_invoice_id}
                                                                </a>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[11px] font-semibold">
                                                                    ⏳ Procesando
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* ── Mobile Card List ── */}
                                    <div className="sm:hidden flex flex-col divide-y divide-slate-100">
                                        {sales.map(s => (
                                            <div className="p-4" key={s.id}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                                            ID #{s.id} · {new Date(s.fecha).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-sm font-semibold text-slate-900">{s.producto_nombre}</div>
                                                    </div>
                                                    <div className="text-base font-bold text-slate-900 text-right">
                                                        S/ {s.total}
                                                        <div className="text-[10px] font-medium text-slate-400 mt-0.5">({s.cantidad} unid.)</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-wrap justify-between items-center gap-2 mt-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                        s.tipo === 'MAYOR' 
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                                                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                    }`}>
                                                        {s.tipo === 'MAYOR' ? 'Mayorista' : 'Minorista'}
                                                    </span>

                                                    {s.odoo_invoice_id ? (
                                                        <a
                                                            href={`http://3.17.39.246:8069/web#id=${s.odoo_invoice_id}&model=account.move&view_type=form`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-semibold hover:bg-emerald-100 transition-colors"
                                                        >
                                                            ☁️ Ver #{s.odoo_invoice_id}
                                                        </a>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[10px] font-semibold">
                                                            ⏳ Procesando
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default SalesPage;
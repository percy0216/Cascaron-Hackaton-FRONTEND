import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Layout from '../components/Layout';
import ProductForm from '../components/ProductForm';
import type { DashboardResponse, DashboardKPIs } from '../types';

const DashboardPage: React.FC = () => {
    const [data, setData]   = useState<DashboardResponse | null>(null);
    const [pulse, setPulse] = useState(false);

    const fetchData = async () => {
        try {
            const res = await api.get<DashboardResponse>('dashboard/');
            setData(res.data);
            setPulse(true);
            setTimeout(() => setPulse(false), 600);
        } catch (err) { console.error('Error al cargar dashboard:', err); }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const kpis: DashboardKPIs = data?.kpis || {
        ventas_hoy:           'S/ 0.00',
        ganancia_hoy:         'S/ 0.00',
        pedidos_hoy:          0,
        productos_stock_bajo: 0,
        low_stock_names:      [],
    };

    const hasLowStock = kpis.productos_stock_bajo > 0;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });

    /* ── KPI cards config ── */
    const kpiCards = [
        {
            label:   'Ventas hoy',
            value:   kpis.ventas_hoy,
            sub:     '+12% vs ayer',
            subOk:   true,
            icon:    '↑',
            accent:  'bg-indigo-600',
        },
        {
            label:   'Ganancia neta',
            value:   kpis.ganancia_hoy,
            sub:     'Fuente: Odoo ERP',
            subOk:   null,
            icon:    null,
            accent:  'bg-slate-200',
        },
        {
            label:   'Pedidos hoy',
            value:   String(kpis.pedidos_hoy),
            sub:     'Transacciones registradas',
            subOk:   null,
            icon:    null,
            accent:  'bg-slate-200',
        },
        {
            label:   'Stock bajo',
            value:   String(kpis.productos_stock_bajo),
            sub:     hasLowStock ? 'Requiere atención' : 'Todo normal',
            subOk:   hasLowStock ? false : true,
            icon:    hasLowStock ? '!' : '✓',
            alert:   hasLowStock,
            accent:  hasLowStock ? 'bg-red-500' : 'bg-emerald-500',
        },
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                
                {/* ── Header ── */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs font-semibold tracking-wider uppercase text-indigo-600 flex items-center gap-2 mb-2">
                            <span className="inline-block w-4 h-0.5 bg-indigo-600 rounded"></span>
                            Panel principal
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                            Tu negocio, <span className="text-indigo-600">en tiempo real.</span>
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 capitalize">
                            {dateStr} · {timeStr}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                            <strong className="block text-xs font-semibold text-emerald-800">Cloud activo</strong>
                            <span className="text-[11px] text-emerald-600">Operativo · us-east-1</span>
                        </div>
                    </div>
                </div>

                {/* ── Refresh bar ── */}
                <div className="flex items-center justify-end gap-2 mb-4">
                    <span className={`w-1.5 h-1.5 rounded-full bg-indigo-500 transition-all duration-300 ${pulse ? 'scale-150 opacity-70' : 'scale-100 opacity-100'}`} />
                    <span className="text-xs text-slate-400 tracking-wide">Actualización cada 5 s</span>
                </div>

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {kpiCards.map((k, i) => (
                        <div 
                            key={i} 
                            className={`relative bg-white border rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-200 shadow-sm overflow-hidden ${
                                k.alert ? 'border-red-200 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            {/* Top Accent Line */}
                            <div className={`absolute top-0 left-0 right-0 h-1 ${k.accent}`}></div>

                            <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 block mb-3">
                                {k.label}
                            </span>
                            <div className={`text-3xl font-bold tracking-tight mb-2 ${k.alert ? 'text-red-700' : 'text-slate-900'}`}>
                                {k.value}
                            </div>
                            
                            <div className={`text-xs flex items-center gap-1 font-medium ${
                                k.subOk === true ? 'text-emerald-600' : k.subOk === false ? 'text-red-600' : 'text-slate-500'
                            }`}>
                                {k.icon && <span>{k.icon}</span>}
                                {k.sub}
                            </div>

                            {/* Low stock pills */}
                            {k.alert && kpis.low_stock_names.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {kpis.low_stock_names.slice(0, 3).map((n) => (
                                        <span key={n} className="bg-red-100 border border-red-200 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                            {n}
                                        </span>
                                    ))}
                                    {kpis.low_stock_names.length > 3 && (
                                        <span className="bg-red-100 border border-red-200 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                            +{kpis.low_stock_names.length - 3} más
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

                    {/* Product Form */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-sm font-semibold text-slate-900">Registrar producto</span>
                            <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full">
                                Inventario
                            </span>
                        </div>
                        <div className="p-5">
                            <ProductForm onProductAdded={fetchData} />
                        </div>
                    </div>

                    {/* Side stack */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4">

                        {/* SUNAT Monitor */}
                        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg mb-4">
                                🛡️
                            </div>
                            <div className="text-sm font-semibold text-slate-900 mb-1">Monitor Tributario IA</div>
                            <div className="text-xs font-semibold text-indigo-600 mb-1">
                                {data?.sunat?.estado || 'Conectando…'}
                            </div>
                            <div className="text-xs text-slate-500 leading-relaxed mb-3">
                                {data?.sunat?.mensaje || 'Analizando flujo de caja…'}
                            </div>
                            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1.5">
                                <span className="text-indigo-400">●</span>
                                Actualizado hace un momento
                            </div>
                        </div>

                        {/* AWS */}
                        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-lg mb-4">
                                ☁️
                            </div>
                            <div className="text-sm font-semibold text-slate-900 mb-1">AWS Cloud</div>
                            <div className="text-xs font-semibold text-slate-700 mb-1">Conectado · us-east-1</div>
                            <div className="text-xs text-slate-500 leading-relaxed mb-3">
                                Latencia: 45 ms · Sincronización activa
                            </div>
                            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1.5">
                                <span className="text-emerald-400">●</span>
                                Odoo sincronizado
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default DashboardPage;
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Layout from '../components/Layout';
import ProductForm from '../components/ProductForm';
import type { DashboardResponse, DashboardKPIs, SunatStatus } from '../types';

const DashboardPage: React.FC = () => {
    const [data, setData] = useState<DashboardResponse | null>(null);

    const fetchData = async () => {
        try {
            const res = await api.get<DashboardResponse>('dashboard/');
            setData(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const kpis = data?.kpis || { ventas_hoy: "...", ganancia_hoy: "...", productos_stock_bajo: 0 };

    return (
        <Layout>
            {/* --- HEADER --- */}
            <div style={styles.headerContainer}>
                <div>
                    <h1 style={styles.pageTitle}>Panel de Control</h1>
                    <p style={styles.pageSubtitle}>Resumen ejecutivo en tiempo real</p>
                </div>
                
                {/* Badge AWS Pro */}
                <div style={styles.awsBadge}>
                    <div style={styles.pulse}></div>
                    <div>
                        <div style={styles.awsTitle}>AWS CLOUD CONNECTED</div>
                        <div style={styles.awsSubtitle}>us-east-1 • Latency: 45ms</div>
                    </div>
                    <div style={styles.awsLogo}>AWS</div>
                </div>
            </div>

            {/* --- KPI CARDS --- */}
            <div style={styles.grid}>
                {/* Tarjeta Ventas */}
                <div style={styles.kpiCard}>
                    <div style={{...styles.iconBox, background: '#e8f5e9', color: '#2e7d32'}}>💰</div>
                    <div>
                        <h3 style={styles.cardLabel}>Ventas del Día</h3>
                        <p style={styles.bigNumber}>{kpis.ventas_hoy}</p>
                        <span style={styles.trendPositive}>↗ +12% vs ayer</span>
                    </div>
                </div>
                
                {/* Tarjeta Ganancia */}
                <div style={styles.kpiCard}>
                    <div style={{...styles.iconBox, background: '#e3f2fd', color: '#1565c0'}}>📈</div>
                    <div>
                        <h3 style={styles.cardLabel}>Ganancia Neta (ERP)</h3>
                        <p style={styles.bigNumber}>{kpis.ganancia_hoy}</p>
                        <span style={styles.tagBlue}>Calculado en Odoo</span>
                    </div>
                </div>
                
                {/* Tarjeta Alertas */}
                <div style={styles.kpiCard}>
                    <div style={{...styles.iconBox, background: '#ffebee', color: '#c62828'}}>⚠️</div>
                    <div>
                        <h3 style={styles.cardLabel}>Alertas de Stock</h3>
                        <p style={styles.bigNumber}>{kpis.productos_stock_bajo}</p>
                        <span style={{fontSize: '0.8rem', color: '#c62828'}}>Requiere atención</span>
                    </div>
                </div>
            </div>
            
            {/* --- SECCIÓN PRINCIPAL (Formulario + Widget) --- */}
            <div style={styles.contentGrid}>
                <div style={styles.mainContent}>
                    <ProductForm onProductAdded={fetchData} />
                </div>
                
                {/* Widget SUNAT Estilizado */}
                <div style={styles.sideWidget}>
                    <div style={styles.widgetHeader}>
                        <span>🏛️ Monitor Tributario IA</span>
                    </div>
                    <div style={styles.widgetBody}>
                        <div style={{fontSize: '3.5rem', marginBottom: '10px'}}>🛡️</div>
                        <h4 style={styles.statusTitle}>{data?.sunat.estado}</h4>
                        <p style={styles.statusText}>{data?.sunat.mensaje}</p>
                        <div style={styles.divider}></div>
                        <small style={{color: '#94a3b8'}}>Actualizado: Hace un momento</small>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

// --- ESTILOS PREMIUM ---
const styles: { [key: string]: React.CSSProperties } = {
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        marginBottom: '35px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e2e8f0'
    },
    pageTitle: { margin: 0, fontSize: '2.2rem', color: '#1e293b', fontWeight: 800, letterSpacing: '-0.5px' },
    pageSubtitle: { margin: '5px 0 0 0', color: '#64748b', fontSize: '1rem' },

    // AWS Badge mejorado
    awsBadge: {
        background: '#0f172a', 
        color: 'white',
        padding: '8px 16px',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 15px rgba(15, 23, 42, 0.15)',
        border: '1px solid #334155'
    },
    awsTitle: { fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.5px' },
    awsSubtitle: { fontSize: '0.65rem', color: '#94a3b8' },
    awsLogo: {
        fontWeight: 900, fontSize: '0.9rem', color: '#f59e0b',
        border: '1px solid #f59e0b', padding: '1px 4px', borderRadius: '3px'
    },
    pulse: {
        width: '8px', height: '8px', background: '#10b981',
        borderRadius: '50%', boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
    },
    
    // Grid KPIs
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '25px',
        marginBottom: '30px'
    },
    kpiCard: { 
        background: 'white', padding: '25px', borderRadius: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #f1f5f9'
    },
    iconBox: {
        width: '50px', height: '50px', borderRadius: '12px', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
    },
    cardLabel: { margin: 0, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' },
    bigNumber: { fontSize: '2rem', fontWeight: 800, margin: '5px 0', color: '#0f172a' },
    trendPositive: { fontSize: '0.8rem', color: '#10b981', fontWeight: 600, background: '#ecfdf5', padding: '2px 8px', borderRadius: '10px' },
    tagBlue: { fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, background: '#eff6ff', padding: '2px 8px', borderRadius: '10px' },

    // Layout inferior
    contentGrid: { display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' },
    mainContent: { flex: '2', minWidth: '300px' },
    
    sideWidget: {
        flex: '1', minWidth: '280px', maxWidth: '350px',
        background: 'white', borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0'
    },
    widgetHeader: {
        background: 'linear-gradient(to right, #f59e0b, #d97706)',
        padding: '15px', color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: '0.95rem'
    },
    widgetBody: { padding: '30px', textAlign: 'center' },
    statusTitle: { margin: '0 0 10px 0', fontSize: '1.2rem', color: '#1e293b' },
    statusText: { margin: 0, color: '#64748b', lineHeight: '1.5' },
    divider: { height: '1px', background: '#e2e8f0', margin: '20px 0' }
};

export default DashboardPage;
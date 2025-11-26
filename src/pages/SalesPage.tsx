import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';

interface Sale {
    id: number;
    total_venta: string;
    ganancia_total: string;
    fecha: string | null; // <-- Puede ser nulo
}

const SalesPage = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('ventas/')
            .then(res => setSales(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Si está cargando, muestra el mensaje
    if (loading) return <Layout><h1 style={{color: '#64748b', fontSize: '1.5rem'}}>Cargando Historial de Ventas...</h1></Layout>;

    return (
        <Layout>
            {/* HEADER */}
            <div style={styles.headerContainer}>
                <div>
                    <h1 style={styles.pageTitle}>Historial de Ventas</h1>
                    <p style={styles.pageSubtitle}>Registro de transacciones y flujo de caja</p>
                </div>
                <div style={styles.totalBadge}>
                    Total Ventas: <strong>{sales.length}</strong>
                </div>
            </div>

            {/* LISTA DE TRANSACCIONES */}
            <div style={styles.cardContainer}>
                {sales.length === 0 ? (
                    <div style={styles.emptyState}>No hay ventas registradas. ¡Vende algo primero!</div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.theadRow}>
                                <th style={styles.th}>ID Transacción</th>
                                <th style={styles.th}>Estado</th>
                                <th style={styles.th}>Fecha y Hora</th>
                                <th style={{...styles.th, textAlign: 'right'}}>Monto Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(s => (
                                <tr key={s.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.idBadge}>#{s.id.toString().padStart(6, '0')}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.statusBadge}>Completado</span>
                                    </td>
                                    <td style={styles.td}>
                                        {/* 🚨 CORRECCIÓN: Usamos check condicional para evitar crash de new Date(null) */}
                                        <div style={{color: '#334155', fontWeight: 500}}>
                                            {s.fecha ? new Date(s.fecha).toLocaleDateString() : '—'}
                                        </div>
                                        <div style={{color: '#94a3b8', fontSize: '0.8rem'}}>
                                            {s.fecha ? new Date(s.fecha).toLocaleTimeString() : '—'}
                                        </div>
                                    </td>
                                    <td style={{...styles.td, textAlign: 'right'}}>
                                        <div style={styles.amount}>+ S/ {parseFloat(s.total_venta).toFixed(2)}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
};

// ... (Estilos) ...
const styles: { [key: string]: React.CSSProperties } = {
    headerContainer: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0'
    },
    pageTitle: { margin: 0, fontSize: '1.8rem', color: '#1e293b', fontWeight: 700 },
    pageSubtitle: { margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' },
    totalBadge: { background: '#fff', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', color: '#64748b', fontSize: '0.9rem' },

    cardContainer: {
        background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden', border: '1px solid #f1f5f9'
    },
    
    table: { width: '100%', borderCollapse: 'collapse' },
    theadRow: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    th: { padding: '16px 24px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
    tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' },
    td: { padding: '16px 24px', fontSize: '0.95rem' },

    idBadge: { fontFamily: 'monospace', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', color: '#475569', display: 'inline-block' },
    statusBadge: { background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #bbf7d0' },
    amount: { fontSize: '1.1rem', fontWeight: 700, color: '#16a34a' },
    
    emptyState: { padding: '40px', textAlign: 'center', color: '#94a3b8' }
};

export default SalesPage;
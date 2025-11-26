import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';

interface Product {
    id: number;
    nombre: string;
    precio_venta: string;
    stock_actual: number;
    odoo_id: number | null; // Puede ser nulo
}

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true); // ESTADO DE CARGA INICIAL
    
    // Estados Modal
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [qty, setQty] = useState(1);
    const [saleType, setSaleType] = useState<'MENOR' | 'MAYOR'>('MENOR');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const fetchData = async () => {
        try {
            const res = await api.get('productos/');
            setProducts(res.data);
        } catch (e) { 
            console.error(e);
        } finally {
            setLoading(false); // Termina la carga
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- ACCIONES ---
    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
            await api.delete(`productos/${id}/`);
            fetchData();
        } catch (e) { alert("Error al eliminar"); }
    };

    const handleOpenSale = (prod: Product) => {
        setSelectedProduct(prod);
        setQty(1);
        setSaleType('MENOR');
        setSuccessMsg('');
        setIsModalOpen(true);
    };

    const handleProcessSale = async () => {
        if (!selectedProduct) return;
        try {
            await api.post('vender/', { 
                producto_id: selectedProduct.id,
                cantidad: qty,
                tipo: saleType
            });
            setSuccessMsg(`✅ ¡Venta Exitosa! Sincronizado con ERP.`);
            fetchData();
        } catch (e) { alert("Error: Stock insuficiente"); }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSuccessMsg('');
    };

    // --- CÁLCULOS VISUALES ---
    const precioBase = selectedProduct ? parseFloat(selectedProduct.precio_venta) : 0;
    const subtotal = precioBase * qty;
    const descuento = saleType === 'MAYOR' ? subtotal * 0.05 : 0;
    const totalPagar = subtotal - descuento;
    
    // 🚨 RENDERING CHECK: Muestra estado de carga
    if (loading) return <Layout><h1 style={{color: '#64748b', fontSize: '1.5rem'}}>Cargando Inventario...</h1></Layout>;

    return (
        <Layout>
            {/* HEADER */}
            <div style={styles.headerContainer}>
                <div>
                    <h1 style={styles.pageTitle}>Inventario</h1>
                    <p style={styles.pageSubtitle}>Gestión centralizada de productos y stock</p>
                </div>
                <div style={styles.totalBadge}>
                    Total Productos: <strong>{products.length}</strong>
                </div>
            </div>
            
            {/* TABLA CARD */}
            <div style={styles.tableContainer}>
                {products.length === 0 ? (
                    <p style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>No hay productos. ¡Crea uno!</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.theadRow}>
                                <th style={styles.th}>Producto</th>
                                <th style={styles.th}>Precio Unit.</th>
                                <th style={styles.th}>Stock Físico</th>
                                <th style={styles.th}>Sincronización</th>
                                <th style={{...styles.th, textAlign: 'right'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={{fontWeight: 'bold', color: '#334155'}}>{p.nombre}</div>
                                        <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>ID: {p.id}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.priceTag}>S/ {p.precio_venta}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.stockBadge,
                                            background: p.stock_actual < 10 ? '#fef2f2' : '#f0fdf4',
                                            color: p.stock_actual < 10 ? '#ef4444' : '#16a34a',
                                            border: p.stock_actual < 10 ? '1px solid #fecaca' : '1px solid #bbf7d0'
                                        }}>
                                            {p.stock_actual} unid.
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        {p.odoo_id ? (
                                            <span style={styles.odooBadge}>
                                                <span style={{fontSize:'10px'}}>☁️</span> AWS #{p.odoo_id}
                                            </span>
                                        ) : (
                                            <span style={{color: '#94a3b8', fontSize: '0.8rem'}}>⏳ Pendiente</span>
                                        )}
                                    </td>
                                    <td style={{...styles.td, textAlign: 'right'}}>
                                        <div style={styles.actionGroup}>
                                            <button onClick={() => handleOpenSale(p)} style={styles.btnSell} title="Realizar Venta">
                                                💰 Vender
                                            </button>
                                            <button style={styles.btnIcon} title="Editar">✏️</button>
                                            <button onClick={() => handleDelete(p.id)} style={{...styles.btnIcon, color: '#ef4444'}} title="Eliminar">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- MODAL DE VENTA --- */}
            {isModalOpen && selectedProduct && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h2 style={{margin:0, fontSize:'1.2rem'}}>Nueva Venta</h2>
                            <button onClick={closeModal} style={styles.closeBtn}>✕</button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            {/* Si hay éxito, mostramos mensaje y botón Odoo */}
                            {successMsg ? (
                                <div style={{textAlign: 'center', padding: '10px'}}>
                                    <div style={styles.successBox}>{successMsg}</div>
                                    
                                    <p style={{color: '#64748b', marginBottom: '15px', marginTop: '10px'}}>
                                        La transacción ha sido registrada en la nube.
                                    </p>

                                    <a 
                                        href="http://18.221.230.36:8069/web#action=account.action_move_out_invoice_type&model=account.move&view_type=list" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={styles.btnInvoice}
                                    >
                                        📄 VER FACTURA EN ODOO
                                    </a>
                                    
                                    <button onClick={closeModal} style={{...styles.btnConfirm, background: '#94a3b8', marginTop: '15px'}}>
                                        Cerrar Ventana
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Formulario Normal */}
                                    <div style={{marginBottom:'15px'}}>
                                        <span style={{display:'block', color:'#64748b', fontSize:'0.8rem'}}>Producto</span>
                                        <strong style={{fontSize:'1.1rem'}}>{selectedProduct.nombre}</strong>
                                    </div>
                                    
                                    <div style={styles.formGrid}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Cantidad</label>
                                            <input type="number" min="1" max={selectedProduct.stock_actual} value={qty} onChange={(e) => setQty(parseInt(e.target.value))} style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Tipo Cliente</label>
                                            <select value={saleType} onChange={(e) => setSaleType(e.target.value as any)} style={styles.select}>
                                                <option value="MENOR">Minorista</option>
                                                <option value="MAYOR">Mayorista (-5%)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Resumen Financiero */}
                                    <div style={styles.summaryBox}>
                                        <div style={styles.summaryRow}><span>Precio Unit.:</span> <span>S/ {precioBase.toFixed(2)}</span></div>
                                        <div style={styles.summaryRow}><span>Subtotal ({qty} u.):</span> <span>S/ {subtotal.toFixed(2)}</span></div>
                                        {saleType === 'MAYOR' && <div style={{...styles.summaryRow, color: '#16a34a'}}><span>Descuento:</span> <span>- S/ {descuento.toFixed(2)}</span></div>}
                                        <div style={styles.divider}></div>
                                        <div style={styles.totalRow}><span>TOTAL:</span> <span>S/ {totalPagar.toFixed(2)}</span></div>
                                    </div>

                                    <button onClick={handleProcessSale} style={styles.btnConfirm}>CONFIRMAR VENTA</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

// --- ESTILOS ---
const styles: { [key: string]: React.CSSProperties } = {
    headerContainer: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0'
    },
    pageTitle: { margin: 0, fontSize: '1.8rem', color: '#1e293b', fontWeight: 700 },
    pageSubtitle: { margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' },
    totalBadge: { background: '#fff', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', color: '#64748b', fontSize: '0.9rem' },

    // Tabla
    tableContainer: {
        background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden', border: '1px solid #f1f5f9'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    theadRow: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    th: { padding: '16px 24px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
    tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' },
    td: { padding: '16px 24px', fontSize: '0.95rem' },
    
    priceTag: { fontWeight: 600, color: '#1e293b' },
    stockBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-block' },
    odooBadge: { background: '#fff7ed', color: '#c2410c', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #ffedd5', display: 'inline-flex', alignItems: 'center', gap: '5px' },
    
    actionGroup: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
    btnSell: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px',
        cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 2px 5px rgba(16, 185, 129, 0.3)'
    },
    btnIcon: {
        background: '#f1f5f9', color: '#64748b', border: 'none', width: '32px', height: '32px',
        borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', transition: '0.2s'
    },

    // Modal
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' },
    modal: { background: 'white', borderRadius: '16px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
    modalHeader: { padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    closeBtn: { background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' },
    modalBody: { padding: '24px' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '0.85rem', fontWeight: 600, color: '#475569' },
    input: { padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' },
    select: { padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', background: 'white' },
    summaryBox: { background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' },
    divider: { height: '1px', background: '#e2e8f0', margin: '10px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' },
    
    btnConfirm: { width: '100%', padding: '14px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, marginTop: '20px', fontSize: '0.95rem' },
    
    successBox: { background: '#ecfdf5', color: '#065f46', padding: '15px', borderRadius: '10px', textAlign: 'center', fontWeight: 500 },
    
    btnInvoice: {
        display: 'inline-block',
        padding: '12px 20px',
        background: '#714b67', // Color Odoo
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(113, 75, 103, 0.3)',
        transition: '0.2s',
        border: '1px solid #5d3d55',
        fontSize: '0.9rem'
    },
};

export default ProductsPage;
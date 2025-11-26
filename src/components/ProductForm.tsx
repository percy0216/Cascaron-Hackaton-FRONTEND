import React, { useState } from 'react';
import api from '../api/axiosConfig';
import type { ProductFormData, ProductResponse } from '../types';

interface Props {
    onProductAdded: () => void;
}

const ProductForm: React.FC<Props> = ({ onProductAdded }) => {
    const [formData, setFormData] = useState<ProductFormData>({
        nombre: '', precio_venta: '', costo_unitario: '', stock_actual: '', stock_minimo: 5
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [odooId, setOdooId] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setOdooId(null);
        try {
            const res = await api.post<ProductResponse>('productos/', formData);
            setStatus('success');
            setOdooId(res.data.odoo_id);
            setFormData({ nombre: '', precio_venta: '', costo_unitario: '', stock_actual: '', stock_minimo: 5 });
            onProductAdded();
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div style={styles.card}>
            <h3>✨ Nuevo Producto (Sync Odoo)</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required style={styles.input} />
                <div style={styles.row}>
                    <input name="precio_venta" type="number" placeholder="Precio" value={formData.precio_venta} onChange={handleChange} required style={styles.input} />
                    <input name="costo_unitario" type="number" placeholder="Costo" value={formData.costo_unitario} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.row}>
                    <input name="stock_actual" type="number" placeholder="Stock" value={formData.stock_actual} onChange={handleChange} required style={styles.input} />
                    <input name="stock_minimo" type="number" placeholder="Mínimo" value={formData.stock_minimo} onChange={handleChange} style={styles.input} />
                </div>
                <button type="submit" disabled={status === 'loading'} style={styles.btn}>
                    {status === 'loading' ? 'Sincronizando...' : 'GUARDAR EN NUBE ☁️'}
                </button>
            </form>
            {status === 'success' && (
                <div style={styles.successBox}>
                    <p>✅ Guardado Local</p>
                    <p>🔗 AWS Odoo ID: <strong>{odooId ?? 'Pendiente...'}</strong></p>
                </div>
            )}
        </div>
    );
};

const styles = {
    card: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column' as const, gap: '10px' },
    row: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' },
    btn: { padding: '12px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    successBox: { marginTop: '15px', padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '5px', border: '1px solid #c3e6cb' }
};

export default ProductForm;
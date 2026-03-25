import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';

interface Product {
    id: number;
    nombre: string;
    precio_venta: string;
    stock_actual: number;
    odoo_id: number | null;
}

const ProductsPage: React.FC = () => {
    const [products, setProducts]               = useState<Product[]>([]);
    const [loading, setLoading]                 = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [qty, setQty]                         = useState(1);
    const [saleType, setSaleType]               = useState<'MENOR' | 'MAYOR'>('MENOR');
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [successMsg, setSuccessMsg]           = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [stockToAdd, setStockToAdd]           = useState(1);
    const [editSuccessMsg, setEditSuccessMsg]   = useState('');

    const fetchData = async () => {
        try {
            const res = await api.get('productos/');
            setProducts(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await api.delete(`productos/${id}/`);
            fetchData();
        } catch { alert('Error al eliminar'); }
    };

    const handleOpenSale = (prod: Product) => {
        setSelectedProduct(prod); setQty(1); setSaleType('MENOR'); setSuccessMsg(''); setIsSaleModalOpen(true);
    };

    const handleProcessSale = async () => {
        if (!selectedProduct) return;
        try {
            await api.post('vender/', { producto_id: selectedProduct.id, cantidad: qty, tipo: saleType });
            setSuccessMsg('venta_ok');
            fetchData();
        } catch { alert('Error: Stock insuficiente'); }
    };

    const closeSaleModal = () => { setIsSaleModalOpen(false); setSuccessMsg(''); };

    const handleOpenEdit = (prod: Product) => {
        setSelectedProduct(prod); setStockToAdd(1); setEditSuccessMsg(''); setIsEditModalOpen(true);
    };

    const handleUpdateStock = async () => {
        if (!selectedProduct) return;
        if (stockToAdd <= 0) return alert('La cantidad a agregar debe ser positiva.');
        try {
            const newStock = selectedProduct.stock_actual + stockToAdd;
            await api.patch(`productos/${selectedProduct.id}/`, { stock_actual: newStock });
            setEditSuccessMsg(`Stock actualizado a ${newStock} unidades.`);
            fetchData();
        } catch (e) { alert('Error al actualizar stock.'); console.error(e); }
    };

    const closeEditModal = () => { setIsEditModalOpen(false); setEditSuccessMsg(''); };

    const precioBase  = selectedProduct ? parseFloat(selectedProduct.precio_venta) : 0;
    const subtotal    = precioBase * qty;
    const descuento   = saleType === 'MAYOR' ? subtotal * 0.05 : 0;
    const totalPagar  = subtotal - descuento;

    const lowStock    = products.filter(p => p.stock_actual < 10).length;
    const synced      = products.filter(p => p.odoo_id).length;

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

                {/* ── Header ── */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs font-semibold tracking-wider uppercase text-indigo-600 flex items-center gap-2 mb-2">
                            <span className="inline-block w-4 h-0.5 bg-indigo-600 rounded"></span>
                            Gestión de inventario
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                            Productos &amp; <span className="text-indigo-600">Stock</span>
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Control centralizado de productos y existencias
                        </p>
                    </div>

                    {!loading && (
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                {products.length} productos
                            </div>
                            {lowStock > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs font-semibold text-red-700 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {lowStock} stock bajo
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {synced} sincronizados
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Table card ── */}
                {loading ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                        <div className="flex items-center justify-center gap-3 text-sm font-medium text-slate-500">
                            <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                            Cargando inventario…
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-sm font-semibold text-slate-900">Lista de productos</span>
                            <span className="text-[11px] font-bold tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                {products.length} REGISTROS
                            </span>
                        </div>

                        {products.length === 0 ? (
                            <div className="py-16 px-6 text-center">
                                <div className="text-4xl text-slate-300 mb-3">📦</div>
                                <div className="text-sm font-semibold text-slate-900 mb-1">Sin productos aún</div>
                                <div className="text-sm text-slate-500">Crea tu primer producto desde el Dashboard.</div>
                            </div>
                        ) : (
                            <>
                                {/* ── Desktop table ── */}
                                <div className="hidden sm:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Producto</th>
                                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Precio unit.</th>
                                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Stock físico</th>
                                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Sincronización</th>
                                                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {products.map(p => (
                                                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-5 py-4 align-middle">
                                                        <div className="text-sm font-semibold text-slate-900">{p.nombre}</div>
                                                        <div className="text-[11px] text-slate-400 mt-0.5">ID #{p.id}</div>
                                                    </td>
                                                    <td className="px-5 py-4 align-middle">
                                                        <span className="text-base font-bold text-slate-900">S/ {p.precio_venta}</span>
                                                    </td>
                                                    <td className="px-5 py-4 align-middle">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                                            p.stock_actual < 10 
                                                            ? 'bg-red-50 text-red-700 border-red-200' 
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        }`}>
                                                            {p.stock_actual < 10 && <span className="font-bold">!</span>}
                                                            {p.stock_actual} unid.
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 align-middle">
                                                        {p.odoo_id
                                                            ? <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[11px] font-semibold">☁️ AWS #{p.odoo_id}</span>
                                                            : <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[11px] font-semibold">Pendiente</span>
                                                        }
                                                    </td>
                                                    <td className="px-5 py-4 align-middle text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleOpenSale(p)} className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-semibold transition-colors shadow-sm">
                                                                Vender
                                                            </button>
                                                            <button onClick={() => handleOpenEdit(p)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors">
                                                                + Stock
                                                            </button>
                                                            <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors">
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* ── Mobile card list ── */}
                                <div className="sm:hidden flex flex-col divide-y divide-slate-100">
                                    {products.map(p => (
                                        <div className="p-4" key={p.id}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900">{p.nombre}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5">ID #{p.id}</div>
                                                </div>
                                                <div className="text-lg font-bold text-slate-900">S/ {p.precio_venta}</div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                    p.stock_actual < 10 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                    {p.stock_actual} unid.
                                                </span>
                                                {p.odoo_id
                                                    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-semibold">☁️ AWS #{p.odoo_id}</span>
                                                    : <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[10px] font-semibold">Pendiente</span>
                                                }
                                            </div>

                                            <div className="flex gap-2">
                                                <button onClick={() => handleOpenSale(p)} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm">
                                                    Vender
                                                </button>
                                                <button onClick={() => handleOpenEdit(p)} className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold">
                                                    + Stock
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ═══════════════════════════════════════
                    MODAL DE VENTA
                ═══════════════════════════════════════ */}
                {isSaleModalOpen && selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && closeSaleModal()}>
                        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 mb-1">Nueva transacción</div>
                                    <div className="text-xl font-bold text-slate-900">Registrar venta</div>
                                </div>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" onClick={closeSaleModal}>✕</button>
                            </div>

                            <div className="p-6">
                                {successMsg === 'venta_ok' ? (
                                    <div className="text-center py-2">
                                        <div className="w-14 h-14 mx-auto mb-4 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center text-emerald-500 text-2xl">✓</div>
                                        <div className="text-xl font-bold text-slate-900 mb-2">¡Venta registrada!</div>
                                        <div className="text-sm text-slate-500 mb-6 leading-relaxed">
                                            La transacción fue procesada y el stock<br />fue actualizado en la nube.
                                        </div>
                                        <a
                                            href="http://3.138.184.115:8069/web#action=account.action_move_out_invoice_type&model=account.move&view_type=list"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors mb-3"
                                        >
                                            ☁️ Ver factura en Odoo →
                                        </a>
                                        <button className="w-full py-2.5 mt-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors" onClick={closeSaleModal}>Cerrar ventana</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 p-3 mb-5 bg-slate-50 border border-slate-200 rounded-xl">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm">📦</div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{selectedProduct.nombre}</div>
                                                <div className="text-xs text-slate-500">{selectedProduct.stock_actual} unidades disponibles</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-slate-700">Cantidad</label>
                                                <input
                                                    type="number" min="1" max={selectedProduct.stock_actual}
                                                    value={qty}
                                                    onChange={e => setQty(parseInt(e.target.value) || 1)}
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-slate-700">Tipo de cliente</label>
                                                <select
                                                    value={saleType}
                                                    onChange={e => setSaleType(e.target.value as 'MENOR' | 'MAYOR')}
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                >
                                                    <option value="MENOR">Minorista</option>
                                                    <option value="MAYOR">Mayorista (−5%)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                                            <div className="flex justify-between items-center text-sm text-slate-600 py-1"><span>Precio unitario</span><span className="font-medium text-slate-900">S/ {precioBase.toFixed(2)}</span></div>
                                            <div className="flex justify-between items-center text-sm text-slate-600 py-1"><span>Subtotal ({qty} u.)</span><span className="font-medium text-slate-900">S/ {subtotal.toFixed(2)}</span></div>
                                            {saleType === 'MAYOR' && (
                                                <div className="flex justify-between items-center text-sm text-emerald-600 py-1 font-medium"><span>Descuento mayorista</span><span>− S/ {descuento.toFixed(2)}</span></div>
                                            )}
                                            <div className="h-px bg-slate-200 my-3" />
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total a cobrar</span>
                                                <span className="text-2xl font-bold text-slate-900 leading-none">S/ {totalPagar.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors flex items-center justify-center gap-2" onClick={handleProcessSale}>
                                            Confirmar venta <span className="opacity-70">→</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════
                    MODAL DE STOCK
                ═══════════════════════════════════════ */}
                {isEditModalOpen && selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && closeEditModal()}>
                        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 mb-1">Gestión de inventario</div>
                                    <div className="text-xl font-bold text-slate-900">Añadir stock</div>
                                </div>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" onClick={closeEditModal}>✕</button>
                            </div>

                            <div className="p-6">
                                {editSuccessMsg ? (
                                    <div className="text-center py-2">
                                        <div className="w-14 h-14 mx-auto mb-4 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center text-emerald-500 text-2xl">✓</div>
                                        <div className="text-xl font-bold text-slate-900 mb-2">Stock actualizado</div>
                                        <div className="text-sm text-slate-500 mb-6">{editSuccessMsg}</div>
                                        <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors" onClick={closeEditModal}>Cerrar</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 p-3 mb-5 bg-slate-50 border border-slate-200 rounded-xl">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm">📦</div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{selectedProduct.nombre}</div>
                                                <div className="text-xs text-slate-500">Stock actual: {selectedProduct.stock_actual} unidades</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5 mb-6">
                                            <label className="text-xs font-semibold text-slate-700">Unidades a añadir</label>
                                            <input
                                                type="number" min="1"
                                                value={stockToAdd}
                                                onChange={e => setStockToAdd(parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-center">
                                            <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Nuevo stock total</div>
                                            <div className="text-4xl font-bold text-slate-900 leading-none mb-1">{selectedProduct.stock_actual + stockToAdd}</div>
                                            <div className="text-xs text-slate-500">
                                                {selectedProduct.stock_actual} actuales + {stockToAdd} a añadir
                                            </div>
                                        </div>

                                        <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 shadow-sm transition-colors" onClick={handleUpdateStock}>
                                            Confirmar ajuste de stock
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default ProductsPage;
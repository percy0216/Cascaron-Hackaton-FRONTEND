"use client"

import type React from "react"
import { useState } from "react"
import api from "../api/axiosConfig"
import type { ProductFormData, ProductResponse } from "../types"

interface Props {
    onProductAdded: () => void
}

const ProductForm: React.FC<Props> = ({ onProductAdded }) => {
    const [formData, setFormData] = useState<ProductFormData>({
        nombre: "",
        precio_venta: "",
        costo_unitario: "",
        stock_actual: "",
        stock_minimo: 5,
    })
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [odooId, setOdooId] = useState<number | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("loading")
        setOdooId(null)
        try {
            const res = await api.post<ProductResponse>("productos/", formData)
            setStatus("success")
            setOdooId(res.data.odoo_id)
            setFormData({ nombre: "", precio_venta: "", costo_unitario: "", stock_actual: "", stock_minimo: 5 })
            onProductAdded()
        } catch (err) {
            console.error(err)
            setStatus("error")
        }
    }

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Nuevo Producto</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">Sincronización automática con AWS Odoo</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    ☁️ Sync
                </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Nombre - Full Width */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre del Producto</label>
                    <input
                        name="nombre"
                        placeholder="Ej: Laptop Dell XPS 15"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Precio y Costo */}
                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Precio de Venta</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 pointer-events-none">S/</span>
                            <input
                                name="precio_venta"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                value={formData.precio_venta}
                                onChange={handleChange}
                                required
                                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Costo Unitario</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 pointer-events-none">S/</span>
                            <input
                                name="costo_unitario"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                value={formData.costo_unitario}
                                onChange={handleChange}
                                required
                                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Stock */}
                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Stock Actual</label>
                        <input
                            name="stock_actual"
                            type="number"
                            placeholder="0"
                            value={formData.stock_actual}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Stock Mínimo</label>
                        <input
                            name="stock_minimo"
                            type="number"
                            placeholder="5"
                            value={formData.stock_minimo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-2.5 mt-2 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {status === "loading" ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sincronizando...
                        </>
                    ) : (
                        "✓ Guardar Producto"
                    )}
                </button>
            </form>

            {/* Success Message */}
            {status === "success" && (
                <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="text-emerald-500 font-bold text-lg leading-none mt-0.5">✓</div>
                    <div>
                        <p className="text-sm font-bold text-emerald-800 mb-0.5">Producto guardado exitosamente</p>
                        <p className="text-xs font-medium text-emerald-600">
                            AWS Odoo ID: <strong className="font-bold text-emerald-700">#{odooId ?? "Pendiente"}</strong>
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {status === "error" && (
                <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="text-red-500 font-bold text-lg leading-none mt-0.5">⚠</div>
                    <div>
                        <p className="text-sm font-bold text-red-800 mb-0.5">Error al guardar</p>
                        <p className="text-xs font-medium text-red-600">Verifica los datos e intenta nuevamente</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductForm
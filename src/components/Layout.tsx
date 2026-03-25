import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Chatbot from './Chatbot';
import { isDemoMode, resetDemoData } from '../api/axiosConfig';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            
            {/* ── Mobile Header ── */}
            <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-sm shadow-sm">
                        ⬡
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight">AliadoMype</span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 -mr-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
                    aria-label="Abrir menú"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </header>

            {/* Sidebar ya maneja su propio overlay internamente */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* ── Main Content Wrapper ── */}
            {/* lg:pl-64 compensa exactamente los 256px de ancho del Sidebar */}
            <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
                
                {isDemoMode && (
                    <div className="mx-4 mt-4 lg:mx-8 lg:mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span><strong>Modo Demo</strong> activo (sin backend / entorno local).</span>
                        </div>
                        <button
                            onClick={resetDemoData}
                            className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 font-semibold text-indigo-700 transition hover:bg-indigo-100 hover:border-indigo-300 shadow-sm"
                        >
                            Reiniciar datos
                        </button>
                    </div>
                )}
                
                {/* El {children} (Dashboard, Productos, etc.) ya trae su propio padding y max-w según los componentes previos */}
                <div className="flex-1 w-full">
                    {children}
                </div>
            </main>

            <Chatbot />
        </div>
    );
};

export default Layout;
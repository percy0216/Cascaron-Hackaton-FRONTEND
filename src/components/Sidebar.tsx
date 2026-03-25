import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const menuItems = [
    { label: 'Dashboard',  icon: '▦', path: '/dashboard' },
    { label: 'Productos',  icon: '◫', path: '/productos'  },
    { label: 'Ventas',     icon: '◈', path: '/ventas'     },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate  = useNavigate();
    const location  = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        if (onClose) onClose();
    };

    return (
        <>
            {/* overlay móvil */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* aside */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col font-sans transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* ── Brand header ── */}
                <div className="relative px-6 pt-7 pb-5 border-b border-slate-800/60">
                    <button 
                        className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        onClick={onClose} 
                        aria-label="Cerrar menú"
                    >
                        ✕
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-lg shadow-[0_0_15px_rgba(99,102,241,0.15)] shrink-0">
                            ⬡
                        </div>
                        <div>
                            <strong className="block text-sm font-semibold text-white tracking-wide">AliadoMype</strong>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Pro · v2.4</span>
                        </div>
                    </div>

                    <div className="text-xl font-bold text-white tracking-tight">
                        Panel de <span className="text-indigo-400">Control</span>
                    </div>

                    {/* Subtle bottom gradient line */}
                    <div className="absolute bottom-[-1px] left-6 right-6 h-px bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
                </div>

                {/* ── Nav ── */}
                <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Navegación principal">
                    <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Módulos</p>
                    <div className="flex flex-col gap-1.5">
                        {menuItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 group ${
                                        active 
                                        ? 'bg-indigo-600/10 border-indigo-500/30' 
                                        : 'bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-800'
                                    }`}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                                        active 
                                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:text-slate-300'
                                    }`}>
                                        {item.icon}
                                    </span>
                                    
                                    <span className={`flex-1 text-sm font-medium transition-colors ${
                                        active ? 'text-white font-semibold' : 'text-slate-400 group-hover:text-slate-200'
                                    }`}>
                                        {item.label}
                                    </span>

                                    {/* Active indicator dot */}
                                    <span className={`w-1.5 h-1.5 rounded-full bg-indigo-500 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* ── Footer ── */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 p-3 mb-3 rounded-xl bg-slate-800/40 border border-slate-800">
                        <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                            AM
                        </div>
                        <div>
                            <strong className="block text-sm font-semibold text-slate-200">Mi negocio</strong>
                            <span className="text-[11px] text-slate-500 font-medium">Plan Pro activo</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200"
                    >
                        <span className="text-lg leading-none opacity-70">↪</span>
                        Cerrar sesión
                    </button>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;
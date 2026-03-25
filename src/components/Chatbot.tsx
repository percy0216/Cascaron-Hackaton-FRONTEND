import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axiosConfig';
import type { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: '👋 Soy TaxBot. Conectado a SUNAT y Odoo. ¿En qué te ayudo?' }
    ]);
    const [inputStr, setInputStr] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages, isOpen, isTyping]);

    const sendMessage = async (text: string) => {
        setMessages(prev => [...prev, { sender: 'user', text: text }]);
        setIsTyping(true);
        try {
            const res = await api.post<{ bot_response: string }>('chat/', { mensaje: text });
            setTimeout(() => {
                setMessages(prev => [...prev, { sender: 'bot', text: res.data.bot_response }]);
                setIsTyping(false);
            }, 600);
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'bot', text: '🔴 Error de conexión.' }]);
            setIsTyping(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputStr.trim()) return;
        sendMessage(inputStr);
        setInputStr("");
    };

    // --- FUNCIÓN PARA NEGRITAS ---
    const formatMessage = (text: string) => {
        return text.split('\n').map((line, i) => {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <div key={i} className="min-h-[1.2em]">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{part}</span>;
                    })}
                </div>
            );
        });
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[2000] flex flex-col items-end font-sans">
            
            {/* Ventana de Chat */}
            {isOpen && (
                <div className="mb-4 w-[calc(100vw-2rem)] sm:w-[360px] h-[500px] max-h-[calc(100vh-8rem)] bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-200 origin-bottom-right">
                    
                    {/* Header */}
                    <div className="bg-slate-900 p-4 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl shadow-sm">
                                🤖
                            </div>
                            <div>
                                <span className="block font-bold text-white tracking-wide text-sm">TaxBot SUNAT</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">IA Activa</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50">
                        {messages.map((m, i) => (
                            <div 
                                key={i} 
                                className={`px-4 py-2.5 max-w-[85%] text-sm shadow-sm ${
                                    m.sender === 'user' 
                                    ? 'self-end bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                                    : 'self-start bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm'
                                }`}
                            >
                                {formatMessage(m.text)}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="self-start px-4 py-2.5 max-w-[85%] bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="p-3 flex gap-2 overflow-x-auto bg-white border-t border-slate-100 shrink-0 scrollbar-hide">
                        <button 
                            onClick={() => sendMessage('Impuesto hoy')} 
                            className="shrink-0 whitespace-nowrap px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                            ⚖️ Impuestos
                        </button>
                        <button 
                            onClick={() => sendMessage('¿Tengo deuda?')} 
                            className="shrink-0 whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                        >
                            🚨 Deuda
                        </button>
                        <button 
                            onClick={() => sendMessage('Ventas de hoy')} 
                            className="shrink-0 whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                        >
                            💰 Ventas
                        </button>
                        <button 
                            onClick={() => sendMessage('Alerta Stock')} 
                            className="shrink-0 whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                        >
                            📦 Stock
                        </button>
                    </div>

                    {/* Footer / Input */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
                        <input 
                            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                            value={inputStr} 
                            onChange={e => setInputStr(e.target.value)} 
                            placeholder="Escribe tu consulta..." 
                        />
                        <button 
                            type="submit"
                            className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
                            disabled={!inputStr.trim()}
                        >
                            <svg className="w-4 h-4 translate-x-px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Action Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 ${
                    isOpen ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
            >
                {isOpen ? '✕' : '💬'}
                {!isOpen && (
                    <span className="absolute 0 top-0 right-0 w-5 h-5 bg-red-500 border-2 border-slate-50 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        1
                    </span>
                )}
            </button>
            
        </div>
    );
};

export default Chatbot;
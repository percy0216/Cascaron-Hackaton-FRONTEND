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

    // --- FUNCIÓN MÁGICA PARA NEGRITAS ---
    // Convierte "**texto**" en <strong>texto</strong> visualmente
    const formatMessage = (text: string) => {
        return text.split('\n').map((line, i) => {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <div key={i} style={{ minHeight: '1.2em' }}>
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{part}</span>;
                    })}
                </div>
            );
        });
    };

    return (
        <div style={styles.wrapper}>
            {isOpen && (
                <div style={styles.window}>
                    <div style={styles.header}>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <span style={{fontSize:'1.5rem'}}>🤖</span>
                            <div>
                                <span style={{display:'block', fontWeight:'bold'}}>TaxBot SUNAT</span>
                                <span style={{fontSize:'0.7rem', opacity:0.8}}>En línea • IA Activa</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>×</button>
                    </div>

                    <div style={styles.body}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                ...styles.message,
                                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                background: m.sender === 'user' ? '#dcf8c6' : 'white',
                                borderBottomRightRadius: m.sender === 'user' ? '0' : '10px',
                                borderBottomLeftRadius: m.sender === 'bot' ? '0' : '10px',
                            }}>
                                {/* Usamos el formateador aquí */}
                                {formatMessage(m.text)}
                            </div>
                        ))}
                        {isTyping && <div style={{...styles.message, color:'#888', fontStyle:'italic'}}>Escribiendo...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* --- AQUÍ ESTÁ TU BOTÓN NUEVO --- */}
                    <div style={styles.quickActions}>
                        <button onClick={() => sendMessage('Impuesto hoy')} style={{...styles.chip, background: '#e3f2fd', color: '#1565c0', border: '1px solid #1565c0'}}>
                            ⚖️ Impuestos
                        </button>
                        <button onClick={() => sendMessage('¿Tengo deuda?')} style={styles.chip}>🚨 Deuda</button>
                        <button onClick={() => sendMessage('Ventas de hoy')} style={styles.chip}>💰 Ventas</button>
                        <button onClick={() => sendMessage('Alerta Stock')} style={styles.chip}>📦 Stock</button>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.footer}>
                        <input style={styles.input} value={inputStr} onChange={e => setInputStr(e.target.value)} placeholder="..." />
                        <button style={styles.sendBtn}>➤</button>
                    </form>
                </div>
            )}

            <button onClick={() => setIsOpen(!isOpen)} style={styles.fab}>
                {isOpen ? '💬' : '🤖'}
                {!isOpen && <span style={styles.notificationDot}>1</span>}
            </button>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    wrapper: { position: 'fixed', bottom: '30px', right: '30px', zIndex: 2000 },
    fab: { 
        width: '65px', height: '65px', borderRadius: '50%', background: '#075e54', 
        color: 'white', fontSize: '30px', border: 'none', cursor: 'pointer', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', transition: 'transform 0.2s'
    },
    notificationDot: {
        position: 'absolute', top: '0', right: '0', width: '20px', height: '20px',
        background: '#e74c3c', borderRadius: '50%', border: '2px solid white',
        fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    window: {
        position: 'absolute', bottom: '80px', right: '0', width: '340px', height: '500px', // Un poco más grande
        background: '#e5ddd5', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #ccc'
    },
    header: { 
        background: '#075e54', color: 'white', padding: '15px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
    },
    closeBtn: { background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' },
    body: { 
        flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px',
        backgroundImage: 'linear-gradient(#e5ddd5 2px, transparent 2px), linear-gradient(90deg, #e5ddd5 2px, transparent 2px)',
        backgroundSize: '20px 20px'
    },
    message: { 
        padding: '10px 15px', borderRadius: '10px', maxWidth: '85%', fontSize: '0.95rem', 
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)', lineHeight: '1.4'
    },
    quickActions: {
        padding: '10px', display: 'flex', gap: '8px', overflowX: 'auto', background: '#f0f0f0', borderTop: '1px solid #ddd'
    },
    chip: {
        background: 'white', border: '1px solid #075e54', color: '#075e54', 
        padding: '6px 12px', borderRadius: '15px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold',
        whiteSpace: 'nowrap'
    },
    footer: { padding: '10px', display: 'flex', gap: '8px', background: 'white' },
    input: { flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' },
    sendBtn: { background: '#128c7e', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem' }
};

export default Chatbot;
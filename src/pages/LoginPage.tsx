import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

// --- Tipos ---
interface LoginResponse {
    token: string;
}

const LoginPage: React.FC = () => {
    // --- Lógica del Estado (Igual que antes) ---
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post<LoginResponse>('login/', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Credenciales incorrectas. Intenta nuevamente.');
            setLoading(false);
        }
    };

    // --- Renderizado (Nuevo Diseño) ---
    return (
        <div style={styles.splitLayout}>
            {/* ================= SECCIÓN IZQUIERDA (BRANDING) ================= */}
            <div style={styles.leftPane}>
                <div style={styles.brandContent}>
                    <div style={styles.logoIcon}>✨</div>
                    <h1 style={styles.brandTitle}>AliadoMype Pro</h1>
                    <p style={styles.brandSubtitle}>Sistema Inteligente de Gestión con IA y Cloud</p>

                    <div style={styles.featureList}>
                        <div style={styles.featureItem}>
                            <span style={styles.featureIcon}>📈</span>
                            <span>Gestión y ventas en tiempo real</span>
                        </div>
                        <div style={styles.featureItem}>
                            <span style={styles.featureIcon}>☁️</span>
                            <span>Sincronización automática con AWS Odoo</span>
                        </div>
                        <div style={styles.featureItem}>
                            <span style={styles.featureIcon}>🤖</span>
                            <span>Asistente Tributario con IA integrado</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= SECCIÓN DERECHA (FORMULARIO) ================= */}
            <div style={styles.rightPane}>
                <div style={styles.formContainer}>
                    <div style={styles.formHeader}>
                        <div style={styles.loginIcon}>🔓</div>
                        <h2 style={styles.welcomeTitle}>¡Bienvenido de nuevo!</h2>
                        <p style={styles.welcomeSubtitle}>Ingresa tus credenciales para continuar</p>
                    </div>

                    <form onSubmit={handleLogin} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Usuario</label>
                            <input 
                                type="text" 
                                placeholder="Ej. admin" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Contraseña</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>
                        
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Autenticando...' : '→ Iniciar Sesión'}
                        </button>
                    </form>
                    
                    {error && <div style={styles.errorBox}>⚠️ {error}</div>}
                    
                    
                </div>
            </div>
        </div>
    );
};

// --- ESTILOS CSS-IN-JS ---
const styles: { [key: string]: React.CSSProperties } = {
    splitLayout: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        overflow: 'hidden',
    },
    // --- Izquierda ---
    leftPane: {
        flex: '1 1 45%', // Ocupa el 45% del ancho
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', // Gradiente violeta/azul similar a la referencia
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
    },
    brandContent: {
        maxWidth: '450px',
        zIndex: 2,
    },
    logoIcon: { fontSize: '3.5rem', marginBottom: '10px' },
    brandTitle: { fontSize: '2.8rem', fontWeight: 800, margin: '0 0 15px 0', lineHeight: 1.1 },
    brandSubtitle: { fontSize: '1.2rem', opacity: 0.9, marginBottom: '40px', fontWeight: 300 },
    featureList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '15px 20px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        fontSize: '1rem',
        fontWeight: 500,
    },
    featureIcon: { fontSize: '1.5rem' },

    // --- Derecha ---
    rightPane: {
        flex: '1 1 55%', // Ocupa el 55% del ancho
        background: '#f8faff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
    },
    formContainer: {
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
    },
    formHeader: { textAlign: 'center', marginBottom: '30px' },
    loginIcon: {
        fontSize: '2rem',
        background: '#eef2ff',
        color: '#6a11cb',
        width: '60px', height: '60px',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 15px auto'
    },
    welcomeTitle: { fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: '0 0 10px 0' },
    welcomeSubtitle: { color: '#64748b', margin: 0 },
    
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' },
    label: { fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginLeft: '5px' },
    input: {
        padding: '14px 16px',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.3s',
        background: '#f8fafc',
    },
    button: {
        padding: '16px',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '1.1rem',
        marginTop: '10px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 5px 15px rgba(37, 117, 252, 0.3)',
    },
    errorBox: {
        marginTop: '20px',
        padding: '12px',
        background: '#fef2f2',
        color: '#dc2626',
        borderRadius: '10px',
        fontSize: '0.9rem',
        border: '1px solid #fecaca',
        textAlign: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    },
    demoCredentials: {
        marginTop: '30px',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#64748b',
        background: '#f1f5f9',
        padding: '15px',
        borderRadius: '12px'
    },
    codeBlock: {
        display: 'block',
        fontFamily: 'monospace',
        background: '#e2e8f0',
        color: '#475569',
        padding: '8px',
        borderRadius: '6px',
        marginTop: '5px',
        fontSize: '0.85rem',
        fontWeight: 'bold'
    }
};

export default LoginPage;
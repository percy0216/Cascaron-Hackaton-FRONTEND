import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { DEMO_CREDENTIALS, isDemoMode } from '../api/axiosConfig';

interface LoginResponse {
    token: string;
}

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setMounted(true);
    }, []);

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

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                :root {
                    --bg-main: #F8FAFC;       
                    --bg-panel: #FFFFFF;      
                    --text-primary: #0F172A;  
                    --text-secondary: #64748B; 
                    --primary: #4F46E5;       
                    --primary-hover: #4338CA; 
                    --primary-light: #EEF2FF; 
                    --border: #E2E8F0;        
                    --border-focus: #4F46E5;
                    --error-bg: #FEF2F2;
                    --error-text: #DC2626;
                    --error-border: #FECACA;
                }

                .login-root {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr;
                    background: var(--bg-main);
                    font-family: 'Inter', system-ui, sans-serif;
                    color: var(--text-primary);
                }

                @media (min-width: 1024px) {
                    .login-root { grid-template-columns: 1.2fr 1fr; }
                }

                /* ── LEFT PANEL (TECH BRANDING) ── */
                .left-panel {
                    display: none;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 64px;
                    background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%); 
                    position: relative;
                    overflow: hidden;
                    color: #FFFFFF;
                }

                @media (min-width: 1024px) {
                    .left-panel { display: flex; }
                }

                .left-panel::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: 
                        radial-gradient(circle at 20% 150%, rgba(79, 70, 229, 0.4) 0%, transparent 50%),
                        radial-gradient(circle at 80% -20%, rgba(79, 70, 229, 0.2) 0%, transparent 50%);
                    pointer-events: none;
                }

                .left-top { position: relative; z-index: 1; }

                .brand-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(8px);
                    border-radius: 9999px;
                    padding: 6px 14px;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    color: #E0E7FF; 
                    width: fit-content;
                }

                .left-headline {
                    margin-top: 48px;
                    font-size: clamp(2.5rem, 4vw, 3.5rem);
                    font-weight: 700;
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                }

                .left-headline span {
                    color: #818CF8; 
                }

                .left-sub {
                    margin-top: 24px;
                    font-size: 18px;
                    line-height: 1.6;
                    color: #94A3B8; 
                    max-width: 480px;
                }

                .feature-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    position: relative;
                    z-index: 1;
                    margin-top: 64px;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .feature-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: rgba(79, 70, 229, 0.2);
                    border: 1px solid rgba(79, 70, 229, 0.3);
                    border-radius: 10px;
                    font-size: 18px;
                }

                .feature-text strong {
                    display: block;
                    font-size: 15px;
                    font-weight: 600;
                    color: #F8FAFC;
                }

                .feature-text span {
                    font-size: 14px;
                    color: #94A3B8;
                    margin-top: 4px;
                    display: block;
                }

                .left-footer {
                    position: relative;
                    z-index: 1;
                    font-size: 13px;
                    color: #64748B;
                }

                /* ── RIGHT PANEL (FORM) ── */
                .right-panel {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 32px 24px;
                    background: var(--bg-main);
                }

                .form-card {
                    width: 100%;
                    max-width: 400px;
                    background: var(--bg-panel);
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
                    border: 1px solid var(--border);
                    opacity: 0;
                    transform: translateY(16px);
                    transition: opacity 0.5s ease, transform 0.5s ease;
                }

                .form-card.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .form-header { margin-bottom: 32px; }

                /* NEW: Mobile brand visibility */
                .mobile-brand {
                    display: inline-block;
                    margin-bottom: 16px;
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--primary);
                    background: var(--primary-light);
                    padding: 6px 12px;
                    border-radius: 6px;
                    letter-spacing: 0.02em;
                }

                @media (min-width: 1024px) {
                    .mobile-brand { display: none; }
                }

                .form-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    letter-spacing: -0.02em;
                }

                .form-subtitle {
                    margin-top: 8px;
                    font-size: 14px;
                    color: var(--text-secondary);
                    line-height: 1.5;
                }

                .demo-banner {
                    margin-top: 24px;
                    padding: 12px 16px;
                    background: var(--primary-light);
                    border: 1px solid rgba(79, 70, 229, 0.2);
                    border-radius: 8px;
                    font-size: 13px;
                    color: var(--primary-hover);
                }

                .demo-banner strong { font-weight: 600; }
                .demo-banner code {
                    background: #FFFFFF;
                    border: 1px solid rgba(79, 70, 229, 0.2);
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-size: 12px;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                    font-weight: 500;
                    margin: 0 2px;
                }

                .form-body { display: flex; flex-direction: column; gap: 20px; }

                .field { display: flex; flex-direction: column; gap: 6px; }

                .field-label {
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--text-primary);
                }

                .field-input {
                    width: 100%;
                    padding: 10px 14px;
                    font-family: inherit;
                    font-size: 14px;
                    color: var(--text-primary);
                    background: #FFFFFF;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    outline: none;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                }

                .field-input::placeholder { color: #94A3B8; }

                .field-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
                }

                .field-input:disabled {
                    background: var(--bg-main);
                    color: var(--text-secondary);
                    cursor: not-allowed;
                }

                .submit-btn {
                    margin-top: 8px;
                    width: 100%;
                    padding: 12px 24px;
                    font-family: inherit;
                    font-size: 14px;
                    font-weight: 500;
                    color: #FFFFFF;
                    background: var(--primary);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                }

                .submit-btn:hover:not(:disabled) {
                    background: var(--primary-hover);
                    box-shadow: 0 4px 6px -1px rgb(79 70 229 / 0.2);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #FFFFFF;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .error-box {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 16px;
                    padding: 12px;
                    background: var(--error-bg);
                    border: 1px solid var(--error-border);
                    border-radius: 8px;
                    font-size: 13px;
                    color: var(--error-text);
                }

                .form-footer {
                    margin-top: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .form-footer-text {
                    font-size: 12px;
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .form-version {
                    font-size: 12px;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
            `}</style>

            <div className="login-root">
                {/* ── LEFT PANEL ── */}
                <section className="left-panel">
                    <div className="left-top">
                        <div className="brand-badge">
                            AliadoMype Pro
                        </div>
                        <h1 className="left-headline">
                            Gestión inteligente<br /><span>para tu negocio.</span>
                        </h1>
                        <p className="left-sub">
                            Visualiza ventas, controla inventario y toma decisiones con datos en tiempo real desde una sola plataforma.
                        </p>
                    </div>

                    <div className="feature-list">
                        {[
                            { icon: '📊', title: 'Reportes en tiempo real', desc: 'Métricas clave actualizadas al instante.' },
                            { icon: '☁️', title: 'Infraestructura Cloud', desc: 'Acceso seguro y rápido desde cualquier lugar.' },
                            { icon: '⚡', title: 'Asistente Tributario', desc: 'Automatización y precisión con IA integrada.' },
                        ].map((f) => (
                            <div className="feature-item" key={f.title}>
                                <div className="feature-icon-wrapper">
                                    {f.icon}
                                </div>
                                <div className="feature-text">
                                    <strong>{f.title}</strong>
                                    <span>{f.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="left-footer">© 2026 AliadoMype · Todos los derechos reservados</div>
                </section>

                {/* ── RIGHT PANEL (FORM) ── */}
                <section className="right-panel">
                    <div className={`form-card ${mounted ? 'visible' : ''}`}>
                        <div className="form-header">
                            {/* BRAND VISIBLE ONLY ON MOBILE */}
                            <div className="mobile-brand">AliadoMype Pro</div>
                            
                            <h2 className="form-title">Iniciar sesión</h2>
                            <p className="form-subtitle">Ingresa a tu espacio de trabajo</p>

                            {isDemoMode && (
                                <div className="demo-banner">
                                    <strong>Modo Demo</strong> <br/>
                                    Usuario: <code>{DEMO_CREDENTIALS.username}</code> <br/>
                                    Clave: <code>{DEMO_CREDENTIALS.password}</code>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleLogin} className="form-body">
                            <div className="field">
                                <label className="field-label">Usuario</label>
                                <input
                                    type="text"
                                    placeholder="ej. admin@empresa.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="field-input"
                                    disabled={loading}
                                    autoComplete="username"
                                />
                            </div>

                            <div className="field">
                                <label className="field-label">Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="field-input"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                <span className="btn-inner">
                                    {loading ? (
                                        <>
                                            <span className="spinner" />
                                            Autenticando...
                                        </>
                                    ) : (
                                        'Ingresar a mi cuenta'
                                    )}
                                </span>
                            </button>
                        </form>

                        {error && (
                            <div className="error-box">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <div className="form-footer">
                            <span className="form-footer-text">
                                🔒 Conexión cifrada
                            </span>
                            <span className="form-version">v2.4.1</span>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default LoginPage;
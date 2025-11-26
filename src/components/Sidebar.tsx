import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const menuItems = [
        { label: '📊 Dashboard', path: '/dashboard' },
        { label: '📦 Productos', path: '/productos' },
        { label: '💰 Ventas', path: '/ventas' },
    ];

    return (
        <div style={styles.sidebar}>
            <div style={styles.logo}>AliadoMype</div>
            <nav style={styles.nav}>
                {menuItems.map((item) => (
                    <button 
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            ...styles.btn,
                            background: location.pathname === item.path ? '#34495e' : 'transparent'
                        }}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    sidebar: { width: '250px', background: '#2c3e50', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px' },
    logo: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' },
    nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
    btn: { padding: '15px', color: 'white', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '1rem', borderRadius: '8px', transition: '0.3s' },
    logoutBtn: { padding: '15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: 'auto' }
};

export default Sidebar;
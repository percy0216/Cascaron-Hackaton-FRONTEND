import React from 'react';
import Sidebar from './Sidebar';
import Chatbot from './Chatbot';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar fijo */}
            <Sidebar />
            
            {/* Contenido Principal: Flex 1 para que ocupe todo el espacio restante */}
            <main style={{ 
                flex: 1, 
                height: '100%', 
                overflowY: 'auto', 
                background: '#f4f7f6', 
                padding: '30px', // Más espacio interno
                position: 'relative'
            }}>
                <div style={{ maxWidth: '1600px', margin: '0 auto' }}> {/* Centrado en pantallas gigantes */}
                    {children}
                </div>
            </main>

            {/* Chatbot flotante (no afecta el layout) */}
            <Chatbot />
        </div>
    );
};
export default Layout;
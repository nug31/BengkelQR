import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench, PlusCircle, LayoutDashboard } from 'lucide-react';

const Header = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                <Wrench size={24} />
                <span>WorkshopQR</span>
            </Link>
            <div className="nav-links">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                    Dashboard
                </Link>
                <Link to="/generator" className={location.pathname === '/generator' ? 'active' : ''}>
                    QR Generator
                </Link>
                <Link to="/add" className={`btn btn-primary ${location.pathname === '/add' ? 'active' : ''}`} style={{ color: 'var(--bg-dark)' }}>
                    <PlusCircle size={18} />
                    Add Tool
                </Link>
            </div>
        </nav>
    );
};

const Layout = ({ children }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const isScanView = query.get('view') === 'scan';

    return (
        <div>
            {!isScanView && <Header />}
            <main className="layout" style={{ paddingTop: isScanView ? '40px' : '' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;

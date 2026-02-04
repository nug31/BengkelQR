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
                <Link to="/add" className={`btn btn-primary ${location.pathname === '/add' ? 'active' : ''}`} style={{ color: 'var(--bg-dark)' }}>
                    <PlusCircle size={18} />
                    Add Tool
                </Link>
            </div>
        </nav>
    );
};

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            <main className="layout">
                {children}
            </main>
        </div>
    );
};

export default Layout;

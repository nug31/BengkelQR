import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Wrench, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, getJurusan, isAdmin } = useAuth();
    const jurusan = getJurusan();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                <Wrench size={24} />
                <span>WorkshopQR</span>
            </Link>
            <div className="nav-links">
                {jurusan && (
                    <span className="badge badge-good no-print" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                        {isAdmin ? 'Admin' : jurusan}
                    </span>
                )}
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                    Dashboard
                </Link>
                <Link to="/add" className={`btn btn-primary ${location.pathname === '/add' ? 'active' : ''}`} style={{ color: 'var(--bg-dark)' }}>
                    <PlusCircle size={18} />
                    Add Tool
                </Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px', border: 'none' }} title="Logout">
                    <LogOut size={18} />
                </button>
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

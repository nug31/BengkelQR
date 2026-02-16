import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wrench } from 'lucide-react';

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message || 'Failed to login');
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div style={{ textAlign: 'center' }}>
                    <div className="login-logo">
                        <Wrench size={30} />
                    </div>
                    <h1 className="login-title">BengkelQR</h1>
                    <p className="login-subtitle">Masuk ke sistem manajemen alat</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="tkr@bengkel.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowRight } from 'lucide-react';

const ToolCard = ({ tool }) => {
    const getStatusBadge = (status, condition) => {
        if (condition === 'Broken') return <span className="badge badge-maintenance">Maintenance</span>;
        if (status === 'In Use') return <span className="badge badge-damaged">In Use</span>;
        return <span className="badge badge-good">Available</span>;
    };

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '160px', background: 'var(--bg-accent)', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
                {tool.image ? (
                    <img
                        src={tool.image}
                        alt={tool.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <QrCode size={48} strokeWidth={1} />
                    </div>
                )}
            </div>

            <div style={{ padding: '20px' }}>
                <div className="flex-between">
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>#{tool.id}</span>
                    {getStatusBadge(tool.status, tool.condition)}
                </div>

                <h3 style={{ margin: '15px 0 5px 0' }}>{tool.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{tool.category}</p>

                <div className="flex-between mt-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                    <Link to={`/tool/${tool.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
                        <ArrowRight size={16} />
                        <span>Manage & Details</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ToolCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowRight } from 'lucide-react';

const ToolCard = ({ tool, index = 0 }) => {
    const getStatusBadge = (status, condition) => {
        if (condition === 'Broken') return <span className="badge badge-maintenance">Maintenance</span>;
        if (status === 'In Use') return <span className="badge badge-damaged">In Use</span>;
        return <span className="badge badge-good">Available</span>;
    };

    return (
        <div className="tool-card" style={{ animationDelay: `${index * 0.08}s` }}>
            {/* Image with gradient overlay */}
            <div className="tool-card-image">
                {tool.image ? (
                    <>
                        <img src={tool.image} alt={tool.name} />
                        <div className="tool-card-image-overlay" />
                    </>
                ) : (
                    <div className="tool-card-image-placeholder">
                        <QrCode size={48} strokeWidth={1} />
                    </div>
                )}
            </div>

            {/* Card Body */}
            <div className="tool-card-body">
                <div className="tool-card-meta">
                    <span className="tool-card-id">#{tool.id}</span>
                    {getStatusBadge(tool.status, tool.condition)}
                </div>

                <h3 className="tool-card-title">{tool.name}</h3>

                {tool.status === 'In Use' && tool.currentBorrower && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                        <span>Dipinjam: <strong>{tool.currentBorrower.name}</strong></span>
                    </div>
                )}

                <div className="tool-card-tags">
                    <span className={`jurusan-chip jurusan-chip-${tool.jurusan}`}>{tool.jurusan}</span>
                    <span className="tool-card-category">{tool.category}</span>
                </div>

                <div className="tool-card-action">
                    <Link to={`/tool/${tool.id}`} className="btn btn-outline">
                        <ArrowRight size={16} />
                        <span>Manage & Details</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ToolCard;

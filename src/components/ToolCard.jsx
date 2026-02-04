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
        <div className="card">
            <div className="flex-between">
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>#{tool.id}</span>
                {getStatusBadge(tool.status, tool.condition)}
            </div>

            <h3 style={{ margin: '10px 0 5px 0' }}>{tool.name}</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{tool.category}</p>

            <div className="flex-between mt-4">
                <Link to={`/tool/${tool.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    <QrCode size={16} />
                    <span>QR & Details</span>
                </Link>
            </div>
        </div>
    );
};

export default ToolCard;

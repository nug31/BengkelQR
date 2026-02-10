import React, { useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, Printer, Trash2, QrCode } from 'lucide-react';

const ToolDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const isScanView = query.get('view') === 'scan';

    const { getToolById, deleteTool } = useInventory();
    const tool = getToolById(id);
    const [showQR, setShowQR] = useState(false);

    const qrRef = useRef();

    if (!tool) {
        return <div className="text-muted">Tool not found</div>;
    }

    // URL with ?view=scan for the QR code
    const qrUrl = `${window.location.origin}/tool/${tool.id}?view=scan`;

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this tool?')) {
            deleteTool(tool.id);
            navigate('/');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className={`detail-container ${showQR ? 'has-qr' : ''}`}>
            <div className="detail-main">
                <div className="minimal-info">
                    {tool.image && (
                        <div style={{ marginBottom: '25px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <img
                                src={tool.image}
                                alt={tool.name}
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <h1 className="minimal-title">{tool.name}</h1>

                    <div className="minimal-field">
                        <label>Category</label>
                        <div className="minimal-value">{tool.category}</div>
                    </div>

                    <div className="minimal-field">
                        <label>Condition</label>
                        <div className="minimal-value">{tool.condition}</div>
                    </div>

                    <div className="minimal-field">
                        <label>Purchase Date</label>
                        <div className="minimal-value">{tool.purchaseDate}</div>
                    </div>

                    <div className="minimal-field">
                        <label>Description</label>
                        <p className="minimal-value">{tool.description || 'No description provided.'}</p>
                    </div>
                </div>

                {!isScanView && (
                    <div className="no-print mt-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
                        <button onClick={() => navigate('/')} className="btn btn-outline">
                            <ArrowLeft size={16} /> Dashboard
                        </button>
                        {!showQR && (
                            <button onClick={() => setShowQR(true)} className="btn btn-outline">
                                <QrCode size={16} /> Manage QR
                            </button>
                        )}
                        <button onClick={handleDelete} className="btn btn-outline" style={{ color: 'var(--accent-danger)', borderColor: 'var(--accent-danger)' }}>
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                )}
            </div>

            {/* QR Section */}
            {(showQR) && (
                <div className="qr-section no-print">
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '100%', textAlign: 'right', marginBottom: '10px' }}>
                            <button onClick={() => setShowQR(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Close</button>
                        </div>
                        <h3 className="text-xl">QR Code Label</h3>
                        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '10px' }} ref={qrRef}>
                            <QRCodeCanvas value={qrUrl} size={180} />
                        </div>
                        <div style={{ color: 'black', background: 'white', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {tool.name}
                        </div>
                        <div style={{ marginTop: '20px', width: '100%' }}>
                            <button onClick={handlePrint} className="btn btn-primary" style={{ width: '100%' }}>
                                <Printer size={18} /> Print Label
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolDetail;

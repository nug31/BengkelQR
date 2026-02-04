import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, Printer, Trash2, QrCode } from 'lucide-react';

const ToolDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToolById, deleteTool } = useInventory();
    const tool = getToolById(id);
    const [showQR, setShowQR] = useState(false);

    const qrRef = useRef();

    if (!tool) {
        return <div className="text-muted">Tool not found</div>;
    }

    // URL that will be encoded in the QR code
    const qrUrl = `${window.location.origin}/tool/${tool.id}`;

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
        <div className="detail-container">
            <div className="detail-main">
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }} className="no-print">
                    <button onClick={() => navigate('/')} className="btn btn-outline" title="Back to Dashboard">
                        <ArrowLeft size={16} /> Back
                    </button>
                    {!showQR && (
                        <button onClick={() => setShowQR(true)} className="btn btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                            <QrCode size={16} /> Show QR Label
                        </button>
                    )}
                </div>

                <div className="card">
                    <div className="flex-between">
                        <h1 className="text-xl" style={{ marginBottom: 0 }}>{tool.name}</h1>
                        <span className={`badge ${tool.condition === 'Broken' ? 'badge-maintenance' : 'badge-good'}`}>
                            {tool.status}
                        </span>
                    </div>

                    <div style={{ marginTop: '20px', display: 'grid', gap: '15px' }}>
                        <div>
                            <label>Category</label>
                            <div style={{ fontWeight: 500 }}>{tool.category}</div>
                        </div>
                        <div>
                            <label>Condition</label>
                            <div style={{ fontWeight: 500 }}>{tool.condition}</div>
                        </div>
                        <div>
                            <label>Purchase Date</label>
                            <div style={{ fontWeight: 500 }}>{tool.purchaseDate}</div>
                        </div>
                        <div>
                            <label>Description</label>
                            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{tool.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    <div className="no-print" style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                        <button onClick={handleDelete} className="btn btn-outline" style={{ color: 'var(--accent-danger)', borderColor: 'var(--accent-danger)' }}>
                            <Trash2 size={16} /> Delete Tool
                        </button>
                    </div>
                </div>
            </div>

            {/* QR Section - can be toggled or visible in print */}
            {(showQR) && (
                <div className="qr-section">
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div className="no-print" style={{ width: '100%', textAlign: 'right', marginBottom: '10px' }}>
                            <button onClick={() => setShowQR(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Close</button>
                        </div>
                        <h3 className="text-xl">QR Code Label</h3>
                        <p className="text-muted no-print" style={{ marginBottom: '20px' }}>Scan to view details</p>

                        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '10px' }} ref={qrRef}>
                            <QRCodeCanvas value={qrUrl} size={180} />
                        </div>
                        <div style={{ color: 'black', background: 'white', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {tool.name}
                        </div>

                        <div className="no-print" style={{ marginTop: '20px', width: '100%' }}>
                            <button onClick={handlePrint} className="btn btn-primary" style={{ width: '100%' }}>
                                <Printer size={18} />
                                Print Label
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolDetail;

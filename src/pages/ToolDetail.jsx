import React, { useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, Printer, Trash2, QrCode, Edit, Download } from 'lucide-react';

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

    // --- SCAN VIEW: PDF-like layout ---
    if (isScanView) {
        return (
            <div className="scan-pdf-container">
                <div className="scan-pdf-page">
                    {/* Header */}
                    <div className="scan-pdf-header">
                        <div>
                            <h1 className="scan-pdf-title">{tool.name}</h1>
                            <p className="scan-pdf-subtitle">Jurusan: {tool.jurusan} | Kategori: {tool.category}</p>
                        </div>
                        <div className="scan-pdf-badge">
                            <span className={`badge ${tool.condition === 'Broken' ? 'badge-maintenance' : tool.status === 'In Use' ? 'badge-damaged' : 'badge-good'}`}>
                                {tool.condition === 'Broken' ? 'Maintenance' : tool.status === 'In Use' ? 'In Use' : 'Available'}
                            </span>
                        </div>
                    </div>

                    {/* Tool Image */}
                    {tool.image && (
                        <div className="scan-pdf-image-section">
                            <img src={tool.image} alt={tool.name} className="scan-pdf-image" />
                        </div>
                    )}

                    {/* Specifications Table */}
                    <div className="scan-pdf-section">
                        <h2 className="scan-pdf-section-title">📋 Spesifikasi Alat</h2>
                        <table className="scan-pdf-table">
                            <tbody>
                                <tr><td className="scan-pdf-label">Nama Alat</td><td>{tool.name}</td></tr>
                                <tr><td className="scan-pdf-label">Kategori</td><td>{tool.category}</td></tr>
                                <tr><td className="scan-pdf-label">Jurusan</td><td>{tool.jurusan}</td></tr>
                                <tr><td className="scan-pdf-label">Kondisi</td><td>{tool.condition}</td></tr>
                                <tr><td className="scan-pdf-label">Status</td><td>{tool.status}</td></tr>
                                <tr><td className="scan-pdf-label">Tanggal Pembelian</td><td>{tool.purchaseDate}</td></tr>
                                {tool.description && <tr><td className="scan-pdf-label">Deskripsi</td><td>{tool.description}</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    {/* SOP Section */}
                    {tool.sop && tool.sop.length > 0 && (
                        <div className="scan-pdf-section">
                            <h2 className="scan-pdf-section-title">📖 SOP - Langkah Penggunaan</h2>
                            <ol className="scan-pdf-sop-list">
                                {tool.sop.map((step, index) => (
                                    <li key={index} className="scan-pdf-sop-step">
                                        <span className="scan-pdf-step-number">{index + 1}</span>
                                        <span className="scan-pdf-step-text">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="scan-pdf-footer">
                        <p>Dokumen ini di-generate otomatis oleh sistem BengkelQR</p>
                        <p>Tanggal cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                {/* Action Buttons (hidden in print) */}
                <div className="no-print" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button onClick={handlePrint} className="btn btn-primary">
                        <Download size={18} /> Download / Print PDF
                    </button>
                </div>
            </div>
        );
    }

    // --- NORMAL VIEW ---
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
                        <label>Jurusan</label>
                        <div className="minimal-value">{tool.jurusan}</div>
                    </div>

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

                    {/* SOP in normal view */}
                    {tool.sop && tool.sop.length > 0 && (
                        <div className="minimal-field">
                            <label>SOP - Langkah Penggunaan</label>
                            <ol style={{ paddingLeft: '20px', margin: '10px 0' }}>
                                {tool.sop.map((step, index) => (
                                    <li key={index} style={{ marginBottom: '6px', color: 'var(--text-primary)' }}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>

                {!isScanView && (
                    <div className="no-print mt-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
                        <button onClick={() => navigate('/')} className="btn btn-outline">
                            <ArrowLeft size={16} /> Dashboard
                        </button>
                        <button onClick={() => navigate(`/edit/${tool.id}`)} className="btn btn-outline">
                            <Edit size={16} /> Edit Tool
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

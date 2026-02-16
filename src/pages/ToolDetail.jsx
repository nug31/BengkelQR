import React, { useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, Printer, Trash2, QrCode, Edit, Download, Wrench } from 'lucide-react';

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

    const { getJurusan, isAdmin } = useAuth();
    const userJurusan = getJurusan();

    // Security: Only owner or admin can edit/delete
    const canManage = isAdmin || (tool?.jurusan === userJurusan);

    if (!tool) return null;

    const qrUrl = window.location.origin + `/tool/${id}?view=scan`;

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this tool?')) {
            await deleteTool(id);
            navigate('/');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // --- SCAN / PDF VIEW ---
    if (isScanView) {
        const getStatusLabel = () => {
            if (tool.condition === 'Broken') return { text: 'MAINTENANCE', cls: 'scan-badge-danger' };
            if (tool.status === 'In Use') return { text: 'IN USE', cls: 'scan-badge-warning' };
            return { text: 'AVAILABLE', cls: 'scan-badge-success' };
        };
        const statusInfo = getStatusLabel();

        return (
            <div className="layout scan-pdf-container">
                <div className="scan-pdf-card">
                    {/* HEADER: Tool name + subtitle + badge */}
                    <header className="scan-header-v2">
                        <div className="scan-header-text">
                            <h1>{tool.name}</h1>
                            <p>Jurusan: {tool.jurusan} | Kategori: {tool.category}</p>
                        </div>
                        <span className={`scan-status-badge ${statusInfo.cls}`}>{statusInfo.text}</span>
                    </header>

                    {/* IMAGE */}
                    {tool.image && (
                        <div className="scan-image-wrapper">
                            <img src={tool.image} alt={tool.name} />
                        </div>
                    )}

                    {/* SPESIFIKASI ALAT */}
                    <div className="scan-section">
                        <h2 className="scan-section-title">📋 Spesifikasi Alat</h2>
                        <table className="scan-spec-table">
                            <tbody>
                                <tr><td className="scan-spec-label">Nama Alat</td><td>{tool.name}</td></tr>
                                <tr><td className="scan-spec-label">Kategori</td><td>{tool.category}</td></tr>
                                <tr><td className="scan-spec-label">Jurusan</td><td>{tool.jurusan}</td></tr>
                                <tr><td className="scan-spec-label">Kondisi</td><td>{tool.condition}</td></tr>
                                <tr><td className="scan-spec-label">Status</td><td>{tool.status}</td></tr>
                                <tr><td className="scan-spec-label">Tanggal Pembelian</td><td>{tool.purchaseDate}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* SOP */}
                    {tool.sop && tool.sop.length > 0 && (
                        <div className="scan-section">
                            <h2 className="scan-section-title">📖 SOP - Langkah Penggunaan</h2>
                            <div className="scan-sop-list">
                                {tool.sop.map((step, idx) => (
                                    <div key={idx} className="scan-sop-item">
                                        <span className="scan-sop-number">{idx + 1}</span>
                                        <p>{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FOOTER */}
                    <footer className="scan-footer-v2">
                        <p>Dokumen ini di-generate otomatis oleh sistem BengkelQR</p>
                    </footer>
                </div>

                {/* DOWNLOAD BUTTON */}
                <div className="no-print" style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '40px' }}>
                    <button onClick={handlePrint} className="btn btn-primary scan-download-btn">
                        <Download size={18} /> Download / Print PDF
                    </button>
                </div>
            </div>
        );
    }

    // --- NORMAL VIEW ---
    return (
        <div className={`detail-container ${showQR ? 'has-qr' : ''}`}>
            <div className={`detail-main ${showQR ? 'no-print' : ''}`}>
                <div className="minimal-info">
                    {tool.image && (
                        <div style={{ marginBottom: '25px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', maxWidth: '350px' }}>
                            <img src={tool.image} alt={tool.name} style={{ width: '100%', display: 'block', maxHeight: '250px', objectFit: 'cover' }} />
                        </div>
                    )}

                    <h1 className="minimal-title">{tool.name}</h1>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '10px' }}>
                        <div className="minimal-field">
                            <label>Jurusan</label>
                            <p className="minimal-value">{tool.jurusan}</p>
                        </div>
                        <div className="minimal-field">
                            <label>Category</label>
                            <p className="minimal-value">{tool.category}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '10px' }}>
                        <div className="minimal-field">
                            <label>Condition</label>
                            <p className="minimal-value">{tool.condition}</p>
                        </div>
                        <div className="minimal-field">
                            <label>Purchase Date</label>
                            <p className="minimal-value">{tool.purchaseDate}</p>
                        </div>
                    </div>

                    <div className="minimal-field">
                        <label>Description</label>
                        <p className="minimal-value" style={{ fontWeight: '400', lineHeight: '1.6' }}>
                            {tool.description || 'No description provided.'}
                        </p>
                    </div>

                    {tool.sop && tool.sop.length > 0 && (
                        <div className="minimal-field" style={{ marginTop: '10px' }}>
                            <label>SOP Penggunaan</label>
                            <ol style={{ paddingLeft: '20px', marginTop: '10px', color: 'var(--text-primary)' }}>
                                {tool.sop.map((step, idx) => (
                                    <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>
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

                        {canManage && (
                            <>
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
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* QR Section */}
            {(showQR) && (
                <div className="qr-section no-print">
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div className="no-print" style={{ width: '100%', textAlign: 'right', marginBottom: '10px' }}>
                            <button onClick={() => setShowQR(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Close</button>
                        </div>
                        <h3 className="text-xl no-print">QR Code Label</h3>
                        <div className="printable-qr-label" ref={qrRef}>
                            <div className="qr-printable-content">
                                <QRCodeCanvas value={qrUrl} size={180} />
                                <div className="qr-tool-name">
                                    {tool.name}
                                </div>
                            </div>
                        </div>
                        <div className="no-print" style={{ marginTop: '20px', width: '100%' }}>
                            <button onClick={handlePrint} className="btn btn-primary" style={{ width: '100%' }}>
                                <Printer size={18} /> Print QR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolDetail;

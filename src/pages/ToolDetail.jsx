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
        return (
            <div className="layout scan-pdf-container">
                <div className="scan-pdf-card">
                    {/* Header Brand */}
                    <header className="scan-pdf-header">
                        <div className="scan-pdf-brand">
                            <Wrench size={32} />
                            <div>
                                <h2>BENGKEL SEKOLAH</h2>
                                <p>Sistem Manajemen Inventaris Alat</p>
                            </div>
                        </div>
                    </header>

                    {/* 1. SPESIFIKASI ALAT */}
                    <div className="scan-pdf-content">
                        {tool.image && (
                            <div className="scan-pdf-image-section">
                                <img src={tool.image} alt={tool.name} className="scan-pdf-image" />
                            </div>
                        )}

                        <div style={{ padding: '25px 35px' }}>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 20px 0', color: 'var(--text-primary)' }}>{tool.name}</h1>

                            <div className="scan-pdf-specs">
                                <div className="scan-pdf-spec-item">
                                    <label>Jurusan</label>
                                    <div className="scan-pdf-badge">{tool.jurusan}</div>
                                </div>
                                <div className="scan-pdf-spec-item">
                                    <label>Kategori</label>
                                    <div>{tool.category}</div>
                                </div>
                                <div className="scan-pdf-spec-item">
                                    <label>Kondisi</label>
                                    <div>{tool.condition}</div>
                                </div>
                                <div className="scan-pdf-spec-item">
                                    <label>Status</label>
                                    <div>{tool.status}</div>
                                </div>
                            </div>

                            <div className="scan-pdf-description">
                                <label>Deskripsi Alat</label>
                                <p>{tool.description || 'Tidak ada deskripsi tambahan.'}</p>
                            </div>
                        </div>

                        {/* 2. SOP */}
                        {tool.sop && tool.sop.length > 0 && (
                            <div className="scan-pdf-sop">
                                <h3>SOP / Langkah Penggunaan</h3>
                                <div className="scan-pdf-sop-grid">
                                    {tool.sop.map((step, idx) => (
                                        <div key={idx} className="scan-pdf-sop-step">
                                            <span className="step-number">{idx + 1}</span>
                                            <p>{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* QR Footer */}
                    <footer className="scan-pdf-footer">
                        <div className="scan-pdf-qr-block">
                            <QRCodeCanvas value={qrUrl} size={100} />
                            <p>Scan untuk info terbaru & SOP digital</p>
                        </div>
                        <div className="scan-pdf-meta">
                            <p>Dibuat: {new Date(tool.createdAt).toLocaleDateString('id-ID')}</p>
                            <p>Lokasi: Bengkel {tool.jurusan}</p>
                        </div>
                    </footer>
                </div>

                {/* 3. TOMBOL DOWNLOAD (Paling Bawah) */}
                <div className="no-print" style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '40px' }}>
                    <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1rem' }}>
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

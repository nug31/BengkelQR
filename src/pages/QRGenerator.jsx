import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Printer, Type, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QRGenerator = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('text'); // 'text' or 'image'
    const [inputText, setInputText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [qrValue, setQrValue] = useState('');
    const [copied, setCopied] = useState(false);
    const qrRef = useRef();

    const handleTextChange = (e) => {
        const val = e.target.value;
        setInputText(val);
        setQrValue(val);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                setImagePreview(base64);
                // Note: Large images will break QR code capacity
                if (base64.length > 2500) {
                    alert('Warning: Image data is too large for a standard QR code. Try a much smaller icon/file.');
                }
                setQrValue(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(qrValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-xl">QR Code Generator</h1>
                    <p className="text-muted">Convert text or small images to QR codes</p>
                </div>
                <button onClick={() => navigate('/')} className="btn btn-outline">Back to Dashboard</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
                <div className="card">
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <button
                            className={`btn ${mode === 'text' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => { setMode('text'); setQrValue(inputText); }}
                            style={{ flex: 1 }}
                        >
                            <Type size={18} /> Text/URL
                        </button>
                        <button
                            className={`btn ${mode === 'image' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => { setMode('image'); setQrValue(imagePreview || ''); }}
                            style={{ flex: 1 }}
                        >
                            <ImageIcon size={18} /> Image
                        </button>
                    </div>

                    {mode === 'text' ? (
                        <div className="form-group">
                            <label>Input Text or URL</label>
                            <textarea
                                value={inputText}
                                onChange={handleTextChange}
                                placeholder="Paste your link or text here..."
                                rows="6"
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>Upload Small Image (Max 2KB recommended)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ marginBottom: '15px' }}
                            />
                            {imagePreview && (
                                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>Original Image Preview:</p>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px', border: '1px solid var(--border)' }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {qrValue && (
                        <button
                            onClick={handleCopy}
                            className="btn btn-outline"
                            style={{ width: '100%', marginTop: '10px', fontSize: '0.8rem' }}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied Data!' : 'Copy Raw Data'}
                        </button>
                    )}
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '20px' }}>Generated QR Code</h3>

                    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }} ref={qrRef}>
                        {qrValue ? (
                            <QRCodeCanvas value={qrValue} size={250} level="L" includeMargin={true} />
                        ) : (
                            <div style={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', border: '2px dashed #eee' }}>
                                Waiting for input...
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '25px', width: '100%' }}>
                        <button
                            disabled={!qrValue}
                            onClick={handlePrint}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            <Printer size={18} /> Print QR Code
                        </button>
                    </div>
                </div>
            </div>

            <div className="no-print mt-4 card" style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>💡 Pro Tip</h4>
                <p className="text-secondary" style={{ fontSize: '0.9rem', margin: '0' }}>
                    QR codes can store up to 3KB of data. If you upload an image and it's too complex, the QR code might become unreadable or fail to generate. Try simple icons or black & white logos for best results!
                </p>
            </div>
        </div>
    );
};

export default QRGenerator;

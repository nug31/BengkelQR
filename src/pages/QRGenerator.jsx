import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';
import { Printer, Type, Image as ImageIcon, Copy, Check, QrCode, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QRGenerator = () => {
    const navigate = useNavigate();
    const [inputMode, setInputMode] = useState('text'); // 'text' or 'image'
    const [outputMode, setOutputMode] = useState('qr'); // 'qr' or 'barcode'
    const [inputText, setInputText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [qrValue, setQrValue] = useState('');
    const [copied, setCopied] = useState(false);
    const codeRef = useRef();

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

    // Barcode can only handle short text/numbers, not Base64 image data
    const canShowBarcode = outputMode === 'barcode' && qrValue && qrValue.length < 80;
    const barcodeWarning = outputMode === 'barcode' && qrValue && qrValue.length >= 80;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-xl">QR & Barcode Generator</h1>
                    <p className="text-muted">Convert text, URLs, or images to QR codes & barcodes</p>
                </div>
                <button onClick={() => navigate('/')} className="btn btn-outline">Back to Dashboard</button>
            </div>

            {/* Output Mode Toggle */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: 'var(--bg-card)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <button
                    className={`btn ${outputMode === 'qr' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setOutputMode('qr')}
                    style={{ flex: 1, border: outputMode !== 'qr' ? 'none' : undefined }}
                >
                    <QrCode size={18} /> QR Code
                </button>
                <button
                    className={`btn ${outputMode === 'barcode' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setOutputMode('barcode')}
                    style={{ flex: 1, border: outputMode !== 'barcode' ? 'none' : undefined }}
                >
                    <BarChart3 size={18} /> Barcode
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
                {/* Input Panel */}
                <div className="card">
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <button
                            className={`btn ${inputMode === 'text' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => { setInputMode('text'); setQrValue(inputText); }}
                            style={{ flex: 1 }}
                        >
                            <Type size={18} /> Text/URL
                        </button>
                        <button
                            className={`btn ${inputMode === 'image' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => { setInputMode('image'); setQrValue(imagePreview || ''); }}
                            style={{ flex: 1 }}
                        >
                            <ImageIcon size={18} /> Image
                        </button>
                    </div>

                    {inputMode === 'text' ? (
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

                {/* Output Panel */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '20px' }}>
                        {outputMode === 'qr' ? 'Generated QR Code' : 'Generated Barcode'}
                    </h3>

                    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', minWidth: '280px' }} ref={codeRef}>
                        {outputMode === 'qr' ? (
                            qrValue ? (
                                <QRCodeCanvas value={qrValue} size={250} level="L" includeMargin={true} />
                            ) : (
                                <div style={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', border: '2px dashed #eee' }}>
                                    Waiting for input...
                                </div>
                            )
                        ) : (
                            canShowBarcode ? (
                                <Barcode
                                    value={qrValue}
                                    format="CODE128"
                                    width={2}
                                    height={80}
                                    displayValue={true}
                                    fontSize={14}
                                    margin={10}
                                />
                            ) : barcodeWarning ? (
                                <div style={{ width: '250px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e74c3c', border: '2px dashed #fee', padding: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
                                    ⚠️ Text too long for barcode. Max ~80 characters. Use QR Code for longer data.
                                </div>
                            ) : (
                                <div style={{ width: '250px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', border: '2px dashed #eee' }}>
                                    Waiting for input...
                                </div>
                            )
                        )}
                    </div>

                    <div style={{ marginTop: '25px', width: '100%' }}>
                        <button
                            disabled={!qrValue || (outputMode === 'barcode' && !canShowBarcode)}
                            onClick={handlePrint}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            <Printer size={18} /> Print {outputMode === 'qr' ? 'QR Code' : 'Barcode'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="no-print mt-4 card" style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>💡 Tips</h4>
                <ul className="text-secondary" style={{ fontSize: '0.9rem', margin: '0', paddingLeft: '20px' }}>
                    <li><strong>QR Code</strong> — Supports up to ~3KB of data. Great for URLs, long text, and small images.</li>
                    <li><strong>Barcode</strong> — Best for short text, product codes, or serial numbers (max ~80 characters).</li>
                    <li>For images, use <strong>QR Code</strong> mode since barcodes can't handle image data.</li>
                </ul>
            </div>
        </div>
    );
};

export default QRGenerator;

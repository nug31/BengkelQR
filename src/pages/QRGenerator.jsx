import React, { useState, useRef } from 'react';
import Barcode from 'react-barcode';
import { Printer, Type, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BarcodeGenerator = () => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [copied, setCopied] = useState(false);
    const codeRef = useRef();

    const handleTextChange = (e) => {
        setInputText(e.target.value);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(inputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const canShowBarcode = inputText && inputText.length > 0 && inputText.length < 80;
    const tooLong = inputText && inputText.length >= 80;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-xl">Barcode Generator</h1>
                    <p className="text-muted">Convert text, serial numbers, or product codes to barcodes</p>
                </div>
                <button onClick={() => navigate('/')} className="btn btn-outline">Back to Dashboard</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
                {/* Input Panel */}
                <div className="card">
                    <div className="form-group">
                        <label><Type size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Input Text or Code</label>
                        <textarea
                            value={inputText}
                            onChange={handleTextChange}
                            placeholder="Enter serial number, product code, or short text..."
                            rows="6"
                            style={{ resize: 'vertical' }}
                        />
                        <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '8px' }}>
                            {inputText.length}/80 characters
                        </p>
                    </div>

                    {inputText && (
                        <button
                            onClick={handleCopy}
                            className="btn btn-outline"
                            style={{ width: '100%', marginTop: '10px', fontSize: '0.8rem' }}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy Text'}
                        </button>
                    )}
                </div>

                {/* Output Panel */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '20px' }}>Generated Barcode</h3>

                    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', minWidth: '280px' }} ref={codeRef}>
                        {canShowBarcode ? (
                            <Barcode
                                value={inputText}
                                format="CODE128"
                                width={2}
                                height={80}
                                displayValue={true}
                                fontSize={14}
                                margin={10}
                            />
                        ) : tooLong ? (
                            <div style={{ width: '250px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e74c3c', border: '2px dashed #fee', padding: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
                                ⚠️ Text too long for barcode. Maximum ~80 characters.
                            </div>
                        ) : (
                            <div style={{ width: '250px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', border: '2px dashed #eee' }}>
                                Waiting for input...
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '25px', width: '100%' }}>
                        <button
                            disabled={!canShowBarcode}
                            onClick={handlePrint}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            <Printer size={18} /> Print Barcode
                        </button>
                    </div>
                </div>
            </div>

            <div className="no-print mt-4 card" style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>💡 Tips</h4>
                <ul className="text-secondary" style={{ fontSize: '0.9rem', margin: '0', paddingLeft: '20px' }}>
                    <li>Barcode format: <strong>CODE128</strong> — supports letters, numbers, and symbols.</li>
                    <li>Best for serial numbers, product codes, or short identifiers.</li>
                    <li>Maximum ~80 characters for readable barcodes.</li>
                </ul>
            </div>
        </div>
    );
};

export default BarcodeGenerator;

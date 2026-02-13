import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';

const AddTool = () => {
    const navigate = useNavigate();
    const { addTool } = useInventory();
    const { getJurusan, isAdmin } = useAuth();
    const userJurusan = getJurusan();

    const [formData, setFormData] = useState({
        name: '',
        category: 'Hand Tools',
        jurusan: userJurusan || 'TKR',
        condition: 'Good',
        status: 'Available',
        description: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        image: null,
        sop: ['']
    });
    const [imageError, setImageError] = useState('');

    // Update jurusan if it loads later
    useEffect(() => {
        if (userJurusan && !isAdmin) {
            setFormData(prev => ({ ...prev, jurusan: userJurusan }));
        }
    }, [userJurusan, isAdmin]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 200 * 1024) {
                setImageError('Image size must be less than 200KB');
                return;
            }
            setImageError('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (imageError) return;
        const cleanData = { ...formData, sop: formData.sop.filter(s => s.trim()) };
        addTool(cleanData);
        navigate('/');
    };

    const handleSopChange = (index, value) => {
        const newSop = [...formData.sop];
        newSop[index] = value;
        setFormData({ ...formData, sop: newSop });
    };

    const addSopStep = () => {
        setFormData({ ...formData, sop: [...formData.sop, ''] });
    };

    const removeSopStep = (index) => {
        const newSop = formData.sop.filter((_, i) => i !== index);
        setFormData({ ...formData, sop: newSop.length ? newSop : [''] });
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '20px' }}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="card">
                <h1 className="text-xl">Add New Tool</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tool Photo (Max 200KB)</label>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ padding: '0', border: 'none', background: 'transparent' }}
                            />
                            {imageError && <div style={{ color: 'var(--accent-danger)', fontSize: '0.8rem', marginTop: '5px' }}>{imageError}</div>}
                            {formData.image && (
                                <div style={{ marginTop: '10px', position: 'relative', width: '100px', height: '100px' }}>
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                                        style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--accent-danger)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tool Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Bosch Cordless Drill"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option>Hand Tools</option>
                                <option>Power Tools</option>
                                <option>Measuring</option>
                                <option>Safety Gear</option>
                                <option>Consumables</option>
                                <option>Other</option>
                                <option>Automotive Emission Analyzer</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Jurusan</label>
                            <select
                                name="jurusan"
                                value={formData.jurusan}
                                onChange={handleChange}
                                disabled={!isAdmin}
                            >
                                <option value="TKR">TKR</option>
                                <option value="TSM">TSM</option>
                                <option value="Mesin">Teknik Mesin</option>
                                <option value="Elind">Teknik Elind</option>
                                <option value="Listrik">Teknik Listrik</option>
                                <option value="Akuntansi">Akuntansi</option>
                                <option value="Perhotelan">Perhotelan</option>
                                <option value="TKI">TKI (Teknik Kimia Industri)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label>Condition</label>
                            <select name="condition" value={formData.condition} onChange={handleChange}>
                                <option>New</option>
                                <option>Good</option>
                                <option>Fair</option>
                                <option>Broken</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Purchase Date</label>
                            <input
                                type="date"
                                name="purchaseDate"
                                value={formData.purchaseDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter serial number or other details..."
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>SOP - Langkah Penggunaan</label>
                        {formData.sop.map((step, index) => (
                            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', minWidth: '24px' }}>{index + 1}.</span>
                                <input
                                    type="text"
                                    value={step}
                                    onChange={(e) => handleSopChange(index, e.target.value)}
                                    placeholder={`Langkah ${index + 1}...`}
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSopStep(index)}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', padding: '4px' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSopStep}
                            className="btn btn-outline"
                            style={{ width: '100%', marginTop: '8px', fontSize: '0.85rem' }}
                        >
                            <Plus size={14} /> Tambah Langkah
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        <Save size={18} />
                        Save Tool
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTool;

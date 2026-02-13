import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { Save, ArrowLeft } from 'lucide-react';

const AddTool = () => {
    const navigate = useNavigate();
    const { addTool } = useInventory();

    const [formData, setFormData] = useState({
        name: '',
        category: 'Hand Tools',
        jurusan: 'TKR',
        condition: 'Good',
        status: 'Available',
        description: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        image: null
    });
    const [imageError, setImageError] = useState('');

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
        addTool(formData);
        navigate('/');
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
                            <select name="jurusan" value={formData.jurusan} onChange={handleChange}>
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

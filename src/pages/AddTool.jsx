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
        condition: 'Good',
        status: 'Available',
        description: '',
        purchaseDate: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Condition</label>
                            <select name="condition" value={formData.condition} onChange={handleChange}>
                                <option>New</option>
                                <option>Good</option>
                                <option>Fair</option>
                                <option>Broken</option>
                            </select>
                        </div>
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

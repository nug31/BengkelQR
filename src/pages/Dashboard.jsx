import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import ToolCard from '../components/ToolCard';
import { Search } from 'lucide-react';

const Dashboard = () => {
    const { tools } = useInventory();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-xl">Workshop Inventory</h1>
                    <p className="text-muted">Manage your tools and equipment</p>
                </div>

                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search tools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '35px' }}
                    />
                </div>
            </div>

            <div className="grid-layout">
                {filteredTools.length > 0 ? (
                    filteredTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))
                ) : (
                    <div className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                        No tools found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

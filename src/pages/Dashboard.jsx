import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import ToolCard from '../components/ToolCard';
import { Search } from 'lucide-react';

const Dashboard = () => {
    const { tools, loading } = useInventory();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJurusan, setSelectedJurusan] = useState('All');

    const jurusans = [
        { id: 'All', label: 'Semua' },
        { id: 'TKR', label: 'TKR' },
        { id: 'TSM', label: 'TSM' },
        { id: 'Mesin', label: 'Teknik Mesin' },
        { id: 'Elind', label: 'Elind' },
        { id: 'Listrik', label: 'Listrik' },
        { id: 'Akuntansi', label: 'Akuntansi' },
        { id: 'Perhotelan', label: 'Perhotelan' },
        { id: 'TKI', label: 'TKI' }
    ];

    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJurusan = selectedJurusan === 'All' || tool.jurusan === selectedJurusan;
        return matchesSearch && matchesJurusan;
    });

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h1 className="text-xl" style={{ marginBottom: '5px' }}>Workshop Inventory</h1>
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

            <div className="dept-nav">
                {jurusans.map(j => (
                    <button
                        key={j.id}
                        className={`dept-chip ${selectedJurusan === j.id ? 'active' : ''}`}
                        onClick={() => setSelectedJurusan(j.id)}
                    >
                        {j.label}
                    </button>
                ))}
            </div>

            <div className="grid-layout">
                {loading ? (
                    <div className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                        Loading tools...
                    </div>
                ) : filteredTools.length > 0 ? (
                    filteredTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))
                ) : (
                    <div className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                        No tools found matching your search.
                    </div>
                )
                }
            </div>
        </div>
    );
};

export default Dashboard;

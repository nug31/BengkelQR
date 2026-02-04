import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

const LOCAL_STORAGE_KEY = 'workshop_inventory_v1';

export const InventoryProvider = ({ children }) => {
  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Hammer Drill X500',
        category: 'Power Tools',
        condition: 'Good',
        status: 'Available',
        description: 'Heavy duty drill for masonry work.',
        purchaseDate: '2025-01-15'
      },
      {
        id: '2',
        name: 'Wrench Set (Metric)',
        category: 'Hand Tools',
        condition: 'Good',
        status: 'In Use',
        description: 'Complete set 6mm-24mm',
        purchaseDate: '2024-11-20'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tools));
  }, [tools]);

  const addTool = (tool) => {
    const newTool = { ...tool, id: Date.now().toString() };
    setTools(prev => [newTool, ...prev]);
  };

  const updateTool = (id, updatedFields) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const deleteTool = (id) => {
    setTools(prev => prev.filter(t => t.id !== id));
  };

  const getToolById = (id) => tools.find(t => t.id === id);

  return (
    <InventoryContext.Provider value={{ tools, addTool, updateTool, deleteTool, getToolById }}>
      {children}
    </InventoryContext.Provider>
  );
};

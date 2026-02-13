import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

const LOCAL_STORAGE_KEY = 'workshop_inventory_v1';

export const InventoryProvider = ({ children }) => {
  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      {
        id: '3',
        name: 'Four Gas Analyzer Qrotech QRO - 402',
        category: 'Automotive Emission Analyzer',
        jurusan: 'TKR',
        condition: 'Good',
        status: 'Available',
        description: 'Alat uji gas emisi kendaraan berbahan bakar bensin. Heavy Duty dan High Accuracy.',
        purchaseDate: '2026-02-10',
        sop: [
          'Pastikan alat dalam kondisi baik dan kabel terhubung dengan benar.',
          'Nyalakan alat dan tunggu proses pemanasan selama 10 menit.',
          'Hubungkan probe ke knalpot kendaraan.',
          'Tekan tombol START untuk memulai pengukuran.',
          'Baca hasil pengukuran gas CO, HC, CO2, dan O2 pada layar.',
          'Setelah selesai, cabut probe dan matikan alat.',
          'Bersihkan probe dan simpan alat di tempat yang kering.'
        ]
      },
      {
        id: '1',
        name: 'Hammer Drill X500',
        category: 'Power Tools',
        jurusan: 'Mesin',
        condition: 'Good',
        status: 'Available',
        description: 'Heavy duty drill for masonry work.',
        purchaseDate: '2025-01-15',
        sop: [
          'Periksa kondisi mata bor dan pastikan terpasang dengan benar.',
          'Hubungkan kabel power ke sumber listrik.',
          'Atur kecepatan putaran sesuai jenis material.',
          'Tekan tombol trigger perlahan untuk memulai pengeboran.',
          'Gunakan tekanan yang stabil dan konsisten.',
          'Setelah selesai, matikan alat dan cabut dari sumber listrik.',
          'Bersihkan mata bor dan simpan alat dengan rapi.'
        ]
      },
      {
        id: '2',
        name: 'Wrench Set (Metric)',
        category: 'Hand Tools',
        jurusan: 'TKR',
        condition: 'Good',
        status: 'In Use',
        description: 'Complete set 6mm-24mm',
        purchaseDate: '2024-11-20',
        sop: [
          'Pilih ukuran kunci pas yang sesuai dengan mur/baut.',
          'Pasang kunci pada mur/baut dengan posisi yang tepat.',
          'Putar searah jarum jam untuk mengencangkan, berlawanan untuk mengendurkan.',
          'Jangan gunakan perpanjangan tuas yang tidak sesuai.',
          'Setelah selesai, bersihkan dan kembalikan ke tempat penyimpanan.'
        ]
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

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tools from Supabase
  const fetchTools = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tools:', error);
    } else {
      // Map snake_case DB fields to camelCase used in the app
      const mapped = data.map(t => ({
        id: t.id,
        name: t.name,
        category: t.category,
        jurusan: t.jurusan,
        condition: t.condition,
        status: t.status,
        description: t.description,
        purchaseDate: t.purchase_date,
        image: t.image,
        sop: t.sop || [],
        createdAt: t.created_at
      }));
      setTools(mapped);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const addTool = async (toolData) => {
    const { data, error } = await supabase
      .from('tools')
      .insert([{
        name: toolData.name,
        category: toolData.category,
        jurusan: toolData.jurusan,
        condition: toolData.condition,
        status: toolData.status,
        description: toolData.description,
        purchase_date: toolData.purchaseDate,
        image: toolData.image,
        sop: toolData.sop || []
      }])
      .select();

    if (error) {
      console.error('Error adding tool:', error);
    } else if (data && data.length > 0) {
      const t = data[0];
      const newTool = {
        id: t.id,
        name: t.name,
        category: t.category,
        jurusan: t.jurusan,
        condition: t.condition,
        status: t.status,
        description: t.description,
        purchaseDate: t.purchase_date,
        image: t.image,
        sop: t.sop || [],
        createdAt: t.created_at
      };
      setTools(prev => [newTool, ...prev]);
    }
  };

  const updateTool = async (id, toolData) => {
    const { error } = await supabase
      .from('tools')
      .update({
        name: toolData.name,
        category: toolData.category,
        jurusan: toolData.jurusan,
        condition: toolData.condition,
        status: toolData.status,
        description: toolData.description,
        purchase_date: toolData.purchaseDate,
        image: toolData.image,
        sop: toolData.sop || []
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating tool:', error);
    } else {
      setTools(prev => prev.map(t => t.id === id ? { ...t, ...toolData } : t));
    }
  };

  const deleteTool = async (id) => {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tool:', error);
    } else {
      setTools(prev => prev.filter(t => t.id !== id));
    }
  };

  const getToolById = useCallback((id) => {
    return tools.find(t => t.id === id);
  }, [tools]);

  return (
    <InventoryContext.Provider value={{ tools, loading, addTool, updateTool, deleteTool, getToolById }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tools from Supabase
  const fetchTools = useCallback(async () => {
    setLoading(true);
    // Join with borrow_history to get current borrower info
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        borrow_history(id, borrower_name, borrower_unit, status)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tools:', error);
    } else {
      // Map data and extract current active borrower if any
      const mapped = data.map(t => {
        const activeBorrow = t.borrow_history?.find(bh => bh.status === 'borrowed');
        return {
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
          createdAt: t.created_at,
          currentBorrower: activeBorrow ? {
            name: activeBorrow.borrower_name,
            unit: activeBorrow.borrower_unit
          } : null
        };
      });
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

  // BORROWING FUNCTIONS
  const borrowTool = async (toolId, borrowerData) => {
    // 1. Update tool status to 'In Use'
    const { error: toolError } = await supabase
      .from('tools')
      .update({ status: 'In Use' })
      .eq('id', toolId);

    if (toolError) {
      console.error('Error updating tool status:', toolError);
      return { success: false, error: toolError };
    }

    // 2. Create borrow history record
    const { error: historyError } = await supabase
      .from('borrow_history')
      .insert([{
        tool_id: toolId,
        borrower_name: borrowerData.name,
        borrower_unit: borrowerData.unit,
        status: 'borrowed'
      }]);

    if (historyError) {
      console.error('Error creating borrow history:', historyError);
      return { success: false, error: historyError };
    }

    // Update local state
    setTools(prev => prev.map(t => t.id === toolId ? { ...t, status: 'In Use' } : t));
    return { success: true };
  };

  const returnTool = async (toolId) => {
    // 1. Update tool status to 'Available'
    const { error: toolError } = await supabase
      .from('tools')
      .update({ status: 'Available' })
      .eq('id', toolId);

    if (toolError) {
      console.error('Error updating tool status:', toolError);
      return { success: false, error: toolError };
    }

    // 2. Update the active borrow history record
    const { error: historyError } = await supabase
      .from('borrow_history')
      .update({
        return_date: new Date().toISOString(),
        status: 'returned'
      })
      .eq('tool_id', toolId)
      .eq('status', 'borrowed');

    if (historyError) {
      console.error('Error updating borrow history:', historyError);
      // Even if history update fails, we should still update local state for tool status
    }

    // Update local state
    setTools(prev => prev.map(t => t.id === toolId ? { ...t, status: 'Available' } : t));
    return { success: true };
  };

  const getBorrowHistory = async (toolId) => {
    const { data, error } = await supabase
      .from('borrow_history')
      .select('*')
      .eq('tool_id', toolId)
      .order('borrow_date', { ascending: false });

    if (error) {
      console.error('Error fetching borrow history:', error);
      return [];
    }
    return data;
  };

  return (
    <InventoryContext.Provider value={{
      tools,
      loading,
      addTool,
      updateTool,
      deleteTool,
      getToolById,
      borrowTool,
      returnTool,
      getBorrowHistory
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);

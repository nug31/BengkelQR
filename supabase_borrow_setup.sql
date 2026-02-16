-- ==========================================
-- SCRIPT TABEL RIWAYAT PEMINJAMAN (BORROW HISTORY)
-- ==========================================

-- 1. Buat tabel borrow_history
CREATE TABLE IF NOT EXISTS public.borrow_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id uuid REFERENCES public.tools(id) ON DELETE CASCADE NOT NULL,
  borrower_name text NOT NULL,
  borrower_unit text NOT NULL,
  borrow_date timestamp with time zone DEFAULT now() NOT NULL,
  return_date timestamp with time zone,
  status text DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned')),
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Aktifkan RLS (Row Level Security)
ALTER TABLE public.borrow_history ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan (Policies)
-- Siapa pun bisa melihat riwayat (supaya bisa tampil di detail alat)
CREATE POLICY "Public profiles are viewable by everyone" ON public.borrow_history FOR SELECT USING (true);

-- Hanya user yang terautentikasi (admin/guru) yang bisa menambah/mengubah data
CREATE POLICY "Authenticated users can insert borrow records" ON public.borrow_history FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update borrow records" ON public.borrow_history FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Expose ke API (Sudah otomatis di Supabase)

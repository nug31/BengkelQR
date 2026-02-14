-- ==========================================
-- SCRIPT PERBAIKAN AKHIR (Paling Aman)
-- ==========================================

-- 1. Bersihkan User yang Error 500
-- Menghapus user yang dibuat manual lewat SQL sebelumnya agar tidak konflik
DELETE FROM auth.users WHERE email LIKE '%@bengkel%';
DELETE FROM auth.identities WHERE identity_data->>'email' LIKE '%@bengkel%';

-- 2. Siapkan Tabel Profile di Public
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text,
  jurusan text,
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Fungsi & Trigger Sinkronisasi Otomatis
-- Jadi nanti kalau Anda buat user lewat Dashboard UI, datanya otomatis masuk ke tabel profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, jurusan)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'jurusan');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SELESAI. 
-- Jangan lupa jalankan script ini di SQL EDITOR.
-- Setelah sukses, buatlah user secara manual lewat menu AUTHENTICATION > USERS di Dashboard.

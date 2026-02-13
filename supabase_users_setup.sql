-- SCRIPT UNTUK MEMBUAT AKUN JURUSAN & TABEL PROFIL
-- Jalankan di SQL Editor Supabase

-- 1. Buat Tabel Profile di schema PUBLIC agar terlihat di Table Editor
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text,
  jurusan text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy agar user bisa melihat profilnya sendiri
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. Fungsi Trigger untuk sinkronisasi otomatis dari AUTH ke PUBLIC
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, jurusan)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'jurusan');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang Trigger (Hapus dulu jika sudah ada agar tidak error)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Extension pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 4. Loop Pembuatan User
DO $$
DECLARE
    user_list JSONB[] := ARRAY[
        '{"email": "admin@bengkel.com", "pass": "admin123", "jurusan": "Admin"}'::JSONB,
        '{"email": "tkr@bengkel.id", "pass": "bengkel123", "jurusan": "TKR"}'::JSONB,
        '{"email": "tsm@bengkel.id", "pass": "bengkel123", "jurusan": "TSM"}'::JSONB,
        '{"email": "mesin@bengkel.id", "pass": "bengkel123", "jurusan": "Mesin"}'::JSONB,
        '{"email": "elind@bengkel.id", "pass": "bengkel123", "jurusan": "Elind"}'::JSONB,
        '{"email": "listrik@bengkel.id", "pass": "bengkel123", "jurusan": "Listrik"}'::JSONB,
        '{"email": "akuntansi@bengkel.id", "pass": "bengkel123", "jurusan": "Akuntansi"}'::JSONB,
        '{"email": "hotel@bengkel.id", "pass": "bengkel123", "jurusan": "Perhotelan"}'::JSONB,
        '{"email": "tki@bengkel.id", "pass": "bengkel123", "jurusan": "TKI"}'::JSONB
    ];
    u JSONB;
    uid UUID;
BEGIN
    FOREACH u IN ARRAY user_list LOOP
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = u->>'email') THEN
            uid := gen_random_uuid();
            
            INSERT INTO auth.users (
                id, email, encrypted_password, email_confirmed_at,
                raw_app_meta_data, raw_user_meta_data, aud, role,
                is_super_admin, confirmed_at, last_sign_in_at, created_at, updated_at
            ) VALUES (
                uid, u->>'email', crypt(u->>'pass', gen_salt('bf')), now(),
                '{"provider":"email","providers":["email"]}',
                jsonb_build_object('jurusan', u->>'jurusan'),
                'authenticated', 'authenticated', false, now(), now(), now(), now()
            );

            INSERT INTO auth.identities (
                id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
            ) VALUES (
                uid, uid, format('{"sub":"%s","email":"%s"}', uid, u->>'email')::jsonb,
                'email', u->>'email', now(), now(), now()
            );
        END IF;
    END LOOP;
END $$;

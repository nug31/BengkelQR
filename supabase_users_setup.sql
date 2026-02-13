-- ==========================================
-- SCRIPT REPAIR AKHIR: RESET & RE-AUTH
-- ==========================================

-- 1. Bersihkan Total
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DELETE FROM auth.users WHERE email LIKE '%@bengkel%';
DELETE FROM auth.identities WHERE identity_data->>'email' LIKE '%@bengkel%';
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Buat Ulang Tabel Profile (Public)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text,
  jurusan text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Atur Izin (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Trigger Sync
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, jurusan)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'jurusan');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Buat User (Metode Paling Standar)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
    encrypted_pass TEXT;
BEGIN
    FOREACH u IN ARRAY user_list LOOP
        uid := gen_random_uuid();
        encrypted_pass := crypt(u->>'pass', gen_salt('bf'));
        
        -- Insert User dengan metadata minimal
        INSERT INTO auth.users (
            id, instance_id, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
            aud, role, is_super_admin, created_at, updated_at
        ) VALUES (
            uid, '00000000-0000-0000-0000-000000000000', u->>'email', 
            encrypted_pass, now(),
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object('jurusan', u->>'jurusan'),
            'authenticated', 'authenticated', false, now(), now()
        );

        -- Insert Identity (Penting: Format ID harus unik)
        INSERT INTO auth.identities (
            id, user_id, identity_data, provider, provider_id, 
            last_sign_in_at, created_at, updated_at
        ) VALUES (
            uid, -- Gunakan UID yang sama sebagai ID identitas
            uid,
            jsonb_build_object('sub', uid, 'email', u->>'email'),
            'email',
            u->>'email',
            now(), now(), now()
        );
    END LOOP;
END $$;

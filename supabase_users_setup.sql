-- ==========================================
-- SCRIPT PERBAIKAN AKHIR (Paling Stabil)
-- ==========================================

-- 1. Bersihkan sisa-sisa lama
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DELETE FROM auth.users WHERE email LIKE '%@bengkel%';
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Buat ulang tabel Profile (Kebutuhan UI BengkelQR)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text,
  jurusan text,
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are visible to everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Trigger Sinkronisasi Otomatis
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

-- 4. Buat Akun Jurusan
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
BEGIN
    FOREACH u IN ARRAY user_list LOOP
        uid := gen_random_uuid();
        
        -- Insert User (Tanpa confirmed_at karena itu kolom otomatis)
        INSERT INTO auth.users (
            id, instance_id, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
            aud, role, is_super_admin, created_at, updated_at
        ) VALUES (
            uid, '00000000-0000-0000-0000-000000000000', u->>'email', 
            crypt(u->>'pass', gen_salt('bf')), now(),
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object('jurusan', u->>'jurusan'),
            'authenticated', 'authenticated', false, now(), now()
        );

        -- Insert Identity
        INSERT INTO auth.identities (
            id, user_id, identity_data, provider, provider_id, 
            last_sign_in_at, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), uid, 
            format('{"sub":"%s","email":"%s"}', uid, u->>'email')::jsonb,
            'email', u->>'email', now(), now(), now()
        );
    END LOOP;
END $$;

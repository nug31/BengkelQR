-- SCRIPT UNTUK MEMBUAT AKUN JURUSAN
-- Jalankan di SQL Editor Supabase

-- 1. Aktifkan Extension pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Fungsi untuk membuat user secara aman
-- Catatan: Password akan di-enkripsi menggunakan bcrypt (standard Supabase)
DO $$
DECLARE
    -- Daftar akun yang akan dibuat
    -- Password default: bengkel123
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
        -- Cek jika email belum ada
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = u->>'email') THEN
            uid := gen_random_uuid();
            
            -- Insert ke auth.users
            INSERT INTO auth.users (
                id,
                email,
                encrypted_password,
                email_confirmed_at,
                raw_app_meta_data,
                raw_user_meta_data,
                aud,
                role,
                is_super_admin,
                confirmed_at,
                last_sign_in_at,
                created_at,
                updated_at
            ) VALUES (
                uid,
                u->>'email',
                crypt(u->>'pass', gen_salt('bf')),
                now(),
                '{"provider":"email","providers":["email"]}',
                jsonb_build_object('jurusan', u->>'jurusan'),
                'authenticated',
                'authenticated',
                false,
                now(),
                now(),
                now(),
                now()
            );

            -- Insert ke auth.identities
            INSERT INTO auth.identities (
                id,
                user_id,
                identity_data,
                provider,
                provider_id,
                last_sign_in_at,
                created_at,
                updated_at
            ) VALUES (
                uid,
                uid,
                format('{"sub":"%s","email":"%s"}', uid, u->>'email')::jsonb,
                'email',
                u->>'email',
                now(),
                now(),
                now()
            );
        END IF;
    END LOOP;
END $$;

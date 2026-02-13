-- SCRIPT UNTUK MEMBUAT AKUN JURUSAN OTOMATIS
-- Jalankan di SQL Editor Supabase

-- 1. Aktifkan Extension pgcrypto jika belum ada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Fungsi Helper untuk membuat user (agar tidak duplikat)
DO $$
DECLARE
    -- Daftar akun: email, password, jurusan
    users_to_create JSONB[] := ARRAY[
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
    new_user_id UUID;
BEGIN
    FOREACH u IN ARRAY users_to_create LOOP
        -- Cek apakah user sudah ada
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = u->>'email') THEN
            new_user_id := gen_random_uuid();
            
            -- Insert ke auth.users
            INSERT INTO auth.users (
                id,
                instance_id,
                email,
                encrypted_password,
                email_confirmed_at,
                raw_app_meta_data,
                raw_user_meta_data,
                aud,
                role,
                created_at,
                updated_at,
                confirmation_token,
                recovery_token,
                email_change_token_new,
                is_super_admin
            ) VALUES (
                new_user_id,
                '00000000-0000-0000-0000-000000000000',
                u->>'email',
                crypt(u->>'pass', gen_salt('bf')),
                now(),
                '{"provider":"email","providers":["email"]}',
                jsonb_build_object('jurusan', u->>'jurusan'),
                'authenticated',
                'authenticated',
                now(),
                now(),
                '',
                '',
                '',
                false
            );

            -- Insert ke auth.identities (PENTING: Agar bisa login lewat password)
            INSERT INTO auth.identities (
                id,
                user_id,
                identity_data,
                provider,
                provider_id,
                email,
                last_sign_in_at,
                created_at,
                updated_at
            ) VALUES (
                new_user_id,
                new_user_id,
                jsonb_build_object('sub', new_user_id, 'email', u->>'email'),
                'email',
                u->>'email',
                u->>'email',
                now(),
                now(),
                now()
            );
            
            RAISE NOTICE 'User created: %', u->>'email';
        ELSE
            RAISE NOTICE 'User already exists: %', u->>'email';
        END IF;
    END LOOP;
END $$;

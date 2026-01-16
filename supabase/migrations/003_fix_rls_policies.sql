-- =====================================================
-- FIX RLS POLICIES FOR CUSTOM AUTH
-- =====================================================
-- Since we're using custom phone+PIN auth instead of Supabase Auth,
-- we need to update RLS policies to allow public access.
-- Security is managed at the application level via session tokens.

-- =====================================================
-- 1. DROP EXISTING POLICIES
-- =====================================================

-- Drop users table policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Allow public read for auth" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow public registration" ON users;

-- Drop funding_applications policies
DROP POLICY IF EXISTS "Users can view their own applications" ON funding_applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON funding_applications;
DROP POLICY IF EXISTS "Users can update their own draft applications" ON funding_applications;

-- Drop application_documents policies
DROP POLICY IF EXISTS "Users can view their own documents" ON application_documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON application_documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON application_documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON application_documents;

-- Drop admin_users policies (if any)
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view their own data" ON admin_users;

-- =====================================================
-- 2. CREATE NEW PUBLIC POLICIES
-- =====================================================
-- Note: Since we're using custom auth with client-side session management,
-- we allow public access and rely on application-level security.
-- In production, consider implementing server-side session validation.

-- Users table policies
CREATE POLICY "Allow public select for auth" ON users
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert for registration" ON users
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update for users" ON users
    FOR UPDATE
    USING (true);

-- Funding applications policies
CREATE POLICY "Allow public select on applications" ON funding_applications
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert on applications" ON funding_applications
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on applications" ON funding_applications
    FOR UPDATE
    USING (true);

-- Application documents policies
CREATE POLICY "Allow public select on documents" ON application_documents
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert on documents" ON application_documents
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on documents" ON application_documents
    FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete on documents" ON application_documents
    FOR DELETE
    USING (true);

-- Admin users policies
CREATE POLICY "Allow public select on admin_users" ON admin_users
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert on admin_users" ON admin_users
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update on admin_users" ON admin_users
    FOR UPDATE
    USING (true);

-- Contact preferences policies (already should have permissive policies)
DROP POLICY IF EXISTS "Public can view contact preferences" ON contact_preferences;
CREATE POLICY "Allow public select on contact_preferences" ON contact_preferences
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public update on contact_preferences" ON contact_preferences
    FOR UPDATE
    USING (true);

-- Site configuration policies
DROP POLICY IF EXISTS "Public can view site configuration" ON site_configuration;
CREATE POLICY "Allow public select on site_configuration" ON site_configuration
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public update on site_configuration" ON site_configuration
    FOR UPDATE
    USING (true);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies updated successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'All tables now allow public access for custom auth system.';
    RAISE NOTICE 'Security is managed at application level via session tokens.';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: For production, consider:';
    RAISE NOTICE '  1. Implementing server-side session validation';
    RAISE NOTICE '  2. Creating a session_tokens table';
    RAISE NOTICE '  3. Using more restrictive RLS policies based on session validation';
END $$;

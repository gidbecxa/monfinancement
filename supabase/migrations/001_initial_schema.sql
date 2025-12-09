-- =====================================================
-- MONFINANCEMENT.CO - SUPABASE DATABASE MIGRATION
-- Version: 1.0.0
-- Date: December 8, 2025
-- Description: Initial database schema setup
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. USERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true
);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Comments
COMMENT ON TABLE users IS 'Stores user authentication and profile information';
COMMENT ON COLUMN users.phone_number IS 'International format phone number (E.164)';

-- =====================================================
-- 2. FUNDING APPLICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS funding_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_number VARCHAR(8) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    
    -- Step 0: Funding Amount
    funding_amount DECIMAL(15,2) NOT NULL CHECK (funding_amount >= 1000 AND funding_amount <= 10000000),
    
    -- Step 1: Personal Information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(30) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    
    -- Step 2: Contact & Funding Details
    email VARCHAR(255),
    residential_address TEXT,
    country_of_residence VARCHAR(100),
    funding_type VARCHAR(100),
    funding_reason TEXT,
    profession VARCHAR(100),
    monthly_income DECIMAL(15,2) CHECK (monthly_income >= 0),
    
    -- Step 3: Document Upload
    step_3_completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    current_step INTEGER DEFAULT 0 CHECK (current_step >= 0 AND current_step <= 4),
    language_preference VARCHAR(5) DEFAULT 'fr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for funding_applications table
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON funding_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_application_number ON funding_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_applications_status ON funding_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON funding_applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON funding_applications(created_at DESC);

-- Comments
COMMENT ON TABLE funding_applications IS 'Stores all funding application data across multiple steps';
COMMENT ON COLUMN funding_applications.application_number IS 'Unique 8-character application identifier';

-- =====================================================
-- 3. APPLICATION DOCUMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES funding_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('identity_front', 'identity_back', 'rib')),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL CHECK (file_size > 0),
    mime_type VARCHAR(100) NOT NULL,
    upload_status VARCHAR(20) DEFAULT 'uploading' CHECK (upload_status IN ('uploading', 'completed', 'failed')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for application_documents table
CREATE INDEX IF NOT EXISTS idx_documents_application_id ON application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON application_documents(application_id, document_type);

-- Comments
COMMENT ON TABLE application_documents IS 'Stores references to uploaded identity and banking documents';

-- =====================================================
-- 4. ADMIN USERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_access TIMESTAMP WITH TIME ZONE
);

-- Index for admin_users table
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(admin_email);

-- Comments
COMMENT ON TABLE admin_users IS 'Stores admin-specific configuration and permissions';

-- =====================================================
-- 5. CONTACT PREFERENCES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_number VARCHAR(50) NOT NULL,
    whatsapp_message_template TEXT,
    contact_email VARCHAR(255) NOT NULL,
    email_subject_template VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE contact_preferences IS 'Stores WhatsApp and email contact information for advisors';

-- Insert default contact preferences
INSERT INTO contact_preferences (whatsapp_number, contact_email, is_active)
VALUES ('+33612345678', 'contact@monfinancement.co', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. SITE CONFIGURATION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS site_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Index for site_configuration table
CREATE INDEX IF NOT EXISTS idx_config_key ON site_configuration(config_key);

-- Comments
COMMENT ON TABLE site_configuration IS 'Stores dynamic site configuration';

-- Insert default configurations
INSERT INTO site_configuration (config_key, config_value, description)
VALUES 
    ('funding_deadline', '{"date": "2026-05-30", "display_format": "DD/MM/YYYY"}'::jsonb, 'Funding application deadline'),
    ('funding_types', '["Business Expansion", "Real Estate", "Education", "Personal Project", "Debt Consolidation", "Other"]'::jsonb, 'Available funding types'),
    ('max_funding_amount', '{"value": 10000000, "currency": "EUR"}'::jsonb, 'Maximum funding amount allowed')
ON CONFLICT (config_key) DO NOTHING;

-- =====================================================
-- 7. APPLICATION NUMBER GENERATOR FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS VARCHAR(8) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude confusing characters
    result VARCHAR(8) := '';
    last_digit INTEGER;
    attempt INTEGER := 0;
    max_attempts INTEGER := 10;
BEGIN
    LOOP
        -- Generate 7 random characters
        result := '';
        FOR i IN 1..7 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
        
        -- Get last used digit and increment (0-9 rotation)
        SELECT COALESCE(
            (SELECT (substring(application_number FROM 8 FOR 1)::INTEGER + 1) % 10
             FROM funding_applications 
             ORDER BY created_at DESC 
             LIMIT 1),
            floor(random() * 10)::INTEGER
        ) INTO last_digit;
        
        -- Append the rotating digit
        result := result || last_digit::TEXT;
        
        -- Check uniqueness
        IF NOT EXISTS (SELECT 1 FROM funding_applications WHERE application_number = result) THEN
            RETURN result;
        END IF;
        
        -- Increment attempt counter
        attempt := attempt + 1;
        IF attempt >= max_attempts THEN
            RAISE EXCEPTION 'Failed to generate unique application number after % attempts', max_attempts;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;

COMMENT ON FUNCTION generate_application_number() IS 'Generates unique 8-character application numbers with rotating last digit';

-- =====================================================
-- 8. TRIGGER FUNCTION FOR APPLICATION NUMBER
-- =====================================================

CREATE OR REPLACE FUNCTION set_application_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
        NEW.application_number := generate_application_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_application_number ON funding_applications;
CREATE TRIGGER trigger_set_application_number
    BEFORE INSERT ON funding_applications
    FOR EACH ROW
    EXECUTE FUNCTION set_application_number();

-- =====================================================
-- 9. TRIGGER FUNCTION FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON funding_applications;
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON funding_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_preferences_updated_at ON contact_preferences;
CREATE TRIGGER update_contact_preferences_updated_at
    BEFORE UPDATE ON contact_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_configuration_updated_at ON site_configuration;
CREATE TRIGGER update_site_configuration_updated_at
    BEFORE UPDATE ON site_configuration
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_configuration ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Funding applications policies
CREATE POLICY "Users can view their own applications"
    ON funding_applications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
    ON funding_applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own draft applications"
    ON funding_applications FOR UPDATE
    USING (auth.uid() = user_id AND status = 'draft');

-- Application documents policies
CREATE POLICY "Users can view their own documents"
    ON application_documents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM funding_applications
            WHERE funding_applications.id = application_documents.application_id
            AND funding_applications.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own documents"
    ON application_documents FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM funding_applications
            WHERE funding_applications.id = application_documents.application_id
            AND funding_applications.user_id = auth.uid()
        )
    );

-- Admin policies (to be created when admin roles are configured)
-- These will be added later when auth.jwt() -> 'role' is set up

-- Public read access for contact preferences
CREATE POLICY "Public can view active contact preferences"
    ON contact_preferences FOR SELECT
    USING (is_active = true);

-- Public read access for site configuration
CREATE POLICY "Public can view site configuration"
    ON site_configuration FOR SELECT
    TO public
    USING (true);

-- =====================================================
-- 11. STORAGE BUCKETS SETUP (Run in Supabase Dashboard)
-- =====================================================

-- Note: Storage buckets must be created via Supabase Dashboard or API
-- Bucket names:
-- 1. 'identity-documents' - for identity cards (front/back)
-- 2. 'rib-documents' - for bank details (RIB)

-- Bucket policies (apply after creating buckets):
-- - Max file size: 10MB for identity, 5MB for RIB
-- - Allowed MIME types: image/jpeg, image/png, application/pdf
-- - Private access (requires authentication)

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verify tables
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database migration completed successfully!';
    RAISE NOTICE 'Tables created: users, funding_applications, application_documents, admin_users, contact_preferences, site_configuration';
    RAISE NOTICE 'Functions created: generate_application_number(), set_application_number(), update_updated_at_column()';
    RAISE NOTICE 'RLS policies enabled on all tables';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Configure Supabase Auth for phone authentication';
    RAISE NOTICE '2. Create storage buckets: identity-documents, rib-documents';
    RAISE NOTICE '3. Set up admin users in admin_users table';
END $$;

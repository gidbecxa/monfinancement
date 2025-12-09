# SUPABASE CONFIGURATION & SETUP GUIDE
## Database Schema, Storage, and Authentication Alternative

---

## TABLE OF CONTENTS

1. [Database Tables & Schema](#1-database-tables--schema)
2. [Storage Buckets Configuration](#2-storage-buckets-configuration)
3. [Row-Level Security Policies](#3-row-level-security-policies)
4. [Database Functions](#4-database-functions)
5. [Alternative Authentication System](#5-alternative-authentication-system)
6. [SQL Migration Scripts](#6-sql-migration-scripts)

---

## 1. DATABASE TABLES & SCHEMA

### 1.1 Users Table

```sql
-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    access_pin VARCHAR(255) NOT NULL, -- Hashed PIN
    pin_expires_at TIMESTAMP WITH TIME ZONE,
    pin_usage_count INTEGER DEFAULT 0,
    max_pin_uses INTEGER DEFAULT 10,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_users_phone_number ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Add comments
COMMENT ON TABLE users IS 'Stores user authentication and profile information';
COMMENT ON COLUMN users.access_pin IS 'Bcrypt hashed PIN for authentication';
COMMENT ON COLUMN users.pin_expires_at IS 'Expiration timestamp for PIN, NULL for no expiry';
COMMENT ON COLUMN users.pin_usage_count IS 'Number of times current PIN has been used';
COMMENT ON COLUMN users.max_pin_uses IS 'Maximum uses before PIN regeneration required';
```

### 1.2 Funding Applications Table

```sql
-- Create funding_applications table
CREATE TABLE funding_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_number VARCHAR(8) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    
    -- Step 0 data
    funding_amount DECIMAL(15,2) NOT NULL CHECK (funding_amount >= 1000 AND funding_amount <= 10000000),
    
    -- Step 1 data
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(30),
    
    -- Step 2 data
    email VARCHAR(255),
    residential_address TEXT,
    country_of_residence VARCHAR(100),
    funding_type VARCHAR(100),
    funding_reason TEXT,
    profession VARCHAR(100),
    monthly_income DECIMAL(15,2),
    
    -- Step 3 data
    step_3_completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    current_step INTEGER DEFAULT 0 CHECK (current_step >= 0 AND current_step <= 3),
    language_preference VARCHAR(5) DEFAULT 'fr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_applications_user_id ON funding_applications(user_id);
CREATE INDEX idx_applications_application_number ON funding_applications(application_number);
CREATE INDEX idx_applications_status ON funding_applications(status);
CREATE INDEX idx_applications_user_status ON funding_applications(user_id, status);
CREATE INDEX idx_applications_created_at ON funding_applications(created_at DESC);

-- Add comments
COMMENT ON TABLE funding_applications IS 'Stores all funding application data across multiple steps';
COMMENT ON COLUMN funding_applications.application_number IS 'Unique 8-character application identifier (e.g., A6B1C5D2)';
COMMENT ON COLUMN funding_applications.current_step IS 'Tracks user progress through application flow (0-3)';
```

### 1.3 Application Documents Table

```sql
-- Create application_documents table
CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES funding_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('identity_front', 'identity_back', 'rib')),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL CHECK (file_size > 0),
    mime_type VARCHAR(100) NOT NULL,
    upload_status VARCHAR(20) DEFAULT 'completed' CHECK (upload_status IN ('uploading', 'completed', 'failed')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_documents_application_id ON application_documents(application_id);
CREATE INDEX idx_documents_application_type ON application_documents(application_id, document_type);

-- Add unique constraint (one document per type per application)
CREATE UNIQUE INDEX idx_documents_unique_type ON application_documents(application_id, document_type);

-- Add comments
COMMENT ON TABLE application_documents IS 'Stores metadata for uploaded documents';
COMMENT ON COLUMN application_documents.file_path IS 'Storage path in Supabase Storage bucket';
```

### 1.4 Admin Users Table

```sql
-- Create admin_users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_access TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_admin_email ON admin_users(admin_email);

-- Add comments
COMMENT ON TABLE admin_users IS 'Extended information for admin users';
COMMENT ON COLUMN admin_users.permissions IS 'JSONB object storing granular permissions';
```

### 1.5 Contact Preferences Table

```sql
-- Create contact_preferences table
CREATE TABLE contact_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_number VARCHAR(50) NOT NULL,
    whatsapp_message_template TEXT,
    contact_email VARCHAR(255) NOT NULL,
    email_subject_template VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default values
INSERT INTO contact_preferences (whatsapp_number, contact_email, whatsapp_message_template, email_subject_template)
VALUES (
    '+229XXXXXXXXXX', -- Replace with actual WhatsApp number
    'contact@monfinancement.co', -- Replace with actual email
    'Hello, I have submitted a funding application. My application number is {APPLICATION_NUMBER}. I would like to discuss the next steps. Thank you.',
    'Funding Application {APPLICATION_NUMBER} - Follow-up Request'
);

-- Add comments
COMMENT ON TABLE contact_preferences IS 'Stores contact information for advisors (single row configuration)';
```

### 1.6 Site Configuration Table

```sql
-- Create site_configuration table
CREATE TABLE site_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Create index
CREATE INDEX idx_config_key ON site_configuration(config_key);

-- Insert default configurations
INSERT INTO site_configuration (config_key, config_value, description) VALUES
('funding_deadline', '{"date": "2026-05-30", "display_format": "DD/MM/YYYY"}'::jsonb, 'Deadline date for funding applications'),
('funding_types', '["Business Startup", "Project Expansion", "Personal Development"]'::jsonb, 'Available funding types for selection'),
('featured_testimonials', '[]'::jsonb, 'Array of testimonial objects to display on homepage');

-- Add comments
COMMENT ON TABLE site_configuration IS 'Stores dynamic site configuration and settings';
COMMENT ON COLUMN site_configuration.config_value IS 'JSONB value allowing flexible data structures';
```

### 1.7 Session Tokens Table

```sql
-- Create session_tokens table for custom authentication
CREATE TABLE session_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Create indexes
CREATE INDEX idx_session_user_id ON session_tokens(user_id);
CREATE INDEX idx_session_token_hash ON session_tokens(token_hash);
CREATE INDEX idx_session_expires_at ON session_tokens(expires_at);

-- Add comments
COMMENT ON TABLE session_tokens IS 'Stores session tokens for custom authentication system';
COMMENT ON COLUMN session_tokens.token_hash IS 'Hashed session token for security';
COMMENT ON COLUMN session_tokens.expires_at IS 'Token expiration timestamp';
```

### 1.8 Activity Logs Table

```sql
-- Create activity_logs table for audit trail
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    application_id UUID REFERENCES funding_applications(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_logs_application_id ON activity_logs(application_id);
CREATE INDEX idx_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_logs_action ON activity_logs(action);

-- Add comments
COMMENT ON TABLE activity_logs IS 'Audit log for tracking user and admin actions';
COMMENT ON COLUMN activity_logs.action IS 'Type of action performed (e.g., login, status_change, document_upload)';
```

---

## 2. STORAGE BUCKETS CONFIGURATION

### 2.1 Create Storage Buckets

Execute these commands in Supabase SQL Editor or via Supabase client:

```sql
-- Create storage bucket for application documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'application-documents',
    'application-documents',
    false, -- Private bucket
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'application/pdf']
);

-- Verify bucket creation
SELECT * FROM storage.buckets WHERE name = 'application-documents';
```

### 2.2 Storage Folder Structure

The storage will be organized as follows:

```
application-documents/
├── [user_id]/
│   └── [application_id]/
│       ├── identity_front/
│       │   └── [timestamp]-[uuid].jpg
│       ├── identity_back/
│       │   └── [timestamp]-[uuid].jpg
│       └── rib/
│           └── [timestamp]-[uuid].pdf
```

---

## 3. ROW-LEVEL SECURITY POLICIES

### 3.1 Enable RLS on All Tables

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
```

### 3.2 Users Table Policies

```sql
-- Users can read their own data
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (id = auth.uid() OR id IN (
    SELECT user_id FROM session_tokens 
    WHERE token_hash = current_setting('app.current_token_hash', true)
    AND expires_at > NOW()
));

-- Users can update their own data (except role and PIN fields via regular update)
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (id = auth.uid() OR id IN (
    SELECT user_id FROM session_tokens 
    WHERE token_hash = current_setting('app.current_token_hash', true)
    AND expires_at > NOW()
))
WITH CHECK (
    role = (SELECT role FROM users WHERE id = users.id) -- Prevent role escalation
);

-- Admins can read all users
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role = 'admin'
    )
    OR
    EXISTS (
        SELECT 1 FROM users u
        JOIN session_tokens st ON u.id = st.user_id
        WHERE st.token_hash = current_setting('app.current_token_hash', true)
        AND st.expires_at > NOW()
        AND u.role = 'admin'
    )
);

-- Allow user creation (for registration)
CREATE POLICY "Allow user registration"
ON users FOR INSERT
WITH CHECK (true);
```

### 3.3 Funding Applications Policies

```sql
-- Users can read their own applications
CREATE POLICY "Users can view own applications"
ON funding_applications FOR SELECT
USING (
    user_id = auth.uid()
    OR
    user_id IN (
        SELECT user_id FROM session_tokens 
        WHERE token_hash = current_setting('app.current_token_hash', true)
        AND expires_at > NOW()
    )
);

-- Users can create their own applications
CREATE POLICY "Users can create own applications"
ON funding_applications FOR INSERT
WITH CHECK (
    user_id = auth.uid()
    OR
    user_id IN (
        SELECT user_id FROM session_tokens 
        WHERE token_hash = current_setting('app.current_token_hash', true)
        AND expires_at > NOW()
    )
);

-- Users can update their own applications
CREATE POLICY "Users can update own applications"
ON funding_applications FOR UPDATE
USING (
    user_id = auth.uid()
    OR
    user_id IN (
        SELECT user_id FROM session_tokens 
        WHERE token_hash = current_setting('app.current_token_hash', true)
        AND expires_at > NOW()
    )
);

-- Admins can read all applications
CREATE POLICY "Admins can view all applications"
ON funding_applications FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role = 'admin'
    )
    OR
    EXISTS (
        SELECT 1 FROM users u
        JOIN session_tokens st ON u.id = st.user_id
        WHERE st.token_hash = current_setting('app.current_token_hash', true)
        AND st.expires_at > NOW()
        AND u.role = 'admin'
    )
);

-- Admins can update all applications
CREATE POLICY "Admins can update all applications"
ON funding_applications FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role = 'admin'
    )
    OR
    EXISTS (
        SELECT 1 FROM users u
        JOIN session_tokens st ON u.id = st.user_id
        WHERE st.token_hash = current_setting('app.current_token_hash', true)
        AND st.expires_at > NOW()
        AND u.role = 'admin'
    )
);

-- Admins can delete applications
CREATE POLICY "Admins can delete applications"
ON funding_applications FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role = 'admin'
    )
    OR
    EXISTS (
        SELECT 1 FROM users u
        JOIN session_tokens st ON u.id = st.user_id
        WHERE st.token_hash = current_setting('app.current_token_hash', true)
        AND st.expires_at > NOW()
        AND u.role = 'admin'
    )
);
```

### 3.4 Application Documents Policies

```sql
-- Users can read their own application documents
CREATE POLICY "Users can view own documents"
ON application_documents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM funding_applications fa
        WHERE fa.id = application_documents.application_id
        AND (
            fa.user_id = auth.uid()
            OR
            fa.user_id IN (
                SELECT user_id FROM session_tokens 
                WHERE token_hash = current_setting('app.current_token_hash', true)
                AND expires_at > NOW()
            )
        )
    )
);

-- Users can create documents for their own applications
CREATE POLICY "Users can upload own documents"
ON application_documents FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM funding_applications fa
        WHERE fa.id = application_documents.application_id
        AND (
            fa.user_id = auth.uid()
            OR
            fa.user_id IN (
                SELECT user_id FROM session_tokens 
                WHERE token_hash = current_setting('app.current_token_hash', true)
                AND expires_at > NOW()
            )
        )
    )
);

-- Users can delete their own documents (before submission)
CREATE POLICY "Users can delete own documents"
ON application_documents FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM funding_applications fa
        WHERE fa.id = application_documents.application_id
        AND fa.status = 'draft'
        AND (
            fa.user_id = auth.uid()
            OR
            fa.user_id IN (
                SELECT user_id FROM session_tokens 
                WHERE token_hash = current_setting('app.current_token_hash', true)
                AND expires_at > NOW()
            )
        )
    )
);

-- Admins can access all documents
CREATE POLICY "Admins can view all documents"
ON application_documents FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role = 'admin'
    )
    OR
    EXISTS (
        SELECT 1 FROM users u
        JOIN session_tokens st ON u.id = st.user_id
        WHERE st.token_hash = current_setting('app.current_token_hash', true)
        AND st.expires_at > NOW()
        AND u.role = 'admin'
    )
);
```

### 3.5 Storage Policies

```sql
-- Storage policy for user document uploads
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'application-documents'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR
        (storage.foldername(name))[1] IN (
            SELECT user_id::text FROM session_tokens 
            WHERE token_hash = current_setting('app.current_token_hash', true)
            AND expires_at > NOW()
        )
    )
);

-- Users can read their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'application-documents'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR
        (storage.foldername(name))[1] IN (
            SELECT user_id::text FROM session_tokens 
            WHERE token_hash = current_setting('app.current_token_hash', true)
            AND expires_at > NOW()
        )
    )
);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'application-documents'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR
        (storage.foldername(name))[1] IN (
            SELECT user_id::text FROM session_tokens 
            WHERE token_hash = current_setting('app.current_token_hash', true)
            AND expires_at > NOW()
        )
    )
);

-- Admins can access all documents
CREATE POLICY "Admins can access all documents"
ON storage.objects FOR ALL
USING (
    bucket_id = 'application-documents'
    AND (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid() AND u.role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM users u
            JOIN session_tokens st ON u.id = st.user_id
            WHERE st.token_hash = current_setting('app.current_token_hash', true)
            AND st.expires_at > NOW()
            AND u.role = 'admin'
        )
    )
);
```

### 3.6 Session Tokens Policies

```sql
-- Users can read their own session tokens
CREATE POLICY "Users can view own sessions"
ON session_tokens FOR SELECT
USING (
    user_id = auth.uid()
    OR
    user_id IN (
        SELECT user_id FROM session_tokens 
        WHERE token_hash = current_setting('app.current_token_hash', true)
        AND expires_at > NOW()
    )
);

-- Allow session creation (for login)
CREATE POLICY "Allow session creation"
ON session_tokens FOR INSERT
WITH CHECK (true);

-- Users can delete their own sessions (logout)
CREATE POLICY "Users can delete own sessions"
ON session_tokens FOR DELETE
USING (
    user_id = auth.uid()
    OR
    user_id IN (
        SELECT user_id FROM session_tokens 
        WHERE token_hash = current_setting('app.current_token_hash', true)
        AND expires_at > NOW()
    )
);
```

### 3.7 Site Configuration Policies

```sql
-- Everyone can read site configuration
CREATE POLICY "Public read site configuration"
ON site_configuration FOR SELECT
USING (true);

-- Only admins can update configuration
CREATE POLICY "Admins can update site configuration"
ON site_configuration FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role = 'admin'
    )
    OR
    EXISTS (
        SELECT 1 FROM users u
        JOIN session_tokens st ON u.id = st.user_id
        WHERE st.token_hash = current_setting('app.current_token_hash', true)
        AND st.expires_at > NOW()
        AND u.role = 'admin'
    )
);
```

### 3.8 Contact Preferences Policies

```sql
-- Everyone can read contact preferences
CREATE POLICY "Public read contact preferences"
ON contact_preferences FOR SELECT
USING (is_active = true);

-- Only admins can modify contact preferences
CREATE POLICY "Admins can manage contact preferences"
ON contact_preferences FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role = 'admin'
    )
    OR
    EXISTS (
        SELECT 1 FROM users u
        JOIN session_tokens st ON u.id = st.user_id
        WHERE st.token_hash = current_setting('app.current_token_hash', true)
        AND st.expires_at > NOW()
        AND u.role = 'admin'
    )
);
```

### 3.9 Activity Logs Policies

```sql
-- Users can read their own activity logs
CREATE POLICY "Users can view own activity"
ON activity_logs FOR SELECT
USING (
    user_id = auth.uid()
    OR
    user_id IN (
        SELECT user_id FROM session_tokens 
        WHERE token_hash = current_setting('app.current_token_hash', true)
        AND expires_at > NOW()
    )
);

-- Allow log creation (for audit trail)
CREATE POLICY "Allow activity log creation"
ON activity_logs FOR INSERT
WITH CHECK (true);

-- Admins can read all logs
CREATE POLICY "Admins can view all activity"
ON activity_logs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid() AND u.role = 'admin'
    )
    OR
    EXISTS (
        SELECT 1 FROM users u
        JOIN session_tokens st ON u.id = st.user_id
        WHERE st.token_hash = current_setting('app.current_token_hash', true)
        AND st.expires_at > NOW()
        AND u.role = 'admin'
    )
);
```

---

## 4. DATABASE FUNCTIONS

### 4.1 Application Number Generation Function

```sql
-- Function to generate unique application number
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS VARCHAR(8) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude O, I, 0, 1
    result TEXT := '';
    last_char TEXT;
    new_char TEXT;
    i INTEGER;
    attempt INTEGER := 0;
    max_attempts INTEGER := 10;
BEGIN
    LOOP
        result := '';
        
        -- Generate 7 random characters
        FOR i IN 1..7 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
        
        -- Get last character from most recent application
        SELECT substring(application_number, 8, 1) INTO last_char
        FROM funding_applications
        ORDER BY created_at DESC
        LIMIT 1;
        
        -- Generate last character different from previous
        LOOP
            new_char := substr(chars, floor(random() * length(chars) + 1)::int, 1);
            EXIT WHEN new_char != last_char OR last_char IS NULL;
        END LOOP;
        
        result := result || new_char;
        
        -- Check uniqueness
        IF NOT EXISTS (SELECT 1 FROM funding_applications WHERE application_number = result) THEN
            RETURN result;
        END IF;
        
        attempt := attempt + 1;
        IF attempt >= max_attempts THEN
            RAISE EXCEPTION 'Failed to generate unique application number after % attempts', max_attempts;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION generate_application_number() IS 'Generates unique 8-character application number with varying last character';
```

### 4.2 Trigger to Auto-Generate Application Number

```sql
-- Trigger function to set application number on insert
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
CREATE TRIGGER trigger_set_application_number
BEFORE INSERT ON funding_applications
FOR EACH ROW
EXECUTE FUNCTION set_application_number();
```

### 4.3 Updated Timestamp Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON funding_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_preferences_updated_at
BEFORE UPDATE ON contact_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_configuration_updated_at
BEFORE UPDATE ON site_configuration
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 4.4 PIN Generation Function

```sql
-- Function to generate random 6-digit PIN
CREATE OR REPLACE FUNCTION generate_user_pin()
RETURNS VARCHAR(6) AS $$
DECLARE
    pin TEXT;
BEGIN
    -- Generate 6-digit PIN
    pin := lpad(floor(random() * 1000000)::text, 6, '0');
    RETURN pin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION generate_user_pin() IS 'Generates a random 6-digit PIN for user authentication';
```

### 4.5 Session Cleanup Function

```sql
-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM session_tokens
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION cleanup_expired_sessions() IS 'Deletes expired session tokens and returns count of deleted rows';
```

### 4.6 Activity Logging Function

```sql
-- Function to log user activity
CREATE OR REPLACE FUNCTION log_activity(
    p_user_id UUID,
    p_application_id UUID,
    p_action VARCHAR(100),
    p_details JSONB DEFAULT NULL,
    p_ip_address VARCHAR(45) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO activity_logs (user_id, application_id, action, details, ip_address)
    VALUES (p_user_id, p_application_id, p_action, p_details, p_ip_address)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION log_activity IS 'Creates an activity log entry and returns the log ID';
```

---

## 5. ALTERNATIVE AUTHENTICATION SYSTEM

### 5.1 Authentication Flow Overview

**System:** Phone Number + 6-Digit PIN Authentication

**How It Works:**
1. User enters phone number
2. System generates a unique 6-digit PIN
3. PIN is displayed to user (they must save it)
4. User uses phone number + PIN for subsequent logins
5. PIN has configurable expiry and usage limits
6. After limits reached, new PIN is automatically generated

**Advantages:**
- No SMS costs
- Works offline
- Simple user experience
- Secure when combined with proper hashing
- No dependency on third-party services

### 5.2 Registration Function

```sql
-- Function to register new user and generate PIN
CREATE OR REPLACE FUNCTION register_user(
    p_phone_number VARCHAR(20)
)
RETURNS TABLE(
    user_id UUID,
    pin VARCHAR(6),
    message TEXT
) AS $$
DECLARE
    v_user_id UUID;
    v_pin VARCHAR(6);
    v_pin_hash VARCHAR(255);
    v_pin_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Check if phone number already exists
    IF EXISTS (SELECT 1 FROM users WHERE phone_number = p_phone_number) THEN
        RAISE EXCEPTION 'Phone number already registered';
    END IF;
    
    -- Generate PIN
    v_pin := generate_user_pin();
    
    -- Hash PIN (using pgcrypto extension)
    v_pin_hash := crypt(v_pin, gen_salt('bf', 12));
    
    -- Set PIN expiry (30 days from now)
    v_pin_expires_at := NOW() + INTERVAL '30 days';
    
    -- Create user
    INSERT INTO users (phone_number, access_pin, pin_expires_at, pin_usage_count, max_pin_uses)
    VALUES (p_phone_number, v_pin_hash, v_pin_expires_at, 0, 50) -- 50 uses before regeneration
    RETURNING id INTO v_user_id;
    
    -- Log activity
    PERFORM log_activity(v_user_id, NULL, 'user_registered', NULL, NULL);
    
    RETURN QUERY SELECT 
        v_user_id,
        v_pin,
        'User registered successfully. Please save your PIN securely.' AS message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### 5.3 Login Function

```sql
-- Function to authenticate user and create session
CREATE OR REPLACE FUNCTION authenticate_user(
    p_phone_number VARCHAR(20),
    p_pin VARCHAR(6),
    p_ip_address VARCHAR(45) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS TABLE(
    user_id UUID,
    session_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    pin_regenerated BOOLEAN,
    new_pin VARCHAR(6),
    message TEXT
) AS $$
DECLARE
    v_user RECORD;
    v_session_token TEXT;
    v_token_hash VARCHAR(255);
    v_session_expires TIMESTAMP WITH TIME ZONE;
    v_pin_regenerated BOOLEAN := false;
    v_new_pin VARCHAR(6) := NULL;
    v_new_pin_hash VARCHAR(255);
BEGIN
    -- Get user
    SELECT * INTO v_user
    FROM users
    WHERE phone_number = p_phone_number AND is_active = true;
    
    -- Check if user exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid phone number or PIN';
    END IF;
    
    -- Check if PIN is expired
    IF v_user.pin_expires_at IS NOT NULL AND v_user.pin_expires_at < NOW() THEN
        RAISE EXCEPTION 'PIN has expired. Please contact support for a new PIN.';
    END IF;
    
    -- Verify PIN
    IF NOT (v_user.access_pin = crypt(p_pin, v_user.access_pin)) THEN
        -- Log failed login attempt
        PERFORM log_activity(v_user.id, NULL, 'login_failed', 
            jsonb_build_object('reason', 'invalid_pin', 'ip_address', p_ip_address), 
            p_ip_address);
        RAISE EXCEPTION 'Invalid phone number or PIN';
    END IF;
    
    -- Increment PIN usage count
    UPDATE users 
    SET 
        pin_usage_count = pin_usage_count + 1,
        last_login = NOW()
    WHERE id = v_user.id;
    
    -- Check if PIN needs regeneration (exceeded max uses)
    IF v_user.pin_usage_count + 1 >= v_user.max_pin_uses THEN
        v_new_pin := generate_user_pin();
        v_new_pin_hash := crypt(v_new_pin, gen_salt('bf', 12));
        
        UPDATE users
        SET 
            access_pin = v_new_pin_hash,
            pin_usage_count = 0,
            pin_expires_at = NOW() + INTERVAL '30 days'
        WHERE id = v_user.id;
        
        v_pin_regenerated := true;
    END IF;
    
    -- Generate session token (random UUID-based)
    v_session_token := encode(gen_random_bytes(32), 'base64');
    v_token_hash := encode(digest(v_session_token, 'sha256'), 'hex');
    v_session_expires := NOW() + INTERVAL '7 days';
    
    -- Create session
    INSERT INTO session_tokens (user_id, token_hash, expires_at, ip_address, user_agent)
    VALUES (v_user.id, v_token_hash, v_session_expires, p_ip_address, p_user_agent);
    
    -- Log successful login
    PERFORM log_activity(v_user.id, NULL, 'login_success', 
        jsonb_build_object('ip_address', p_ip_address), 
        p_ip_address);
    
    RETURN QUERY SELECT 
        v_user.id,
        v_session_token,
        v_session_expires,
        v_pin_regenerated,
        v_new_pin,
        CASE 
            WHEN v_pin_regenerated THEN 'Login successful. Your PIN has been regenerated. Please save your new PIN.'
            ELSE 'Login successful.'
        END AS message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5.4 Session Validation Function

```sql
-- Function to validate session token
CREATE OR REPLACE FUNCTION validate_session(
    p_session_token TEXT
)
RETURNS TABLE(
    user_id UUID,
    role VARCHAR(20),
    is_valid BOOLEAN,
    expires_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_token_hash VARCHAR(255);
    v_session RECORD;
BEGIN
    -- Hash the token
    v_token_hash := encode(digest(p_session_token, 'sha256'), 'hex');
    
    -- Get session with user info
    SELECT 
        st.user_id,
        u.role,
        st.expires_at,
        (st.expires_at > NOW()) AS is_valid
    INTO v_session
    FROM session_tokens st
    JOIN users u ON st.user_id = u.id
    WHERE st.token_hash = v_token_hash;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT NULL::UUID, NULL::VARCHAR(20), false, NULL::TIMESTAMP WITH TIME ZONE;
        RETURN;
    END IF;
    
    -- Update last used timestamp
    IF v_session.is_valid THEN
        UPDATE session_tokens
        SET last_used_at = NOW()
        WHERE token_hash = v_token_hash;
    END IF;
    
    RETURN QUERY SELECT 
        v_session.user_id,
        v_session.role,
        v_session.is_valid,
        v_session.expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5.5 Logout Function

```sql
-- Function to logout (delete session)
CREATE OR REPLACE FUNCTION logout_user(
    p_session_token TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_token_hash VARCHAR(255);
    v_user_id UUID;
BEGIN
    -- Hash the token
    v_token_hash := encode(digest(p_session_token, 'sha256'), 'hex');
    
    -- Get user_id for logging
    SELECT user_id INTO v_user_id
    FROM session_tokens
    WHERE token_hash = v_token_hash;
    
    -- Delete session
    DELETE FROM session_tokens
    WHERE token_hash = v_token_hash;
    
    -- Log logout
    IF v_user_id IS NOT NULL THEN
        PERFORM log_activity(v_user_id, NULL, 'logout', NULL, NULL);
    END IF;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5.6 PIN Regeneration Function (Manual)

```sql
-- Function to manually regenerate PIN
CREATE OR REPLACE FUNCTION regenerate_user_pin(
    p_user_id UUID
)
RETURNS TABLE(
    new_pin VARCHAR(6),
    expires_at TIMESTAMP WITH TIME ZONE,
    message TEXT
) AS $$
DECLARE
    v_new_pin VARCHAR(6);
    v_new_pin_hash VARCHAR(255);
    v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Generate new PIN
    v_new_pin := generate_user_pin();
    v_new_pin_hash := crypt(v_new_pin, gen_salt('bf', 12));
    v_expires_at := NOW() + INTERVAL '30 days';
    
    -- Update user PIN
    UPDATE users
    SET 
        access_pin = v_new_pin_hash,
        pin_usage_count = 0,
        pin_expires_at = v_expires_at,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Log activity
    PERFORM log_activity(p_user_id, NULL, 'pin_regenerated', NULL, NULL);
    
    RETURN QUERY SELECT 
        v_new_pin,
        v_expires_at,
        'PIN regenerated successfully. Please save your new PIN securely.' AS message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 6. SQL MIGRATION SCRIPTS

### 6.1 Complete Setup Script

Execute this script to set up the entire database from scratch:

```sql
-- ============================================
-- MONFINANCEMENT.CO - COMPLETE DATABASE SETUP
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    access_pin VARCHAR(255) NOT NULL,
    pin_expires_at TIMESTAMP WITH TIME ZONE,
    pin_usage_count INTEGER DEFAULT 0,
    max_pin_uses INTEGER DEFAULT 50,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_phone_number ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Funding applications table
CREATE TABLE funding_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_number VARCHAR(8) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    funding_amount DECIMAL(15,2) NOT NULL CHECK (funding_amount >= 1000 AND funding_amount <= 10000000),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(30),
    email VARCHAR(255),
    residential_address TEXT,
    country_of_residence VARCHAR(100),
    funding_type VARCHAR(100),
    funding_reason TEXT,
    profession VARCHAR(100),
    monthly_income DECIMAL(15,2),
    step_3_completed_at TIMESTAMP WITH TIME ZONE,
    current_step INTEGER DEFAULT 0 CHECK (current_step >= 0 AND current_step <= 3),
    language_preference VARCHAR(5) DEFAULT 'fr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_applications_user_id ON funding_applications(user_id);
CREATE INDEX idx_applications_application_number ON funding_applications(application_number);
CREATE INDEX idx_applications_status ON funding_applications(status);
CREATE INDEX idx_applications_user_status ON funding_applications(user_id, status);
CREATE INDEX idx_applications_created_at ON funding_applications(created_at DESC);

-- Application documents table
CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES funding_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('identity_front', 'identity_back', 'rib')),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL CHECK (file_size > 0),
    mime_type VARCHAR(100) NOT NULL,
    upload_status VARCHAR(20) DEFAULT 'completed' CHECK (upload_status IN ('uploading', 'completed', 'failed')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_application_id ON application_documents(application_id);
CREATE INDEX idx_documents_application_type ON application_documents(application_id, document_type);
CREATE UNIQUE INDEX idx_documents_unique_type ON application_documents(application_id, document_type);

-- Admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_access TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_admin_email ON admin_users(admin_email);

-- Contact preferences table
CREATE TABLE contact_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_number VARCHAR(50) NOT NULL,
    whatsapp_message_template TEXT,
    contact_email VARCHAR(255) NOT NULL,
    email_subject_template VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site configuration table
CREATE TABLE site_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_config_key ON site_configuration(config_key);

-- Session tokens table
CREATE TABLE session_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX idx_session_user_id ON session_tokens(user_id);
CREATE INDEX idx_session_token_hash ON session_tokens(token_hash);
CREATE INDEX idx_session_expires_at ON session_tokens(expires_at);

-- Activity logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    application_id UUID REFERENCES funding_applications(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_logs_application_id ON activity_logs(application_id);
CREATE INDEX idx_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_logs_action ON activity_logs(action);

-- ============================================
-- 2. INSERT DEFAULT DATA
-- ============================================

-- Insert default contact preferences
INSERT INTO contact_preferences (whatsapp_number, contact_email, whatsapp_message_template, email_subject_template)
VALUES (
    '+229XXXXXXXXXX',
    'contact@monfinancement.co',
    'Hello, I have submitted a funding application. My application number is {APPLICATION_NUMBER}. I would like to discuss the next steps. Thank you.',
    'Funding Application {APPLICATION_NUMBER} - Follow-up Request'
);

-- Insert default site configurations
INSERT INTO site_configuration (config_key, config_value, description) VALUES
('funding_deadline', '{"date": "2026-05-30", "display_format": "DD/MM/YYYY"}'::jsonb, 'Deadline date for funding applications'),
('funding_types', '["Business Startup", "Project Expansion", "Personal Development"]'::jsonb, 'Available funding types for selection'),
('featured_testimonials', '[]'::jsonb, 'Array of testimonial objects to display on homepage');

-- ============================================
-- 3. CREATE FUNCTIONS
-- ============================================

-- Application number generation
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS VARCHAR(8) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    last_char TEXT;
    new_char TEXT;
    i INTEGER;
    attempt INTEGER := 0;
    max_attempts INTEGER := 10;
BEGIN
    LOOP
        result := '';
        FOR i IN 1..7 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
        SELECT substring(application_number, 8, 1) INTO last_char
        FROM funding_applications ORDER BY created_at DESC LIMIT 1;
        LOOP
            new_char := substr(chars, floor(random() * length(chars) + 1)::int, 1);
            EXIT WHEN new_char != last_char OR last_char IS NULL;
        END LOOP;
        result := result || new_char;
        IF NOT EXISTS (SELECT 1 FROM funding_applications WHERE application_number = result) THEN
            RETURN result;
        END IF;
        attempt := attempt + 1;
        IF attempt >= max_attempts THEN
            RAISE EXCEPTION 'Failed to generate unique application number';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PIN generation
CREATE OR REPLACE FUNCTION generate_user_pin()
RETURNS VARCHAR(6) AS $$
BEGIN
    RETURN lpad(floor(random() * 1000000)::text, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Activity logging function
CREATE OR REPLACE FUNCTION log_activity(
    p_user_id UUID,
    p_application_id UUID,
    p_action VARCHAR(100),
    p_details JSONB DEFAULT NULL,
    p_ip_address VARCHAR(45) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO activity_logs (user_id, application_id, action, details, ip_address)
    VALUES (p_user_id, p_application_id, p_action, p_details, p_ip_address)
    RETURNING id INTO log_id;
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Session cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM session_tokens WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User registration function
CREATE OR REPLACE FUNCTION register_user(p_phone_number VARCHAR(20))
RETURNS TABLE(user_id UUID, pin VARCHAR(6), message TEXT) AS $$
DECLARE
    v_user_id UUID;
    v_pin VARCHAR(6);
    v_pin_hash VARCHAR(255);
    v_pin_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE phone_number = p_phone_number) THEN
        RAISE EXCEPTION 'Phone number already registered';
    END IF;
    v_pin := generate_user_pin();
    v_pin_hash := crypt(v_pin, gen_salt('bf', 12));
    v_pin_expires_at := NOW() + INTERVAL '30 days';
    INSERT INTO users (phone_number, access_pin, pin_expires_at, pin_usage_count, max_pin_uses)
    VALUES (p_phone_number, v_pin_hash, v_pin_expires_at, 0, 50)
    RETURNING id INTO v_user_id;
    PERFORM log_activity(v_user_id, NULL, 'user_registered', NULL, NULL);
    RETURN QUERY SELECT 
        v_user_id,
        v_pin,
        'User registered successfully. Please save your PIN securely.' AS message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User authentication function
CREATE OR REPLACE FUNCTION authenticate_user(
    p_phone_number VARCHAR(20),
    p_pin VARCHAR(6),
    p_ip_address VARCHAR(45) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS TABLE(
    user_id UUID,
    session_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    pin_regenerated BOOLEAN,
    new_pin VARCHAR(6),
    message TEXT
) AS $$
DECLARE
    v_user RECORD;
    v_session_token TEXT;
    v_token_hash VARCHAR(255);
    v_session_expires TIMESTAMP WITH TIME ZONE;
    v_pin_regenerated BOOLEAN := false;
    v_new_pin VARCHAR(6) := NULL;
    v_new_pin_hash VARCHAR(255);
BEGIN
    SELECT * INTO v_user FROM users WHERE phone_number = p_phone_number AND is_active = true;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid phone number or PIN';
    END IF;
    IF v_user.pin_expires_at IS NOT NULL AND v_user.pin_expires_at < NOW() THEN
        RAISE EXCEPTION 'PIN has expired. Please contact support.';
    END IF;
    IF NOT (v_user.access_pin = crypt(p_pin, v_user.access_pin)) THEN
        PERFORM log_activity(v_user.id, NULL, 'login_failed', 
            jsonb_build_object('reason', 'invalid_pin'), p_ip_address);
        RAISE EXCEPTION 'Invalid phone number or PIN';
    END IF;
    UPDATE users SET pin_usage_count = pin_usage_count + 1, last_login = NOW()
    WHERE id = v_user.id;
    IF v_user.pin_usage_count + 1 >= v_user.max_pin_uses THEN
        v_new_pin := generate_user_pin();
        v_new_pin_hash := crypt(v_new_pin, gen_salt('bf', 12));
        UPDATE users SET access_pin = v_new_pin_hash, pin_usage_count = 0, 
            pin_expires_at = NOW() + INTERVAL '30 days'
        WHERE id = v_user.id;
        v_pin_regenerated := true;
    END IF;
    v_session_token := encode(gen_random_bytes(32), 'base64');
    v_token_hash := encode(digest(v_session_token, 'sha256'), 'hex');
    v_session_expires := NOW() + INTERVAL '7 days';
    INSERT INTO session_tokens (user_id, token_hash, expires_at, ip_address, user_agent)
    VALUES (v_user.id, v_token_hash, v_session_expires, p_ip_address, p_user_agent);
    PERFORM log_activity(v_user.id, NULL, 'login_success', 
        jsonb_build_object('ip_address', p_ip_address), p_ip_address);
    RETURN QUERY SELECT 
        v_user.id,
        v_session_token,
        v_session_expires,
        v_pin_regenerated,
        v_new_pin,
        CASE 
            WHEN v_pin_regenerated THEN 'Login successful. Your PIN has been regenerated.'
            ELSE 'Login successful.'
        END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Session validation function
CREATE OR REPLACE FUNCTION validate_session(p_session_token TEXT)
RETURNS TABLE(user_id UUID, role VARCHAR(20), is_valid BOOLEAN, expires_at TIMESTAMP WITH TIME ZONE) AS $$
DECLARE
    v_token_hash VARCHAR(255);
    v_session RECORD;
BEGIN
    v_token_hash := encode(digest(p_session_token, 'sha256'), 'hex');
    SELECT st.user_id, u.role, st.expires_at, (st.expires_at > NOW()) AS is_valid
    INTO v_session FROM session_tokens st
    JOIN users u ON st.user_id = u.id WHERE st.token_hash = v_token_hash;
    IF NOT FOUND THEN
        RETURN QUERY SELECT NULL::UUID, NULL::VARCHAR(20), false, NULL::TIMESTAMP WITH TIME ZONE;
        RETURN;
    END IF;
    IF v_session.is_valid THEN
        UPDATE session_tokens SET last_used_at = NOW() WHERE token_hash = v_token_hash;
    END IF;
    RETURN QUERY SELECT v_session.user_id, v_session.role, v_session.is_valid, v_session.expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Logout function
CREATE OR REPLACE FUNCTION logout_user(p_session_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_token_hash VARCHAR(255);
    v_user_id UUID;
BEGIN
    v_token_hash := encode(digest(p_session_token, 'sha256'), 'hex');
    SELECT user_id INTO v_user_id FROM session_tokens WHERE token_hash = v_token_hash;
    DELETE FROM session_tokens WHERE token_hash = v_token_hash;
    IF v_user_id IS NOT NULL THEN
        PERFORM log_activity(v_user_id, NULL, 'logout', NULL, NULL);
    END IF;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PIN regeneration function
CREATE OR REPLACE FUNCTION regenerate_user_pin(p_user_id UUID)
RETURNS TABLE(new_pin VARCHAR(6), expires_at TIMESTAMP WITH TIME ZONE, message TEXT) AS $$
DECLARE
    v_new_pin VARCHAR(6);
    v_new_pin_hash VARCHAR(255);
    v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    v_new_pin := generate_user_pin();
    v_new_pin_hash := crypt(v_new_pin, gen_salt('bf', 12));
    v_expires_at := NOW() + INTERVAL '30 days';
    UPDATE users SET access_pin = v_new_pin_hash, pin_usage_count = 0, 
        pin_expires_at = v_expires_at, updated_at = NOW()
    WHERE id = p_user_id;
    PERFORM log_activity(p_user_id, NULL, 'pin_regenerated', NULL, NULL);
    RETURN QUERY SELECT v_new_pin, v_expires_at, 'PIN regenerated successfully.' AS message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. CREATE TRIGGERS
-- ============================================

-- Trigger for application number
CREATE OR REPLACE FUNCTION set_application_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
        NEW.application_number := generate_application_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_application_number
BEFORE INSERT ON funding_applications
FOR EACH ROW EXECUTE FUNCTION set_application_number();

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON funding_applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_preferences_updated_at
BEFORE UPDATE ON contact_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_configuration_updated_at
BEFORE UPDATE ON site_configuration
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SETUP COMPLETE
-- ============================================
```

### 6.2 Create Storage Bucket Script

Execute in Supabase SQL Editor:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'application-documents',
    'application-documents',
    false,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;
```

---

## SUPPLEMENTARY DOCUMENT: AUTHENTICATION SYSTEM IMPLEMENTATION GUIDE

# ALTERNATIVE AUTHENTICATION IMPLEMENTATION
## Phone Number + PIN System (No SMS OTP)

### System Overview

**Due to budget constraints, the MVP will not use SMS-based OTP authentication via Supabase Auth. Instead, we implement a custom authentication system using:**

- **Phone Number:** Primary identifier
- **6-Digit PIN:** Generated by system, stored securely
- **Session Tokens:** JWT-like tokens for maintaining sessions
- **Usage Limits:** Automatic PIN regeneration after configured number of uses

### Key Advantages

1. **Zero SMS Costs:** No third-party SMS provider needed
2. **Simple UX:** Easy for users to understand and use
3. **Secure:** PINs are bcrypt-hashed with high cost factor
4. **Flexible:** Can add SMS OTP later without major refactoring
5. **Offline-Ready:** Works without external dependencies

### Authentication Flow

**Registration:**
1. User enters phone number
2. System calls `register_user(phone_number)` function
3. System generates 6-digit PIN
4. PIN is displayed to user once (they must save it)
5. User is logged in automatically

**Login:**
1. User enters phone number + PIN
2. System calls `authenticate_user(phone_number, pin)` function
3. System validates PIN (bcrypt comparison)
4. System generates session token
5. Session token stored in HTTP-only cookie or localStorage
6. If PIN usage limit reached, new PIN generated automatically

**Session Management:**
1. Every API request includes session token in header
2. Backend calls `validate_session(token)` function
3. Function returns user_id, role, and validity status
4. Expired sessions rejected automatically

### Security Considerations

**PIN Security:**
- PINs are hashed using bcrypt with cost factor 12
- Never store or transmit PINs in plaintext
- Display PIN to user only once during registration
- Automatic regeneration prevents long-term exposure

**Session Security:**
- Tokens are random 256-bit values
- Stored as SHA-256 hashes in database
- 7-day expiration (configurable)
- IP address and user agent logged for audit trail

**Rate Limiting:**
- Implement at application level
- Max 5 failed login attempts per phone number per hour
- Temporary account lock after excessive failures

### Frontend Implementation Notes

**Storage:**
```javascript
// Store session token securely
// Option 1: HTTP-only cookie (recommended)
// Set via Set-Cookie header from backend

// Option 2: localStorage (easier for MVP)
localStorage.setItem('session_token', token);

// Always use HTTPS in production
```

**API Calls:**
```javascript
// Include token in all authenticated requests
const headers = {
  'Authorization': `Bearer ${sessionToken}`,
  'Content-Type': 'application/json'
};
```

**PIN Display:**
```javascript
// After registration, show PIN prominently
// Use modal or dedicated page
// Emphasize importance of saving PIN
// Provide download/copy options
```

### Migration Path to SMS OTP

When budget allows, migration to SMS OTP is straightforward:

1. Enable Supabase Auth with phone provider
2. Keep existing PIN system as fallback
3. Gradually migrate users to OTP
4. Deprecate PIN system after transition period

### Database Queries for Common Operations

**Check if phone number exists:**
```sql
SELECT EXISTS(SELECT 1 FROM users WHERE phone_number = '+1234567890');
```

**Get user by session token:**
```sql
SELECT u.* FROM users u
JOIN session_tokens st ON u.id = st.user_id
WHERE st.token_hash = encode(digest('token_here', 'sha256'), 'hex')
AND st.expires_at > NOW();
```

**Get all user's applications:**
```sql
SELECT * FROM funding_applications
WHERE user_id = 'user_uuid_here'
ORDER BY created_at DESC;
```

**Update application status (admin):**
```sql
UPDATE funding_applications
SET status = 'approved', updated_at = NOW()
WHERE id = 'application_uuid_here';
```

### Error Handling

**Common errors to handle:**
- Phone number already registered
- Invalid phone number format
- Invalid PIN
- Expired PIN
- Expired session token
- Account locked (too many failed attempts)

**Error responses should be user-friendly:**
- "Invalid phone number or PIN" (don't specify which)
- "Your PIN has expired. Please contact support."
- "Your session has expired. Please log in again."

---

## END OF SUPABASE CONFIGURATION GUIDE

All SQL scripts are ready to execute. Copy each section into Supabase SQL Editor and run in order. The system will be fully configured for the alternative authentication approach.
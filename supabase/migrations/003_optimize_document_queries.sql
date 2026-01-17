-- =====================================================
-- MIGRATION: Optimize Document Management for Admin
-- =====================================================
-- Description: Adds indexes and views to optimize document retrieval
-- for admin users, making it easy to find all documents uploaded by
-- any user for any funding application.
-- Created: January 17, 2026
-- =====================================================

-- Add composite index for efficient admin document queries
-- This allows admins to quickly:
-- 1. Find all documents for a specific user across all applications
-- 2. Find all documents for a specific application
-- 3. Filter by document type and upload status
CREATE INDEX IF NOT EXISTS idx_documents_admin_search 
ON application_documents(application_id, document_type, upload_status, uploaded_at DESC);

-- Add index on uploaded_at for chronological sorting
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at 
ON application_documents(uploaded_at DESC);

-- Create a view for admin document management
-- This provides a comprehensive view of all documents with user and application context
CREATE OR REPLACE VIEW admin_document_overview AS
SELECT 
    ad.id AS document_id,
    ad.document_type,
    ad.file_name,
    ad.file_path,
    ad.file_size,
    ad.mime_type,
    ad.upload_status,
    ad.uploaded_at,
    fa.id AS application_id,
    fa.application_number,
    fa.user_id,
    fa.status AS application_status,
    fa.funding_amount,
    fa.first_name,
    fa.last_name,
    u.phone_number AS user_phone
FROM 
    application_documents ad
    INNER JOIN funding_applications fa ON ad.application_id = fa.id
    INNER JOIN users u ON fa.user_id = u.id
ORDER BY 
    ad.uploaded_at DESC;

-- Grant access to admin_document_overview
GRANT SELECT ON admin_document_overview TO authenticated;

-- Add helpful comment
COMMENT ON VIEW admin_document_overview IS 
'Comprehensive view for admin document management. Provides all document details along with user and application context for efficient document retrieval and management.';

-- Add comment to explain document organization
COMMENT ON INDEX idx_documents_admin_search IS 
'Optimizes admin queries for finding documents by application, type, status, and date. Enables fast retrieval of all documents for any user or application.';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Document management optimization completed successfully!';
    RAISE NOTICE 'Added indexes: idx_documents_admin_search, idx_documents_uploaded_at';
    RAISE NOTICE 'Created view: admin_document_overview';
    RAISE NOTICE 'Admins can now efficiently query documents by:';
    RAISE NOTICE '  - User (via user_id or phone_number)';
    RAISE NOTICE '  - Application (via application_id or application_number)';
    RAISE NOTICE '  - Document type (identity_front, identity_back, rib)';
    RAISE NOTICE '  - Upload status and date';
END $$;

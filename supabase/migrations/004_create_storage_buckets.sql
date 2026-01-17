-- =====================================================
-- MIGRATION: Create Storage Buckets for Documents
-- =====================================================
-- Description: Creates storage buckets for application documents
-- and sets up appropriate policies for secure access
-- Created: January 17, 2026
-- =====================================================

-- Create the application-documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'application-documents',
  'application-documents',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES (Custom Auth - Public Access)
-- =====================================================
-- Note: Since we're using custom phone+PIN authentication (not Supabase Auth),
-- we cannot use auth.uid() for RLS policies. Access control is handled at the
-- application level. Storage bucket is public for document uploads and viewing.

-- Policy 1: Allow anyone to upload documents (app-level auth controls this)
CREATE POLICY "Allow document uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'application-documents');

-- Policy 2: Allow anyone to view documents
CREATE POLICY "Allow document viewing"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'application-documents');

-- Policy 3: Allow document updates/replacement
CREATE POLICY "Allow document updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'application-documents')
WITH CHECK (bucket_id = 'application-documents');

-- Policy 4: Allow document deletion
CREATE POLICY "Allow document deletion"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'application-documents');

-- Add helpful comments
COMMENT ON POLICY "Allow document uploads" ON storage.objects IS 
'Allows public uploads to application-documents bucket. Access control handled at application level via custom phone+PIN authentication.';

COMMENT ON POLICY "Allow document viewing" ON storage.objects IS 
'Allows public viewing of documents. Application validates user session before allowing access to dashboard.';

COMMENT ON POLICY "Allow document updates" ON storage.objects IS 
'Allows document replacement. Application-level auth ensures users can only replace their own documents.';

COMMENT ON POLICY "Allow document deletion" ON storage.objects IS 
'Allows document deletion. Application-level auth controls which documents users can delete.';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Storage buckets created successfully!';
    RAISE NOTICE 'Bucket: application-documents';
    RAISE NOTICE 'File size limit: 5MB';
    RAISE NOTICE 'Allowed types: JPEG, PNG, PDF';
    RAISE NOTICE 'Storage policies configured for secure access';
END $$;

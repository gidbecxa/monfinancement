-- Fix funding types to use translation keys instead of hardcoded English text
-- This allows the frontend to properly translate funding types across all languages

-- Update the funding_types configuration to use translation keys
UPDATE site_configuration
SET config_value = '["personal-loan", "business-loan", "education-loan", "medical-assistance", "project-funding", "emergency-aid", "other"]'::jsonb
WHERE config_key = 'funding_types';

-- Verify the update
-- SELECT config_key, config_value FROM site_configuration WHERE config_key = 'funding_types';

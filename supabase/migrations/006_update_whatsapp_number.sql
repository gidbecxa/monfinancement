-- Update WhatsApp number to the real number
-- Previous: +33612345678 (placeholder)
-- New: +33629125401 (real number)

UPDATE contact_preferences
SET 
  whatsapp_number = '+33629125401',
  whatsapp_message_template = 'Bonjour, j''ai fait la demande. J''ai besoin d''assistance pour un bon suivi de mon dossier'
WHERE is_active = true;

-- Verify the update
-- SELECT whatsapp_number, whatsapp_message_template FROM contact_preferences WHERE is_active = true;

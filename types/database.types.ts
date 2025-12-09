export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone_number: string
          created_at: string
          updated_at: string
          last_login: string | null
          role: 'user' | 'admin'
          is_active: boolean
        }
        Insert: {
          id?: string
          phone_number: string
          created_at?: string
          updated_at?: string
          last_login?: string | null
          role?: 'user' | 'admin'
          is_active?: boolean
        }
        Update: {
          id?: string
          phone_number?: string
          created_at?: string
          updated_at?: string
          last_login?: string | null
          role?: 'user' | 'admin'
          is_active?: boolean
        }
      }
      funding_applications: {
        Row: {
          id: string
          user_id: string
          application_number: string
          status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
          funding_amount: number
          first_name: string
          last_name: string
          date_of_birth: string
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
          email: string
          residential_address: string
          country_of_residence: string
          funding_type: string
          funding_reason: string
          profession: string
          monthly_income: number
          step_3_completed_at: string | null
          current_step: number
          language_preference: string
          created_at: string
          updated_at: string
          submitted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          application_number?: string
          status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
          funding_amount: number
          first_name?: string
          last_name?: string
          date_of_birth?: string
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
          email?: string
          residential_address?: string
          country_of_residence?: string
          funding_type?: string
          funding_reason?: string
          profession?: string
          monthly_income?: number
          step_3_completed_at?: string | null
          current_step?: number
          language_preference?: string
          created_at?: string
          updated_at?: string
          submitted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          application_number?: string
          status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
          funding_amount?: number
          first_name?: string
          last_name?: string
          date_of_birth?: string
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
          email?: string
          residential_address?: string
          country_of_residence?: string
          funding_type?: string
          funding_reason?: string
          profession?: string
          monthly_income?: number
          step_3_completed_at?: string | null
          current_step?: number
          language_preference?: string
          created_at?: string
          updated_at?: string
          submitted_at?: string | null
        }
      }
      application_documents: {
        Row: {
          id: string
          application_id: string
          document_type: 'identity_front' | 'identity_back' | 'rib'
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          upload_status: 'uploading' | 'completed' | 'failed'
          uploaded_at: string
        }
        Insert: {
          id?: string
          application_id: string
          document_type: 'identity_front' | 'identity_back' | 'rib'
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          upload_status?: 'uploading' | 'completed' | 'failed'
          uploaded_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          document_type?: 'identity_front' | 'identity_back' | 'rib'
          file_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          upload_status?: 'uploading' | 'completed' | 'failed'
          uploaded_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          full_name: string
          admin_email: string
          permissions: Json
          created_at: string
          last_access: string | null
        }
        Insert: {
          id: string
          full_name: string
          admin_email: string
          permissions?: Json
          created_at?: string
          last_access?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          admin_email?: string
          permissions?: Json
          created_at?: string
          last_access?: string | null
        }
      }
      contact_preferences: {
        Row: {
          id: string
          whatsapp_number: string
          whatsapp_message_template: string | null
          contact_email: string
          email_subject_template: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whatsapp_number: string
          whatsapp_message_template?: string | null
          contact_email: string
          email_subject_template?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whatsapp_number?: string
          whatsapp_message_template?: string | null
          contact_email?: string
          email_subject_template?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      site_configuration: {
        Row: {
          id: string
          config_key: string
          config_value: Json
          description: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          config_key: string
          config_value: Json
          description?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          config_key?: string
          config_value?: Json
          description?: string | null
          updated_at?: string
          updated_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_application_number: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

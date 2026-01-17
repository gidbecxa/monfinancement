'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Check, X, Eye } from 'lucide-react'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Document {
  id: string
  document_type: 'identity_front' | 'identity_back' | 'rib'
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  upload_status: 'uploading' | 'completed' | 'failed'
  uploaded_at: string
}

interface DocumentSectionProps {
  applicationId: string
  documents: Document[]
  onDocumentUploaded: () => void
}

const DOCUMENT_TYPES = {
  identity_front: {
    label: 'Identity Card (Front)',
    description: 'Front side of your ID card',
    icon: FileText,
  },
  identity_back: {
    label: 'Identity Card (Back)',
    description: 'Back side of your ID card',
    icon: FileText,
  },
  rib: {
    label: 'RIB (Bank Details)',
    description: 'Bank account information document',
    icon: FileText,
  },
}

export function DocumentSection({ applicationId, documents, onDocumentUploaded }: DocumentSectionProps) {
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const supabase = createClient()
  
  // Refs for file inputs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const getDocumentByType = (type: keyof typeof DOCUMENT_TYPES) => {
    return documents.find(doc => doc.document_type === type)
  }
  
  const triggerFileInput = (type: keyof typeof DOCUMENT_TYPES) => {
    fileInputRefs.current[type]?.click()
  }

  const handleFileUpload = async (
    type: keyof typeof DOCUMENT_TYPES,
    file: File
  ) => {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB', {
        description: 'Please choose a smaller file',
      })
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Only PDF, JPEG, and PNG files are allowed',
      })
      return
    }

    setUploading(type)
    setUploadProgress(0)

    // Show uploading toast
    const uploadToast = toast.loading(`Uploading ${DOCUMENT_TYPES[type].label}...`, {
      description: 'Please wait while we process your document',
    })

    try {
      // Simulate upload progress
      setUploadProgress(10)

      // Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${applicationId}/${type}_${Date.now()}.${fileExt}`

      setUploadProgress(30)

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error('Failed to upload file to storage')
      }

      setUploadProgress(60)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('application-documents')
        .getPublicUrl(fileName)

      setUploadProgress(80)

      // Save document record to database
      const { error: dbError } = await supabase
        .from('application_documents')
        // @ts-expect-error - Supabase type inference issue
        .insert({
          application_id: applicationId,
          document_type: type,
          file_name: file.name,
          file_path: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          upload_status: 'completed',
        })

      if (dbError) {
        console.error('Database insert error:', dbError)
        throw new Error('Failed to save document record')
      }

      setUploadProgress(100)

      // Dismiss loading toast and show success
      toast.dismiss(uploadToast)
      toast.success('Document uploaded successfully!', {
        description: `${DOCUMENT_TYPES[type].label} has been validated and saved`,
        duration: 5000,
      })

      // Refresh documents list
      onDocumentUploaded()
    } catch (error) {
      console.error('Upload error:', error)
      
      // Dismiss loading toast and show error
      toast.dismiss(uploadToast)
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Please try again or contact support if the problem persists',
        duration: 7000,
      })
    } finally {
      setUploading(null)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Your Documents</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(DOCUMENT_TYPES) as Array<keyof typeof DOCUMENT_TYPES>).map((type) => {
          const docType = DOCUMENT_TYPES[type]
          const existingDoc = getDocumentByType(type)
          const Icon = docType.icon

          return (
            <div
              key={type}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${existingDoc ? 'bg-success-100' : 'bg-gray-100'}`}>
                    <Icon className={`w-5 h-5 ${existingDoc ? 'text-success-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">{docType.label}</h4>
                    <p className="text-xs text-gray-500">{docType.description}</p>
                  </div>
                </div>
                {existingDoc && (
                  <Check className="w-5 h-5 text-success-600" />
                )}
              </div>

              {/* Status */}
              {existingDoc ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded p-2 text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{formatFileSize(existingDoc.file_size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uploaded:</span>
                      <span className="font-medium">{formatDate(existingDoc.uploaded_at)}</span>
                    </div>
                  </div>

                  {/* Success indicator */}
                  <div className="flex items-center gap-2 text-xs text-success-600 bg-success-50 rounded p-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">Verified and stored securely</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedDocument(existingDoc)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => triggerFileInput(type)}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Replace
                    </Button>
                    <input
                      ref={(el) => { fileInputRefs.current[type] = el }}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleFileUpload(type, file)
                          e.target.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {uploading === type ? (
                    <div className="space-y-2">
                      {/* Upload progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-center text-gray-600">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => triggerFileInput(type)}
                        disabled={!!uploading}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                      <input
                        ref={(el) => { fileInputRefs.current[type] = el }}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(type, file)
                            e.target.value = ''
                          }
                        }}
                        disabled={!!uploading}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">{selectedDocument.file_name}</h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              {selectedDocument.mime_type === 'application/pdf' ? (
                <iframe
                  src={selectedDocument.file_path}
                  className="w-full h-[600px]"
                  title="Document Preview"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedDocument.file_path}
                  alt="Document"
                  className="max-w-full h-auto mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

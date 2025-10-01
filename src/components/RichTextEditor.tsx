import React, { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Link2, Type, Palette } from 'lucide-react'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
})

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  height?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your blog post...",
  height = "400px"
}) => {
  const [showImageModal, setShowImageModal] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Image upload handler
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    try {
      setUploadingImage(true)
      
      // For demo purposes, we'll use a data URL
      // In production, you'd upload to your server/cloud storage
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    } finally {
      setUploadingImage(false)
    }
  }, [])

  // Custom image handler
  const imageHandler = useCallback(() => {
    setShowImageModal(true)
  }, [])

  // Dropzone for image upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      try {
        const imageUrl = await uploadImage(file)
        // Simple insertion - user can position it manually
        onChange(value + `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`)
        setShowImageModal(false)
      } catch (error) {
        alert('Failed to upload image. Please try again.')
      }
    }
  }, [uploadImage, onChange, value])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  // Custom toolbar configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': ['sans-serif', 'serif', 'monospace'] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ]

  // Custom styles for the editor
  const editorStyle = {
    height: height,
  }

  useEffect(() => {
    // Load Quill styles dynamically
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
    document.head.appendChild(link)
    
    return () => {
      // Cleanup
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className="relative">
      {/* Rich Text Editor */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={editorStyle}
          theme="snow"
        />
      </div>

      {/* Custom Formatting Buttons (Additional) */}
      <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-sm text-gray-600 font-medium">Quick Actions:</div>
        <div className="text-sm text-gray-500">
          Use the toolbar above for formatting: <strong>Bold (B)</strong>, <em>Italic (I)</em>, <u>Underline (U)</u>, colors, fonts, and more!
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        <button
          onClick={() => setShowImageModal(true)}
          className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="text-sm">Add Image</span>
        </button>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Image</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {uploadingImage ? (
                <div className="text-blue-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  Uploading image...
                </div>
              ) : isDragActive ? (
                <p className="text-blue-600">Drop the image here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">Drag & drop an image here, or click to select</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowImageModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RichTextEditor
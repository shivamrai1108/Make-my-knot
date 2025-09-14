import { useState, useRef } from 'react'
import { Camera, Upload, X, Check } from 'lucide-react'
import Image from 'next/image'

interface ProfilePictureUploadProps {
  currentPicture?: string
  onUpload: (pictureUrl: string) => void
  className?: string
}

export default function ProfilePictureUpload({ 
  currentPicture, 
  onUpload, 
  className = '' 
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPicture || null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new window.Image()
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        const newWidth = img.width * ratio
        const newHeight = img.height * ratio
        
        canvas.width = newWidth
        canvas.height = newHeight
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, newWidth, newHeight)
        
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        }, file.type, quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const simulateCloudUpload = async (file: File): Promise<string> => {
    // Simulate various upload stages
    const stages = [
      { progress: 20, message: 'Compressing image...', delay: 500 },
      { progress: 40, message: 'Connecting to server...', delay: 300 },
      { progress: 70, message: 'Uploading to cloud storage...', delay: 800 },
      { progress: 90, message: 'Processing image...', delay: 400 },
      { progress: 100, message: 'Upload complete!', delay: 200 }
    ]
    
    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay))
      // In a real app, you'd update progress here
      console.log(`${stage.progress}% - ${stage.message}`)
    }
    
    // Return the compressed image as base64
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF)')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB. Please choose a smaller image.')
      return
    }

    setIsUploading(true)

    try {
      // Show immediate preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
      }
      reader.readAsDataURL(file)

      // Compress image for better performance
      const compressedFile = await compressImage(file)
      
      console.log(`Original size: ${(file.size / 1024).toFixed(1)}KB, Compressed: ${(compressedFile.size / 1024).toFixed(1)}KB`)
      
      // Simulate cloud upload process
      const uploadedUrl = await simulateCloudUpload(compressedFile)
      
      // Call the upload handler
      onUpload(uploadedUrl)
      
      // Success feedback
      console.log('✅ Profile picture uploaded successfully!')

    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Upload failed. Please try again with a different image.')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Current/Preview Image */}
      {previewUrl ? (
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="Change picture"
                disabled={isUploading}
              >
                <Camera className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={handleRemove}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="Remove picture"
                disabled={isUploading}
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>

          {/* Upload indicator */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      ) : (
        /* Upload Area */
        <div
          className={`w-32 h-32 rounded-full border-4 border-dashed transition-colors cursor-pointer ${
            dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            ) : (
              <>
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-xs text-center px-2">
                  Click or drag to upload
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload guidelines */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Upload a profile picture (max 5MB)
        </p>
        <p className="text-xs text-gray-400 mt-1">
          JPG, PNG, or GIF formats supported
        </p>
      </div>
    </div>
  )
}

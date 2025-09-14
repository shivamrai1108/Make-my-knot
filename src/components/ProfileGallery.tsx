import { useState, useRef } from 'react'
import { Upload, X, Camera, Star, Lock, Eye, EyeOff, Edit3, Trash2, Image as ImageIcon } from 'lucide-react'

interface ProfileImage {
  id: string
  url: string
  isMain: boolean
  isPrivate: boolean
  caption?: string
  uploadedAt: string
}

interface Props {
  images: ProfileImage[]
  onImagesChange: (images: ProfileImage[]) => void
  maxImages?: number
  isOwner?: boolean
  canViewPrivate?: boolean
}

export default function ProfileGallery({ 
  images, 
  onImagesChange, 
  maxImages = 6, 
  isOwner = false, 
  canViewPrivate = false 
}: Props) {
  const [selectedImage, setSelectedImage] = useState<ProfileImage | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [editingCaption, setEditingCaption] = useState<string | null>(null)
  const [captionText, setCaptionText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter images based on privacy and permissions
  const visibleImages = images.filter(img => 
    !img.isPrivate || isOwner || canViewPrivate
  )

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !isOwner) return

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage: ProfileImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            url: e.target?.result as string,
            isMain: images.length === 0, // First image becomes main
            isPrivate: false,
            uploadedAt: new Date().toISOString()
          }
          
          onImagesChange([...images, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
    setShowUploadModal(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (!isOwner) return
    
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (isOwner) setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const deleteImage = (imageId: string) => {
    if (!isOwner) return
    const updatedImages = images.filter(img => img.id !== imageId)
    // If we deleted the main image, make the first remaining image main
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isMain)) {
      updatedImages[0].isMain = true
    }
    onImagesChange(updatedImages)
  }

  const togglePrivacy = (imageId: string) => {
    if (!isOwner) return
    const updatedImages = images.map(img =>
      img.id === imageId ? { ...img, isPrivate: !img.isPrivate } : img
    )
    onImagesChange(updatedImages)
  }

  const setMainImage = (imageId: string) => {
    if (!isOwner) return
    const updatedImages = images.map(img => ({
      ...img,
      isMain: img.id === imageId
    }))
    onImagesChange(updatedImages)
  }

  const updateCaption = (imageId: string, caption: string) => {
    if (!isOwner) return
    const updatedImages = images.map(img =>
      img.id === imageId ? { ...img, caption } : img
    )
    onImagesChange(updatedImages)
    setEditingCaption(null)
    setCaptionText('')
  }

  const startEditingCaption = (image: ProfileImage) => {
    setEditingCaption(image.id)
    setCaptionText(image.caption || '')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Photo Gallery</h3>
          <p className="text-gray-600 mt-1">
            {isOwner 
              ? `Share your best photos (${visibleImages.length}/${maxImages})`
              : `${visibleImages.length} photo${visibleImages.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        {isOwner && images.length < maxImages && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Camera className="h-5 w-5 mr-2" />
            Add Photos
          </button>
        )}
      </div>

      {/* Image Grid */}
      {visibleImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {visibleImages.map((image, index) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.caption || `Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                {/* Badges */}
                <div className="absolute top-2 left-2 space-y-1">
                  {image.isMain && (
                    <div className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Main
                    </div>
                  )}
                  {image.isPrivate && (
                    <div className="bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </div>
                  )}
                </div>

                {/* Owner Controls */}
                {isOwner && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-y-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePrivacy(image.id)
                      }}
                      className="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-white shadow-lg transition-colors"
                      title={image.isPrivate ? 'Make Public' : 'Make Private'}
                    >
                      {image.isPrivate ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteImage(image.id)
                      }}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* View Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                    View Photo
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {isOwner ? 'No photos uploaded yet' : 'No public photos available'}
          </h4>
          <p className="text-gray-600 mb-6">
            {isOwner 
              ? 'Add some beautiful photos to make your profile stand out'
              : 'This user hasn\'t shared any public photos yet'
            }
          </p>
          {isOwner && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary px-6 py-3"
            >
              <Camera className="h-5 w-5 mr-2 inline" />
              Upload Photos
            </button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && isOwner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Photos</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-primary-600 bg-primary-50' : 'border-gray-300'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Drag and drop photos here
              </h4>
              <p className="text-gray-600 mb-4">or click to browse</p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary px-6 py-3"
              >
                Choose Photos
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Upload up to {maxImages - images.length} more photos. 
              Supported formats: JPG, PNG, GIF (max 5MB each)
            </p>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                {selectedImage.isMain && (
                  <div className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Main Photo
                  </div>
                )}
                {selectedImage.isPrivate && (
                  <div className="bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.caption || 'Profile photo'}
                className="w-full max-h-[60vh] object-contain"
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              {/* Caption */}
              <div className="mb-4">
                {editingCaption === selectedImage.id ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={captionText}
                      onChange={(e) => setCaptionText(e.target.value)}
                      placeholder="Add a caption..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={() => updateCaption(selectedImage.id, captionText)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCaption(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700 italic">
                      {selectedImage.caption || (isOwner ? 'No caption added' : '')}
                    </p>
                    {isOwner && (
                      <button
                        onClick={() => startEditingCaption(selectedImage)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit Caption"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {!selectedImage.isMain && (
                      <button
                        onClick={() => {
                          setMainImage(selectedImage.id)
                          setSelectedImage(null)
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Set as Main
                      </button>
                    )}
                    
                    <button
                      onClick={() => togglePrivacy(selectedImage.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    >
                      {selectedImage.isPrivate ? (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Make Public
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Make Private
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      deleteImage(selectedImage.id)
                      setSelectedImage(null)
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

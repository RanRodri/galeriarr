import { useState, useRef } from 'react'
import { useImages } from '../hooks/useImages.jsx'

const ImageUploader = ({ albumId, onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  
  const { uploadImage } = useImages(albumId)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = async (files) => {
    if (!albumId) {
      setError('Selecciona un álbum antes de subir imágenes')
      return
    }

    setError(null)
    setUploading(true)
    setUploadProgress(0)

    try {
      const fileArray = Array.from(files)
      const totalFiles = fileArray.length
      let uploadedCount = 0

      for (const file of fileArray) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          setError(`El archivo ${file.name} no es una imagen o video válido`)
          continue
        }

        // Validar tamaño (máximo 100MB)
        if (file.size > 100 * 1024 * 1024) {
          setError(`El archivo ${file.name} es demasiado grande. Máximo 100MB`)
          continue
        }

        try {
          await uploadImage(file)
          uploadedCount++
          setUploadProgress((uploadedCount / totalFiles) * 100)
        } catch (uploadError) {
          console.error(`Error subiendo ${file.name}:`, uploadError)
          setError(`Error subiendo ${file.name}: ${uploadError.message}`)
        }
      }

      if (uploadedCount > 0) {
        onUploadComplete?.(uploadedCount)
        setUploadProgress(100)
        
        // Limpiar progreso después de un momento
        setTimeout(() => {
          setUploadProgress(0)
        }, 2000)
      }
    } catch (error) {
      console.error('Error en el proceso de subida:', error)
      setError(`Error en el proceso de subida: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openFileDialog()
    }
  }

  return (
    <div className="w-full">
      {/* Área de drag & drop */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-75 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Icono de subida */}
        <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
          {uploading ? (
            <svg className="w-full h-full animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>

        {/* Texto principal */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {uploading ? 'Subiendo imágenes...' : 'Sube tus imágenes aquí'}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          {uploading 
            ? 'Por favor espera mientras se procesan tus archivos'
            : 'Arrastra y suelta archivos de imagen o video, o haz clic para seleccionar'
          }
        </p>

        {/* Barra de progreso */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Botón de selección de archivos */}
        {!uploading && (
          <button
            type="button"
            onClick={openFileDialog}
            onKeyDown={handleKeyDown}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            tabIndex={0}
            aria-label="Seleccionar archivos para subir"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Seleccionar archivos
          </button>
        )}

        {/* Información adicional */}
        <div className="mt-4 text-xs text-gray-500">
          <p>Formatos soportados: JPG, PNG, GIF, WebP, MP4, MOV, AVI</p>
          <p>Tamaño máximo: 100MB por archivo</p>
        </div>

        {/* Input de archivos oculto */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Selector de archivos"
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {uploadProgress === 100 && !error && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                ¡Imágenes subidas exitosamente! Se están procesando en Google Photos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader

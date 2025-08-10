import { useState, useRef } from 'react'
import Swal from 'sweetalert2'

export default function ImageUploader({ onUpload, albumId, disabled = false }) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        Swal.showValidationMessage('Solo se permiten archivos de imagen')
        return false
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB
        Swal.showValidationMessage('La imagen no puede ser mayor a 100MB')
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    try {
      setIsUploading(true)
      
      // Mostrar progreso
      Swal.fire({
        title: 'Subiendo imagen...',
        html: `
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Subiendo ${validFiles.length} imagen${validFiles.length > 1 ? 'es' : ''}...</p>
            <div class="mt-4 text-sm text-gray-600">
              <p>Por favor espera mientras se procesan tus archivos</p>
            </div>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false
      })

      // Subir cada archivo
      for (const file of validFiles) {
        await onUpload(file, file.name)
      }

      // Mostrar éxito
      await Swal.fire({
        title: '¡Imágenes subidas!',
        text: `${validFiles.length} imagen${validFiles.length > 1 ? 'es' : ''} se han subido exitosamente al álbum.`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })

    } catch (error) {
      console.error('Error uploading images:', error)
      await Swal.fire({
        title: 'Error al subir imágenes',
        text: error.message || 'Hubo un problema al subir las imágenes. Inténtalo de nuevo.',
        icon: 'error'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files)
    // Reset input para permitir seleccionar el mismo archivo
    e.target.value = ''
  }

  return (
    <div className="w-full">
      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Área de drag & drop */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="space-y-4">
          {/* Icono */}
          <div className="mx-auto w-16 h-16 text-gray-400">
            {isUploading ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            ) : (
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>

          {/* Texto */}
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isUploading 
                ? 'Subiendo imágenes...' 
                : 'Arrastra y suelta imágenes aquí'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isUploading 
                ? 'Por favor espera mientras se procesan tus archivos'
                : 'o haz clic para seleccionar archivos'
              }
            </p>
          </div>

          {/* Información adicional */}
          {!isUploading && (
            <div className="text-xs text-gray-400 space-y-1">
              <p>Formatos soportados: JPG, PNG, GIF, WebP</p>
              <p>Tamaño máximo por archivo: 100MB</p>
              <p>Puedes seleccionar múltiples archivos</p>
            </div>
          )}
        </div>

        {/* Overlay de drag activo */}
        {dragActive && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
            <div className="text-blue-600 font-medium text-lg">
              Suelta las imágenes aquí
            </div>
          </div>
        )}
      </div>

      {/* Botón de selección manual */}
      {!isUploading && (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Seleccionar Imágenes</span>
        </button>
      )}
    </div>
  )
}

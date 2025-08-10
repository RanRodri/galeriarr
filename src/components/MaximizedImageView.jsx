import { useEffect } from 'react'

export default function MaximizedImageView({ 
  selectedImage, 
  images, 
  onClose, 
  onNavigate 
}) {
  
  // Función para manejar navegación con teclado
  const handleKeyDown = (event) => {
    if (!selectedImage) return

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        onNavigate('prev')
        break
      case 'ArrowRight':
        event.preventDefault()
        onNavigate('next')
        break
      case 'Escape':
        event.preventDefault()
        onClose()
        break
      default:
        break
    }
  }

  // Efecto para escuchar eventos de teclado
  useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  // Función para obtener URL optimizada de imagen
  const getOptimizedImageUrl = (mediaItem, size = 400) => {
    if (!mediaItem?.baseUrl) return null
    return `${mediaItem.baseUrl}=w${size}-h${size}-c`
  }

  // Función para obtener URL de imagen en alta resolución
  const getHighResImageUrl = (mediaItem) => {
    if (!mediaItem?.baseUrl) return null
    return `${mediaItem.baseUrl}=w1920-h1080`
  }

  // Función para obtener información de la imagen
  const getImageInfo = (mediaItem) => {
    const metadata = mediaItem?.mediaMetadata
    if (!metadata) return {}

    return {
      width: metadata.width || 'Desconocido',
      height: metadata.height || 'Desconocido',
      mimeType: mediaItem.mimeType || null,
      estimatedSize: metadata.width && metadata.height 
        ? `${Math.round((metadata.width * metadata.height * 3) / (1024 * 1024))} MB aprox.`
        : 'N/A'
    }
  }

  if (!selectedImage) return null

  const imageInfo = getImageInfo(selectedImage)
  const currentIndex = images.findIndex(img => img.id === selectedImage.id)

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header superior solo con botón cerrar */}
        <div className="absolute top-0 right-0 z-20 p-2 sm:p-3 md:p-6">
          {/* Botón cerrar moderno responsivo */}
          <button
            className="group bg-black bg-opacity-60 hover:bg-opacity-80 backdrop-blur-md border border-white border-opacity-20 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-white hover:text-red-400 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
            onClick={onClose}
            aria-label="Cerrar vista maximizada"
          >
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-90" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contador de imágenes responsivo */}
        {images.length > 1 && (
          <div className="absolute top-2 sm:top-3 md:top-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-full px-3 sm:px-4 md:px-6 py-1 sm:py-2 border border-white border-opacity-20">
              <span className="text-white text-xs sm:text-sm font-medium">
                {currentIndex + 1} de {images.length}
              </span>
            </div>
          </div>
        )}

        {/* Botones de navegación modernos responsivos */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 sm:left-3 md:left-6 top-1/2 transform -translate-y-1/2 z-20 group bg-black bg-opacity-60 hover:bg-opacity-80 backdrop-blur-md border border-white border-opacity-20 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 text-white hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              onClick={() => onNavigate('prev')}
              aria-label="Imagen anterior"
            >
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              className="absolute right-2 sm:right-3 md:right-6 top-1/2 transform -translate-y-1/2 z-20 group bg-black bg-opacity-60 hover:bg-opacity-80 backdrop-blur-md border border-white border-opacity-20 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 text-white hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              onClick={() => onNavigate('next')}
              aria-label="Siguiente imagen"
            >
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Imagen maximizada optimizada responsiva */}
        <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6">
          <div className="relative w-full max-w-4xl max-h-[75vh] flex items-center justify-center">
            <img
              src={getHighResImageUrl(selectedImage)}
              alt={selectedImage.description || 'Imagen del álbum'}
              className="w-full h-auto max-h-full object-contain rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl"
              style={{
                maxHeight: '75vh',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.src = getOptimizedImageUrl(selectedImage, 800)
              }}
            />
          </div>
        </div>

        {/* Metadatos compactos y pequeños responsivos */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 border border-white border-opacity-20">
            {/* En móvil mostrar solo dimensiones, en desktop mostrar todo */}
            <div className="hidden sm:flex items-center space-x-2 md:space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300 text-[10px]">Dimensiones:</span>
                <span className="text-white font-medium text-[10px]">{imageInfo.width} × {imageInfo.height}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-[10px]">Tamaño:</span>
                <span className="text-white font-medium text-[10px]">{imageInfo.estimatedSize}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300 text-[10px]">Tipo:</span>
                <span className="text-white font-medium text-[10px]">{imageInfo.mimeType?.split('/')[1]?.toUpperCase() || 'N/A'}</span>
              </div>
            </div>
            
            {/* En móvil mostrar solo dimensiones */}
            <div className="sm:hidden flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span className="text-white font-medium text-[10px]">{imageInfo.width} × {imageInfo.height}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

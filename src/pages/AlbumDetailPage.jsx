import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useImages } from '../hooks/useImages'
import { useImageUpload } from '../hooks/useImageUpload'
import { googlePhotosAPI } from '../services/googlePhotosAPI'
import ImageGrid from '../components/ImageGrid'
import MaximizedImageView from '../components/MaximizedImageView'
import Swal from 'sweetalert2'

export default function AlbumDetailPage() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Estados principales
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Hook personalizado para manejo de imágenes
  const { 
    images, 
    loading,
    hasMoreImages,
    loadMoreImages, 
    reloadImages,
    // Estados de paginación por página
    currentPage,
    // Funciones de paginación por página
    goToPage,
    getTotalPages,
    getCurrentPageImages
  } = useImages(albumId)
  
  // Hook personalizado para subida de imágenes
  const { uploading, handleImageUpload } = useImageUpload(
    (file, description) => googlePhotosAPI.uploadImageToAlbum(file, albumId, description),
    reloadImages
  )

  // Efecto para cargar imágenes al montar el componente
  useEffect(() => {
    if (albumId) {
      reloadImages()
    }
  }, [albumId])

  // Función para manejar clic en imagen
  const handleImageClick = (image) => {
    setSelectedImage(image)
    const index = images.findIndex(img => img.id === image.id)
    setCurrentImageIndex(index >= 0 ? index : 0)
  }

  // Función para cerrar vista maximizada
  const handleCloseMaximized = () => {
    setSelectedImage(null)
    setCurrentImageIndex(0)
  }

  // Función para navegar entre imágenes
  const handleNavigateImage = (direction) => {
    if (!selectedImage || images.length === 0) return

    let newIndex
    if (direction === 'next') {
      newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    } else {
      newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    }
    
    setCurrentImageIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  // Función para manejar subida de imágenes
  const handleUploadImages = () => {
    if (!user) {
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para subir imágenes',
        icon: 'info',
        confirmButtonText: 'Entendido'
      })
      return
    }
    
    handleImageUpload()
  }

  // Función para volver a la lista de álbumes
  const handleBackToAlbums = () => {
    navigate('/')
  }

  // Función para manejar cambio de página
  const handlePageChange = (page) => {
    goToPage(page)
  }

  // Renderizado condicional para estado de carga
  if (loading && images.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header de carga */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl animate-pulse"></div>
                <div className="h-5 sm:h-6 bg-gray-200 rounded-lg w-32 sm:w-48 animate-pulse"></div>
              </div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded-xl w-24 sm:w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Contenido de carga */}
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center max-w-md mx-auto">
            {/* Icono de carga animado */}
            <div className="relative mb-6 sm:mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Texto de carga */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Cargando tu álbum
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Preparando una experiencia visual increíble...
            </p>
            
            {/* Indicador de progreso */}
            <div className="mt-6 sm:mt-8 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" style={{ position: 'relative' }}>
      {/* Header moderno con glassmorphism - Responsivo y optimizado para mobile */}
      <div 
        className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg fixed top-0 left-0 right-0 z-50"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <div className="container mx-auto px-2 sm:px-6 py-2 sm:py-4">
          {/* Layout del header - Responsivo y compacto para mobile */}
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            {/* Botón de regreso con diseño moderno - Responsivo y compacto */}
            <button
              onClick={handleBackToAlbums}
              className="group flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-200/50 w-full sm:w-auto"
              aria-label="Volver a la lista de álbumes"
            >
              <div className="w-4 h-4 sm:w-7 sm:h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 flex-shrink-0">
                <svg 
                  className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white transition-transform group-hover:-translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="text-center sm:text-left flex-1 sm:flex-none">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">Volver a</span>
                <span className="block text-xs sm:text-base text-gray-800 font-semibold">Álbumes</span>
              </div>
            </button>

            {/* Título del álbum con diseño premium - Responsivo y compacto para mobile */}
            <div className="text-center flex-1 order-first sm:order-none">
              <div className="inline-flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 px-2 sm:px-6 py-1.5 sm:py-2.5 bg-gradient-to-r from-white to-gray-50 rounded-xl sm:rounded-2xl shadow-sm border border-white/50">
                <div className="w-4 h-4 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-sm sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Detalle del Álbum
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    {images?.length || 0} imágenes • Página {currentPage} de {getTotalPages() || 1}
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de subida con diseño premium - Responsivo y compacto para mobile */}
            <button
              onClick={handleUploadImages}
              disabled={uploading}
              className="group relative overflow-hidden px-2 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:transform-none disabled:shadow-none w-full sm:w-auto order-last sm:order-none"
              aria-label="Subir imágenes al álbum"
            >
              {/* Fondo del botón */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:from-blue-500 group-hover:via-indigo-500 group-hover:to-purple-500 transition-all duration-300"></div>
               
              {/* Contenido del botón */}
              <div className="relative flex items-center justify-center space-x-2 sm:space-x-3 text-white">
                {uploading ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xs sm:text-sm font-medium">Subiendo...</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300 flex-shrink-0">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-medium">Subir imágenes</span>
                  </>
                )}
              </div>
               
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal con espaciado optimizado para mobile */}
      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 pt-16 sm:pt-24">
        {/* Grid de imágenes */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xl border border-white/20">
          <ImageGrid
            images={getCurrentPageImages()}
            onImageClick={handleImageClick}
            onLoadMore={loadMoreImages}
            hasMoreImages={hasMoreImages}
            loading={loading}
            // Props de paginación por página
            currentPage={currentPage}
            totalPages={getTotalPages() || 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Vista maximizada de imagen */}
      {selectedImage && (
        <MaximizedImageView
          selectedImage={selectedImage}
          images={images}
          onClose={handleCloseMaximized}
          onNavigate={handleNavigateImage}
        />
      )}
    </div>
  )
}


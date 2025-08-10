export default function ImageGrid({ 
  images, 
  onImageClick, 
  onLoadMore, 
  hasMoreImages, 
  loading,
  // Nuevas props para paginación por página
  currentPage = 1,
  totalPages = 1,
  onPageChange = null
}) {
  
  // Función para obtener URL optimizada de imagen
  const getOptimizedImageUrl = (mediaItem, size = 400) => {
    if (!mediaItem?.baseUrl) return null
    return `${mediaItem.baseUrl}=w${size}-h${size}-c`
  }

  // Función para formatear fecha corregida
  const formatDate = (mediaItem) => {
    // Intentar obtener la fecha de diferentes fuentes
    let dateToUse = null
    let dateSource = 'none'
    
    // 1. Primero intentar con mediaMetadata.creationTime
    if (mediaItem?.mediaMetadata?.creationTime) {
      dateToUse = mediaItem.mediaMetadata.creationTime
      dateSource = 'creationTime'
    }
    // 2. Si no, intentar con mediaMetadata.photoTakenTime
    else if (mediaItem?.mediaMetadata?.photoTakenTime) {
      dateToUse = mediaItem.mediaMetadata.photoTakenTime
      dateSource = 'photoTakenTime'
    }
    // 3. Si no, intentar con filename (buscar fecha en el nombre)
    else if (mediaItem?.filename) {
      // Buscar patrón de fecha en el filename (YYYY-MM-DD o similar)
      const dateMatch = mediaItem.filename.match(/(\d{4})-(\d{2})-(\d{2})/)
      if (dateMatch) {
        dateToUse = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}T00:00:00Z`
        dateSource = 'filename'
      }
    }
    
    if (!dateToUse) {
      console.log('No se encontró fecha para:', mediaItem?.filename || mediaItem?.id, 'Sources:', mediaItem?.mediaMetadata)
      return 'Fecha desconocida'
    }
    
    try {
      const date = new Date(dateToUse)
      
      // Verificar que la fecha sea válida
      if (isNaN(date.getTime())) {
        console.log('Fecha inválida:', dateToUse, 'Source:', dateSource, 'MediaItem:', mediaItem?.filename || mediaItem?.id)
        return 'Fecha inválida'
      }
      
      const now = new Date()
      const diffTime = now - date // Cambiar a diferencia directa para evitar problemas con fechas futuras
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      // Debug log
      console.log('Fecha procesada:', {
        original: dateToUse,
        parsed: date.toISOString(),
        source: dateSource,
        diffDays: diffDays,
        diffTime: diffTime,
        now: now.toISOString()
      })
      
      // Si la fecha es futura (puede pasar con algunos metadatos), mostrar fecha exacta
      if (diffTime < 0) {
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
      
      // Si la fecha es muy reciente (hoy)
      if (diffDays === 0) {
        const hours = Math.floor(diffTime / (1000 * 60 * 60))
        if (hours < 1) {
          const minutes = Math.floor(diffTime / (1000 * 60))
          return `Subida hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`
        }
        return `Subida hace ${hours} hora${hours !== 1 ? 's' : ''}`
      }
      
      // Si la fecha es ayer
      if (diffDays === 1) return 'Subida ayer'
      
      // Si la fecha es reciente (última semana)
      if (diffDays < 7) return `Subida hace ${diffDays} días`
      
      // Si la fecha es del último mes
      if (diffDays < 30) return `Subida hace ${Math.ceil(diffDays / 7)} semanas`
      
      // Si la fecha es del último año
      if (diffDays < 365) return `Subida hace ${Math.ceil(diffDays / 30)} meses`
      
      // Para fechas muy antiguas, mostrar fecha exacta
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formateando fecha:', error, 'MediaItem:', mediaItem, 'DateToUse:', dateToUse)
      return 'Error en fecha'
    }
  }

  // Función para obtener información de la imagen
  const getImageInfo = (mediaItem) => {
    const metadata = mediaItem?.mediaMetadata
    if (!metadata) return {}

    // Función para limpiar texto y remover extensión del archivo
    const cleanText = (text) => {
      if (!text) return null
      return text
        .replace(/^Imagen subida desde la aplicación -? ?/, '') // Remover prefijo antiguo
        .replace(/\.[^/.]+$/, '') // Remover extensión
        .trim() // Limpiar espacios
    }

    return {
      cleanDescription: cleanText(mediaItem.description), // Descripción limpia sin extensión
      creationTime: metadata.creationTime
    }
  }

    // Componente de paginación tradicional
  const PaginationComponent = () => {
    if (totalPages <= 1) return null

    const renderPageNumbers = () => {
      const pages = []
      const maxVisiblePages = 5
      
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      
      // Ajustar si no hay suficientes páginas visibles
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
      
      // Agregar primera página si no está visible
      if (startPage > 1) {
        pages.push(
          <button
            key={1}
            onClick={() => onPageChange?.(1)}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-lg shadow-sm"
          >
            1
          </button>
        )
        
        if (startPage > 2) {
          pages.push(
            <span key="ellipsis1" className="px-3 py-2 text-gray-400">
              ...
            </span>
          )
        }
      }
      
      // Agregar páginas visibles
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange?.(i)}
            className={`px-3 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 ${
              i === currentPage
                ? 'bg-blue-600 text-white border border-blue-600 shadow-md scale-105'
                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md'
            }`}
          >
            {i}
          </button>
        )
      }
      
      // Agregar última página si no está visible
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <span key="ellipsis2" className="px-3 py-2 text-gray-400">
              ...
            </span>
          )
        }
        
        pages.push(
          <button
            key={totalPages}
            onClick={() => onPageChange?.(totalPages)}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-lg shadow-sm"
          >
            {totalPages}
          </button>
        )
      }
      
      return pages
    }

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 py-8">
        {/* Información de paginación centrada */}
       

        {/* Controles de paginación centrados */}
        <div className="flex items-center gap-2">
          {/* Botón anterior */}
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          {/* Números de página */}
          <div className="flex items-center gap-1">
            {renderPageNumbers()}
          </div>

          {/* Botón siguiente */}
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            Siguiente
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Este álbum está vacío</h3>
        <p className="text-slate-600">Sube tu primera imagen para comenzar</p>
      </div>
    )
  }

  return (
    <>
      {/* Grid de imágenes completamente responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 p-3 sm:p-4">
        {images.map((mediaItem) => {
          const imageInfo = getImageInfo(mediaItem)
          const optimizedUrl = getOptimizedImageUrl(mediaItem)
          
          return (
            <div key={mediaItem.id} className="flex flex-col gap-2 sm:gap-3">
              <div
                className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-lg sm:rounded-xl cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md"
                style={{ backgroundImage: `url(${optimizedUrl || "data:image/svg+xml,%3csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='%23f3f4f6'/%3e%3cpath d='m160 180 80-60 80 60v120H160V180z' fill='%23d1d5db'/%3e%3ccircle cx='200' cy='140' r='20' fill='%23d1d5db'/%3e%3c/svg%3e"})` }}
                onClick={() => onImageClick(mediaItem)}
                onError={(e) => {
                  e.target.style.backgroundImage = "url('data:image/svg+xml,%3csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='%23f3f4f6'/%3e%3cpath d='m160 180 80-60 80 60v120H160V180z' fill='%23d1d5db'/%3e%3c/svg%3e')"
                }}
              />
              
              <div className="px-1">
                <p className="text-[#0e161b] text-xs sm:text-sm font-medium leading-tight truncate">
                  {imageInfo.cleanDescription || 'Sin título'}
                </p>
                <p className="text-[#4e7a97] text-[10px] sm:text-xs font-normal leading-tight">
                  {formatDate(mediaItem)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Componente de paginación avanzada */}
      <PaginationComponent />
    </>
  )
}

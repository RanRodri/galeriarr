import { useState, useEffect } from 'react'
import { googlePhotosAPI } from '../services/googlePhotosAPI.js'
import { useAuth } from '../context/AuthContext.jsx'

export const useImages = (albumId = null) => {
  const { isAuthenticated } = useAuth()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nextPageToken, setNextPageToken] = useState(null)
  
  // Estados para paginación por página
  const [currentPage, setCurrentPage] = useState(1)
  const [totalImages, setTotalImages] = useState(0)
  const [imagesPerPage] = useState(12)



  // Cargar imágenes
  const loadImages = async (pageToken = null) => {
    if (!isAuthenticated || !albumId) {
      console.log('🚫 useImages - No se pueden cargar imágenes:', { isAuthenticated, albumId })
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('🔄 useImages - Iniciando carga de imágenes para álbum:', albumId)

      let result
      if (albumId) {
        // Cargar imágenes de un álbum específico
        console.log('📂 useImages - Cargando imágenes del álbum:', albumId)
        result = await googlePhotosAPI.getMediaItemsFromAlbum(albumId, 50, pageToken)
        console.log('✅ useImages - Imágenes del álbum cargadas:', result)
      } else {
        // Cargar todas las imágenes del usuario
        console.log('📸 useImages - Cargando todas las imágenes del usuario')
        result = await googlePhotosAPI.getAllMediaItems(50, pageToken)
        console.log('✅ useImages - Todas las imágenes cargadas:', result)
      }
      
      if (pageToken) {
        // Si es paginación, agregar a las existentes
        setImages(prev => [...prev, ...result.mediaItems])
        console.log('📄 useImages - Imágenes agregadas por paginación:', result.mediaItems.length)
      } else {
        // Si es primera carga, reemplazar
        setImages(result.mediaItems)
        console.log('🆕 useImages - Imágenes reemplazadas (primera carga):', result.mediaItems.length)
      }
      
      setNextPageToken(result.nextPageToken)
      // Solo establecer el total en la primera carga
      if (!pageToken) {
        setTotalImages(result.mediaItems.length)
      }
    } catch (err) {
      console.error('❌ useImages - Error loading images:', err)
      
      // Categorizar errores para mejor UX
      let errorMessage = err.message
      
      if (err.message.includes('403')) {
        errorMessage = 'No tienes permisos suficientes para acceder a las imágenes de este álbum.'
      } else if (err.message.includes('401')) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      } else if (err.message.includes('404')) {
        errorMessage = 'El álbum no se encontró o no tienes acceso a él.'
      } else if (err.message.includes('500') || err.message.includes('502') || err.message.includes('503')) {
        errorMessage = 'Error del servidor de Google Photos. Por favor, intenta más tarde.'
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Subir imagen a álbum
  const uploadImage = async (file, description = '') => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }

    if (!albumId) {
      throw new Error('Album ID is required for uploading')
    }

    try {
      const newImage = await googlePhotosAPI.uploadImageToAlbum(file, albumId, description)
      
      // Agregar la nueva imagen al inicio de la lista
      setImages(prev => [newImage, ...prev])
      
      return newImage
    } catch (err) {
      console.error('Error uploading image:', err)
      throw err
    }
  }

  // Agregar imágenes existentes al álbum
  const addImagesToAlbum = async (imageIds) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }

    if (!albumId) {
      throw new Error('Album ID is required')
    }

    try {
      await googlePhotosAPI.addMediaItemsToAlbum(albumId, imageIds)
      
      // Recargar las imágenes del álbum
      reloadImages()
    } catch (err) {
      console.error('Error adding images to album:', err)
      throw err
    }
  }

  // Remover imágenes del álbum
  const removeImagesFromAlbum = async (imageIds) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }

    if (!albumId) {
      throw new Error('Album ID is required')
    }

    try {
      await googlePhotosAPI.removeMediaItemsFromAlbum(albumId, imageIds)
      
      // Remover las imágenes de la lista local
      setImages(prev => prev.filter(img => !imageIds.includes(img.id)))
    } catch (err) {
      console.error('Error removing images from album:', err)
      throw err
    }
  }

  // Buscar imágenes por rango de fechas
  const searchImagesByDateRange = async (startDate, endDate) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }

    try {
      setLoading(true)
      setError(null)

      const result = await googlePhotosAPI.searchPhotosByDateRange(startDate, endDate)
      setImages(result)
      setNextPageToken(null) // Reset pagination for search results
    } catch (err) {
      console.error('Error searching images by date:', err)
      
      // Categorizar errores para mejor UX
      let errorMessage = err.message
      
      if (err.message.includes('403')) {
        errorMessage = 'No tienes permisos suficientes para buscar imágenes.'
      } else if (err.message.includes('401')) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      } else if (err.message.includes('400')) {
        errorMessage = 'Los parámetros de búsqueda no son válidos.'
      } else if (err.message.includes('500') || err.message.includes('502') || err.message.includes('503')) {
        errorMessage = 'Error del servidor de Google Photos. Por favor, intenta más tarde.'
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.'
      }
      
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Cargar más imágenes (paginación)
  const loadMoreImages = () => {
    if (nextPageToken && !loading) {
      loadImages(nextPageToken)
    }
  }

  // Recargar imágenes
  const reloadImages = () => {
    setNextPageToken(null)
    setTotalImages(0)
    setCurrentPage(1)
    loadImages()
  }

  // Obtener imagen individual
  const getImage = async (imageId) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }

    try {
      return await googlePhotosAPI.getMediaItem(imageId)
    } catch (err) {
      console.error('Error getting image:', err)
      throw err
    }
  }

  // Funciones de paginación por página
  const goToPage = (page) => {
    if (page >= 1 && page <= getTotalPages()) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const getTotalPages = () => {
    return Math.ceil(totalImages / imagesPerPage)
  }

  const getCurrentPageImages = () => {
    const startIndex = (currentPage - 1) * imagesPerPage
    const endIndex = startIndex + imagesPerPage
    return images.slice(startIndex, endIndex)
  }

  // Cargar imágenes al montar o cuando cambie el estado de autenticación/albumId
  useEffect(() => {
    console.log('🔄 useImages - useEffect ejecutado:', {
      isAuthenticated,
      albumId,
      currentImagesCount: images.length
    })
    
    if (isAuthenticated) {
      console.log('✅ useImages - Usuario autenticado, cargando imágenes')
      loadImages()
    } else {
      console.log('❌ useImages - Usuario no autenticado, limpiando estado')
      setImages([])
      setError(null)
      setNextPageToken(null)
      setTotalImages(0)
      setCurrentPage(1)
    }
  }, [isAuthenticated, albumId])

  return {
    images,
    loading,
    error,
    hasMoreImages: !!nextPageToken,
    // Estados de paginación por página
    currentPage,
    totalImages,
    imagesPerPage,
    totalPages: getTotalPages(),
    currentPageImages: getCurrentPageImages(),
    // Funciones de paginación por página
    goToPage,
    nextPage,
    prevPage,
    // Funciones existentes
    uploadImage,
    addImagesToAlbum,
    removeImagesFromAlbum,
    searchImagesByDateRange,
    loadMoreImages,
    reloadImages,
    getImage
  }
}

export default useImages
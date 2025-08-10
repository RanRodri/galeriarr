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
      return
    }

    try {
      setLoading(true)
      setError(null)

      let result
      if (albumId) {
        // Cargar imágenes de un álbum específico
        result = await googlePhotosAPI.getMediaItemsFromAlbum(albumId, 50, pageToken)
      } else {
        // Cargar todas las imágenes del usuario
        result = await googlePhotosAPI.getAllMediaItems(50, pageToken)
      }
      
      // Asegurar que result.mediaItems sea siempre un array
      const mediaItems = Array.isArray(result?.mediaItems) ? result.mediaItems : []
      
      if (pageToken) {
        // Si es paginación, agregar a las existentes
        setImages(prev => [...prev, ...mediaItems])
      } else {
        // Si es primera carga, reemplazar
        setImages(mediaItems)
      }
      
      setNextPageToken(result?.nextPageToken || null)
      // Solo establecer el total en la primera carga
      if (!pageToken) {
        setTotalImages(mediaItems.length)
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
        errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta más tarde.'
      }
      
      setError(errorMessage)
      // En caso de error, asegurar que images sea un array vacío
      setImages([])
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
    if (!isAuthenticated || !albumId) {
      throw new Error('User not authenticated or album ID missing')
    }

    try {
      await googlePhotosAPI.addMediaItemsToAlbum(albumId, imageIds)
      
      // Recargar imágenes para mostrar las nuevas
      await loadImages()
    } catch (err) {
      console.error('Error adding images to album:', err)
      throw err
    }
  }

  // Remover imágenes del álbum
  const removeImagesFromAlbum = async (imageIds) => {
    if (!isAuthenticated || !albumId) {
      throw new Error('User not authenticated or album ID missing')
    }

    try {
      await googlePhotosAPI.removeMediaItemsFromAlbum(albumId, imageIds)
      
      // Remover imágenes de la lista local
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
      
      setImages(result.mediaItems)
      setNextPageToken(result.nextPageToken)
      setTotalImages(result.mediaItems.length)
      setCurrentPage(1)
    } catch (err) {
      console.error('Error searching images by date:', err)
      setError(err.message)
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
    setImages([])
    setNextPageToken(null)
    setCurrentPage(1)
    loadImages()
  }

  // Obtener imagen específica
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

  // Navegación de páginas
  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const nextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
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

  // Efecto para cargar imágenes cuando cambie la autenticación o el álbum
  useEffect(() => {
    if (isAuthenticated && albumId) {
      loadImages()
    } else if (!isAuthenticated) {
      // Limpiar estado cuando no esté autenticado
      setImages([])
      setNextPageToken(null)
      setError(null)
      setCurrentPage(1)
      setTotalImages(0)
    }
  }, [isAuthenticated, albumId])

  return {
    images,
    loading,
    error,
    currentPage,
    totalImages,
    imagesPerPage,
    hasMoreImages: !!nextPageToken,
    loadImages,
    uploadImage,
    addImagesToAlbum,
    removeImagesFromAlbum,
    searchImagesByDateRange,
    loadMoreImages,
    reloadImages,
    getImage,
    goToPage,
    nextPage,
    prevPage,
    getTotalPages,
    getCurrentPageImages
  }
}

export default useImages
import { useState, useEffect } from 'react'
import { googlePhotosAPI } from '../services/googlePhotosAPI.js'
import { useAuth } from '../context/AuthContext.jsx'

export const useAlbums = () => {
  const { isAuthenticated } = useAuth()
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nextPageToken, setNextPageToken] = useState(null)

  // Cargar álbumes
  const loadAlbums = async (pageToken = null) => {
    if (!isAuthenticated) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const result = await googlePhotosAPI.getAllUserAlbums(50, pageToken)
      
      if (pageToken) {
        // Si es paginación, agregar a los existentes
        setAlbums(prev => [...prev, ...result.albums])
      } else {
        // Si es primera carga, reemplazar
        setAlbums(result.albums)
      }
      
      setNextPageToken(result.nextPageToken)
    } catch (err) {
      console.error('❌ useAlbums - Error loading albums:', err)
      
      // Categorizar errores para mejor UX
      let errorMessage = err.message
      
      if (err.message.includes('403')) {
        errorMessage = 'No tienes permisos suficientes para acceder a los álbumes.'
      } else if (err.message.includes('401')) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
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

  // Crear nuevo álbum
  const createAlbum = async (title) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }

    try {
      const newAlbum = await googlePhotosAPI.createAlbum(title)
      
      // Agregar el nuevo álbum al inicio de la lista
      setAlbums(prev => [newAlbum, ...prev])
      
      return newAlbum
    } catch (err) {
      console.error('Error creating album:', err)
      throw err
    }
  }

  // Compartir álbum
  const shareAlbum = async (albumId, options = {}) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }

    try {
      const result = await googlePhotosAPI.shareAlbum(albumId, options)
      
      // Actualizar el álbum en la lista local
      setAlbums(prev => prev.map(album => 
        album.id === albumId 
          ? { ...album, shareInfo: result.shareInfo }
          : album
      ))
      
      return result
    } catch (err) {
      console.error('Error sharing album:', err)
      throw err
    }
  }

  // Cargar más álbumes (paginación)
  const loadMoreAlbums = () => {
    if (nextPageToken && !loading) {
      loadAlbums(nextPageToken)
    }
  }

  // Recargar álbumes
  const reloadAlbums = () => {
    setAlbums([])
    setNextPageToken(null)
    loadAlbums()
  }

  // Obtener álbum específico
  const getAlbum = async (albumId) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }

    try {
      return await googlePhotosAPI.getAlbum(albumId)
    } catch (err) {
      console.error('Error getting album:', err)
      throw err
    }
  }

  // Buscar álbum por título
  const searchAlbumByTitle = (searchTerm) => {
    if (!searchTerm.trim()) {
      return albums
    }

    const term = searchTerm.toLowerCase()
    return albums.filter(album => 
      album.title.toLowerCase().includes(term)
    )
  }

  // Filtrar álbumes por tipo
  const filterAlbumsByType = (type) => {
    switch (type) {
      case 'user':
        return albums.filter(album => album.source === 'user')
      case 'shared':
        return albums.filter(album => album.source === 'shared')
      case 'system':
        return albums.filter(album => album.source === 'system')
      default:
        return albums
    }
  }

  // Ordenar álbumes
  const sortAlbums = (sortBy = 'creationTime', order = 'desc') => {
    const sorted = [...albums].sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'mediaItemsCount':
          aValue = a.mediaItemsCount || 0
          bValue = b.mediaItemsCount || 0
          break
        case 'creationTime':
        default:
          aValue = new Date(a.creationTime || 0)
          bValue = new Date(b.creationTime || 0)
          break
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return sorted
  }

  // Efecto para cargar álbumes cuando cambie la autenticación
  useEffect(() => {
    if (isAuthenticated) {
      loadAlbums()
    } else {
      // Limpiar estado cuando no esté autenticado
      setAlbums([])
      setNextPageToken(null)
      setError(null)
    }
  }, [isAuthenticated])

  return {
    albums,
    loading,
    error,
    hasMoreAlbums: !!nextPageToken,
    loadAlbums,
    createAlbum,
    shareAlbum,
    loadMoreAlbums,
    reloadAlbums,
    getAlbum,
    searchAlbumByTitle,
    filterAlbumsByType,
    sortAlbums
  }
}
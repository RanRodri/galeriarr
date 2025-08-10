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
      console.log('🚫 useAlbums - No se pueden cargar álbumes: usuario no autenticado')
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('🔄 useAlbums - Iniciando carga de álbumes')

      // Usar el método que obtiene TODOS los álbumes del usuario (sistema, móvil, app)
      const result = await googlePhotosAPI.getAllUserAlbums(50, pageToken)
      console.log('✅ useAlbums - Álbumes cargados:', result)
      
      if (pageToken) {
        // Si es paginación, agregar a los existentes
        setAlbums(prev => [...prev, ...result.albums])
        console.log('📄 useAlbums - Álbumes agregados por paginación:', result.albums.length)
      } else {
        // Si es primera carga, reemplazar
        setAlbums(result.albums)
        console.log('🆕 useAlbums - Álbumes reemplazados (primera carga):', result.albums.length)
      }
      
      setNextPageToken(result.nextPageToken)
    } catch (err) {
      console.error('❌ useAlbums - Error loading albums:', err)
      
      // Categorizar errores para mejor UX
      let errorMessage = err.message
      
      if (err.message.includes('403') || err.message.includes('Acceso denegado')) {
        errorMessage = 'No tienes permisos suficientes para acceder a Google Photos. Esto puede deberse a: 1) La API no está habilitada en tu proyecto de Google Cloud, 2) Los scopes no fueron otorgados correctamente, 3) La sesión necesita ser renovada. Por favor, intenta re-autenticarte.'
      } else if (err.message.includes('401')) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      } else if (err.message.includes('500') || err.message.includes('502') || err.message.includes('503')) {
        errorMessage = 'Error del servidor de Google Photos. Por favor, intenta más tarde.'
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta más tarde.'
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
    setNextPageToken(null)
    loadAlbums()
  }

  // Cargar álbumes al montar o cuando cambie el estado de autenticación
  useEffect(() => {
    console.log('🔄 useAlbums - useEffect ejecutado:', {
      isAuthenticated,
      currentAlbumsCount: albums.length
    })
    
    if (isAuthenticated) {
      console.log('✅ useAlbums - Usuario autenticado, cargando álbumes')
      loadAlbums()
    } else {
      console.log('❌ useAlbums - Usuario no autenticado, limpiando estado')
      setAlbums([])
      setError(null)
      setNextPageToken(null)
    }
  }, [isAuthenticated])

  return {
    albums,
    loading,
    error,
    hasMoreAlbums: !!nextPageToken,
    createAlbum,
    shareAlbum,
    loadMoreAlbums,
    reloadAlbums
  }
}

export default useAlbums
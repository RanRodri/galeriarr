import { googleAuth } from './googleAuth.js'
import { API_ENDPOINTS } from '../utils/constants.js'

class GooglePhotosAPI {
  
  // CRUD de Álbumes
  
  // Obtener todos los álbumes
  async getAlbums(pageSize = 50, pageToken = null) {
    try {
      console.log('🔍 GooglePhotosAPI - getAlbums iniciado:', { pageSize, pageToken })
      
      const params = new URLSearchParams({
        pageSize: pageSize.toString()
      })
      
      if (pageToken) {
        params.append('pageToken', pageToken)
      }

      const endpoint = `${API_ENDPOINTS.ALBUMS}?${params.toString()}`
      console.log('🌐 GooglePhotosAPI - getAlbums endpoint:', endpoint)

      const response = await googleAuth.authenticatedFetch(endpoint)

      console.log('📥 GooglePhotosAPI - getAlbums response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ GooglePhotosAPI - getAlbums error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ GooglePhotosAPI - getAlbums success:', {
        albumsCount: data.albums?.length || 0,
        nextPageToken: data.nextPageToken
      })
      
      return {
        albums: data.albums || [],
        nextPageToken: data.nextPageToken
      }
    } catch (error) {
      console.error('❌ GooglePhotosAPI - Error fetching albums:', error)
      throw error
    }
  }

  // Obtener todos los álbumes del usuario (app-created, shared, system)
  async getAllUserAlbums(pageSize = 50, pageToken = null) {
    try {
      console.log('🔍 GooglePhotosAPI - getAllUserAlbums iniciado:', { pageSize, pageToken })
      
      // Hacer llamadas paralelas a diferentes endpoints
      const [userAlbumsResponse, sharedAlbumsResponse] = await Promise.all([
        // Álbumes del usuario (incluye todos los álbumes, no solo app-created)
        googleAuth.authenticatedFetch(
          `${API_ENDPOINTS.ALBUMS}?pageSize=${pageSize}${pageToken ? `&pageToken=${pageToken}` : ''}`
        ),
        // Álbumes compartidos
        googleAuth.authenticatedFetch(
          `${API_ENDPOINTS.SHARED_ALBUMS}?pageSize=${pageSize}`
        )
      ])

      console.log('📥 GooglePhotosAPI - getAllUserAlbums responses:', {
        userAlbumsStatus: userAlbumsResponse.status,
        sharedAlbumsStatus: sharedAlbumsResponse.status
      })

      if (!userAlbumsResponse.ok) {
        throw new Error(`Error fetching user albums: ${userAlbumsResponse.status}`)
      }

      if (!sharedAlbumsResponse.ok) {
        throw new Error(`Error fetching shared albums: ${sharedAlbumsResponse.status}`)
      }

      const [userAlbumsData, sharedAlbumsData] = await Promise.all([
        userAlbumsResponse.json(),
        sharedAlbumsResponse.json()
      ])

      console.log('📊 GooglePhotosAPI - getAllUserAlbums data:', {
        userAlbumsCount: userAlbumsData.albums?.length || 0,
        sharedAlbumsCount: sharedAlbumsData.sharedAlbums?.length || 0
      })

      // Procesar álbumes del usuario
      const userAlbums = (userAlbumsData.albums || []).map(album => ({
        ...album,
        source: 'user' // Álbumes del usuario (no solo app-created)
      }))

      // Procesar álbumes compartidos
      const sharedAlbums = (sharedAlbumsData.sharedAlbums || []).map(album => ({
        ...album,
        source: 'shared'
      }))

      // Combinar y eliminar duplicados
      const allAlbums = [...userAlbums, ...sharedAlbums]
      const uniqueAlbums = allAlbums.filter((album, index, self) => 
        index === self.findIndex(a => a.id === album.id)
      )

      console.log('✅ GooglePhotosAPI - getAllUserAlbums completado:', {
        totalAlbums: uniqueAlbums.length,
        nextPageToken: userAlbumsData.nextPageToken
      })

      return {
        albums: uniqueAlbums,
        nextPageToken: userAlbumsData.nextPageToken
      }
    } catch (error) {
      console.error('❌ GooglePhotosAPI - Error fetching all user albums:', error)
      throw error
    }
  }

  // Crear un nuevo álbum
  async createAlbum(title) {
    try {
      const response = await googleAuth.authenticatedFetch(API_ENDPOINTS.ALBUMS, {
        method: 'POST',
        body: JSON.stringify({
          album: {
            title: title
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating album:', error)
      throw error
    }
  }

  // Obtener álbum por ID
  async getAlbum(albumId) {
    try {
      console.log('🔍 GooglePhotosAPI - getAlbum iniciado:', albumId)
      console.log('🌐 GooglePhotosAPI - Endpoint:', `${API_ENDPOINTS.ALBUMS}/${albumId}`)
      
      const response = await googleAuth.authenticatedFetch(
        `${API_ENDPOINTS.ALBUMS}/${albumId}`
      )

      console.log('📥 GooglePhotosAPI - getAlbum response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ GooglePhotosAPI - getAlbum error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const albumData = await response.json()
      console.log('✅ GooglePhotosAPI - getAlbum success:', albumData)
      return albumData
    } catch (error) {
      console.error('❌ GooglePhotosAPI - Error fetching album:', error)
      throw error
    }
  }

  // Compartir álbum
  async shareAlbum(albumId, sharedAlbumOptions = {}) {
    try {
      const response = await googleAuth.authenticatedFetch(
        `${API_ENDPOINTS.ALBUMS}/${albumId}:share`,
        {
          method: 'POST',
          body: JSON.stringify({
            sharedAlbumOptions: {
              isCollaborative: sharedAlbumOptions.isCollaborative || false,
              isCommentable: sharedAlbumOptions.isCommentable || false,
              ...sharedAlbumOptions
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error sharing album:', error)
      throw error
    }
  }

  // CRUD de Media Items (Imágenes)

  // Buscar media items en un álbum
  async getMediaItemsFromAlbum(albumId, pageSize = 50, pageToken = null) {
    try {
      console.log('🔍 GooglePhotosAPI - getMediaItemsFromAlbum iniciado:', { albumId, pageSize, pageToken })
      
      const body = {
        albumId: albumId,
        pageSize: pageSize
      }

      if (pageToken) {
        body.pageToken = pageToken
      }

      console.log('📤 GooglePhotosAPI - Request body:', body)
      console.log('🌐 GooglePhotosAPI - Endpoint:', API_ENDPOINTS.SEARCH)

      const response = await googleAuth.authenticatedFetch(API_ENDPOINTS.SEARCH, {
        method: 'POST',
        body: JSON.stringify(body)
      })

      console.log('📥 GooglePhotosAPI - Response status:', response.status)
      console.log('📥 GooglePhotosAPI - Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ GooglePhotosAPI - Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ GooglePhotosAPI - Response data:', data)
      
      return {
        mediaItems: data.mediaItems || [],
        nextPageToken: data.nextPageToken
      }
    } catch (error) {
      console.error('❌ GooglePhotosAPI - Error fetching media items from album:', error)
      throw error
    }
  }



  // Buscar todos los media items del usuario
  async getAllMediaItems(pageSize = 100, pageToken = null) {
    try {
      const params = new URLSearchParams({
        pageSize: pageSize.toString()
      })
      
      if (pageToken) {
        params.append('pageToken', pageToken)
      }

      const response = await googleAuth.authenticatedFetch(
        `${API_ENDPOINTS.MEDIA_ITEMS}?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        mediaItems: data.mediaItems || [],
        nextPageToken: data.nextPageToken
      }
    } catch (error) {
      console.error('Error fetching all media items:', error)
      throw error
    }
  }

  // Obtener media item por ID
  async getMediaItem(mediaItemId) {
    try {
      const response = await googleAuth.authenticatedFetch(
        `${API_ENDPOINTS.MEDIA_ITEMS}/${mediaItemId}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching media item:', error)
      throw error
    }
  }

  // Subir archivo (paso 1: obtener upload token)
  async uploadFile(file) {
    try {
      // Paso 1: Subir el archivo y obtener upload token
      const uploadResponse = await googleAuth.authenticatedFetch(API_ENDPOINTS.UPLOADS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Goog-Upload-Content-Type': file.type,
          'X-Goog-Upload-Protocol': 'raw'
        },
        body: file
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed! status: ${uploadResponse.status}`)
      }

      const uploadToken = await uploadResponse.text()
      return uploadToken
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  // Crear media item desde upload token
  async createMediaItem(uploadToken, description = '', albumId = null) {
    try {
      const newMediaItems = [{
        description: description,
        simpleMediaItem: {
          uploadToken: uploadToken
        }
      }]

      const body = {
        newMediaItems: newMediaItems
      }

      if (albumId) {
        body.albumId = albumId
      }

      const response = await googleAuth.authenticatedFetch(API_ENDPOINTS.BATCH_CREATE, {
        method: 'POST',
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error(`Create media item failed! status: ${response.status}`)
      }

      const data = await response.json()
      return data.newMediaItemResults[0]
    } catch (error) {
      console.error('Error creating media item:', error)
      throw error
    }
  }

  // Función completa: subir imagen a álbum
  async uploadImageToAlbum(file, albumId, description = '') {
    try {
      // Paso 1: Subir archivo
      const uploadToken = await this.uploadFile(file)
      
      // Paso 2: Crear media item en el álbum
      const result = await this.createMediaItem(uploadToken, description, albumId)
      
      if (result.status && result.status.message !== 'Success') {
        throw new Error(`Failed to create media item: ${result.status.message}`)
      }
      
      return result.mediaItem
    } catch (error) {
      console.error('Error uploading image to album:', error)
      throw error
    }
  }

  // Agregar media items existentes a un álbum
  async addMediaItemsToAlbum(albumId, mediaItemIds) {
    try {
      const response = await googleAuth.authenticatedFetch(
        `${API_ENDPOINTS.ALBUMS}/${albumId}:batchAddMediaItems`,
        {
          method: 'POST',
          body: JSON.stringify({
            mediaItemIds: mediaItemIds
          })
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding media items to album:', error)
      throw error
    }
  }

  // Remover media items de un álbum
  async removeMediaItemsFromAlbum(albumId, mediaItemIds) {
    try {
      const response = await googleAuth.authenticatedFetch(
        `${API_ENDPOINTS.ALBUMS}/${albumId}:batchRemoveMediaItems`,
        {
          method: 'POST',
          body: JSON.stringify({
            mediaItemIds: mediaItemIds
          })
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error removing media items from album:', error)
      throw error
    }
  }

  // Funciones de utilidad

  // Buscar fotos por fecha
  async searchPhotosByDateRange(startDate, endDate) {
    try {
      const response = await googleAuth.authenticatedFetch(API_ENDPOINTS.SEARCH, {
        method: 'POST',
        body: JSON.stringify({
          filters: {
            dateFilter: {
              ranges: [{
                startDate: {
                  year: startDate.getFullYear(),
                  month: startDate.getMonth() + 1,
                  day: startDate.getDate()
                },
                endDate: {
                  year: endDate.getFullYear(),
                  month: endDate.getMonth() + 1,
                  day: endDate.getDate()
                }
              }]
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.mediaItems || []
    } catch (error) {
      console.error('Error searching photos by date range:', error)
      throw error
    }
  }
}

// Exportar instancia singleton
export const googlePhotosAPI = new GooglePhotosAPI()
export default googlePhotosAPI
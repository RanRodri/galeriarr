import { googleAuth } from './googleAuth.js'
import { API_ENDPOINTS } from '../utils/constants.js'

class GooglePhotosAPI {
  
  // CRUD de Álbumes
  
  // Obtener todos los álbumes
  async getAlbums(pageSize = 50, pageToken = null) {
    try {
      const params = new URLSearchParams({
        pageSize: pageSize.toString()
      })
      
      if (pageToken) {
        params.append('pageToken', pageToken)
      }

      const endpoint = `${API_ENDPOINTS.ALBUMS}?${params.toString()}`

      const response = await googleAuth.authenticatedFetch(endpoint)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ GooglePhotosAPI - getAlbums error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
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

      // Combinar y ordenar por fecha de creación (más recientes primero)
      const allAlbums = [...userAlbums, ...sharedAlbums].sort((a, b) => {
        const dateA = new Date(a.creationTime || a.mediaItemsCount || 0)
        const dateB = new Date(b.creationTime || b.mediaItemsCount || 0)
        return dateB - dateA
      })

      return {
        albums: allAlbums,
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
        throw new Error(`Failed to create album: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating album:', error)
      throw error
    }
  }

  // Obtener un álbum específico
  async getAlbum(albumId) {
    try {
      const endpoint = `${API_ENDPOINTS.ALBUMS}/${albumId}`

      const response = await googleAuth.authenticatedFetch(endpoint)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ GooglePhotosAPI - getAlbum error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const albumData = await response.json()
      return albumData
    } catch (error) {
      console.error('❌ GooglePhotosAPI - Error fetching album:', error)
      throw error
    }
  }

  // Compartir un álbum
  async shareAlbum(albumId, sharedAlbumOptions = {}) {
    try {
      const response = await googleAuth.authenticatedFetch(
        `${API_ENDPOINTS.ALBUMS}/${albumId}:share`,
        {
          method: 'POST',
          body: JSON.stringify({
            sharedAlbumOptions: {
              isCollaborative: sharedAlbumOptions.isCollaborative || false,
              isCommentable: sharedAlbumOptions.isCommentable || false
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to share album: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error sharing album:', error)
      throw error
    }
  }

  // Obtener elementos multimedia de un álbum
  async getMediaItemsFromAlbum(albumId, pageSize = 50, pageToken = null) {
    try {
      const body = {
        albumId: albumId,
        pageSize: pageSize
      }

      if (pageToken) {
        body.pageToken = pageToken
      }

      const response = await googleAuth.authenticatedFetch(API_ENDPOINTS.SEARCH, {
        method: 'POST',
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ GooglePhotosAPI - Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        mediaItems: data.mediaItems || [],
        nextPageToken: data.nextPageToken
      }
    } catch (error) {
      console.error('❌ GooglePhotosAPI - Error fetching media items from album:', error)
      throw error
    }
  }

  // Obtener todos los elementos multimedia del usuario
  async getAllMediaItems(pageSize = 100, pageToken = null) {
    try {
      const params = new URLSearchParams({
        pageSize: pageSize.toString()
      })
      
      if (pageToken) {
        params.append('pageToken', pageToken)
      }

      const endpoint = `${API_ENDPOINTS.MEDIA_ITEMS}?${params.toString()}`
      const response = await googleAuth.authenticatedFetch(endpoint)

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

  // Obtener un elemento multimedia específico
  async getMediaItem(mediaItemId) {
    try {
      const endpoint = `${API_ENDPOINTS.MEDIA_ITEMS}/${mediaItemId}`
      const response = await googleAuth.authenticatedFetch(endpoint)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching media item:', error)
      throw error
    }
  }

  // Subir un archivo
  async uploadFile(file) {
    try {

      const response = await googleAuth.authenticatedFetch(API_ENDPOINTS.UPLOADS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Goog-Upload-Content-Type': file.type,
          'X-Goog-Upload-Protocol': 'raw'
        },
        body: file
      })

    

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Upload failed with response:', errorText)
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const uploadToken = await response.text()
      return uploadToken
    } catch (error) {
      console.error('❌ Error uploading file:', error)
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  // Crear un elemento multimedia
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

  // Subir imagen a un álbum específico
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

  // Agregar elementos multimedia a un álbum
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
        throw new Error(`Failed to add media items to album: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding media items to album:', error)
      throw error
    }
  }

  // Remover elementos multimedia de un álbum
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
        throw new Error(`Failed to remove media items from album: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error removing media items from album:', error)
      throw error
    }
  }

  // Buscar fotos por rango de fechas
  async searchPhotosByDateRange(startDate, endDate) {
    try {
      const body = {
        filters: {
          dateFilter: {
            ranges: [
              {
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
              }
            ]
          }
        },
        pageSize: 100
      }

      const response = await googleAuth.authenticatedFetch(API_ENDPOINTS.SEARCH, {
        method: 'POST',
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        mediaItems: data.mediaItems || [],
        nextPageToken: data.nextPageToken
      }
    } catch (error) {
      console.error('Error searching photos by date range:', error)
      throw error
    }
  }
}

// Exportar instancia singleton
export const googlePhotosAPI = new GooglePhotosAPI()
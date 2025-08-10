import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useAlbums } from '../hooks/useAlbums.js'
import LoginPrompt from '../components/LoginPrompt.jsx'
import Swal from 'sweetalert2'

// Componentes UI reutilizables
import { GradientButton, LoadingSpinner, Badge, UserAvatar } from '../components/ui'

// ============================================================================
// COMPONENTES ESPECÍFICOS DE LA PÁGINA
// ============================================================================

// Header de la página
const AlbumsHeader = ({ user, onCreateAlbum, isCreatingAlbum }) => (
  <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <UserInfo user={user} />
        <CreateAlbumButton onCreateAlbum={onCreateAlbum} isCreatingAlbum={isCreatingAlbum} />
      </div>
    </div>
  </div>
)

// Información del usuario
const UserInfo = ({ user }) => (
  <div className="flex items-center space-x-3 sm:space-x-6">
    <UserAvatar user={user} size="lg" />
    <UserDetails user={user} />
  </div>
)

// Detalles del usuario
const UserDetails = ({ user }) => (
  <div className="space-y-1 min-w-0 flex-1">
    <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent truncate">
      Mis Álbumes
    </h1>
    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
      <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">
        {user?.name || user?.email || 'Usuario'}
      </p>
      {user?.name && user?.email && (
        <Badge variant="default" size="md">
          {user.email}
        </Badge>
      )}
    </div>
  </div>
)

// Botón de crear álbum
const CreateAlbumButton = ({ onCreateAlbum, isCreatingAlbum }) => (
  <div className="flex items-center justify-center sm:justify-end">
    <GradientButton
      onClick={onCreateAlbum}
      disabled={isCreatingAlbum}
      variant="primary"
      size="lg"
      className="w-full sm:w-auto flex items-center justify-center space-x-2 sm:space-x-3"
    >
      {isCreatingAlbum ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Creando...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nuevo Álbum</span>
        </>
      )}
    </GradientButton>
  </div>
)

// Estado de carga
const LoadingState = () => (
  <div className="text-center py-12 sm:py-16">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4 sm:mb-6"></div>
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin animate-reverse"></div>
    </div>
    <p className="text-gray-600 text-base sm:text-lg font-medium">Cargando tus álbumes...</p>
  </div>
)

// Estado de error
const ErrorState = ({ error, onRetry, onReAuth, onForceReAuth, onCleanAndReload }) => (
  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
    <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
      <ErrorIcon />
      <ErrorContent error={error} />
      <ErrorActions 
        error={error} 
        onRetry={onRetry} 
        onReAuth={onReAuth} 
        onForceReAuth={onForceReAuth} 
        onCleanAndReload={onCleanAndReload} 
      />
    </div>
  </div>
)

// Icono de error
const ErrorIcon = () => (
  <div className="flex-shrink-0 flex justify-center lg:justify-start">
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
)

// Contenido del error
const ErrorContent = ({ error }) => (
  <div className="flex-1 min-w-0 text-center lg:text-left">
    <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Error al cargar álbumes</h3>
    <p className="text-red-700 mb-4 text-sm sm:text-base">{error}</p>
    
    {(error.includes('403') || error.includes('insufficient') || error.includes('permisos')) && (
      <div className="mb-4 p-3 sm:p-4 bg-red-100 rounded-lg sm:rounded-xl">
        <p className="text-sm text-red-700 font-medium mb-2">
          Parece que hay un problema con los permisos. Esto puede suceder cuando:
        </p>
        <ul className="text-sm text-red-700 space-y-1">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>Los permisos de la aplicación han cambiado</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>La sesión ha expirado</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>Necesitas re-autenticarte</span>
          </li>
        </ul>
      </div>
    )}
  </div>
)

// Acciones del error
const ErrorActions = ({ error, onRetry, onReAuth, onForceReAuth, onCleanAndReload }) => (
  <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-3">
    <GradientButton variant="danger" size="md" onClick={onRetry}>
      Reintentar
    </GradientButton>
    
    {(error.includes('403') || error.includes('insufficient') || error.includes('permisos')) && (
      <>
        <GradientButton variant="info" size="md" onClick={onReAuth}>
          Re-autenticar
        </GradientButton>
        
        <GradientButton variant="primary" size="md" onClick={onForceReAuth}>
          Forzar Nueva Auth
        </GradientButton>
      </>
    )}
    
    <GradientButton variant="warning" size="md" onClick={onCleanAndReload}>
      Limpiar y Recargar
    </GradientButton>
  </div>
)

// Estado vacío (sin álbumes)
const EmptyState = ({ onCreateAlbum }) => (
  <div className="text-center py-12 sm:py-16 md:py-20 px-4">
    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
      <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No tienes álbumes aún</h3>
    <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg max-w-md mx-auto">
      Crea tu primer álbum para comenzar a organizar tus fotos de manera profesional
    </p>
    <GradientButton variant="primary" size="xl" onClick={onCreateAlbum} className="w-full sm:w-auto">
      Crear Primer Álbum
    </GradientButton>
  </div>
)

// Tarjeta de álbum individual
const AlbumCard = ({ album }) => (
  <Link
    to={`/album/${album.id}`}
    className="group bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105"
  >
    <AlbumCover album={album} />
    <AlbumInfo album={album} />
  </Link>
)

// Portada del álbum
const AlbumCover = ({ album }) => (
  <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
    <img
      src={getAlbumCoverUrl(album)}
      alt={`Portada de ${album.title}`}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      onError={(e) => {
        e.target.src = 'https://via.placeholder.com/400x400/e5e7eb/9ca3af?text=Sin+Portada'
      }}
    />
    
    {/* Overlay con "Ver álbum" */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
      <span className="text-white font-bold text-base sm:text-lg opacity-0 group-hover:opacity-100 transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-all duration-300">
        Ver álbum
      </span>
    </div>
    
    {/* Badge con número de fotos */}
    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
      {album.mediaItemsCount || 0} fotos
    </div>
  </div>
)

// Información del álbum
const AlbumInfo = ({ album }) => (
  <div className="p-3 sm:p-4 md:p-5">
    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
      {album.title}
    </h3>
    {album.creationTime && (
      <p className="text-gray-500 text-xs sm:text-sm font-medium">
        {new Date(album.creationTime).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </p>
    )}
  </div>
)

// Botón de cargar más álbumes
const LoadMoreButton = ({ hasMoreAlbums, loading, onLoadMore }) => {
  if (!hasMoreAlbums) return null
  
  return (
    <div className="text-center mt-8 sm:mt-10 md:mt-12">
      <GradientButton
        variant="secondary"
        size="lg"
        onClick={onLoadMore}
        disabled={loading}
        className="w-full sm:w-auto max-w-xs flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-gray-600 mr-2 sm:mr-3 inline-block"></div>
            Cargando...
          </>
        ) : (
          'Cargar más álbumes'
        )}
      </GradientButton>
    </div>
  )
}

// ============================================================================
// HOOKS PERSONALIZADOS
// ============================================================================

// Hook para manejar la creación de álbumes
const useAlbumCreation = (createAlbum) => {
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false)

  const handleCreateAlbum = async () => {
    try {
      setIsCreatingAlbum(true)
      
      const { value: albumTitle } = await Swal.fire({
        title: 'Crear Nuevo Álbum',
        input: 'text',
        inputLabel: 'Nombre del álbum',
        inputPlaceholder: 'Ej: Vacaciones de Verano',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Crear',
        inputValidator: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Debes ingresar un nombre para el álbum'
          }
          if (value.trim().length > 100) {
            return 'El nombre del álbum no puede tener más de 100 caracteres'
          }
        }
      })

      if (albumTitle) {
        await createAlbum(albumTitle.trim())
        await Swal.fire({
          icon: 'success',
          title: '¡Álbum creado!',
          text: `El álbum "${albumTitle}" se ha creado exitosamente`,
          timer: 2000,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Error creating album:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error al crear álbum',
        text: error.message || 'Hubo un problema al crear el álbum'
      })
    } finally {
      setIsCreatingAlbum(false)
    }
  }

  return { isCreatingAlbum, handleCreateAlbum }
}

// Hook para limpiar parámetros de URL
const useUrlCleanup = () => {
  useEffect(() => {
    const url = new URL(window.location.href)
    const hasAuthParams = url.searchParams.has('code') || url.searchParams.has('state') || url.searchParams.has('error')
    
    if (hasAuthParams) {
      url.searchParams.delete('code')
      url.searchParams.delete('state')
      url.searchParams.delete('error')
      url.searchParams.delete('error_description')
      
      window.history.replaceState({}, document.title, url.pathname)
    }
  }, [])
}

// Hook para actualizar información del usuario
const useUserInfoUpdate = (isAuthenticated, user, updateUserInfo) => {
  useEffect(() => {
    if (isAuthenticated && (!user?.name || !user?.picture)) {
      updateUserInfo()
    }
  }, [isAuthenticated, user, updateUserInfo])
}

// ============================================================================
// FUNCIONES UTILITARIAS
// ============================================================================

// Función para obtener la URL de la portada del álbum
const getAlbumCoverUrl = (album) => {
  if (album.coverPhotoBaseUrl) {
    return `${album.coverPhotoBaseUrl}=w400-h400-c`
  }
  return 'https://via.placeholder.com/400x400/e5e7eb/9ca3af?text=Sin+Portada'
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function AlbumsPage() {
  const { isAuthenticated, user, authLoading, updateUserInfo } = useAuth()
  const { 
    albums, 
    loading, 
    error, 
    hasMoreAlbums, 
    createAlbum, 
    loadMoreAlbums, 
    reloadAlbums,
    nextPageToken 
  } = useAlbums()

  // Hooks personalizados
  const { isCreatingAlbum, handleCreateAlbum } = useAlbumCreation(createAlbum)
  useUrlCleanup()
  useUserInfoUpdate(isAuthenticated, user, updateUserInfo)

  // Funciones para manejar errores
  const handleReAuth = () => {
    import('../services/googleAuth.js').then(({ googleAuth }) => {
      googleAuth.forceReAuth()
    })
  }

  const handleForceReAuth = () => {
    import('../services/googleAuth.js').then(({ googleAuth }) => {
      googleAuth.startNewAuth()
    })
  }

  const handleCleanAndReload = () => {
    import('../services/googleAuth.js').then(({ googleAuth }) => {
      googleAuth.forceReAuth()
    })
  }

  // Si está cargando la autenticación, mostrar spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <LoadingSpinner size="lg" text="Verificando autenticación..." />
      </div>
    )
  }

  // Si no está autenticado, mostrar prompt de login
  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AlbumsHeader 
        user={user} 
        onCreateAlbum={handleCreateAlbum} 
        isCreatingAlbum={isCreatingAlbum} 
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 md:py-12">
        {loading && albums.length === 0 && <LoadingState />}
        
        {error && (
          <ErrorState 
            error={error}
            onRetry={reloadAlbums}
            onReAuth={handleReAuth}
            onForceReAuth={handleForceReAuth}
            onCleanAndReload={handleCleanAndReload}
          />
        )}

        {!loading && !error && albums.length === 0 && (
          <EmptyState onCreateAlbum={handleCreateAlbum} />
        )}

        {albums.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}

        <LoadMoreButton 
          hasMoreAlbums={hasMoreAlbums} 
          loading={loading} 
          onLoadMore={loadMoreAlbums} 
        />
      </div>
    </div>
  )
}


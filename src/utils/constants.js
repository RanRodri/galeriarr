// Validación de variables de entorno requeridas
const requiredEnvVars = {
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  VITE_GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  VITE_GOOGLE_PROJECT_ID: import.meta.env.VITE_GOOGLE_PROJECT_ID,
  VITE_GOOGLE_AUTH_URI: import.meta.env.VITE_GOOGLE_AUTH_URI,
  VITE_GOOGLE_TOKEN_URI: import.meta.env.VITE_GOOGLE_TOKEN_URI,
  VITE_GOOGLE_PHOTOS_API_BASE: import.meta.env.VITE_GOOGLE_PHOTOS_API_BASE,
  VITE_REQUEST_TIMEOUT: import.meta.env.VITE_REQUEST_TIMEOUT,
  VITE_MAX_RETRIES: import.meta.env.VITE_MAX_RETRIES,
  VITE_RETRY_DELAY: import.meta.env.VITE_RETRY_DELAY
}

// Verificar que todas las variables requeridas estén definidas
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}. Asegúrate de crear un archivo .env con todas las variables requeridas.`)
}

/**
 * Google Photos API Configuration
 * Todas las configuraciones se obtienen de variables de entorno
 * para mayor seguridad y flexibilidad
 */
export const GOOGLE_CONFIG = {
  CLIENT_ID: requiredEnvVars.VITE_GOOGLE_CLIENT_ID,
  CLIENT_SECRET: requiredEnvVars.VITE_GOOGLE_CLIENT_SECRET,
  REDIRECT_URI: requiredEnvVars.VITE_GOOGLE_REDIRECT_URI,
  PROJECT_ID: requiredEnvVars.VITE_GOOGLE_PROJECT_ID, 
  
  // OAuth URLs
  AUTH_URI: requiredEnvVars.VITE_GOOGLE_AUTH_URI,
  TOKEN_URI: requiredEnvVars.VITE_GOOGLE_TOKEN_URI,
  
  // API Endpoints
  PHOTOS_API_BASE: requiredEnvVars.VITE_GOOGLE_PHOTOS_API_BASE,
  
  // OAuth Scopes
  SCOPES: [
    'https://www.googleapis.com/auth/photoslibrary',
    'https://www.googleapis.com/auth/photoslibrary.readonly',
    'https://www.googleapis.com/auth/photoslibrary.appendonly',
    'https://www.googleapis.com/auth/photoslibrary.sharing',
    'https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata',
    'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'openid'
  ]
}

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTHORIZE: GOOGLE_CONFIG.AUTH_URI,
  TOKEN: GOOGLE_CONFIG.TOKEN_URI,
  
  // Albums
  ALBUMS: `${GOOGLE_CONFIG.PHOTOS_API_BASE}/albums`,
  SHARED_ALBUMS: `${GOOGLE_CONFIG.PHOTOS_API_BASE}/sharedAlbums`,
  
  // Media Items
  MEDIA_ITEMS: `${GOOGLE_CONFIG.PHOTOS_API_BASE}/mediaItems`,
  SEARCH: `${GOOGLE_CONFIG.PHOTOS_API_BASE}/mediaItems:search`,
  BATCH_CREATE: `${GOOGLE_CONFIG.PHOTOS_API_BASE}/mediaItems:batchCreate`,
  
  // Uploads
  UPLOADS: `${GOOGLE_CONFIG.PHOTOS_API_BASE}/uploads`
}

/**
 * Request configurations
 * Configuraciones para reintentos y timeouts de las peticiones HTTP
 */
export const REQUEST_CONFIG = {
  TIMEOUT: parseInt(requiredEnvVars.VITE_REQUEST_TIMEOUT),
  MAX_RETRIES: parseInt(requiredEnvVars.VITE_MAX_RETRIES),
  RETRY_DELAY: parseInt(requiredEnvVars.VITE_RETRY_DELAY)
}

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'google_access_token',
  REFRESH_TOKEN: 'google_refresh_token',
  TOKEN_EXPIRY: 'google_token_expiry',
  USER_INFO: 'google_user_info'
}
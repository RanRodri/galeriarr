import { GOOGLE_CONFIG, STORAGE_KEYS } from '../utils/constants.js'

class GoogleAuthService {
  constructor() {
    this.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    this.tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY)
  }

  // Generar URL de autorización
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: GOOGLE_CONFIG.CLIENT_ID,
      redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
      response_type: 'code',
      scope: GOOGLE_CONFIG.SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    })

    const authUrl = `${GOOGLE_CONFIG.AUTH_URI}?${params.toString()}`
    return authUrl
  }

  // Validar si un código de autorización es válido
  isCodeValid(code) {
    if (!code || code.trim() === '') {
      return false
    }
    
    // Los códigos de autorización de Google suelen tener un formato específico
    // y una longitud mínima
    if (code.length < 10) {
      return false
    }
    
    // Verificar si el código ya fue procesado (evitar reutilización)
    const processedCodes = JSON.parse(localStorage.getItem('processed_auth_codes') || '[]')
    if (processedCodes.includes(code)) {
      return false
    }
    
    return true
  }

  // Marcar código como procesado
  markCodeAsProcessed(code) {
    try {
      const processedCodes = JSON.parse(localStorage.getItem('processed_auth_codes') || '[]')
      processedCodes.push(code)
      
      // Mantener solo los últimos 10 códigos para evitar que crezca demasiado
      if (processedCodes.length > 10) {
        processedCodes.splice(0, processedCodes.length - 10)
      }
      
      localStorage.setItem('processed_auth_codes', JSON.stringify(processedCodes))
    } catch (error) {
      // Error silencioso al marcar código como procesado
    }
  }

  // Intercambiar código de autorización por tokens
  async exchangeCodeForTokens(code) {
    try {
      // Verificar que el código no esté vacío
      if (!this.isCodeValid(code)) {
        throw new Error('Authorization code is empty or invalid')
      }
      
      // Limpiar tokens existentes antes de la nueva autenticación
      this.accessToken = null
      this.refreshToken = null
      this.tokenExpiry = null
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY)
      
      const tokenRequestBody = new FormData()
      tokenRequestBody.append('client_id', GOOGLE_CONFIG.CLIENT_ID)
      tokenRequestBody.append('client_secret', GOOGLE_CONFIG.CLIENT_SECRET)
      tokenRequestBody.append('code', code)
      tokenRequestBody.append('grant_type', 'authorization_code')
      tokenRequestBody.append('redirect_uri', GOOGLE_CONFIG.REDIRECT_URI)

      const response = await fetch(GOOGLE_CONFIG.TOKEN_URI, {
        method: 'POST',
        body: tokenRequestBody
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Token exchange failed: ${response.status} - ${errorData}`)
      }

      const tokenData = await response.json()
      this.saveTokens(tokenData)
      
      // Marcar código como procesado
      this.markCodeAsProcessed(code)
      
      return tokenData
    } catch (error) {
      console.error('Error exchanging code for tokens:', error)
      throw error
    }
  }

  // Guardar tokens en localStorage
  saveTokens(tokenData) {
    if (!tokenData.access_token) {
      throw new Error('No access token received')
    }

    this.accessToken = tokenData.access_token
    this.refreshToken = tokenData.refresh_token || this.refreshToken

    // Calcular tiempo de expiración
    const expiresIn = tokenData.expires_in || 3600 // Default 1 hora
    const expiryTime = Date.now() + (expiresIn * 1000)
    this.tokenExpiry = expiryTime.toString()

    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, this.accessToken)
    if (this.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, this.refreshToken)
    }
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, this.tokenExpiry)
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    if (!this.accessToken || !this.tokenExpiry) {
      return false
    }

    const now = Date.now()
    const expiry = parseInt(this.tokenExpiry)
    
    // Verificar si el token ha expirado
    if (now >= expiry) {
      // Si hay refresh token, intentar renovar
      if (this.refreshToken) {
        this.refreshAccessToken()
        return true // Temporalmente true mientras se renueva
      }
      return false
    }

    return true
  }

  // Renovar access token usando refresh token
  async refreshAccessToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      const tokenRequestBody = new FormData()
      tokenRequestBody.append('client_id', GOOGLE_CONFIG.CLIENT_ID)
      tokenRequestBody.append('client_secret', GOOGLE_CONFIG.CLIENT_SECRET)
      tokenRequestBody.append('refresh_token', this.refreshToken)
      tokenRequestBody.append('grant_type', 'refresh_token')

      const response = await fetch(GOOGLE_CONFIG.TOKEN_URI, {
        method: 'POST',
        body: tokenRequestBody
      })

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`)
      }

      const tokenData = await response.json()
      
      // Actualizar solo el access token y expiry
      this.accessToken = tokenData.access_token
      const expiresIn = tokenData.expires_in || 3600
      const expiryTime = Date.now() + (expiresIn * 1000)
      this.tokenExpiry = expiryTime.toString()

      // Actualizar localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, this.accessToken)
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, this.tokenExpiry)

      return this.accessToken
    } catch (error) {
      console.error('Error refreshing access token:', error)
      // Si falla el refresh, limpiar tokens
      this.logout()
      throw error
    }
  }

  // Obtener un access token válido
  async getValidAccessToken() {
    if (!this.isAuthenticated()) {
      return null
    }

    // Verificar si el token está por expirar (5 minutos de margen)
    const now = Date.now()
    const expiry = parseInt(this.tokenExpiry)
    const fiveMinutes = 5 * 60 * 1000

    if (expiry - now <= fiveMinutes) {
      // Renovar token si está por expirar
      await this.refreshAccessToken()
    }

    return this.accessToken
  }

  // Realizar peticiones autenticadas
  async authenticatedFetch(url, options = {}) {
    try {
      const token = await this.getValidAccessToken()
      if (!token) {
        throw new Error('No valid access token available')
      }

      // Configurar headers de autorización
      const authOptions = {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      }

      // Realizar la petición
      const response = await fetch(url, authOptions)

      // Si el token expiró durante la petición, renovar y reintentar
      if (response.status === 401) {
        const newToken = await this.refreshAccessToken()
        if (newToken) {
          authOptions.headers.Authorization = `Bearer ${newToken}`
          return await fetch(url, authOptions)
        }
      }

      return response
    } catch (error) {
      console.error('❌ GoogleAuth - Error en authenticatedFetch:', error)
      throw error
    }
  }

  // Iniciar proceso de login
  login() {
    const authUrl = this.getAuthUrl()
    window.location.href = authUrl
  }

  // Forzar re-autenticación
  forceReAuth() {
    // Limpiar tokens existentes
    this.logout()
    
    // Iniciar nuevo proceso de autenticación
    this.startNewAuth()
  }

  // Iniciar nueva autenticación
  startNewAuth() {
    // Limpiar cualquier estado anterior
    localStorage.removeItem('processed_auth_codes')
    
    // Generar nueva URL de autorización
    const authUrl = this.getAuthUrl()
    
    // Redirigir al usuario
    window.location.href = authUrl
  }

  // Cerrar sesión
  logout() {
    // Limpiar tokens
    this.accessToken = null
    this.refreshToken = null
    this.tokenExpiry = null
    
    // Limpiar localStorage
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY)
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
    
    // Limpiar códigos procesados
    localStorage.removeItem('processed_auth_codes')
    
    // Limpiar parámetros de URL
    this.clearAuthUrlParams()
  }

  // Limpiar parámetros de autenticación de la URL
  clearAuthUrlParams() {
    try {
      const url = new URL(window.location.href)
      const paramsToRemove = ['code', 'state', 'error', 'error_description']
      
      paramsToRemove.forEach(param => {
        url.searchParams.delete(param)
      })
      
      // Actualizar URL sin recargar la página
      window.history.replaceState({}, document.title, url.toString())
    } catch (error) {
      // Error silencioso al limpiar parámetros
    }
  }

  // Obtener información del usuario
  async getUserInfo() {
    try {
      const response = await this.authenticatedFetch('https://www.googleapis.com/oauth2/v2/userinfo')
      
      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.status}`)
      }

      const userInfo = await response.json()
      
      // Cachear información del usuario
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
      
      return userInfo
    } catch (error) {
      console.error('Error getting user info:', error)
      throw error
    }
  }

  // Obtener información del usuario desde cache
  getCachedUserInfo() {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.USER_INFO)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      return null
    }
  }

  // Verificar si el usuario tiene los scopes requeridos
  hasRequiredScopes() {
    // Por ahora, si está autenticado, asumimos que tiene los scopes
    // En una implementación más robusta, podríamos verificar los scopes específicos
    return this.isAuthenticated()
  }



  // Verificar permisos del usuario
  async checkPermissions() {
    try {
      // Intentar hacer una petición simple para verificar permisos
      const response = await this.authenticatedFetch('https://photoslibrary.googleapis.com/v1/albums?pageSize=1')
      return response.ok
    } catch (error) {
      return false
    }
  }
}

// Exportar instancia singleton
export const googleAuth = new GoogleAuthService()
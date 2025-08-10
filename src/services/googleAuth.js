import { GOOGLE_CONFIG, STORAGE_KEYS } from '../utils/constants.js'

class GoogleAuthService {
  constructor() {
    console.log('🏗️ GoogleAuth - Constructor iniciado')
    console.log('🏗️ GoogleAuth - Storage keys:', STORAGE_KEYS)
    
    this.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    this.tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY)
    
    console.log('🏗️ GoogleAuth - Tokens cargados del localStorage:', {
      hasAccessToken: !!this.accessToken,
      hasRefreshToken: !!this.refreshToken,
      hasTokenExpiry: !!this.tokenExpiry,
      accessTokenPreview: this.accessToken ? `${this.accessToken.substring(0, 20)}...` : 'null',
      refreshTokenPreview: this.refreshToken ? `${this.refreshToken.substring(0, 20)}...` : 'null',
      tokenExpiry: this.tokenExpiry
    })
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
        throw new Error(`Error al obtener tokens: ${response.status} ${response.statusText}`)
      }

      const tokenData = await response.json()
      
      // Guardar tokens
      this.saveTokens(tokenData)
      
      // Marcar el código como procesado para evitar reutilización
      this.markCodeAsProcessed(code)
      
      return tokenData
    } catch (error) {
      throw error
    }
  }

  // Guardar tokens en localStorage
  saveTokens(tokenData) {
    console.log('💾 GoogleAuth - saveTokens iniciado:', {
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      expiresIn: tokenData.expires_in
    })
    
    this.accessToken = tokenData.access_token
    this.refreshToken = tokenData.refresh_token
    
    // Calcular tiempo de expiración
    const expiryTime = Date.now() + (tokenData.expires_in * 1000)
    this.tokenExpiry = expiryTime

    console.log('⏰ GoogleAuth - Tiempo de expiración calculado:', {
      now: Date.now(),
      expiresIn: tokenData.expires_in,
      expiryTime,
      expiryDate: new Date(expiryTime)
    })

    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, this.accessToken)
    if (tokenData.refresh_token) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, this.refreshToken)
    }
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString())
    
    console.log('✅ GoogleAuth - Tokens guardados en localStorage:', {
      accessTokenStored: !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
      refreshTokenStored: !!localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      expiryStored: !!localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY)
    })
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    console.log('🔍 GoogleAuth - isAuthenticated check:', {
      hasAccessToken: !!this.accessToken,
      hasTokenExpiry: !!this.tokenExpiry,
      accessToken: this.accessToken ? `${this.accessToken.substring(0, 20)}...` : 'null',
      tokenExpiry: this.tokenExpiry
    })
    
    if (!this.accessToken || !this.tokenExpiry) {
      console.log('❌ GoogleAuth - Faltan tokens básicos')
      return false
    }

    // Verificar si el token ha expirado (con margen de 5 minutos)
    const now = Date.now()
    const expiryWithBuffer = parseInt(this.tokenExpiry) - (5 * 60 * 1000)
    const isExpired = now >= expiryWithBuffer
    
    console.log('⏰ GoogleAuth - Verificación de expiración:', {
      now,
      expiryWithBuffer,
      isExpired,
      result: !isExpired
    })
    
    return !isExpired
  }

  // Renovar token de acceso
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch(GOOGLE_CONFIG.TOKEN_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          client_secret: GOOGLE_CONFIG.CLIENT_SECRET,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token'
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error_description || data.error)
      }

      // Actualizar tokens
      this.saveTokens({
        access_token: data.access_token,
        refresh_token: this.refreshToken, // Mantener el refresh token actual
        expires_in: data.expires_in
      })

      return data.access_token
    } catch (error) {
      console.error('Error refreshing access token:', error)
      this.logout() // Limpiar tokens inválidos
      throw error
    }
  }

  // Obtener token de acceso válido
  async getValidAccessToken() {
    console.log('🔑 GoogleAuth - getValidAccessToken iniciado')
    console.log('🔑 GoogleAuth - Estado actual:', {
      isAuthenticated: this.isAuthenticated(),
      hasRefreshToken: !!this.refreshToken,
      hasAccessToken: !!this.accessToken
    })
    
    if (!this.isAuthenticated()) {
      console.log('🚫 GoogleAuth - Usuario no autenticado')
      if (this.refreshToken) {
        console.log('🔄 GoogleAuth - Intentando renovar token con refresh token')
        await this.refreshAccessToken()
      } else {
        console.log('❌ GoogleAuth - No hay refresh token disponible')
        throw new Error('User not authenticated')
      }
    }
    
    console.log('✅ GoogleAuth - Token válido obtenido:', this.accessToken ? `${this.accessToken.substring(0, 20)}...` : 'null')
    return this.accessToken
  }

  // Hacer petición autenticada
  async authenticatedFetch(url, options = {}) {
    try {
      console.log('🔐 GoogleAuth - authenticatedFetch iniciado:', { url, options })
      
      const token = await this.getValidAccessToken()
      console.log('🔑 GoogleAuth - Token obtenido:', token ? `${token.substring(0, 20)}...` : 'null')
      
      const defaultOptions = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      }

      console.log('📤 GoogleAuth - Request config:', {
        url,
        method: options.method || 'GET',
        headers: defaultOptions.headers
      })

      const response = await fetch(url, {
        ...options,
        ...defaultOptions,
        headers: {
          ...defaultOptions.headers,
          ...options.headers
        }
      })

      console.log('📥 GoogleAuth - Response recibida:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })

      // Si el token es inválido, intentar renovar
      if (response.status === 401) {
        console.log('🔄 GoogleAuth - Token expirado, renovando...')
        
        await this.refreshAccessToken()
        const newToken = await this.getValidAccessToken()
        console.log('🆕 GoogleAuth - Nuevo token obtenido:', newToken ? `${newToken.substring(0, 20)}...` : 'null')
        
        return fetch(url, {
          ...options,
          ...defaultOptions,
          headers: {
            ...defaultOptions.headers,
            'Authorization': `Bearer ${newToken}`,
            ...options.headers
          }
        })
      }

      // Manejar error 403 específicamente
      if (response.status === 403) {
        console.error('🚫 GoogleAuth - Acceso denegado (403)')
        throw new Error(`Acceso denegado (403). Verifica que tengas permisos para acceder a: ${url}`)
      }

      return response
    } catch (error) {
      console.error('❌ GoogleAuth - Error en authenticatedFetch:', error)
      throw error
    }
  }

  // Iniciar proceso de login
  login() {
    // Limpiar cualquier estado anterior antes de iniciar nuevo login
    this.logout()
    
    const authUrl = this.getAuthUrl()
    window.location.href = authUrl
  }

  // Forzar re-autenticación completa
  forceReAuth() {
    // Limpiar todo el estado
    this.logout()
    
    // Limpiar códigos procesados
    localStorage.removeItem('processed_auth_codes')
    
    // Limpiar parámetros de URL
    this.clearAuthUrlParams()
    
    // Forzar recarga de la página para limpiar completamente el estado
    window.location.reload()
  }

  // Iniciar nueva autenticación con consentimiento forzado
  startNewAuth() {
    // Limpiar estado actual
    this.logout()
    
    // Limpiar códigos procesados
    localStorage.removeItem('processed_auth_codes')
    
    // Generar URL con consentimiento forzado
    const params = new URLSearchParams({
      client_id: GOOGLE_CONFIG.CLIENT_ID,
      redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
      response_type: 'code',
      scope: GOOGLE_CONFIG.SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      approval_prompt: 'force'
    })

    const authUrl = `${GOOGLE_CONFIG.AUTH_URI}?${params.toString()}`
    
    // Redirigir a la nueva autenticación
    window.location.href = authUrl
  }

  // Cerrar sesión
  logout() {
    this.accessToken = null
    this.refreshToken = null
    this.tokenExpiry = null
    
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY)
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
    
    // Limpiar parámetros de URL que puedan contener códigos de autorización expirados
    this.clearAuthUrlParams()
  }

  // Limpiar parámetros de autorización de la URL
  clearAuthUrlParams() {
    try {
      const url = new URL(window.location.href)
      url.searchParams.delete('code')
      url.searchParams.delete('state')
      url.searchParams.delete('error')
      url.searchParams.delete('error_description')
      
      // Solo actualizar la URL si no estamos en la página de callback
      if (!url.pathname.includes('/auth/callback')) {
        window.history.replaceState({}, document.title, url.pathname)
      }
    } catch (error) {
      console.warn('Could not clear auth URL parameters:', error)
    }
  }

  // Obtener información del usuario
  async getUserInfo() {
    try {
      const response = await this.authenticatedFetch('https://www.googleapis.com/oauth2/v2/userinfo')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const userInfo = await response.json()
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
      
      return userInfo
    } catch (error) {
      console.error('Error getting user info:', error)
      throw error
    }
  }

  // Obtener información del usuario desde localStorage
  getCachedUserInfo() {
    const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO)
    return userInfo ? JSON.parse(userInfo) : null
  }

  // Verificar si la autenticación actual tiene los scopes requeridos
  hasRequiredScopes() {
    if (!this.accessToken) {
      return false
    }
    
    // Verificar que tengamos al menos el scope básico de Google Photos
    const requiredScopes = [
      'https://www.googleapis.com/auth/photoslibrary',
      'https://www.googleapis.com/auth/photoslibrary.readonly'
    ]
    
    // Por ahora, solo verificamos que tengamos un token válido
    // Los scopes reales se verifican en el servidor de Google
    const hasBasicScope = this.isAuthenticated()
    
    return hasBasicScope
  }

  // Método de debug para verificar el estado de autenticación
  debugAuthState() {
    // Método de debug removido para producción
  }

  // Verificar si hay problemas de permisos
  async checkPermissions() {
    try {
      // Intentar hacer una petición simple para verificar permisos
      const response = await this.authenticatedFetch('https://photoslibrary.googleapis.com/v1/albums?pageSize=1')
      
      if (response.status === 403) {
        const errorText = await response.text()
        return {
          hasPermission: false,
          error: 'insufficient_scopes',
          message: 'No tienes permisos suficientes para acceder a Google Photos'
        }
      }
      
      return { hasPermission: true }
    } catch (error) {
      return {
        hasPermission: false,
        error: 'unknown',
        message: 'Error al verificar permisos'
      }
    }
  }
}

// Exportar instancia singleton
export const googleAuth = new GoogleAuthService()
export default googleAuth
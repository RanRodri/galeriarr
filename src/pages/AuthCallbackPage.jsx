import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { googleAuth } from '../services/googleAuth.js'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshAuthStatus } = useAuth()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [error, setError] = useState(null)
  const hasProcessedCode = useRef(false) // Prevenir procesamiento múltiple del código

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')

      if (errorParam) {
        setError(`OAuth error: ${errorParam}`)
        setStatus('error')
        setTimeout(() => navigate('/', { replace: true }), 5000)
        return
      }

      if (!code) {
        setError('No authorization code received')
        setStatus('error')
        setTimeout(() => navigate('/', { replace: true }), 5000)
        return
      }

      // Prevenir procesamiento múltiple del mismo código en esta instancia del componente
      if (hasProcessedCode.current) {
        setStatus('success') // Asumir éxito si ya fue procesado
        setTimeout(() => navigate('/', { replace: true }), 1000)
        return
      }

      // Marcar como procesado para esta instancia del componente
      hasProcessedCode.current = true

      try {
        // Verificar si el código es válido antes de proceder
        if (!googleAuth.isCodeValid(code)) {
          throw new Error('El código de autorización no es válido o ya fue utilizado.')
        }

        setStatus('processing')

        // NO llamar logout() aquí - puede interferir con el intercambio de tokens
        // Solo limpiar parámetros de URL si es necesario
        googleAuth.clearAuthUrlParams()

        // Intercambiar código por tokens
        await googleAuth.exchangeCodeForTokens(code)

        // NO obtener información del usuario - solo necesitamos los tokens para Google Photos
        // await googleAuth.getUserInfo()

        // Actualizar el estado de autenticación en el context
        await refreshAuthStatus()

        setStatus('success')

        // Redirigir a la página principal después de 1 segundo
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 1000)

      } catch (error) {
        console.error('Auth callback error:', error)
        
        // Manejar errores específicos de OAuth
        let errorMessage = error.message
        
        if (error.message.includes('invalid_grant')) {
          errorMessage = 'El código de autorización ha expirado o ya fue utilizado. Por favor, inicia sesión nuevamente.'
        } else if (error.message.includes('400')) {
          errorMessage = 'Error en la solicitud de autenticación. Por favor, intenta nuevamente.'
        } else if (error.message.includes('403')) {
          errorMessage = 'No tienes permisos suficientes. Por favor, verifica los permisos de la aplicación.'
        } else if (error.message.includes('código de autorización no es válido')) {
          errorMessage = 'El código de autorización no es válido. Por favor, inicia sesión nuevamente.'
        }
        
        setError(errorMessage)
        setStatus('error')

        // Si hay error, permitir reintento en el próximo montaje si el código sigue siendo válido
        hasProcessedCode.current = false // Resetear ref en error para permitir reintento

        // Redirigir a login después de 5 segundos en caso de error
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 5000)
      }
    }

    handleAuthCallback()
  }, [searchParams, navigate, refreshAuthStatus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
          
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Procesando autenticación...
              </h2>
              <p className="text-slate-600">
                Por favor espere mientras completamos el proceso de login con Google Photos.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                ¡Autenticación exitosa!
              </h2>
              <p className="text-slate-600 mb-4">
                Te has conectado correctamente con Google Photos.
              </p>
              <p className="text-sm text-slate-500">
                Redirigiendo en unos segundos...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Error de autenticación
              </h2>
              <p className="text-slate-600 mb-4">
                Hubo un problema al conectar con Google Photos:
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 text-sm font-medium">
                  {error}
                </p>
              </div>
              <p className="text-sm text-slate-500">
                Serás redirigido para intentar nuevamente...
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
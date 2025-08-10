import { googleAuth } from "../services/googleAuth.js";

export default function LoginPrompt() {
  const handleLogin = () => {
    googleAuth.login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
          
          {/* Logo y título */}
          <div className="mb-8">
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 hover:rotate-6 hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl opacity-75 blur-sm"></div>
              <svg className="w-12 h-12 text-white relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
              Google Photos Gallery
            </h1>
            
            <p className="text-slate-600 text-lg leading-relaxed">
              Accede a tus recuerdos más preciados y organiza tus momentos especiales
            </p>
          </div>

          {/* Características destacadas */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-center gap-3 text-slate-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Organiza tus fotos en álbumes personalizados</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-600">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm">Acceso seguro con tu cuenta de Google</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Interfaz moderna y fácil de usar</span>
            </div>
          </div>
          
          {/* Botón de login */}
          <button
            onClick={handleLogin}
            className="group w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-slate-700 font-semibold hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="flex items-center justify-center space-x-3">
              {/* Logo de Google */}
              <div className="relative">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              
              <span className="text-lg">Continuar con Google</span>
              
              {/* Icono de flecha */}
              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
          
          {/* Información adicional */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 leading-relaxed">
              Al continuar, aceptas nuestros{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline decoration-2 underline-offset-2 transition-colors duration-200">
                términos de servicio
              </a>{' '}
              y{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline decoration-2 underline-offset-2 transition-colors duration-200">
                política de privacidad
              </a>
            </p>
          </div>

          {/* Indicador de seguridad */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Conexión segura con Google</span>
          </div>
        </div>
      </div>

      {/* Footer flotante */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-xs text-slate-400">
          Desarrollado por Rances Rodriguez
        </p>
      </div>
    </div>
  );
}

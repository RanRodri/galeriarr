import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    setShowMobileMenu(false)
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] px-3 sm:px-4 md:px-6 lg:px-10 py-2 sm:py-3 bg-white/80 backdrop-blur relative z-50">
      <Link to="/" className="flex items-center gap-2 sm:gap-3 text-[#111518]">
        <div className="size-5 sm:size-6">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-[#111518] text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">Photo Album</h2>
      </Link>

      <div className="flex flex-1 justify-end gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {isAuthenticated && (
          <>
            {/* Navegación desktop */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-9">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `text-sm font-medium leading-normal ${isActive ? 'text-[#19a2e6]' : 'text-[#111518]'}`}
              >
                Álbumes
              </NavLink>
              <NavLink
                to="/form"
                className={({ isActive }) => `text-sm font-medium leading-normal ${isActive ? 'text-[#19a2e6]' : 'text-[#111518]'}`}
              >
                Crear Álbum
              </NavLink>
            </nav>

            {/* Botón menú móvil */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Menú de navegación"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </>
        )}
        
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1 sm:gap-2 hover:bg-slate-100 rounded-lg p-1.5 sm:p-2 transition-colors"
            >
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name}
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-7 sm:size-8"
                />
              ) : (
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full size-7 sm:size-8 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Menú desplegable del usuario */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-[60]">
                <div className="p-3 sm:p-4 border-b border-gray-100">
                  <p className="font-semibold text-slate-800 text-sm sm:text-base">{user?.name}</p>
                  <p className="text-xs sm:text-sm text-slate-600">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Menú móvil desplegable */}
      {showMobileMenu && (
        <div className="absolute top-full left-0 right-0 bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border-b border-slate-700 shadow-2xl z-[55] md:hidden">
          <nav className="flex flex-col p-4 space-y-3">
            <NavLink
              to="/"
              end
              onClick={() => setShowMobileMenu(false)}
              className={({ isActive }) => `text-base font-medium leading-normal px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'text-blue-400 bg-blue-900/30 border border-blue-700/50' : 'text-slate-200 hover:bg-slate-700/50 hover:text-white'}`}
            >
              Álbumes
            </NavLink>
            <NavLink
              to="/form"
              onClick={() => setShowMobileMenu(false)}
              className={({ isActive }) => `text-base font-medium leading-normal px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'text-blue-400 bg-blue-900/30 border border-blue-700/50' : 'text-slate-200 hover:bg-slate-700/50 hover:text-white'}`}
            >
              Crear Álbum
            </NavLink>
          </nav>
        </div>
      )}

      {/* Overlay para cerrar menú móvil */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/40 z-[45] md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </header>
  )
}



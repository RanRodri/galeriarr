import React from 'react'

const UserAvatar = ({ 
  user, 
  size = 'md',
  showStatus = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 sm:w-12 sm:h-12", 
    lg: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
  }
  
  const borderClasses = {
    sm: "border-2 ring-2",
    md: "border-2 sm:border-4 ring-2 sm:ring-4",
    lg: "border-2 sm:border-4 ring-2 sm:ring-4"
  }
  
  const textSizes = {
    sm: "text-sm",
    md: "text-lg sm:text-xl",
    lg: "text-lg sm:text-xl md:text-2xl"
  }
  
  return (
    <div className={`relative ${className}`}>
      {user?.picture ? (
        <img
          src={user.picture}
          alt={`Foto de perfil de ${user.name || user.email}`}
          className={`${sizeClasses[size]} rounded-xl sm:rounded-2xl object-cover border-white ring-blue-100 shadow-lg ${borderClasses[size]}`}
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border-white ring-blue-100 ${borderClasses[size]}`}>
          <span className={`text-white font-bold ${textSizes[size]}`}>
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </span>
        </div>
      )}
      
      {showStatus && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  )
}

export default UserAvatar

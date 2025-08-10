import React from 'react'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-indigo-100 text-indigo-800"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  }
  
  return (
    <span className={`${variants[variant]} ${sizes[size]} font-medium rounded-full w-fit ${className}`}>
      {children}
    </span>
  )
}

export default Badge

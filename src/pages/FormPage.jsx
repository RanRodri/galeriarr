import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function FormPage() {
  // Estado simple del formulario
  const [formData, setFormData] = useState({
    documentType: '',
    name: '',
    lastName: '',
    address: '',
    startDate: '',
    endDate: ''
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Opciones de documento
  const documentTypes = [
    { value: '', label: 'Seleccionar Tipo de Documento' },
    { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
    { value: 'CE', label: 'Cédula de Extranjería (CE)' },
    { value: 'NIT', label: 'Número de Identificación Tributaria (NIT)' }
  ]

  // Validaciones exactas según especificaciones
  const validateDocumentType = (value) => {
    if (!value) return 'El tipo de documento es obligatorio'
    if (!['CC', 'CE', 'NIT'].includes(value)) return 'Seleccione un tipo válido'
    return ''
  }

  const validateName = (value) => {
    if (!value.trim()) return 'El nombre es obligatorio'
    if (value.trim().length > 200) return 'Máximo 200 caracteres'
    
    // Solo letras y espacios
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value.trim())) {
      return 'Solo se permiten letras y espacios'
    }
    
    const words = value.trim().split(/\s+/).filter(w => w.length > 0)
    if (words.length > 6) return 'Máximo 6 palabras'
    
    for (let word of words) {
      if (word.length < 3) return 'Cada palabra debe tener mínimo 3 letras'
    }
    
    return ''
  }

  const validateLastName = (value) => {
    if (!value.trim()) return 'El apellido es obligatorio'
    if (value.trim().length > 200) return 'Máximo 200 caracteres'
    
    // Solo letras y espacios
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value.trim())) {
      return 'Solo se permiten letras y espacios'
    }
    
    const words = value.trim().split(/\s+/).filter(w => w.length > 0)
    if (words.length > 6) return 'Máximo 6 palabras'
    
    for (let word of words) {
      if (word.length < 3) return 'Cada palabra debe tener mínimo 3 letras'
    }
    
    return ''
  }

  const validateAddress = (value) => {
    if (!value.trim()) return 'La dirección es obligatoria'
    if (value.trim().length > 150) return 'Máximo 150 caracteres'
    
    // Alfanumérico + espacios + # + -
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s#\-]+$/.test(value.trim())) {
      return 'Solo letras, números, espacios, # y -'
    }
    
    return ''
  }

  const isWeekend = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    const day = date.getDay()
    return day === 0 || day === 6 // 0=domingo, 6=sábado
  }

  const validateStartDate = (value) => {
    if (!value) return 'La fecha de inicio es obligatoria'
    
    const today = new Date().toISOString().split('T')[0]
    if (value < today) return 'No puede ser anterior a hoy'
    
    if (isWeekend(value)) return 'No puede ser fin de semana'
    
    return ''
  }

  const validateEndDate = (value, startDate) => {
    if (!value) return 'La fecha de fin es obligatoria'
    if (!startDate) return 'Seleccione primero la fecha de inicio'
    
    if (value <= startDate) return 'Debe ser posterior a la fecha de inicio'
    
    if (isWeekend(value)) return 'No puede ser fin de semana'
    
    // Calcular días
    const start = new Date(startDate + 'T00:00:00')
    const end = new Date(value + 'T00:00:00')
    const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return 'Mínimo 30 días de diferencia'
    if (diffDays > 365) return 'Máximo 365 días de diferencia'
    
    return ''
  }

  // Validar un campo específico
  const validateField = (name, value) => {
    switch (name) {
      case 'documentType': return validateDocumentType(value)
      case 'name': return validateName(value)
      case 'lastName': return validateLastName(value)
      case 'address': return validateAddress(value)
      case 'startDate': return validateStartDate(value)
      case 'endDate': return validateEndDate(value, formData.startDate)
      default: return ''
    }
  }

  // Manejar cambios - SIMPLE Y DIRECTO
  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Actualizar valor
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validar si ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
      
      // Si es startDate y endDate ya tiene valor, revalidar endDate
      if (name === 'startDate' && formData.endDate && touched.endDate) {
        const endError = validateEndDate(formData.endDate, value)
        setErrors(prev => ({ ...prev, endDate: endError }))
      }
    }
  }

  // Manejar blur - SIMPLE
  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  // Verificar si el formulario es válido
  const isFormValid = () => {
    const hasErrors = Object.values(errors).some(error => error !== '')
    const hasEmptyFields = Object.values(formData).some(value => value === '')
    return !hasErrors && !hasEmptyFields
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Marcar todos como tocados
    const allTouched = {}
    Object.keys(formData).forEach(key => { allTouched[key] = true })
    setTouched(allTouched)
    
    // Validar todos los campos
    const allErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) allErrors[key] = error
    })
    setErrors(allErrors)
    
    const hasErrors = Object.keys(allErrors).length > 0
    
    if (hasErrors) {
      // Mostrar errores
      const fieldNames = {
        documentType: 'Tipo de Documento',
        name: 'Nombre',
        lastName: 'Apellido',
        address: 'Dirección',
        startDate: 'Fecha de Inicio',
        endDate: 'Fecha de Fin'
      }
      
      const errorList = Object.keys(allErrors).map(key => 
        `• ${fieldNames[key]}: ${allErrors[key]}`
      ).join('\n')
      
      await Swal.fire({
        icon: 'error',
        title: 'Errores en el formulario',
        text: `Por favor corrija los siguientes errores:\n\n${errorList}`,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#dc3545'
      })
      return
    }

    // Todo válido - confirmar
    const result = await Swal.fire({
      icon: 'success',
      title: '¡Formulario válido!',
      text: 'Todos los campos cumplen con los requisitos. ¿Desea crear el álbum?',
      showCancelButton: true,
      confirmButtonText: 'Crear Álbum',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745'
    })

    if (!result.isConfirmed) return

    setIsSubmitting(true)
    
    try {
      // Simular creación
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      await Swal.fire({
        icon: 'success',
        title: '¡Álbum creado!',
        text: 'Su álbum ha sido creado exitosamente.',
        timer: 3000,
        timerProgressBar: true
      })
      
      // Limpiar formulario
      setFormData({
        documentType: '',
        name: '',
        lastName: '',
        address: '',
        startDate: '',
        endDate: ''
      })
      setErrors({})
      setTouched({})
      
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al crear el álbum. Inténtelo nuevamente.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMinDate = () => new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Crear Nuevo Álbum
          </h1>
          <p className="text-slate-600 text-lg">
            Complete la información requerida para crear su álbum personalizado
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Tipo de Documento */}
            <div>
              <label htmlFor="documentType" className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="text-blue-600">📄</span>
                Tipo de Documento *
              </label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  errors.documentType && touched.documentType 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                } shadow-sm`}
              >
                {documentTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.documentType && touched.documentType && (
                <div className="mt-2 flex items-center gap-2 text-red-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{errors.documentType}</span>
                </div>
              )}
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="text-blue-600">👤</span>
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ej: Juan Carlos"
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    errors.name && touched.name 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  } shadow-sm`}
                />
                {errors.name && touched.name && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{errors.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="text-blue-600">👤</span>
                  Apellido *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ej: García López"
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    errors.lastName && touched.lastName 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  } shadow-sm`}
                />
                {errors.lastName && touched.lastName && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{errors.lastName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="text-blue-600">📍</span>
                Dirección *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Calle 123 # 45-67"
                className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  errors.address && touched.address 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                } shadow-sm`}
              />
              {errors.address && touched.address && (
                <div className="mt-2 flex items-center gap-2 text-red-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{errors.address}</span>
                </div>
              )}
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="text-blue-600">📅</span>
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={getMinDate()}
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    errors.startDate && touched.startDate 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  } shadow-sm`}
                />
                {errors.startDate && touched.startDate && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{errors.startDate}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="text-blue-600">📅</span>
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={formData.startDate || getMinDate()}
                  disabled={!formData.startDate}
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    errors.endDate && touched.endDate 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  } ${!formData.startDate ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''} shadow-sm`}
                />
                {errors.endDate && touched.endDate && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{errors.endDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Información de validación */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Reglas de Validación</h3>
              </div>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 mt-0.5">📅</span>
                  <span className="text-sm text-slate-700">Las fechas no pueden ser sábados o domingos</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 mt-0.5">⏱️</span>
                  <span className="text-sm text-slate-700">El rango debe ser entre 30 y 365 días</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 mt-0.5">✍️</span>
                  <span className="text-sm text-slate-700">Nombres: máximo 6 palabras, cada una con mínimo 3 letras</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 mt-0.5">🏠</span>
                  <span className="text-sm text-slate-700">Dirección: máximo 150 caracteres, solo letras, números, # y -</span>
                </div>
              </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                  isFormValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:scale-[1.02] hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando Álbum...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Crear Álbum
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
import { useState, useRef, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function ImageUploadModal({ onUpload, onClose }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  // Función para mostrar previews
  const showPreviews = (files) => {
    setSelectedFiles(Array.from(files))
    const previewGrid = document.getElementById('previewGrid')
    const totalFiles = document.getElementById('totalFiles')
    const totalSize = document.getElementById('totalSize')
    
    if (!previewGrid || !totalFiles || !totalSize) return
    
    previewGrid.innerHTML = ''
    let totalSizeBytes = 0
    
    files.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const previewItem = document.createElement('div')
        previewItem.className = 'relative group'
        previewItem.innerHTML = `
          <div class="relative aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 group-hover:border-blue-400 transition-colors">
            <img src="${e.target.result}" alt="${file.name}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            
            <!-- Información del archivo -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p class="text-white text-xs font-medium truncate">${file.name}</p>
              <p class="text-gray-300 text-xs">${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            
            <!-- Botón de eliminar -->
            <button type="button" onclick="removeFile(${index})" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        `
        previewGrid.appendChild(previewItem)
      }
      reader.readAsDataURL(file)
      totalSizeBytes += file.size
    })
    
    // Actualizar contadores
    totalFiles.textContent = `${files.length} imagen${files.length !== 1 ? 'es' : ''} seleccionada${files.length !== 1 ? 's' : ''}`
    totalSize.textContent = `Tamaño total: ${(totalSizeBytes / (1024 * 1024)).toFixed(2)} MB`
    
    const previewContainer = document.getElementById('previewContainer')
    if (previewContainer) {
      previewContainer.classList.remove('hidden')
    }
  }

  // Función para eliminar archivo
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    
    const dt = new DataTransfer()
    newFiles.forEach(file => dt.items.add(file))
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files
    }
    
    if (newFiles.length === 0) {
      const previewContainer = document.getElementById('previewContainer')
      if (previewContainer) {
        previewContainer.classList.add('hidden')
      }
    } else {
      showPreviews(newFiles)
    }
  }

  // Función para manejar selección de archivos
  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      showPreviews(Array.from(files))
    }
  }

  // Función para manejar drag and drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    if (files.length > 0) {
      const dt = new DataTransfer()
      files.forEach(file => dt.items.add(file))
      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files
      }
      handleFileSelect(files)
    }
  }

  // Función para abrir selector de archivos
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // Función para manejar cambio en input
  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files)
    e.target.value = ''
  }

  // Función para validar archivos
  const validateFiles = () => {
    if (selectedFiles.length === 0) {
      Swal.showValidationMessage('Selecciona al menos una imagen')
      return false
    }
    
    for (const file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        Swal.showValidationMessage(`"${file.name}" no es una imagen válida`)
        return false
      }
      if (file.size > 100 * 1024 * 1024) {
        Swal.showValidationMessage(`"${file.name}" es demasiado grande (máx. 100MB)`)
        return false
      }
    }
    
    return selectedFiles
  }

  // Configurar funciones globales para SweetAlert
  useEffect(() => {
    window.removeFile = removeFile
  }, [selectedFiles])

  // Configurar event listeners
  useEffect(() => {
    const dropZone = dropZoneRef.current
    const fileInput = fileInputRef.current
    
    if (!dropZone || !fileInput) return

    // Click en drop zone
    dropZone.addEventListener('click', handleClick)
    
    // Cambio en input de archivo
    fileInput.addEventListener('change', handleFileInputChange)
    
    // Drag and drop
    dropZone.addEventListener('dragover', handleDrag)
    dropZone.addEventListener('dragleave', handleDrag)
    dropZone.addEventListener('drop', handleDrop)
    
    return () => {
      dropZone.removeEventListener('click', handleClick)
      fileInput.removeEventListener('change', handleFileInputChange)
      dropZone.removeEventListener('dragover', handleDrag)
      dropZone.removeEventListener('dragleave', handleDrag)
      dropZone.removeEventListener('drop', handleDrop)
    }
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone Principal */}
      <div className="mb-6">
        <div 
          ref={dropZoneRef}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-300'
          }`}
        >
          <div className="space-y-6">
            {/* Icono animado */}
            <div className="mx-auto w-20 h-20 text-blue-500 relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
              <svg className="w-full h-full relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            {/* Texto principal */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">Subir imágenes</h3>
              <p className="text-gray-600">Arrastra y suelta múltiples imágenes aquí</p>
              <p className="text-sm text-gray-500">o haz clic para seleccionar archivos</p>
            </div>
            
            {/* Información de formatos */}
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs font-medium text-gray-700">JPG, PNG, GIF, WebP</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <span className="text-xs text-gray-500">Máx. 100MB por archivo</span>
            </div>
          </div>
          
          {/* Indicador de drag activo */}
          <div className={`absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-2xl transition-opacity duration-200 pointer-events-none ${
            dragActive ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenedor de previews */}
      <div id="previewContainer" className="hidden mb-6">
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Imágenes seleccionadas</h4>
          <p className="text-sm text-gray-600">Revisa las imágenes antes de subir</p>
        </div>
        
        <div id="previewGrid" className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200">
          {/* Los previews se insertarán aquí dinámicamente */}
        </div>
        
        <div className="mt-4 text-center">
          <p id="totalFiles" className="text-sm text-gray-600"></p>
          <p id="totalSize" className="text-xs text-gray-500"></p>
        </div>
      </div>
      
      {/* Input de archivos oculto */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        multiple 
        className="hidden" 
      />
    </div>
  )
}

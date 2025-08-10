import { useState } from 'react'
import Swal from 'sweetalert2'

export const useImageUpload = (uploadImage, reloadImages) => {
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async () => {
    const { value: files } = await Swal.fire({
      title: 'Subir imágenes',
      html: `
        <div class="w-full max-w-2xl mx-auto">
          <!-- Drop Zone Principal -->
          <div class="mb-6">
            <div id="dropZone" class="relative border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
              <div class="space-y-6">
                <!-- Icono animado -->
                <div class="mx-auto w-20 h-20 text-blue-500 relative">
                  <div class="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
                  <svg class="w-full h-full relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <!-- Texto principal -->
                <div class="space-y-2">
                  <h3 class="text-2xl font-bold text-gray-800">Subir imágenes</h3>
                  <p class="text-gray-600">Arrastra y suelta múltiples imágenes aquí</p>
                  <p class="text-sm text-gray-500">o haz clic para seleccionar archivos</p>
                </div>
                
                <!-- Información de formatos -->
                <div class="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                  <div class="flex items-center gap-1">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span class="text-xs font-medium text-gray-700">JPG, PNG, GIF, WebP</span>
                  </div>
                  <div class="w-px h-4 bg-gray-300"></div>
                  <span class="text-xs text-gray-500">Máx. 100MB por archivo</span>
                </div>
              </div>
              
              <!-- Indicador de drag activo -->
              <div id="dragActive" class="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-2xl opacity-0 transition-opacity duration-200 pointer-events-none">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="bg-white rounded-full p-4 shadow-lg">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contenedor de previews -->
          <div id="previewContainer" class="hidden mb-6">
            <div class="text-center mb-4">
              <h4 class="text-lg font-semibold text-gray-800 mb-2">Imágenes seleccionadas</h4>
              <p class="text-sm text-gray-600">Revisa las imágenes antes de subir</p>
            </div>
            
            <div id="previewGrid" class="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200">
              <!-- Los previews se insertarán aquí dinámicamente -->
            </div>
            
            <div class="mt-4 text-center">
              <p id="totalFiles" class="text-sm text-gray-600"></p>
              <p id="totalSize" class="text-xs text-gray-500"></p>
            </div>
          </div>
          
          <!-- Input de archivos oculto -->
          <input type="file" id="fileInput" accept="image/*" multiple class="hidden" />
        </div>
      `,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Subir imágenes',
      confirmButtonColor: '#3b82f6',
      showLoaderOnConfirm: true,
      width: '600px',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        confirmButton: 'rounded-xl px-8 py-3 text-lg font-semibold',
        cancelButton: 'rounded-xl px-8 py-3 text-lg font-medium'
      },
      preConfirm: () => {
        const fileInput = document.getElementById('fileInput')
        const files = Array.from(fileInput.files)
        
        if (files.length === 0) {
          Swal.showValidationMessage('Selecciona al menos una imagen')
          return false
        }
        
        // Validar cada archivo
        for (const file of files) {
          if (!file.type.startsWith('image/')) {
            Swal.showValidationMessage(`"${file.name}" no es una imagen válida`)
            return false
          }
          if (file.size > 100 * 1024 * 1024) {
            Swal.showValidationMessage(`"${file.name}" es demasiado grande (máx. 100MB)`)
            return false
          }
        }
        
        return files
      },
      didOpen: () => {
        const dropZone = document.getElementById('dropZone')
        const fileInput = document.getElementById('fileInput')
        const previewContainer = document.getElementById('previewContainer')
        const previewGrid = document.getElementById('previewGrid')
        const totalFiles = document.getElementById('totalFiles')
        const totalSize = document.getElementById('totalSize')
        const dragActive = document.getElementById('dragActive')
        
        let selectedFiles = []
        
        // Función para mostrar previews
        const showPreviews = (files) => {
          selectedFiles = Array.from(files)
          previewGrid.innerHTML = ''
          
          let totalSizeBytes = 0
          
          selectedFiles.forEach((file, index) => {
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
          totalFiles.textContent = `${selectedFiles.length} imagen${selectedFiles.length !== 1 ? 'es' : ''} seleccionada${selectedFiles.length !== 1 ? 's' : ''}`
          totalSize.textContent = `Tamaño total: ${(totalSizeBytes / (1024 * 1024)).toFixed(2)} MB`
          
          previewContainer.classList.remove('hidden')
        }
        
        // Función para eliminar archivo
        window.removeFile = (index) => {
          selectedFiles.splice(index, 1)
          const dt = new DataTransfer()
          selectedFiles.forEach(file => dt.items.add(file))
          fileInput.files = dt.files
          showPreviews(selectedFiles)
          
          if (selectedFiles.length === 0) {
            previewContainer.classList.add('hidden')
          }
        }
        
        // Click en drop zone
        dropZone.addEventListener('click', () => {
          fileInput.click()
        })
        
        // Cambio en input de archivo
        fileInput.addEventListener('change', (e) => {
          const files = Array.from(e.target.files)
          if (files.length > 0) {
            showPreviews(files)
          }
        })
        
        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
          e.preventDefault()
          dragActive.classList.remove('opacity-0')
        })
        
        dropZone.addEventListener('dragleave', (e) => {
          e.preventDefault()
          if (!dropZone.contains(e.relatedTarget)) {
            dragActive.classList.add('opacity-0')
          }
        })
        
        dropZone.addEventListener('drop', (e) => {
          e.preventDefault()
          dragActive.classList.add('opacity-0')
          
          const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
          if (files.length > 0) {
            const dt = new DataTransfer()
            files.forEach(file => dt.items.add(file))
            fileInput.files = dt.files
            showPreviews(files)
          }
        })
      }
    })

    if (files && files.length > 0) {
      try {
        setUploading(true)
        
        Swal.fire({
          title: 'Subiendo imágenes...',
          html: `
            <div class="text-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-lg font-medium text-gray-800 mb-2">Subiendo ${files.length} imagen${files.length !== 1 ? 'es' : ''}</p>
              <p class="text-gray-600">Por favor espera mientras se procesan tus archivos...</p>
            </div>
          `,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        })

        // Subir imágenes secuencialmente con delay para evitar rate limiting
        const uploadResults = []
        const totalFiles = files.length
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          
          // Actualizar el loading con progreso
          Swal.update({
            html: `
              <div class="text-center">
                <div class="relative mb-4">
                  <div class="w-16 h-16 mx-auto">
                    <svg class="w-full h-full text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <!-- Barra de progreso -->
                  <div class="mt-4 w-48 mx-auto bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${((i + 1) / totalFiles) * 100}%"></div>
                  </div>
                </div>
                <p class="text-lg font-medium text-gray-800 mb-2">Subiendo imagen ${i + 1} de ${totalFiles}</p>
                <p class="text-gray-600 mb-2">${file.name}</p>
                <p class="text-sm text-gray-500">Por favor espera, esto puede tomar unos momentos...</p>
              </div>
            `
          })
          
          try {
            const result = await uploadImage(file, file.name)
            uploadResults.push({ success: true, file: file.name, result })
            
            // Delay de 1 segundo entre subidas para evitar rate limiting
            if (i < files.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          } catch (error) {
            console.error(`Error subiendo ${file.name}:`, error)
            uploadResults.push({ success: false, file: file.name, error: error.message })
            
            // Si falla una imagen, esperar un poco más antes de continuar
            if (i < files.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 2000))
            }
          }
        }
        
        // Mostrar resumen de resultados
        const successfulUploads = uploadResults.filter(r => r.success).length
        const failedUploads = uploadResults.filter(r => !r.success).length
        
        if (failedUploads === 0) {
          // Todas las imágenes se subieron exitosamente
          Swal.fire({
            title: '',
            html: `
              <div class="relative">
                <!-- Fondo con gradiente y patrón -->
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl"></div>
                <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.3"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
                
                <!-- Contenido principal -->
                <div class="relative z-10 text-center p-8">
                  <!-- Icono animado con confeti -->
                  <div class="relative mb-6">
                    <div class="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                      <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    
                    <!-- Partículas de confeti -->
                    <div class="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="absolute -top-4 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
                    <div class="absolute -bottom-2 -right-4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.5s"></div>
                    <div class="absolute -bottom-4 -left-4 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.7s"></div>
                  </div>
                  
                  <!-- Título principal con gradiente -->
                  <div class="mb-6">
                    <h2 class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                      ¡Subida Completada!
                    </h2>
                    <div class="w-20 h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full mx-auto"></div>
                  </div>
                  
                  <!-- Estadísticas con diseño moderno -->
                  <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-6">
                    <div class="flex items-center justify-center space-x-8">
                      <div class="text-center">
                        <div class="text-3xl font-bold text-emerald-600">${successfulUploads}</div>
                        <div class="text-sm text-gray-600 font-medium">Imagen${successfulUploads !== 1 ? 'es' : ''}</div>
                      </div>
                      <div class="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                      <div class="text-center">
                        <div class="text-3xl font-bold text-green-600">100%</div>
                        <div class="text-sm text-gray-600 font-medium">Éxito</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Mensaje de confirmación -->
                  <div class="bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl p-4 border border-emerald-200">
                    <div class="flex items-center justify-center space-x-2">
                      <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span class="text-emerald-800 font-medium">Todas las imágenes se procesaron correctamente</span>
                    </div>
                  </div>
                </div>
              </div>
            `,
            showConfirmButton: false,
            timer: 5000,
            customClass: {
              popup: 'rounded-3xl shadow-2xl border-0',
              container: 'p-4'
            },
            background: 'transparent',
            backdrop: 'rgba(0, 0, 0, 0.4)'
          })
        } else if (successfulUploads === 0) {
          // Todas las imágenes fallaron
          Swal.fire({
            title: '',
            html: `
              <div class="relative">
                <!-- Fondo con gradiente -->
                <div class="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 rounded-3xl"></div>
                
                <!-- Contenido principal -->
                <div class="relative z-10 text-center p-8">
                  <!-- Icono de error -->
                  <div class="mx-auto w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl mb-6">
                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  
                  <!-- Título -->
                  <h2 class="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Error en la Subida
                  </h2>
                  <div class="w-20 h-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-full mx-auto mb-6"></div>
                  
                  <!-- Mensaje principal -->
                  <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-6">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-red-600 mb-2">0%</div>
                      <div class="text-gray-600 font-medium">No se pudo subir ninguna imagen</div>
                      <div class="text-sm text-gray-500 mt-1">Hubo problemas con la API de Google Photos</div>
                    </div>
                  </div>
                  
                  <!-- Lista de errores -->
                  <div class="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-4 border border-red-200">
                    <div class="flex items-center space-x-2 mb-3">
                      <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span class="text-red-800 font-medium">Errores encontrados:</span>
                    </div>
                    <div class="text-left space-y-2">
                      ${uploadResults.filter(r => !r.success).map(r => 
                        `<div class="bg-white/60 rounded-lg p-3 border border-red-200">
                          <div class="text-sm text-red-800 font-medium">${r.file}</div>
                          <div class="text-xs text-red-600">${r.error}</div>
                        </div>`
                      ).join('')}
                    </div>
                  </div>
                </div>
              </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#ef4444',
            customClass: {
              popup: 'rounded-3xl shadow-2xl border-0',
              confirmButton: 'rounded-xl px-8 py-3 text-lg font-semibold'
            },
            background: 'transparent',
            backdrop: 'rgba(0, 0, 0, 0.4)'
          })
        } else {
          // Algunas imágenes se subieron, otras fallaron
          Swal.fire({
            title: '',
            html: `
              <div class="relative">
                <!-- Fondo con gradiente -->
                <div class="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl"></div>
                
                <!-- Contenido principal -->
                <div class="relative z-10 text-center p-8">
                  <!-- Icono de advertencia -->
                  <div class="mx-auto w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl mb-6">
                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  
                  <!-- Título -->
                  <h2 class="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                    Subida Parcial
                  </h2>
                  <div class="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full mx-auto mb-6"></div>
                  
                  <!-- Resumen estadístico -->
                  <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-6">
                    <div class="grid grid-cols-2 gap-6">
                      <div class="text-center">
                        <div class="text-3xl font-bold text-green-600">${successfulUploads}</div>
                        <div class="text-sm text-gray-600 font-medium">Exitosas</div>
                      </div>
                      <div class="text-center">
                        <div class="text-3xl font-bold text-red-600">${failedUploads}</div>
                        <div class="text-sm text-gray-600 font-medium">Fallidas</div>
                      </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200">
                      <div class="text-center">
                        <div class="text-2xl font-bold text-gray-800">${totalFiles}</div>
                        <div class="text-sm text-gray-600 font-medium">Total</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Detalles -->
                  <div class="space-y-4">
                    <div class="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border border-green-200">
                      <div class="flex items-center space-x-2 mb-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-green-800 font-medium">Subidas exitosas:</span>
                      </div>
                      <div class="text-left">
                        ${uploadResults.filter(r => r.success).map(r => 
                          `<div class="text-sm text-green-700 ml-4 mb-1">• ${r.file}</div>`
                        ).join('')}
                      </div>
                    </div>
                    
                    <div class="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-4 border border-red-200">
                      <div class="flex items-center space-x-2 mb-2">
                        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span class="text-red-800 font-medium">Errores:</span>
                      </div>
                      <div class="text-left">
                        ${uploadResults.filter(r => !r.success).map(r => 
                          `<div class="text-sm text-red-700 ml-4 mb-1">• ${r.file}: ${r.error}</div>`
                        ).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#f59e0b',
            customClass: {
              popup: 'rounded-3xl shadow-2xl border-0',
              confirmButton: 'rounded-xl px-8 py-3 text-lg font-semibold'
            },
            background: 'transparent',
            backdrop: 'rgba(0, 0, 0, 0.4)'
          })
        }
        
        // Recargar las imágenes para mostrar las nuevas subidas
        await reloadImages()
        
      } catch (error) {
        console.error('Error uploading images:', error)
        Swal.fire({
          title: '',
          html: `
            <div class="relative">
              <!-- Fondo con gradiente -->
              <div class="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 rounded-3xl"></div>
              
              <!-- Contenido principal -->
              <div class="relative z-10 text-center p-8">
                <!-- Icono de error -->
                <div class="mx-auto w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl mb-6">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                <!-- Título -->
                <h2 class="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Error en la Subida
                </h2>
                <div class="w-16 h-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-full mx-auto mb-4"></div>
                
                <!-- Mensaje -->
                <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                  <p class="text-gray-700">No se pudieron subir algunas imágenes. Inténtalo de nuevo.</p>
                </div>
              </div>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#ef4444',
          customClass: {
            popup: 'rounded-3xl shadow-2xl border-0',
            confirmButton: 'rounded-xl px-6 py-2 text-base font-semibold'
          },
          background: 'transparent',
          backdrop: 'rgba(0, 0, 0, 0.4)'
        })
      } finally {
        setUploading(false)
      }
    }
  }

  return {
    uploading,
    handleImageUpload
  }
}

# 📸 Google Photos Album Manager

Una aplicación web moderna para gestionar álbumes de Google Photos con funcionalidades avanzadas de autenticación OAuth2, gestión de álbumes y subida de imágenes.

## 🚀 Características Principales

- **🔐 Autenticación OAuth2** con Google Photos API
- **📚 Gestión de Álbumes** - Crear, ver y gestionar álbumes
- **🖼️ Subida de Imágenes** - Subir fotos directamente a álbumes específicos
- **📱 Diseño Responsivo** - Optimizado para móviles y desktop
- **⚡ Interfaz Moderna** - UI/UX intuitiva con TailwindCSS
- **🔄 Estado en Tiempo Real** - Gestión de estado con React Context

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Build tool y servidor de desarrollo
- **TailwindCSS** - Framework de CSS utilitario
- **React Router DOM** - Enrutamiento de la aplicación
- **React Query** - Gestión de estado del servidor

### Autenticación & API
- **Google OAuth2** - Autenticación segura
- **Google Photos API** - Integración con Google Photos
- **JWT Tokens** - Manejo de sesiones

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad de navegadores

## 📋 Prerrequisitos

- Node.js 16+ 
- npm o yarn
- Cuenta de Google con Google Photos habilitado
- Proyecto configurado en Google Cloud Console

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd prueba-tecnica
```

### 2. Instalar dependencias
```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom @tanstack/react-query date-fns
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
VITE_GOOGLE_CLIENT_ID=tu_client_id
VITE_GOOGLE_CLIENT_SECRET=tu_client_secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_GOOGLE_PROJECT_ID=tu_project_id
VITE_GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/v2/auth
VITE_GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
VITE_GOOGLE_PHOTOS_API_BASE=https://photoslibrary.googleapis.com/v1
VITE_REQUEST_TIMEOUT=30000
VITE_MAX_RETRIES=3
VITE_RETRY_DELAY=1000
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## 🗂️ Estructura de la Aplicación

### Rutas Principales
- **`/`** - Página principal con lista de álbumes
- **`/album/:id`** - Detalle del álbum con imágenes y opción de subida
- **`/form`** - Formulario de validación
- **`/auth/callback`** - Callback de autenticación OAuth2

### Componentes Principales
- **`Header`** - Navegación y estado de autenticación
- **`AlbumsPage`** - Lista de álbumes del usuario
- **`AlbumDetailPage`** - Vista detallada del álbum
- **`ImageGrid`** - Grid responsivo de imágenes
- **`FormPage`** - Formulario de validación

## 🔧 Funcionalidades Implementadas

### Gestión de Álbumes
- ✅ Listar todos los álbumes creados en la webapp
- ✅ Crear nuevos álbumes
- ✅ Compartir álbumes 
- ✅ Navegar entre álbumes

### Gestión de Imágenes
- ✅ Subir imágenes a álbumes específicos
- ✅ Visualizar imágenes en grid responsivo

### Autenticación
- ✅ Flujo OAuth2 completo con Google
- ✅ Renovación automática de tokens
- ✅ Manejo de sesiones persistentes
- ✅ Logout seguro

## 📱 Características Responsivas

- **Mobile First** - Diseño optimizado para dispositivos móviles
- **Grid Adaptativo** - Ajuste automático del número de columnas
- **Hero Section Fijo** - Optimizado para pantallas pequeñas
- **Touch Friendly** - Interacciones optimizadas para touch

## 🚀 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

## 🔒 Seguridad

- **OAuth2** - Autenticación estándar de la industria
- **Tokens JWT** - Manejo seguro de sesiones
- **HTTPS** - Comunicación encriptada
- **Variables de Entorno** - Configuración segura

## 📊 Estado del Proyecto

- ✅ **Autenticación OAuth2** - Completamente funcional
- ✅ **Gestión de Álbumes** - CRUD completo implementado
- ✅ **Subida de Imágenes** - Integración con Google Photos API
- ✅ **UI/UX Responsiva** - Diseño moderno y funcional
- ✅ **Manejo de Errores** - Sistema robusto de errores
- ✅ **Testing** - Pruebas de funcionalidad básica

## 🤝 Contribución

Este es un proyecto de prueba técnica que demuestra:
- Arquitectura de aplicaciones React modernas
- Integración con APIs externas (Google Photos)
- Manejo de autenticación OAuth2
- Diseño responsivo con TailwindCSS
- Buenas prácticas de desarrollo

## 📝 Notas de Implementación

- **Arquitectura Modular** - Componentes reutilizables y separación de responsabilidades
- **Manejo de Estado** - Context API para estado global de autenticación
- **Optimización de Performance** - Lazy loading y memoización
- **Accesibilidad** - Atributos ARIA y navegación por teclado

## 🔗 Enlaces Útiles

- [Google Photos API Documentation](https://developers.google.com/photos)
- [Google OAuth2 Guide](https://developers.google.com/identity/protocols/oauth2)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

**Desarrollado con ❤️ para demostrar habilidades en desarrollo frontend moderno by RANCES RODIRGUEZ**

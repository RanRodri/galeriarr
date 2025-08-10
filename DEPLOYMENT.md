# 🐳 Guía de Despliegue con Docker

Esta guía te ayudará a desplegar la aplicación Google Photos Album Manager usando Docker.

## 📋 Prerrequisitos

- Docker instalado en tu sistema
- Docker Compose instalado
- Git para clonar el repositorio

## 🚀 Despliegue Rápido

### Opción 1: Usando el script automatizado (Recomendado)

```bash
# Dar permisos de ejecución al script
chmod +x deploy.sh

# Ejecutar el script de despliegue
./deploy.sh
```

### Opción 2: Comandos manuales

```bash
# 1. Construir la imagen
docker-compose build

# 2. Iniciar los servicios
docker-compose up -d

# 3. Verificar el estado
docker-compose ps
```

## 🔧 Configuración

### Variables de Entorno

Antes de desplegar, asegúrate de tener configuradas las variables de entorno necesarias para Google Photos API:

```env
VITE_GOOGLE_CLIENT_ID=tu_client_id
VITE_GOOGLE_CLIENT_SECRET=tu_client_secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
VITE_GOOGLE_PROJECT_ID=tu_project_id
VITE_GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/v2/auth
VITE_GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
VITE_GOOGLE_PHOTOS_API_BASE=https://photoslibrary.googleapis.com/v1
```

### Puertos

La aplicación se ejecuta por defecto en el puerto **3000**. Puedes cambiar esto modificando el archivo `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Cambia 8080 por el puerto que prefieras
```

## 📊 Comandos Útiles

### Gestión de Contenedores

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f google-photos-app

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver estado de los servicios
docker-compose ps
```

### Gestión de Imágenes

```bash
# Ver imágenes Docker
docker images

# Limpiar imágenes no utilizadas
docker image prune -f

# Reconstruir imagen (forzar rebuild)
docker-compose build --no-cache
```

### Acceso a la Aplicación

Una vez desplegada, la aplicación estará disponible en:
- **URL Local**: http://localhost:3000
- **URL del Contenedor**: http://localhost:3000

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Ver qué está usando el puerto 3000
netstat -tulpn | grep :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "8080:80"
```

#### 2. Error de permisos
```bash
# Dar permisos al script
chmod +x deploy.sh

# Ejecutar con sudo si es necesario
sudo ./deploy.sh
```

#### 3. Contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs

# Verificar configuración
docker-compose config
```

#### 4. Limpiar completamente
```bash
# Detener y remover todo
docker-compose down -v --remove-orphans

# Limpiar imágenes
docker system prune -a

# Reconstruir desde cero
docker-compose build --no-cache
docker-compose up -d
```

## 📈 Monitoreo

### Health Check

La aplicación incluye health checks automáticos:

```bash
# Ver estado de health check
docker inspect google-photos-album-manager | grep Health -A 10
```

### Logs

```bash
# Ver logs de acceso
docker exec google-photos-album-manager tail -f /var/log/nginx/access.log

# Ver logs de error
docker exec google-photos-album-manager tail -f /var/log/nginx/error.log
```

## 🔒 Seguridad

### Headers de Seguridad

La aplicación incluye headers de seguridad configurados en Nginx:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

### Firewall

Asegúrate de que solo el puerto necesario esté abierto:
```bash
# Solo abrir puerto 3000
sudo ufw allow 3000
```

## 📝 Notas de Producción

### Para Entorno de Producción

1. **Cambiar puerto**: Usar puerto 80 o 443
2. **SSL/TLS**: Configurar certificados SSL
3. **Variables de entorno**: Usar archivos `.env` seguros
4. **Backup**: Configurar backups de la aplicación
5. **Monitoreo**: Implementar herramientas de monitoreo

### Optimizaciones

- La imagen usa multi-stage build para reducir tamaño
- Nginx está configurado con compresión gzip
- Caché optimizado para archivos estáticos
- Health checks automáticos

---

**Desarrollado por RANCES RODRIGUEZ** 🚀


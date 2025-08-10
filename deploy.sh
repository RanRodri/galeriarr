#!/bin/bash

# Script de despliegue para Google Photos Album Manager
# Autor: RANCES RODRIGUEZ

echo "🚀 Iniciando despliegue de Google Photos Album Manager..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

print_status "Docker y Docker Compose verificados correctamente."

# Parar y remover contenedores existentes
print_status "Deteniendo contenedores existentes..."
docker-compose down --remove-orphans

# Limpiar imágenes no utilizadas
print_status "Limpiando imágenes no utilizadas..."
docker image prune -f

# Construir la imagen
print_status "Construyendo la imagen Docker..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    print_status "Imagen construida exitosamente."
else
    print_error "Error al construir la imagen."
    exit 1
fi

# Iniciar los servicios
print_status "Iniciando servicios..."
docker-compose up -d

if [ $? -eq 0 ]; then
    print_status "Servicios iniciados exitosamente."
else
    print_error "Error al iniciar los servicios."
    exit 1
fi

# Esperar un momento para que el servicio esté listo
print_status "Esperando que el servicio esté listo..."
sleep 10

# Verificar el estado del servicio
print_status "Verificando estado del servicio..."
docker-compose ps

# Verificar logs
print_status "Mostrando logs del servicio..."
docker-compose logs --tail=20

print_status "🎉 ¡Despliegue completado exitosamente!"
print_status "La aplicación está disponible en: http://localhost:3000"
print_status "Para ver logs en tiempo real: docker-compose logs -f"
print_status "Para detener: docker-compose down"


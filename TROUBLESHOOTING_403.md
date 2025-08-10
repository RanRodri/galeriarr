# Solución para Error 403 - Google Photos API

## Problema
El error `403 Forbidden` indica que aunque la autenticación OAuth es exitosa, la aplicación no tiene permisos para acceder a la API de Google Photos.

## Causas Comunes

### 1. API de Google Photos Library no habilitada
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Selecciona tu proyecto: `valued-velocity-400223`
- Ve a "APIs y servicios" > "Biblioteca"
- Busca "Google Photos Library API"
- Si no está habilitada, haz clic en "Habilitar"

### 2. Scopes insuficientes
Los scopes actuales en `constants.js` son correctos, pero verifica que:
- `https://www.googleapis.com/auth/photoslibrary` esté incluido
- `https://www.googleapis.com/auth/photoslibrary.readonly` esté incluido

### 3. Consentimiento del usuario
El usuario debe dar consentimiento explícito para todos los scopes solicitados.

### 4. Configuración del proyecto OAuth
Verifica en [Google Cloud Console](https://console.cloud.google.com/):
- **APIs y servicios** > **Pantalla de consentimiento OAuth**
- **APIs y servicios** > **Credenciales** > Tu OAuth 2.0 Client ID

## Soluciones

### Solución 1: Forzar Nueva Autenticación
1. Haz clic en el botón "Forzar Nueva Auth" en la página de álbumes
2. Esto te llevará a Google para dar consentimiento explícito
3. Asegúrate de aceptar todos los permisos solicitados

### Solución 2: Verificar Configuración
1. Haz clic en "Verificar Config" (botón verde en modo desarrollo)
2. Revisa la consola del navegador para ver la configuración actual
3. Compara con la configuración en Google Cloud Console

### Solución 3: Habilitar API Manualmente
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **APIs y servicios** > **Biblioteca**
4. Busca "Google Photos Library API"
5. Haz clic en **Habilitar**

### Solución 4: Verificar Facturación
1. Ve a **Facturación** en Google Cloud Console
2. Asegúrate de que tu proyecto tenga facturación habilitado
3. Algunas APIs requieren facturación activa

## Verificación

### Usar Botones de Debug
1. **Debug Avanzado**: Muestra estado de autenticación y prueba la API
2. **Verificar Config**: Muestra configuración del proyecto y tokens

### Verificar en Consola
Los logs mostrarán:
- Estado de autenticación
- Tokens disponibles
- Errores específicos de la API
- Configuración del proyecto

## Pasos de Resolución Recomendados

1. **Primero**: Usa "Verificar Config" para diagnosticar
2. **Segundo**: Si la API no está habilitada, habilítala en Google Cloud Console
3. **Tercero**: Usa "Forzar Nueva Auth" para obtener consentimiento explícito
4. **Cuarto**: Usa "Debug Avanzado" para verificar que todo funcione

## Contacto
Si el problema persiste después de seguir estos pasos, verifica:
- Los logs de la consola del navegador
- La configuración en Google Cloud Console
- Que el proyecto tenga todas las APIs necesarias habilitadas

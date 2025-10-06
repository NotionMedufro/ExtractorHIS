# 🔄 Sistema de Sincronización Inteligente

Este sistema permite mantener una base de datos local persistente que se sincroniza inteligentemente con Notion, actualizando solo los registros que han cambiado.

## 🌟 Características Principales

- **📚 Base de datos local**: Los datos se guardan en `data/resumenes-database.json`
- **🔄 Sincronización incremental**: Solo actualiza registros modificados
- **📴 Funcionamiento offline**: Funciona sin conexión usando datos locales
- **⚡ Detección automática**: Identifica cambios por fecha de última edición
- **💾 Backup automático**: Guarda copia en localStorage como respaldo
- **🖱️ Sincronización manual**: Botón en la interfaz para forzar sincronización

## 📁 Estructura de Archivos

```
extractor-medico-web/
├── data/
│   └── resumenes-database.json     # Base de datos local
├── sync-manager.js                 # Sistema de sincronización web
├── sync.js                         # Script de sincronización CLI  
├── notion-config.js                # Configuración de Notion API
├── resumenes-clinicos.html         # Página web principal
├── resumenes-styles.css            # Estilos CSS
└── resumenes-script.js             # Lógica JavaScript principal
```

## 🚀 Uso de la Aplicación Web

### Carga Automática
La aplicación web carga automáticamente:
1. **Datos locales primero** (carga instantánea)
2. **Verifica si necesita sincronizar** (>6 horas desde última sync)
3. **Sincroniza solo cambios** si es necesario

### Sincronización Manual
Haz clic en el botón **"Sincronizar"** en el header para:
- Forzar una sincronización inmediata
- Actualizar datos aunque no hayan pasado 6 horas
- Ver notificación de éxito/error

### Estados de Conexión
- **🌐 Online**: Sincroniza automáticamente
- **📴 Offline**: Usa solo datos locales
- **⚠️ Error**: Fallback a datos locales

## 🖥️ Script de Línea de Comandos

### Instalación
```bash
cd extractor-medico-web
npm install  # Si usas dependencias adicionales
```

### Comandos Disponibles

```bash
# Sincronización normal (solo si es necesario)
node sync.js

# Forzar sincronización completa
node sync.js --force

# Solo verificar cambios sin sincronizar
node sync.js --check

# Mostrar estadísticas de la base de datos
node sync.js --stats

# Mostrar ayuda
node sync.js --help
```

### Ejemplo de Uso
```bash
# Configurar token (solo para producción real)
export NOTION_TOKEN=secret_tu_token_aqui

# Sincronizar
node sync.js --force
```

## ⚙️ Configuración

### Variables de Entorno
```bash
# Para producción con API real de Notion
NOTION_TOKEN=secret_tu_token_de_integracion
```

### Configuración de Sincronización
En `sync-manager.js`:
```javascript
// Intervalo de sincronización automática
const hoursElapsed = (now - lastSync) / (1000 * 60 * 60);
return hoursElapsed > 6; // Cambiar aquí las horas
```

## 📊 Lógica de Sincronización

### Proceso Inteligente
1. **Cargar base de datos local**
2. **Obtener todos los registros de Notion**
3. **Comparar fechas** de `lastEdited`
4. **Identificar cambios**:
   - ➕ **Nuevos**: No existen localmente
   - 🔄 **Actualizados**: Fecha más reciente en Notion
   - ✨ **Sin cambios**: Mantener versión local
   - 🗑️ **Eliminados**: Existen localmente pero no en Notion

### Ejemplo de Log de Sincronización
```
🔄 Iniciando sincronización con Notion...
📥 Recibidos 25 registros de Notion
➕ Nuevo registro: Diabetes Mellitus
🔄 Actualizado: Influenza
✅ Sincronización completada:
   📊 Total de registros: 25
   ➕ Nuevos: 1
   🔄 Actualizados: 1
   ✨ Sin cambios: 23
   🗑️ Eliminados: 0
```

## 💾 Formato de Base de Datos

### `data/resumenes-database.json`
```json
{
  "metadata": {
    "lastSync": "2025-01-04T15:30:00.000Z",
    "version": "1.0.0",
    "totalRecords": 6
  },
  "records": [
    {
      "id": "1",
      "lastEdited": "2025-01-04T15:30:00.000Z",
      "title": "Influenza",
      "definicion": "Enfermedad respiratoria viral...",
      "epidemiologia": "Epidemia estacional...",
      "etiopatogenia": "Virus Influenza A, B y C...",
      "clinica": "Inicio abrupto: fiebre...",
      "clasificacion": "Tipo A: H1N1, H3N2...",
      "diagnostico": "Clínico en contexto...",
      "manejo": "Oseltamivir si <48h...",
      "diferenciales": "COVID-19, rinovirus...",
      "extra": "",
      "ramos": ["Medicina Interna"],
      "grupos": ["Infectología"]
    }
  ]
}
```

## 🔧 Desarrollo y Testing

### Modo Desarrollo
- **Datos simulados**: Se usan automáticamente si no hay token
- **Sin delay**: Carga casi instantánea para testing
- **Logs detallados**: Console logs para debugging

### Modo Producción
- **API real de Notion**: Con token válido
- **Manejo de errores**: Fallback a datos locales
- **Rate limiting**: Respeta límites de Notion API

## 🛠️ Personalización

### Cambiar Frecuencia de Sincronización
```javascript
// En sync-manager.js, método shouldSync()
return hoursElapsed > 12; // Cambiar de 6 a 12 horas
```

### Agregar Nuevos Campos
1. Actualizar `transformNotionData()` en `notion-config.js`
2. Actualizar estructura JSON en base de datos
3. Actualizar UI para mostrar nuevos campos

### Configurar Notificaciones
```javascript
// En resumenes-script.js, método showTemporaryMessage()
// Cambiar duración, colores, posición, etc.
```

## 🐛 Solución de Problemas

### Error: "Base de datos no encontrada"
```bash
# Verificar que existe el directorio
mkdir -p data

# El archivo se creará automáticamente en primera sincronización
```

### Error: "NOTION_TOKEN no configurado"
```bash
# Para desarrollo (usa datos simulados)
node sync.js --force  # Funciona sin token

# Para producción
export NOTION_TOKEN=tu_token_real
node sync.js --force
```

### Datos no se actualizan en web
```javascript
// Revisar consola del navegador
// Verificar que SyncManager esté cargado
console.log(window.syncManager);

// Forzar limpieza de cache
localStorage.clear();
location.reload();
```

### Sincronización lenta
- Verificar conexión a internet
- Revisar que no haya muchos registros sin cambios
- Considerar aumentar intervalo de sincronización automática

## 📈 Estadísticas y Monitoreo

### En la Web
- **Header**: Total de patologías y última actualización
- **Botón de sync**: Estado visual de sincronización
- **Notificaciones**: Mensajes de éxito/error temporales

### En CLI
```bash
# Ver estadísticas completas
node sync.js --stats

# Salida ejemplo:
# 📊 Estadísticas de la Base de Datos
# 📚 Total de registros: 25
# 🏥 Ramos: 3 (Medicina Interna, Pediatría, Cirugía)
# 🏷️ Grupos: 5 (Infectología, Cardiología, Reumatología, ...)
# 🕐 Última sincronización: 04/01/2025 15:30:00 (hace 2 horas)
```

## 🚀 Próximas Mejoras

- [ ] **Sincronización en tiempo real** con WebSockets
- [ ] **Compression** de datos para localStorage
- [ ] **Versionado** de registros para historial
- [ ] **Sincronización bidireccional** (editar desde web)
- [ ] **API propia** para multiple clientes
- [ ] **Notificaciones push** para cambios importantes
- [ ] **Backup automático** a múltiples ubicaciones

---

**💡 Tip**: Para máximo rendimiento, programa sincronizaciones automáticas usando cron jobs:

```bash
# Sincronizar cada 6 horas
0 */6 * * * cd /ruta/a/proyecto && node sync.js
```

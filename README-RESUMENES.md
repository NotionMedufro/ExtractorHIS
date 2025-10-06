# 📚 Resúmenes Clínicos - MedUfro

Una aplicación web moderna para visualizar y explorar resúmenes clínicos sincronizados desde Notion.

## 🌟 Características

- **🔍 Búsqueda avanzada**: Busca por patologías, definiciones, síntomas y más
- **🏷️ Filtros inteligentes**: Filtra por ramos, categorías y contenido disponible
- **📱 Diseño responsivo**: Optimizado para desktop, tablet y móvil
- **🎯 Modal detallado**: Vista completa con navegación por secciones
- **⚡ Carga rápida**: Datos simulados para desarrollo, API real para producción
- **🎨 Interfaz moderna**: Diseño médico profesional con animaciones suaves

## 📋 Estructura de Datos

La aplicación maneja los siguientes campos de cada patología:

- **Información básica**: Título, definición
- **Contexto médico**: Epidemiología, etiopatogenia
- **Aspectos clínicos**: Clínica, clasificación
- **Diagnóstico**: Estudios y métodos diagnósticos  
- **Tratamiento**: Manejo terapéutico
- **Diagnósticos diferenciales**: Patologías similares
- **Metadatos**: Ramos, grupos por reparto

## 🚀 Instalación y Uso

### 1. Archivos principales

```
resumenes-clinicos.html    # Página principal
resumenes-styles.css       # Estilos CSS
resumenes-script.js        # Lógica JavaScript
notion-config.js           # Configuración de Notion API
```

### 2. Modo desarrollo

1. Abre `resumenes-clinicos.html` en tu navegador
2. La aplicación cargará datos simulados automáticamente
3. Explora las funcionalidades de búsqueda y filtros

### 3. Integración con Notion (Producción)

#### Paso 1: Crear integración en Notion
```
1. Ve a https://www.notion.so/my-integrations
2. Clic en "Create new integration"
3. Asigna un nombre (ej: "ResumenesMedicos")
4. Selecciona tu workspace
5. Copia el "Internal Integration Token"
```

#### Paso 2: Dar permisos a la base de datos
```
1. Ve a tu base de datos de Notion
2. Clic en "Share" (esquina superior derecha)  
3. Invita tu integración con permisos de lectura
```

#### Paso 3: Configurar servidor proxy (Recomendado)
```javascript
// Ejemplo servidor Node.js/Express
const express = require('express');
const { Client } = require('@notionhq/client');

const app = express();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

app.post('/api/notion/database/:id/query', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: req.params.id,
      ...req.body
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🎨 Personalización

### Colores y temas
```css
:root {
  --primary-color: #2563eb;      /* Azul principal */
  --medical-red: #dc2626;        /* Rojo médico */
  --medical-green: #16a34a;      /* Verde médico */
  --accent-color: #0f766e;       /* Color acento */
}
```

### Agregar nuevos filtros
```javascript
// En populateFilters()
const especialidades = [...new Set(
  appState.data.flatMap(item => item.especialidades)
)];

especialidades.forEach(especialidad => {
  // Crear botones de filtro
});
```

## 📱 Funcionalidades

### Búsqueda
- **Tiempo real**: Búsqueda instantánea mientras escribes
- **Múltiples campos**: Busca en título, definición, clínica, etc.
- **No sensible a mayúsculas**: Busca sin preocuparte por mayúsculas/minúsculas

### Filtros
- **Por ramo**: Medicina Interna, Pediatría, Cirugía, etc.
- **Por categoría**: Infectología, Cardiología, Reumatología, etc.
- **Por contenido**: Solo elementos con definición, clínica o manejo

### Modal de detalles
- **Navegación por pestañas**: 8 secciones organizadas
- **Información completa**: Todo el contenido disponible
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 🔧 Configuración avanzada

### Variables de entorno (Producción)
```bash
NOTION_TOKEN=secret_tu_token_aqui
DATABASE_ID=25d92775959a80cf9a21de989fafb5a7
NODE_ENV=production
```

### Optimizaciones
```javascript
// Service Worker para cache (opcional)
// sw.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/notion')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
```

## 🐛 Troubleshooting

### Problemas comunes

**1. Los datos no cargan**
- Verifica que el ID de base de datos sea correcto
- Asegúrate de que la integración tenga permisos
- Revisa la consola del navegador para errores

**2. Filtros no funcionan**
- Verifica que los nombres de los campos coincidan
- Revisa que los datos tengan la estructura correcta

**3. Modal no abre**
- Asegúrate de que el JavaScript se cargue correctamente
- Verifica que no haya errores de JavaScript en consola

### Logs útiles
```javascript
// Ver estado de la aplicación
console.log(window.appState);

// Ver datos cargados
console.log(window.appState.data);

// Ver filtros aplicados
console.log(window.appState.filters);
```

## 🔒 Seguridad

**⚠️ IMPORTANTE**: Nunca expongas tu token de Notion en el frontend

### Buenas prácticas
- Usa un servidor proxy para las llamadas a Notion API
- Implementa rate limiting en tu servidor
- Valida y sanitiza todos los datos de entrada
- Usa HTTPS en producción

## 📈 Próximas mejoras

- [ ] Vista de lista completa
- [ ] Exportar a PDF
- [ ] Favoritos del usuario
- [ ] Modo offline con cache
- [ ] Búsqueda por voz
- [ ] Temas personalizables
- [ ] Estadísticas de uso
- [ ] Sincronización automática

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍⚕️ Autor

**MedUfro Team**
- 🩺 Enfoque médico especializado
- 📚 Base de conocimientos curada
- 🔬 Datos verificados por profesionales

---

**⚡ Tip**: Para una mejor experiencia, usa la aplicación en una pantalla de al menos 1024px de ancho para aprovechar todas las funcionalidades.

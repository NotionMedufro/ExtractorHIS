# Extensión CSS Modifier para Chrome

Esta extensión permite modificar el CSS de la página `http://10.6.84.181/` de forma dinámica.

## 🚀 Características

- **Modificación automática**: Aplica estilos CSS personalizados automáticamente al cargar la página
- **Interfaz de control**: Panel popup para controlar la extensión
- **Personalizaciones rápidas**: Cambio de colores de fondo y texto
- **CSS personalizado**: Permite escribir y aplicar CSS personalizado
- **Botón flotante**: Botón en la página para activar/desactivar estilos adicionales
- **Persistencia**: Guarda las configuraciones entre sesiones

## 📦 Instalación

### Método 1: Modo desarrollador (Recomendado)

1. **Abre Chrome** y navega a `chrome://extensions/`

2. **Activa el modo desarrollador** en la esquina superior derecha

3. **Carga la extensión**:
   - Haz clic en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta `chrome-extension` que contiene todos los archivos

4. **Verifica la instalación**:
   - La extensión aparecerá en la lista
   - Verás el ícono en la barra de herramientas de Chrome

### Método 2: Empaquetado (Opcional)

```bash
# En Chrome, ve a chrome://extensions/
# Activa el modo desarrollador
# Haz clic en "Empaquetar extensión"
# Selecciona la carpeta chrome-extension como directorio raíz
```

## 🎯 Uso

### 1. Navegación
- Navega a `http://10.6.84.181/`
- La extensión se activará automáticamente
- Verás una barra roja en la parte superior indicando que la extensión está activa
- Aparecerá un botón flotante 🎨 en la esquina inferior derecha

### 2. Panel de Control
- Haz clic en el ícono de la extensión en la barra de herramientas
- Se abrirá un panel con las siguientes opciones:

#### Controles Rápidos
- **Activar/Desactivar Estilos**: Alterna los estilos CSS de la página
- **Restablecer Estilos**: Vuelve a los estilos originales
- **Recargar Página**: Recarga la página actual

#### Personalización
- **Color de fondo**: Selector de color para el fondo de la página
- **Color de texto**: Selector de color para el texto
- **Aplicar Colores**: Aplica los colores seleccionados

#### CSS Personalizado
- **Área de texto**: Escribe CSS personalizado
- **Aplicar CSS**: Aplica el CSS escrito

### 3. Botón Flotante
- Haz clic en el botón flotante 🎨 para activar/desactivar estilos adicionales
- El botón tiene animaciones hover para mejor interacción

## 📁 Estructura de Archivos

```
chrome-extension/
├── manifest.json          # Configuración de la extensión
├── styles.css             # Estilos CSS principales
├── content.js             # Script de contenido (se ejecuta en la página)
├── popup.html             # Interfaz del panel de control
├── popup.js               # Lógica del panel de control
└── README.md              # Este archivo
```

## 🛠️ Personalización

### Modificar estilos automáticos
Edita el archivo `styles.css` para cambiar los estilos que se aplican automáticamente:

```css
/* Ejemplo: Cambiar el color de fondo */
body {
    background-color: #tu-color !important;
}

/* Ejemplo: Modificar títulos */
h1, h2, h3 {
    color: #tu-color !important;
    font-weight: bold !important;
}
```

### Agregar funcionalidad JavaScript
Edita el archivo `content.js` para agregar funcionalidad personalizada:

```javascript
// Ejemplo: Agregar un nuevo botón
function addCustomButton() {
    const button = document.createElement('button');
    button.textContent = 'Mi Botón';
    button.onclick = () => alert('¡Hola!');
    document.body.appendChild(button);
}
```

### Modificar la interfaz del popup
Edita `popup.html` y `popup.js` para personalizar el panel de control.

## 🔧 Desarrollo

### Estructura del manifest.json
```json
{
  "manifest_version": 3,
  "permissions": ["activeTab"],
  "host_permissions": ["http://10.6.84.181/*"],
  "content_scripts": [...]
}
```

### Debugging
1. **Consola de la página**: 
   - Abre DevTools (F12) en `http://10.6.84.181/`
   - Ve a la pestaña Console para ver logs de `content.js`

2. **Popup debugging**:
   - Haz clic derecho en el ícono de la extensión
   - Selecciona "Inspeccionar popup"

3. **Extensión debugging**:
   - Ve a `chrome://extensions/`
   - Haz clic en "Detalles" de tu extensión
   - Haz clic en "Inspeccionar vistas"

## ⚠️ Limitaciones

- Solo funciona en `http://10.6.84.181/*`
- Requiere permisos de pestaña activa
- Los estilos se pierden al recargar la página (excepto los automáticos)
- Algunos sitios pueden tener CSP que bloquee ciertos estilos

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Solución de Problemas

### La extensión no se carga
- Verifica que todos los archivos estén en la misma carpeta
- Asegúrate de que el `manifest.json` sea válido
- Revisa la consola de errores en `chrome://extensions/`

### Los estilos no se aplican
- Verifica que estés en `http://10.6.84.181/`
- Abre DevTools y revisa si hay errores en la consola
- Intenta recargar la extensión

### El popup no aparece
- Verifica que el ícono de la extensión esté visible
- Asegúrate de que `popup.html` y `popup.js` estén en la carpeta
- Revisa errores en la consola del popup (click derecho > Inspeccionar popup)

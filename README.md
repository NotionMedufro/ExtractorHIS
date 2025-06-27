# 🩺 Extractor de Datos Médicos

Herramienta web gratuita para extraer información específica de reportes médicos usando expresiones regulares. Basada en las fórmulas desarrolladas en Notion, ahora disponible como aplicación web de acceso libre.

## ✨ Características

- **Sin registro**: No requiere crear cuenta ni iniciar sesión
- **Completamente gratuito**: Sin costos ni limitaciones
- **Privacidad total**: Todo el procesamiento se realiza localmente en el navegador
- **Extracción automática**: Basada en regex optimizadas para reportes médicos chilenos
- **Múltiples formatos**: Extrae hemograma, función renal, hepática, coagulación, nutricional y fechas
- **Responsive**: Funciona en desktop, tablet y móvil

## 🚀 Cómo publicar la herramienta

### Opción 1: GitHub Pages (Gratuito)

1. **Crear repositorio en GitHub:**
   ```bash
   # En tu terminal
   cd extractor-medico-web
   git init
   git add .
   git commit -m "Initial commit: Medical data extractor tool"
   ```

2. **Subir a GitHub:**
   - Crear un nuevo repositorio en GitHub (ej: `extractor-medico`)
   - Seguir las instrucciones de GitHub para subir el código

3. **Activar GitHub Pages:**
   - Ir a Settings → Pages
   - Seleccionar "Deploy from a branch"
   - Elegir "main" branch y "/ (root)"
   - Tu herramienta estará disponible en: `https://tu-usuario.github.io/extractor-medico`

### Opción 2: Netlify (Gratuito)

1. **Ir a [netlify.com](https://netlify.com)**
2. **Drag & Drop:** Arrastra la carpeta `extractor-medico-web` al área de despliegue
3. **Tu herramienta estará disponible inmediatamente** en una URL como: `https://nombre-aleatorio.netlify.app`
4. **Opcional:** Cambiar el nombre del sitio en Site settings → Change site name

### Opción 3: Vercel (Gratuito)

1. **Ir a [vercel.com](https://vercel.com)**
2. **Import Project:** Conectar con GitHub o subir archivos directamente
3. **Deploy:** La herramienta se publicará automáticamente
4. **URL disponible:** `https://tu-proyecto.vercel.app`

### Opción 4: Surge.sh (Gratuito)

```bash
# Instalar surge globalmente
npm install -g surge

# Navegar a la carpeta del proyecto
cd extractor-medico-web

# Publicar
surge

# Seguir las instrucciones para elegir dominio
```

## 📁 Estructura del proyecto

```
extractor-medico-web/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript con regex
└── README.md           # Este archivo
```

## 🔧 Funcionalidades implementadas

### Parámetros de extracción disponibles:

1. **Hemograma**: Hemoglobina, Leucocitos, Neutrófilos %, Plaquetas, PCR, Procalcitonina
2. **Renal**: Creatinina, BUN, Sodio, Potasio, Cloro
3. **Hepático**: Bilirrubina Total/Directa, GOT/GPT, Fosfatasa Alcalina, GGT
4. **Coagulación**: INR, PT, PTT
5. **Nutricional**: Proteínas, Albúmina, Prealbúmina
6. **Fecha**: Fecha de toma de muestra
7. **Tal cual**: Texto completo sin procesar

### Características técnicas:

- **Regex optimizadas** basadas en las fórmulas de Notion
- **Manejo de asteriscos** para valores fuera de rango
- **Formato de salida** idéntico al de Notion
- **Detección automática** de diferentes formatos de laboratorio
- **Interfaz intuitiva** con selección múltiple
- **Botones de utilidad**: Copiar, descargar, cargar ejemplo

## 🎯 Ejemplo de uso

1. **Selecciona los parámetros** que quieres extraer (ej: Hemograma, Renal, Hepático)
2. **Pega el texto del reporte** médico en el área de texto
3. **Haz clic en "Extraer Datos"**
4. **Obtén el resultado** formateado listo para usar

### Resultado esperado:
```
Hb: *11.1, GB: *15.890 (N: 73%), Plq: *512.000, PCR: *32.1, Proca: 0.05, 
Crea: 1.18, BUN: *24.7, Na: *149, K: 4.9, Cl: *108, 
BiliT/D: 0.17/0.08, GOT/GPT: *39/*54, FA: *188, GGT: *131
```

## ⚠️ Importante

- Los resultados deben ser validados por profesionales médicos calificados
- Esta herramienta es para apoyo en la transcripción, no para diagnóstico
- Todo el procesamiento se realiza localmente, no se envían datos a servidores

## 🔒 Privacidad

- **Sin tracking**: No se recopilan datos de usuarios
- **Sin cookies**: No se utilizan cookies de seguimiento
- **Procesamiento local**: Todo se ejecuta en el navegador del usuario
- **Sin almacenamiento**: Los datos no se guardan en servidores

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones modernas)
- ✅ Dispositivos móviles (iOS/Android)
- ✅ Tabletas
- ✅ Desktop (Windows, Mac, Linux)

## 🆘 Soporte

Si encuentras algún problema o tienes sugerencias:

1. **Regex no funciona**: Verificar el formato del texto de entrada
2. **Datos no extraídos**: Asegurarse de que los nombres de pruebas coincidan
3. **Mejoras**: Las regex se pueden ajustar en `script.js`

---

## 🚀 ¡Tu herramienta está lista!

Una vez que publiques usando cualquiera de las opciones anteriores, tendrás una herramienta web profesional y gratuita, accesible desde cualquier dispositivo con internet, sin necesidad de cuentas o registro.

**¡Perfecto para compartir con colegas y usar en el trabajo diario!**

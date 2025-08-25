# 📊 Dashboard Médico - Visualización de Exámenes

Herramienta web interactiva para visualizar y analizar datos de exámenes médicos en formato tabular, con un diseño similar a dashboards hospitalarios profesionales.

## 🚀 Características Principales

### ✨ Funcionalidades

- **🔄 Procesamiento Automático**: Pega datos tabulares y se procesan automáticamente
- **📈 Métricas en Tiempo Real**: Indicadores clave como parámetros totales, días de seguimiento y valores críticos
- **📊 Gráficos Interactivos**: Visualización de tendencias con gráficos de línea SVG
- **⚠️ Alertas Críticas**: Identificación automática de valores fuera de rango (↑ ↓)
- **📋 Tabla Detallada**: Vista completa de todos los datos por fecha con códigos de color
- **💾 Exportación**: Descarga de datos en formato CSV
- **📱 Responsive**: Funciona en desktop, tablet y móvil
- **🌓 Tema Oscuro**: Interfaz moderna con tema oscuro profesional
- **🌐 Google Sheets**: Carga datos directamente desde hojas de cálculo públicas de Google
- **🔗 Enlaces Dinámicos**: Conecta con Google Sheets para datos siempre actualizados

### 🎨 Diseño Visual

Inspirado en dashboards hospitalarios reales con:
- Métricas destacadas con iconos y mini-gráficos
- Código de colores para valores normales/anormales
- Gráficos de tendencias para parámetros clave
- Tabla scrollable con columnas fijas
- Notificaciones y estados de loading

## 📁 Archivos del Proyecto

```
dashboard-médico/
├── dashboard.html           # Página principal
├── dashboard-styles.css     # Estilos CSS (tema oscuro)
├── dashboard-main.js        # Lógica principal de la aplicación
├── dashboard-components.js  # Componentes de visualización
├── dashboard-types.js       # Estructuras de datos
├── medical-parser.js        # Parser de datos médicos
└── README-DASHBOARD.md      # Este archivo
```

## 🔧 Cómo Usar

### 1. Abrir el Dashboard
```bash
# Abre el archivo en tu navegador
open dashboard.html
```

### 2. Ingresar Datos Médicos

**Formato Esperado:**
```
Exámenes	29/07/2025	30/07/2025	31/07/2025	01/08/2025
Leucocitos (10³/uL)	-	03.01	3.42	3.79 ↓
Hemoglobina (g/dL)	-	12.2	12.9	11.30 ↓
Creatinina (mg/dL)	1.42	1.72	2.00	2.41 ↑
PCR	-	-	-	6.75 ↑
```

**Instrucciones:**
1. Copia los datos desde Excel, PDF o cualquier fuente tabular
2. Pégalos en el área de texto del dashboard
3. Los datos se procesarán automáticamente
4. O haz clic en "Procesar Datos" manualmente

### 3. Cargar desde Google Sheets 🆕

#### Configurar Google Sheets:
1. **Crear/abrir tu hoja de cálculo** en Google Sheets
2. **Organizar los datos** con el formato médico:
   - Primera fila: fechas (29/07/2025, 30/07/2025, etc.)
   - Primera columna: nombres de parámetros (Leucocitos, Hemoglobina, etc.)
   - Celdas: valores con símbolos ↑ ↓ para valores anormales
3. **Hacer la hoja pública**:
   - Clic en "Compartir" (esquina superior derecha)
   - Cambiar a "Cualquier persona con el enlace puede ver"
   - Copiar el enlace

#### Usar en el Dashboard:
1. **Expandir la sección** "Cargar desde Google Sheets"
2. **Pegar el enlace** de tu hoja pública
3. **Hacer clic en "Cargar"**
4. Los datos se importarán y procesarán automáticamente

#### Formatos de enlace aceptados:
```
https://docs.google.com/spreadsheets/d/ID_DE_LA_HOJA/edit#gid=0
ID_DE_LA_HOJA
```

#### Ventajas de usar Google Sheets:
- **Colaborativo**: Múltiples personas pueden actualizar los datos
- **Tiempo Real**: Los cambios se reflejan inmediatamente
- **Accesible**: Disponible desde cualquier dispositivo
- **Historial**: Google Sheets guarda versiones automáticamente

### 4. Cargar Datos de Ejemplo
- Haz clic en **"Cargar Ejemplo"** para ver el dashboard en acción
- Se cargarán datos médicos reales de muestra

### 4. Interpretar el Dashboard

#### Métricas Principales
- **PARÁMETROS**: Número total de exámenes analizados
- **TIEMPO PROMEDIO**: Días de seguimiento
- **VALORES CRÍTICOS**: Número de parámetros fuera de rango

#### Gráfico de Tendencias
- Muestra la evolución de los parámetros más importantes
- Se priorizan automáticamente los valores críticos
- Colores diferentes para cada parámetro

#### Parámetros Críticos
- Lista de valores anormales (marcados con ↑ ↓)
- Incluye tendencia (subiendo/bajando/estable)
- Se actualiza en tiempo real

#### Tabla Detallada
- Vista completa de todos los datos
- Código de colores: rojo para anormales, blanco para normales
- Scroll horizontal para muchas fechas
- Columna de estado con iconos

### 5. Exportar Datos
- Haz clic en **"Exportar"** para descargar un archivo CSV
- Incluye todos los datos procesados con estado de normalidad

## 🎯 Casos de Uso

### Para Médicos y Profesionales de Salud
- **Seguimiento de Pacientes**: Visualizar evolución de exámenes a lo largo del tiempo
- **Detección Rápida**: Identificar inmediatamente valores críticos
- **Análisis de Tendencias**: Ver si los parámetros mejoran o empeoran
- **Reportes**: Exportar datos para informes médicos

### Para Pacientes
- **Automonitoreo**: Entender la evolución de sus propios exámenes
- **Preparación para Consultas**: Llevar visualizaciones claras al médico
- **Seguimiento de Tratamientos**: Ver el impacto de medicamentos o terapias

### Para Instituciones Médicas
- **Dashboard Hospitalario**: Monitoreo de múltiples pacientes
- **Análisis Epidemiológico**: Tendencias en poblaciones
- **Calidad de Atención**: Seguimiento de indicadores clave

## 🧪 Datos Soportados

### Formatos de Fecha Compatibles
- `DD/MM/YYYY` (preferido)
- `DD/MM/YY`
- `YYYY-MM-DD`
- `DD-MM-YYYY`
- Con sufijos: `29/07/2025 AM`, `30/07/2025 PM`, `31/07/2025 MN`

### Tipos de Parámetros
- **Hemograma**: Leucocitos, Hemoglobina, Hematocrito, Plaquetas, etc.
- **Función Renal**: Creatinina, BUN, VFG, Electrolitos
- **Función Hepática**: Bilirrubinas, Transaminasas, Fosfatasa Alcalina
- **Inflamación**: PCR, VHS, Procalcitonina
- **Coagulación**: INR, PT, PTT
- **Gases Arteriales**: pH, pO2, pCO2, HCO3
- **Y muchos más**: Cualquier parámetro numérico con fechas

### Indicadores de Anormalidad
El sistema detecta automáticamente valores anormales usando:
- **↑** Valores elevados
- **↓** Valores disminuidos
- **Asteriscos** `*` para valores críticos

## 🔧 Personalización

### Modificar Colores
Edita las variables CSS en `dashboard-styles.css`:
```css
:root {
    --primary-color: #4a90a4;     /* Color principal */
    --error-color: #f44336;       /* Color para valores críticos */
    --success-color: #4caf50;     /* Color para valores normales */
    --bg-primary: #1a2332;        /* Fondo principal */
}
```

### Agregar Nuevos Parámetros
Modifica el parser en `medical-parser.js` para manejar formatos específicos.

### Cambiar Métricas
Edita `dashboard-components.js` para personalizar las métricas mostradas.

## 🔍 Solución de Problemas

### ❌ "Formato de datos no reconocido"
- **Causa**: Los datos no tienen el formato tabular esperado
- **Solución**: Asegúrate de que la primera fila tenga fechas válidas y las siguientes tengan parámetros con valores

### ❌ "No se encontraron fechas válidas"
- **Causa**: Las fechas no están en formato reconocido
- **Solución**: Usa formato DD/MM/YYYY o similar

### ❌ "Datos insuficientes"
- **Causa**: Muy poca información en el input
- **Solución**: Incluye al menos 2-3 filas de datos con fechas

### ⚠️ Pocos parámetros críticos detectados
- **Causa**: Los símbolos ↑ ↓ no están presentes en los datos
- **Solución**: Agrega manualmente los símbolos a valores anormales

### 📱 Problemas en móvil
- El dashboard es responsive, pero tablas muy grandes pueden necesitar scroll horizontal
- En pantallas pequeñas, algunas funcionalidades se adaptan automáticamente

## 🚀 Despliegue

### Opción 1: Local
1. Abre `dashboard.html` directamente en cualquier navegador moderno
2. No requiere servidor web para funcionar básico

### Opción 2: Web (GitHub Pages, Netlify, Vercel)
1. Sube todos los archivos a tu repositorio
2. Configura el hosting para servir `dashboard.html` como página principal
3. El dashboard funcionará completamente en el navegador

### Opción 3: Integración
- Puedes integrar el dashboard en aplicaciones existentes
- Todos los módulos son independientes y reutilizables
- Compatible con frameworks como React, Vue, Angular

## 📝 Licencia y Uso

- **Uso Libre**: Puedes usar, modificar y distribuir libremente
- **Propósito Médico**: Herramienta de apoyo, NO sustituye el criterio médico
- **Sin Garantías**: Úsala bajo tu propio riesgo
- **Privacidad**: Todo el procesamiento es local, no se envían datos a servidores

## 🎉 ¡Listo para Usar!

Tu dashboard médico está completamente funcional. Solo abre `dashboard.html` en tu navegador y comienza a analizar datos médicos con una interfaz profesional y moderna.

---

**💡 Tip**: Para mejores resultados, copia los datos directamente desde Excel o PDFs médicos manteniendo la estructura tabular original.

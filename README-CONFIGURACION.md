# 🔧 Configuración del Extractor HIS

## 📋 Cómo Adaptar el Extractor a Nuevos Formatos

Cuando el formato de los reportes médicos cambie, puedes actualizar fácilmente los patrones de extracción sin tocar el código principal.

### 🎯 Archivo Principal de Configuración

**Archivo:** `extraction-patterns.js`

Este archivo contiene todos los patrones regex organizados por categorías médicas.

### 🔍 Estructura de un Patrón

```javascript
// Ejemplo actual:
hemoglobina: /Hemoglobina\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i,

// Si cambia a "Hb: 11.1 g/dL", actualizar a:
hemoglobina: /Hb:\s*(\d+\.?\d*)\s+g\/dL/i,
```

### 📚 Componentes de Regex

| Componente | Significado | Ejemplo |
|------------|-------------|---------|
| `\s*` | Cero o más espacios | `Hemoglobina   * 11.1` |
| `\s+` | Uno o más espacios | `11.1 g/dL` |
| `\d+` | Uno o más dígitos | `11` o `123` |
| `\.?` | Punto opcional | `11` o `11.1` |
| `\*?` | Asterisco opcional | `11.1` o `* 11.1` |
| `()` | Grupo de captura | Extrae el valor |
| `[\s\S]*?` | Cualquier carácter | Texto multi-línea |
| `/i` | Insensible a mayúsculas | `Hemoglobina` o `HEMOGLOBINA` |

### 🛠️ Pasos Para Actualizar

#### 1. **Identificar el Cambio**
Antes: `Hemoglobina * 11.1 g/dL`
Después: `HB: 11.1 g/dL`

#### 2. **Localizar el Patrón**
```javascript
// En extraction-patterns.js, sección hemograma:
hemoglobina: /Hemoglobina\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i,
```

#### 3. **Actualizar el Patrón**
```javascript
// Cambiar por:
hemoglobina: /HB:\s*(\d+\.?\d*)\s+g\/dL/i,
```

#### 4. **Probar el Cambio**
- Guarda el archivo `extraction-patterns.js`
- Recarga la página web
- Pega un texto de prueba
- Verifica que extraiga correctamente

### 📋 Ejemplos de Cambios Comunes

#### Cambio de Nombre de Examen
```javascript
// De "Hemoglobina" a "HB"
hemoglobina: /HB\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i,

// De "Proteína C Reactiva" a "PCR"
pcr: /PCR\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i,
```

#### Cambio de Unidades
```javascript
// De "mg/dL" a "mg/dl"
creatinina: /Creatinina[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dl/,

// De "10e3/uL" a "x10³/μL"
leucocitos: /Leucocitos\s*\*?\s*(\d+\.?\d*)\s+x10³\/μL/i,
```

#### Agregar Prefijos
```javascript
// Si agregan "Lab:" antes
pcr: /Lab:\s*Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i,

// Si agregan código antes: "CBC001 Hemoglobina"
hemoglobina: /CBC001\s+Hemoglobina\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i,
```

#### Cambio de Formato de Asteriscos
```javascript
// Si cambian "*" por "H" (High)
hemoglobina: /Hemoglobina\s*(H?)\s*(\d+\.?\d*)\s+g\/dL/i,

// Si cambian "*" por "↑"
hemoglobina: /Hemoglobina\s*(↑?)\s*(\d+\.?\d*)\s+g\/dL/i,
```

### 🗂️ Categorías de Patrones

#### **Hemograma**
- `hemoglobina`, `hematocrito`, `leucocitos`
- `neutrofilos_porcentaje`, `plaquetas`

#### **Función Renal**
- `creatinina`, `bun`, `urea`
- `sodio`, `potasio`, `cloro`

#### **Función Hepática**
- `bilirrubina_total`, `bilirrubina_directa`
- `got`, `gpt`, `fosfatasa_alcalina`, `ggt`

#### **PCR y Inflamación**
- `pcr`, `procalcitonina`, `vhs`

#### **Coagulación**
- `inr`, `pt`, `ptt`

#### **Nutricional**
- `proteinas`, `albumina`, `prealbumin`

#### **Gases en Sangre**
- `ph`, `pco2`, `hco3`, `saturacion_o2`

### 🚨 Casos Especiales

#### **Valores con Rangos**
```javascript
// Para valores como "11.1 [10-15]"
hemoglobina: /Hemoglobina\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL\s*\[[^\]]+\]/i,
```

#### **Múltiples Formatos**
```javascript
// Para aceptar varios formatos
hemoglobina: /(?:Hemoglobina|Hb|HGB)\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i,
```

#### **Valores con Decimales Variables**
```javascript
// Para valores como "11", "11.1", "11.12"
hemoglobina: /Hemoglobina\s*(\*?)\s*(\d+(?:\.\d+)?)\s+g\/dL/i,
```

### 🧪 Herramientas de Prueba

#### **Regex101.com**
1. Ve a [regex101.com](https://regex101.com)
2. Selecciona "JavaScript" (bandera)
3. Pega tu patrón regex
4. Pega texto de ejemplo
5. Verifica que capture correctamente

#### **Consola del Navegador**
```javascript
// Prueba un patrón directamente
const pattern = /Hemoglobina\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i;
const text = "Hemoglobina * 11.1 g/dL";
const match = text.match(pattern);
console.log(match); // Debe mostrar el resultado
```

### 🔄 Flujo de Actualización

1. **📊 Identifica** qué cambió en el formato
2. **📝 Localiza** el patrón en `extraction-patterns.js`
3. **✏️ Modifica** el regex según el nuevo formato
4. **💾 Guarda** el archivo
5. **🔄 Recarga** la página web
6. **🧪 Prueba** con texto real
7. **✅ Verifica** que funcione correctamente

### ⚠️ Precauciones

- **No toques** las secciones marcadas como "NO EDITAR"
- **Respeta** la estructura de los grupos de captura `()`
- **Prueba siempre** antes de usar en producción
- **Haz backup** antes de cambios importantes

### 🆘 Solución de Problemas

#### **El patrón no encuentra nada**
- Verifica que el texto coincida exactamente
- Revisa espacios extra o caracteres especiales
- Usa `[\s\S]*?` para texto multi-línea

#### **Extrae valores incorrectos**
- Revisa los grupos de captura `()`
- Asegúrate de capturar solo el número
- Verifica el orden de los grupos

#### **Error en la consola**
- Revisa caracteres especiales que necesiten escape
- Verifica que todas las `/` estén cerradas
- Comprueba la sintaxis de JavaScript

### 📞 Contacto

Si necesitas ayuda con patrones complejos, contacta al desarrollador con:
- El formato anterior (ejemplo)
- El formato nuevo (ejemplo)
- Qué parámetro necesitas extraer

---

*Actualizado: Enero 2025 - Versión 2.0*

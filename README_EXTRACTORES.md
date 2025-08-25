# 🩺 Guía para Editar los Extractores Médicos

Este extractor está diseñado para ser **extremadamente fácil de modificar y corregir errores**. Los archivos están separados y organizados de forma simple:

## 📁 Estructura de Archivos

```
├── patterns.js      ← Patrones de búsqueda (regex) organizados por categoría
├── extractors.js    ← Funciones de extracción simples y fáciles de leer
├── script.js        ← Lógica principal (no necesitas tocarlo)
├── index.html       ← Interfaz web
└── styles.css       ← Estilos
```

## 🔧 Cómo Corregir Errores de Extracción

### 1. Problema: "No encuentra un valor específico"

**Archivo a editar:** `patterns.js`

**Ejemplo:** Si no encuentra "Proteína C Reactiva" en un formato específico:

```javascript
// ANTES (en patterns.js, línea ~90)
pcr: [
    /PROTEINA\s+C\s+REACTIVA\s*\(?CRP\)?\s*[hi*]*\s*(\d+\.?\d*)\s+mg\/L/i,
    /Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i
],

// DESPUÉS (agregar nuevo patrón)
pcr: [
    /PROTEINA\s+C\s+REACTIVA\s*\(?CRP\)?\s*[hi*]*\s*(\d+\.?\d*)\s+mg\/L/i,
    /Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i,
    /PCR\s*:\s*(\d+\.?\d*)\s*mg\/L/i  // ← Nuevo patrón más simple
],
```

### 2. Problema: "Extrae el valor pero con formato incorrecto"

**Archivo a editar:** `extractors.js`

**Ejemplo:** Si la hemoglobina necesita formato diferente:

```javascript
// ANTES (en extractors.js, línea ~38)
const hbFormateado = parseFloat(hb).toFixed(1);
resultados.push(`Hb: ${hbFormateado}`);

// DESPUÉS (cambiar formato)
const hbFormateado = Math.round(parseFloat(hb)); // Sin decimales
resultados.push(`Hb: ${hbFormateado}`);
```

### 3. Problema: "Necesita un nuevo parámetro completamente"

**Pasos:**

1. **Agregar patrón** en `patterns.js`:
```javascript
// En la sección correspondiente (ej: renal)
renal: {
    // ... patrones existentes ...
    
    // NUEVO PATRÓN
    acido_urico: /Ácido Úrico\s*\*?\s*(\d+\.?\d*)\s*mg\/dL/i,
}
```

2. **Agregar extractor** en `extractors.js`:
```javascript
// En la función extraerRenal()
// 8. ÁCIDO ÚRICO (nuevo parámetro)
const acidoUrico = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.acido_urico);
if (acidoUrico) {
    resultados.push(`Ac.Úrico: ${acidoUrico}`);
}
```

## 🛠 Herramientas para Testing

### Probar un patrón específico:

1. Abre la consola del navegador (F12)
2. Pega tu texto de prueba:
```javascript
const textoEjemplo = "Ácido Úrico * 6.5 mg/dL";
const patron = /Ácido Úrico\s*\*?\s*(\d+\.?\d*)\s*mg\/dL/i;
const resultado = textoEjemplo.match(patron);
console.log(resultado); // Debe mostrar el valor encontrado
```

### Probar un extractor completo:

```javascript
const extractor = new SimpleExtractor();
const resultado = extractor.extraerRenal();
console.log(resultado);
```

## 📝 Patrones Regex Comunes

```javascript
// Números con decimales opcionales
(\d+\.?\d*)

// Espacios opcionales
\s*

// Asterisco opcional (valores alterados)
\*?

// Unidades comunes
mg\/dL    // mg/dL
mEq\/L    // mEq/L
g\/dL     // g/dL
U\/L      // U/L

// Palabras opcionales (hi = high, i = low)
[hi*]*
```

## 🚨 Errores Comunes y Soluciones

### Error: "Regex no funciona"
- **Causa:** Caracteres especiales sin escapar
- **Solución:** Escapar con `\` antes de: `.`, `(`, `)`, `/`, etc.

### Error: "Encuentra texto pero no el número"
- **Causa:** Los paréntesis `()` están mal ubicados
- **Solución:** Los `()` deben rodear SOLO el número que quieres extraer

### Error: "No encuentra nada"
- **Causa:** El patrón es muy específico
- **Solución:** Hacer el patrón más flexible con `\s*` y `?`

## 🔄 Proceso de Debugging

1. **Identificar el problema:** ¿No encuentra o formato incorrecto?
2. **Localizar el archivo:** `patterns.js` para búsqueda, `extractors.js` para formato
3. **Probar en consola:** Usar `console.log()` para ver qué encuentra
4. **Ajustar gradualmente:** Cambios pequeños e incrementales
5. **Probar en la web:** Recargar página y probar con texto real

## 💡 Tips para Mantener Simple

- **Un patrón por problema:** No hagas regex súper complejas
- **Comentar cambios:** Deja comentarios explicando qué hace cada patrón
- **Usar nombres descriptivos:** `hemoglobina` es mejor que `pattern1`
- **Probar con datos reales:** Siempre usar texto real del laboratorio

## 📞 Estructura de Contacto

Si encuentras un error:
1. Identifica QUÉ valor no se extrae correctamente
2. Copia el texto exacto del laboratorio 
3. Señala qué resultado esperabas
4. Modifica el archivo correspondiente siguiendo esta guía

¡El sistema está diseñado para que cualquier corrección sea rápida y directa!

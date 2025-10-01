// PATRONES DE EXTRACCIÓN MÉDICA
// Cada patrón está claramente documentado y es fácil de modificar

const EXTRACTION_PATTERNS = {
    // ============== HEMOGRAMA ==============
    hemograma: {
        // Hemoglobina: busca "Hemoglobina" seguido de números y "g/dL"
        hemoglobina: /Hemoglobina\s*\*?\s*(\d+\.?\d*)\s*g\/dL/i,
        
        // Hematocrito: busca "Hematocrito" seguido de números y "%"
        hematocrito: /Hematocrito\s*\*?\s*(\d+\.?\d*)\s*%/i,
        
        // Leucocitos: busca "Leucocitos" seguido de números y "10e3/uL"
        leucocitos: /(?:Recuento de )?Leucocitos\s*\*?\s*(\d+\.?\d*)\s*10e3\/uL/i,
        
        // Neutrófilos porcentaje: busca "Neutrófilos %" seguido de números
        neutrofilos_porcentaje: /Neutrófilos\s*%\s*\*?\s*(\d+\.?\d*)\s*%/i,
        
        // Linfocitos porcentaje: busca "Linfocitos %" seguido de números
        linfocitos_porcentaje: /Linfocitos\s*%\s*\*?\s*(\d+\.?\d*)\s*%/i,
        
        // Plaquetas: busca "Plaquetas" seguido de números y "10e3/uL"
        plaquetas: /(?:Recuento de )?Plaquetas\s*\*?\s*(\d+)\s*10e3\/uL/i
    },

    // ============== FUNCIÓN RENAL ==============
    renal: {
        // Creatinina: busca "Creatinina" seguido de números y "mg/dL"
        creatinina: /Creatinina\s*\*?\s*(\d+\.?\d*)\s*mg\/dL/i,
        
        // BUN (Nitrógeno Ureico): busca "Nitrógeno Ureico" seguido de números
        bun: /Nitrógeno Ureico\s*\*?\s*(\d+\.?\d*)\s*mg/i,
        
        // Urea: busca "Urea" seguido de números y "mg/dL"
        urea: /Urea\s*\*?\s*(\d+\.?\d*)\s*mg\/dL/i,
        
        // Sodio: busca "Sodio" seguido de números y "mEq/L"
        sodio: /Sodio\s*\*?\s*(\d+\.?\d*)\s*mEq\/L/i,
        
        // Potasio: busca "Potasio" seguido de números y "mEq/L"
        potasio: /Potasio\s*\*?\s*(\d+\.?\d*)\s*mEq\/L/i,
        
        // Cloro: busca "Cloro" seguido de números y "mEq/L"
        cloro: /Cloro\s*\*?\s*(\d+\.?\d*)\s*mEq\/L/i,
        
        // Fósforo: busca "Fósforo" seguido de números y "mg/dL"
        fosforo: /Fósforo\s*\*?\s*(\d+\.?\d*)\s*mg\/dL/i,
        
        // Calcio: busca "Calcio" seguido de números y "mg/dL"
        calcio: /Calcio\s*\*?\s*(\d+\.?\d*)\s*mg\/dL/i,
        
        // Magnesio: busca "Magnesio" seguido de números y "mg/dL"
        magnesio: /Magnesio\s*\*?\s*(\d+\.?\d*)\s*mg\/dL/i
    },

    // ============== FUNCIÓN HEPÁTICA ==============
    hepatico: {
        // Bilirrubina Total: busca "Bilirrubina Total" seguido de números
        bilirrubina_total: /(?:Bilirrubina Total|BILIRRUBINA TOTAL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        
        // Bilirrubina Directa: busca "Bilirrubina Directa" seguido de números
        bilirrubina_directa: /Bilirrubina Directa\s*\*?\s*(\d+\.?\d*)\s*mg\/dL/i,
        
        // GOT/ASAT: múltiples patrones para transaminasas
        got_asat: [
            /ASPARTATO AMINO TRANSFERASA[\s\S]*?\(ASAT\/GOT\)[\s\S]*?(\d+\.?\d*)\s*U\/L/i,
            /Transaminasa GOT\/ASAT\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /(?:GOT|ASAT)\s*\*?\s*(\d+\.?\d*)\s*U\/L/i
        ],
        
        // GPT/ALT: múltiples patrones para transaminasas
        gpt_alt: [
            /ALANINA AMINO TRANSFERASA[\s\S]*?\(ALAT\/GPT\)[\s\S]*?[hi]*\s*(\d+\.?\d*)\s*U\/L/i,
            /Transaminasa GPT\/\s?ALT\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /(?:GPT|ALT)\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
        ],
        
        // Fosfatasa Alcalina: busca "Fosfatasa Alcalina" o "FOSFATASAS ALCALINAS"
        fosfatasa_alcalina: /(?:Fosfatasa Alcalina|FOSFATASAS ALCALINAS)\s*[hi*]*\s*(\d+\.?\d*)\s*U\/L/i,
        
        // GGT: busca "Gamma Glutamiltranspeptidasa"
        ggt: /Gamma Glutamiltranspeptidasa\s*\*?\s*(\d+\.?\d*)\s*U\/L/i
    },

    // ============== NUTRICIONAL ==============
    nutricional: {
        // Proteínas: busca "Proteínas" o "PROTEINAS TOTALES"
        proteinas: /(?:Proteínas|PROTEINAS TOTALES)\s*[hi*]*\s*(\d+\.?\d*)\s*g\/dL/i,
        
        // Albúmina: busca "Albúmina" o "ALBUMINA"
        albumina: /(?:Albúmina|ALBUMINA)\s*[hi*]*\s*(\d+\.?\d*)\s*g\/dL/i,
        
        // Prealbúmina: busca "Prealbúmina"
        prealbumin: /Prealbúmina\s*\*?\s*(\d+\.?\d*)/i
    },

    // ============== PCR Y MARCADORES INFLAMATORIOS ==============
    pcr: {
        // PCR: múltiples patrones para Proteína C Reactiva
        pcr: [
            /PROTEINA\s+C\s+REACTIVA\s*\(?CRP\)?\s*[hi*]*\s*(\d+\.?\d*)\s+mg\/L/i,
            /Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i
        ],
        
        // Procalcitonina: busca "Procalcitonina"
        procalcitonina: /Procalcitonina\s*\*?\s*(\d+\.?\d*)\s+ng\/mL/i,
        
        // VHS: busca "VHS" o "Velocidad de Sedimentación"
        vhs: /(?:VHS|Velocidad\s+de\s+Sedimentación)\s*\*?\s*(\d+\.?\d*)\s*mm\/hr?/i
    },

    // ============== COAGULACIÓN ==============
    coagulacion: {
        // INR: busca "INR" seguido de números
        inr: /INR[\s\S]{0,20}(\d+\.?\d*)/i,
        
        // Tiempo de Protrombina: busca "Tiempo de Protrombina"
        tiempo_protrombina: /Tiempo de Protrombina[\s\S]*?(\d+\.?\d*)\s+seg/i,
        
        // TTPA: busca "TTPA"
        ttpa: /TTPA[\s\S]*?(\d+\.?\d*)\s+seg/i
    },

    // ============== GASES EN SANGRE ==============
    gases: {
        // pH: busca "pH"
        ph: /pH[\s\S]*?(\d+\.?\d*)/i,
        
        // PCO2: busca "PCO2"
        pco2: /PCO2[\s\S]*?(\d+\.?\d*)\s+mmHg/i,
        
        // HCO3: busca "HCO3"
        hco3: /HCO3[\s\S]*?(\d+\.?\d*)\s+mmol\/L/i,
        
        // Saturación de O2: busca "Saturación O2"
        saturacion_o2: /%\s+Saturación\s+O2[\s\S]*?(\d+\.?\d*)\s+%/i
    },

    // ============== FECHAS ==============
    fechas: {
        // Múltiples patrones para extraer fechas
        patrones: [
            /Recepcion\s+muestra\s*:\s*(\d{2}[-\/]\d{2}[-\/]\d{4})/i,        // "Recepcion muestra: dd/mm/yyyy" o "Recepcion muestra: dd-mm-yyyy"
            /Fecha\s+(\d{2}\/\d{2}\/\d{4})/i,                              // "Fecha dd/mm/yyyy"
            /Toma Muestra:\s*(\d{2}\/\d{2}\/\d{4})/i,                      // "Toma Muestra: dd/mm/yyyy"
            /Fecha\/Hora de T\. muestra\s*:\s*(\d{2}\/\d{2}\/\d{4})/i,     // "Fecha/Hora de T. muestra : dd/mm/yyyy"
            /^(\d{2}\/\d{2}\/\d{4})/m,                                     // Fecha al inicio de línea
            /(\d{2}\/\d{2}\/\d{4})/                                        // Cualquier fecha dd/mm/yyyy
        ]
    }
};

// Función auxiliar para buscar con múltiples patrones
function buscarConPatrones(texto, patrones) {
    // Si es un solo patrón, convertirlo a array
    if (patrones instanceof RegExp) {
        patrones = [patrones];
    }
    
    // Probar cada patrón hasta encontrar una coincidencia
    for (let patron of patrones) {
        let coincidencia = texto.match(patron);
        if (coincidencia) {
            return coincidencia;
        }
    }
    
    return null; // No se encontró ninguna coincidencia
}

// Función simple para extraer un valor usando un patrón
function extraerValor(texto, patron) {
    let coincidencia = buscarConPatrones(texto, patron);
    return coincidencia ? coincidencia[1] : null;
}

// Exportar para uso en script.js
window.EXTRACTION_PATTERNS = EXTRACTION_PATTERNS;
window.buscarConPatrones = buscarConPatrones;
window.extraerValor = extraerValor;

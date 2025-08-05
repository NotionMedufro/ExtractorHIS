// ===============================================================
// CONFIGURACIÓN DE PATRONES DE EXTRACCIÓN
// ===============================================================
// Este archivo contiene todos los patrones regex que usa el extractor.
// Cuando cambie el formato de los reportes médicos, puedes editar
// estos patrones sin tocar el código principal.

const EXTRACTION_PATTERNS = {
    
    // ====== HEMOGRAMA ======
    hemograma: {
        // Hemoglobina - NUEVO FORMATO: "HEMOGLOBINA 10.00 g/dL"
        hemoglobina: /HEMOGLOBINA\s+[hi]?\s*(\d+\.?\d*)\s+g\/dL/i,
        
        // Hematocrito - NUEVO FORMATO: "HEMATOCRITO 30.00 %"
        hematocrito: /HEMATOCRITO\s+[hi]?\s*(\d+\.?\d*)\s*%/i,
        
        // Leucocitos - NUEVO FORMATO: "RECUENTO DE LEUCOCITOS 5.81 10^3/uL" o "RECUENTO DE LEUCOCITOS i 5.81 10^3/uL"
       leucocitos: /RECUENTO DE LEUCOCITOS\s+(?:[hi]\s+)?(\d+\.?\d*)\s+(?:10\^3|10e3)\/uL/i,
        
        // Neutrófilos % - NUEVO FORMATO: "NEUTROFILOS % 34.90 %"
        neutrofilos_porcentaje: /NEUTROFILOS\s*%\s+([hi]?\s*\d+\.?\d*)\s*%/i,
        
        // Linfocitos % - NUEVO FORMATO: "LINFOCITOS % 52.00 %"
        linfocitos_porcentaje: /LINFOCITOS\s*%\s+([hi]?\s*\d+\.?\d*)\s*%/i,
        
        // Plaquetas - NUEVO FORMATO: "RECUENTO DE PLAQUETAS 424 10^3/uL" o "RECUENTO DE PLAQUETAS h 424 10^3/uL"
       plaquetas: /RECUENTO DE PLAQUETAS\s+(?:[hi]\s+)?(\d+)\s+(?:10\^3|10e3)\/uL/i,
        
        // Neutrófilos absolutos - NUEVO FORMATO: "NEUTROFILOS 2.02 10^3/uL"
       neutrofilos_absolutos: /^NEUTROFILOS\s+([hi]?\s*\d+\.?\d*)\s+(?:10\^3|10e3)\/uL/im,
        
        // Linfocitos absolutos - NUEVO FORMATO: "LINFOCITOS 3.02 10^3/uL"
       linfocitos_absolutos: /^LINFOCITOS\s+([hi]?\s*\d+\.?\d*)\s+(?:10\^3|10e3)\/uL/im
    },
    
    // ====== PARÁMETROS ADICIONALES HEMOGRAMA ======
    hemograma_extra: {
        // VCM - NUEVO FORMATO: "VCM- VOLUMEN CORPUSCULAR MEDIO 95.70 fL"
        vcm: /VCM-\s*VOLUMEN CORPUSCULAR MEDIO\s+([hi]?\s*\d+\.?\d*)\s*fL/i,
        
        // CHCM - NUEVO FORMATO: "CHCM - CONC. Hb CORPUSCULAR MEDIA 33.30 g/dL"
        chcm: /CHCM\s*-\s*CONC\. Hb CORPUSCULAR MEDIA\s+([hi]?\s*\d+\.?\d*)\s*g\/dL/i,
        
        // RDW - NUEVO FORMATO: "RDW 14.90 %"
        rdw: /^RDW\s+([hi]?\s*\d+\.?\d*)\s*%/im,
        
        // Reticulocitos - Buscar patrón: "Reticulocitos * 2.5 %" (sin cambios detectados)
        reticulocitos: /Reticulocitos\s*\*?\s*(\d+\.?\d*)\s*%/i
    },
    
    // ====== FUNCIÓN RENAL ======
    renal: {
        // Creatinina - NUEVO FORMATO: "CREATININA 1.04 mg/dL"
        creatinina: /CREATININA\s+([hi]?\s*\d+\.?\d*)\s+mg\/dL/i,
        
        // BUN (Nitrógeno Ureico) - NUEVO FORMATO: "NITROGENO UREICO (BUN) 14.2 mg%"
        bun: /NITROGENO UREICO \(BUN\)\s+([hi]?\s*\d+\.?\d*)\s+mg%/i,
        
        // Urea - NUEVO FORMATO: "UREA 30.40 mg/dL"
        urea: /^UREA\s+([hi]?\s*\d+\.?\d*)\s+mg\/dL/im,
        
        // Sodio - NUEVO FORMATO: "ELECTROLITO SODIO 137.40 mEq/L"
        sodio: /ELECTROLITO SODIO\s+([hi]?\s*\d+\.?\d*)\s+mEq\/L/i,
        
        // Potasio - NUEVO FORMATO: "ELECTROLITO POTASIO 4.54 mEq/L"
        potasio: /ELECTROLITO POTASIO\s+([hi]?\s*\d+\.?\d*)\s+mEq\/L/i,
        
        // Cloro - NUEVO FORMATO: "ELECTROLITO CLORO 100.80 mEq/L"
        cloro: /ELECTROLITO CLORO\s+([hi]?\s*\d+\.?\d*)\s+mEq\/L/i,
        
        // Fósforo - NUEVO FORMATO: "FOSFORO SERICO 3.47 mg/dL"
        fosforo: /FOSFORO SERICO\s+([hi]?\s*\d+\.?\d*)\s+mg\/dL/i,
        
        // Calcio - NUEVO FORMATO: "CALCIO 9.43 mg/dL"
        calcio: /^CALCIO\s+([hi]?\s*\d+\.?\d*)\s+mg\/dL/im,
        
        // Magnesio - NUEVO FORMATO: "MAGNESIO 1.76 mg/dL"
        magnesio: /^MAGNESIO\s+([hi]?\s*\d+\.?\d*)\s+mg\/dL/im
    },
    
    // ====== FUNCIÓN HEPÁTICA ======
    hepatico: {
        // Bilirrubina Total - NUEVO FORMATO: "BILIRRUBINA TOTAL 0.16 mg/dL"
        bilirrubina_total: /BILIRRUBINA TOTAL\s+([hi]?\s*\d+\.?\d*)\s+mg\/dL/i,
        
        // Bilirrubina Directa - No encontrada en nuevo formato, mantener original
        bilirrubina_directa: /Bilirrubina Directa[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/,
        
        // GOT/ASAT - NUEVO FORMATO: "ASPARTATO AMINO TRANSFERASA (ASAT/GOT) 29.20 U/L"
        got: /ASPARTATO AMINO TRANSFERASA.*?\(ASAT\/GOT\)\s+(?:[hi]\s+)?(\d+\.?\d*)\s+U\/L/i,
        
        // GPT/ALT - NUEVO FORMATO: "ALANINA AMINO TRANSFERASA (ALAT/GPT) h 50.10 U/L"
        gpt: /ALANINA AMINO TRANSFERASA.*?\(ALAT\/GPT\)\s+(?:[hi]\s+)?(\d+\.?\d*)\s+U\/L/i,
        
        // Fosfatasa Alcalina - NUEVO FORMATO: "FOSFATASAS ALCALINAS h 174.00 U/L"
        fosfatasa_alcalina: /FOSFATASAS ALCALINAS\s+(?:[hi]\s+)?(\d+\.?\d*)\s+U\/L/i,
        
        // GGT - No encontrada en nuevo formato, mantener original
        ggt: /Gamma Glutamiltranspeptidasa[\s\S]*?(\*?\s*\d+\.?\d*)\s+U\/L/
    },
    
    // ====== NUTRICIONAL ======
    nutricional: {
        // Proteínas - NUEVO FORMATO: "PROTEINAS TOTALES i 6.15 g/dL"
        proteinas: /PROTEINAS TOTALES\s+([hi]?\s*\d+\.?\d*)\s+g\/dL/i,
        
        // Albúmina - NUEVO FORMATO: "ALBUMINA 3.63 g/dL"
        albumina: /^ALBUMINA\s+([hi]?\s*\d+\.?\d*)\s+g\/dL/im,
        
        // Prealbúmina - No encontrada en nuevo formato, mantener original
        prealbumin: /Prealbúmina[\s\S]*?(\d+\.?\d*)/
    },
    
    // ====== PCR, PROCALCITONINA Y VHS ======
    pcr_proca_vhs: {
        // PCR - NUEVO FORMATO: "PROTEINA C REACTIVA (CRP) h 23.30 mg/L"
        pcr: /PROTEINA C REACTIVA \(CRP\)\s+([hi]?\s*\d+\.?\d*)\s+mg\/L/i,
        
        // Procalcitonina - No encontrada en nuevo formato, mantener original
        procalcitonina: /Procalcitonina\s*\*?\s*(\d+\.?\d*)\s+ng\/mL/i,
        
        // VHS - No encontrada en nuevo formato, mantener original
        vhs: /(?:VHS|Velocidad\s+de\s+Sedimentación)\s*\*?\s*(\d+\.?\d*)\s*mm\/hr?/i
    },
    
    // ====== COAGULACIÓN ======
    coagulacion: {
        // INR - Buscar patrón: "INR 1.2"
        inr: /INR[\s\S]{0,20}(\d+\.?\d*)/,
        
        // PT (Tiempo de Protrombina) - Buscar patrón: "Tiempo de Protrombina 12.5 seg"
        pt: /Tiempo de Protrombina[\s\S]*?(\d+\.?\d*)\s+seg/,
        
        // PTT (TTPA) - Buscar patrón: "TTPA 35.2 seg"
        ptt: /TTPA[\s\S]*?(\d+\.?\d*)\s+seg/
    },
    
    // ====== GASES EN SANGRE ======
    gases: {
        // pH - Buscar patrón: "pH 7.40"
        ph: /pH[\s\S]*?(\d+\.?\d*)/,
        
        // PCO2 - Buscar patrón: "PCO2 40.2 mmHg"
        pco2: /PCO2[\s\S]*?(\d+\.?\d*)\s+mmHg/,
        
        // HCO3 - Buscar patrón: "HCO3 24.5 mmol/L"
        hco3: /HCO3[\s\S]*?(\d+\.?\d*)\s+mmol\/L/,
        
        // Saturación O2 - Buscar patrón: "% Saturación O2 98.5 %"
        saturacion_o2: /%\s+Saturación\s+O2[\s\S]*?(\d+\.?\d*)\s+%/
    },
    
    // ====== FECHAS Y METADATOS ======
    fechas: {
        // Fecha completa - Buscar patrón: "20/03/2025"
        fecha_completa: /(\d{2}\/\d{2}\/\d{4})/,
        
        // Toma de muestra - Buscar patrón: "Toma Muestra: 20/03/2025 06:24:00"
        toma_muestra: /Toma Muestra:\s*(\d{2}\/\d{2}\/\d{4})/,
        
        // Fecha de registro - Buscar patrón: "F. Registro: 20/03/2025"
        fecha_registro: /F\. Registro:\s*(\d{2}\/\d{2}\/\d{4})/,
        
        // Fecha de informe - Buscar patrón: "F. Informe: 21/03/2025"
        fecha_informe: /F\. Informe:\s*(\d{2}\/\d{2}\/\d{4})/,
        
        // NUEVO: Fecha de toma de muestra con formato completo - "Fecha/Hora de T. muestra : 29/07/2025 15:18:38"
        fecha_toma_muestra_completa: /Fecha\/Hora de T\. muestra\s*:\s*(\d{2}\/\d{2}\/\d{4})/i
    },
    
    // ====== INFORMACIÓN DEL PACIENTE ======
    paciente: {
        // Sexo - Buscar patrón: "Sexo: Hombre" o "Sexo: Mujer"
        sexo_hombre: /Sexo:\s*\n?\s*(Hombre|Masculino|Male|M)\b/i,
        sexo_mujer: /Sexo:\s*\n?\s*(Mujer|Femenino|Female|F)\b/i,
        
        // Número de petición - Buscar patrón: "N° Petición:320061388"
        numero_peticion: /N° Petición:\s*(\d+)/,
        
        // Embarazo - Buscar patrones de embarazo
        embarazo: /embaraza(da|zo)|gestante|pregnant|pregnancy|semanas de gestación|sdg/i
    }
};

// ===============================================================
// INSTRUCCIONES PARA ACTUALIZAR PATRONES
// ===============================================================

/*
CÓMO EDITAR ESTOS PATRONES:

1. ESTRUCTURA DE UN PATRÓN:
   - Cada patrón es una expresión regular (regex)
   - Los grupos de captura () extraen el valor específico
   - La bandera /i hace que sea insensible a mayúsculas/minúsculas

2. EJEMPLOS DE MODIFICACIÓN:

   Si el formato cambia de:
   "Hemoglobina * 11.1 g/dL"
   
   A:
   "Hb: 11.1 g/dL"
   
   Cambiar:
   hemoglobina: /Hemoglobina\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i,
   
   Por:
   hemoglobina: /Hb:\s*(\d+\.?\d*)\s+g\/dL/i,

3. COMPONENTES IMPORTANTES:
   - \s* = cero o más espacios
   - \s+ = uno o más espacios
   - \d+ = uno o más dígitos
   - \.? = punto opcional
   - \* = asterisco literal
   - \*? = asterisco opcional
   - () = grupo de captura para extraer el valor
   - [\s\S]*? = cualquier carácter (incluyendo saltos de línea)

4. PROBAR LOS CAMBIOS:
   - Guarda este archivo
   - Recarga la página web
   - Pega un texto de ejemplo para probar

5. CASOS ESPECIALES:
   - Si necesitas escapar caracteres especiales, usa \
   - Para OR lógico, usa |
   - Para rangos de caracteres, usa []

EJEMPLOS DE CAMBIOS COMUNES:

// Si cambia de "Hemoglobina" a "HB":
hemoglobina: /HB\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i,

// Si cambia de "mg/dL" a "mg/dl":
creatinina: /Creatinina[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dl/,

// Si agregan prefijos como "Lab:":
pcr: /Lab:\s*Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i,

// Si cambian el formato de unidades:
leucocitos: /Leucocitos\s*\*?\s*(\d+\.?\d*)\s+x10³\/μL/i,

*/

// ===============================================================
// NO EDITAR: Exportar configuración
// ===============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EXTRACTION_PATTERNS;
}

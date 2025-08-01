// Datos de ejemplo para cargar
const EXAMPLE_DATA = `PRUEBA RESULTADO UNIDADES INT. DE REF. MÉTODO
QUÍMICA SANGUINEA
Validado por: TM. Francisco Quiñones Alarcón (20/03/2025 12:24:38)
Bilirrubina Directa 0.08 mg/dL [0-0.3] Jendrassik - Groff
Glucosa * 221 mg/dL [70-100] Hexoquinasa
Urea * 52.8 mg/dL [10-50] UV Cinético
Nitrógeno Ureico * 24.7 mg % [6-22] Test Calculado
Vel. Filtración Glomerular (MDRD) 59.4 ml/min/1.73m^2
Creatinina 1.18 mg/dL [0.7-1.2] Jaffé Compensado
Bilirrubina Total 0.17 mg/dL [0-1] DPD
Bilirrubina Indirecta 0.09 mg / dl [<=0.8] Calculado
Fosfatasa Alcalina * 188 U/L [40-129] Colorimétrico
Transaminasa GOT/ASAT * 39 U/L [0-37] UV Estandarizado
Transaminasa GPT/ ALT * 54 U/L [0-50] UV Estandarizado
Colesterol Total * 258 mg/dL [0-200] CHOD-PAP
Colesterol HDL * 33 mg/dL [35-80] PEG, medida directa
Colesterol LDL * 172 mg/dL [<=99] Solubilización micelar selectiva
Colesterol VLDL * 57 mg/dL [<=40] Calculado
Triglicéridos * 285 mg/dL [0-200] GPO-PAP
Proteínas 7.1 g/dL [6.6-8.7] Biuret
Albúmina 4 g/dL [3.4-4.8] Verde de bromocresol
Gamma Glutamiltranspeptidasa * 131 U/L [10-66] G-glutamil-carboxinitroanilida
Fósforo 4.4 mg/dL [2.5-5] Fosfomolibdato-UV
Magnesio 2.1 mg/dL [1.6-2.6] Colorimétrico/azul de xilidil
Sodio * 149 mEq/L [135-145] Electrodo Ion Selectivo
Potasio 4.9 mEq/L [3.5-5] Electrodo Ion Selectivo
Cloro * 108 mEq/L [98-107] Electrodo Ion Selectivo
Proteína C Reactiva * 32.1 mg/L [<=5] Inmunoturbidimetria

DERIVADO
Validado por: TM. Francisco Quiñones Alarcón (20/03/2025 12:24:38)
Prealbúmina 25.7 mg / dl [18-40]

HORMONAS
Validado por: TM. Francisco Quiñones Alarcón (20/03/2025 12:24:38)
Procalcitonina 0.05 ng/mL [0-0.5] ECLIA

HEMATOLOGÍA
Validado por: TM. Osvaldo Muñoz Jaramillo (20/03/2025 07:48:16)
Recuento de Leucocitos * 15.89 10e3/uL [4-12]
Recuento de Eritrocitos 3.85 10e6/uL [3.8-5.8]
Hematocrito * 34.1 % [35-47]
Hemoglobina * 11.1 g/dL [14-17.5]
HCM-Hb Corpuscular Media 28.7 pg [25-32]
CHCM-Conc.Hb Corpuscular Media 32.6 g / dl [32-36]
VCM-Volumen Corpuscular Medio 88.6 fL [82-95]
RDW 14.1 % [11.5 - 14.5]
RDW-SD 47.3
Recuento de Plaquetas * 512 10e3/uL [150-450]
MPV 10 [7.2 - 11.1]
Basófilos % 0.1 % [0 - 0.1]
Eosinófilos % 4.8 % [0 - 4]
Neutrófilos % * 73 % [50-70]
Linfocitos % * 16.2 % [25-40]
Monocitos % 5.9 % [3 - 9]
Basófilos 0.02 10e3/uL [0 - 0.1]
Eosinófilos 0.76 10e3/uL [0 - 0.3]
Neutrófilos 11.6 10e3/uL
Linfocitos 2.57 10e3/uL
Monocitos 0.94 10e3/uL

SERVICIO DE SALUD ARAUCANIA SUR
HOSPITAL DR. HERNÁN HENRIQUEZ ARAVENA
LABORATORIO CLÍNICO
N° Petición:320061388
Paciente: JARA QUIÑONES, JOSE ABRAHAM F. Toma Muestra: 20/03/2025 06:24:00
RUT: 7453657-3 F. Recepción: 20/03/2025 05:00:36
F. Nacimiento / Edad: 08/03/1945 (79) F. Informe: 21/03/2025 14:30:30
Sexo: Hombre Prof. Solicitante: BERTHOLD SEBASTIÁN BOHN
Procedencia: HOSPITALIZACION Servicio: CIRUGIA CUIDADOS MEDIOS`;

// Funciones de extracción basadas en las fórmulas de Notion
class MedicalDataExtractor {
    constructor() {
        this.copyPasteText = '';
        this.selectedOptions = [];
    }

    // Función auxiliar para extraer usando expresiones regulares
    extractMatch(text, pattern, flags = 'gi') {
        try {
            const regex = new RegExp(pattern, flags);
            const matches = text.match(regex);
            return matches ? matches[0] : '';
        } catch (error) {
            console.warn('Error en regex:', pattern, error);
            return '';
        }
    }

    // Función para actualizar patrones de extracción
    updatePatterns(newPatterns) {
        this.patterns = { ...this.defaultPatterns, ...newPatterns };
    }

    // Patrones de extracción por defecto
    defaultPatterns = {
        bilirubin: 'Bilirrubina Directa\\s*([0-9.]+)\\s*mg/dL',
        glucose: 'Glucosa\\s*\\*?\\s*([0-9.]+)\\s*mg/dL',
        urea: 'Urea\\s*\\*?\\s*([0-9.]+)\\s*mg/dL',
        creatinine: 'Creatinina\\s*([0-9.]+)\\s*mg/dL',
        hemoglobin: 'Hemoglobina\\s*\\*?\\s*([0-9.]+)\\sg/dL'
    };

    // Función auxiliar para reemplazar asteriscos
    cleanAsterisks(text) {
        return text.replace(/\* /g, '*');
    }
    
    // Función para formatear valores numéricos (redondear según necesidad)
    formatValue(value) {
        if (!value) return value;
        
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return value;
        
        // Si el número es menor que 10 y tiene decimales, mantener 1 decimal
        if (numValue < 10 && numValue % 1 !== 0) {
            return numValue.toFixed(1);
        }
        // Si es mayor o igual a 10, redondear a entero
        return Math.round(numValue).toString();
    }
    
    // Valores normales de referencia
    static getNormalValues() {
        return {
            // Valores que dependen del sexo
            'Hb': {
                'male': '13-17 g/dL',
                'female': '12-16 g/dL',
                'pregnant': '11-16 g/dL'
            },
            'Hcto': {
                'male': '42-52%',
                'female': '37-47%'
            },
            // Valores para parámetros futuros (NOTA: Estos valores están guardados para cuando se agreguen al extractor)
            'Hierro': {
                'male': '65-175 μg/dL',
                'female': '50-170 μg/dL'
            },
            'Ferritina': {
                'male': '20-250 ng/mL',
                'female': '10-120 ng/mL'
            },
            'Transferrina': '200-360 mg/dL',
            'SatTransferrina': '20-50%',
            
            // Valores universales
            'VCM': '80-100 fL',
            'CHCM': '31-36 g/dL',
            'RDW': '11.5-14.5%',
            'Retic': '1-2%',
            'GB': '4.000-12.000 /μL',
            'N': '50-66%',
            'L': '25-33%',
            'RAN': '2.500-7.000 /μL',
            'RAL': '1.000-4.800 /μL',
            'Plaq': '150.000-400.000 /μL',
            'VHS': '≤20 mm/h',
            'PCR': '≤3.0 mg/L',
            'Proca': '≤0.25 ng/mL',
            'Crea': '0.6-1.2 mg/dL',
            'BUN': '7-18 mg/dL',
            'Urea': '10-50 mg/dL',
            'AcidoUrico': '3-8 mg/dL',
            'Na': '135-145 mEq/L',
            'K': '3.5-5.0 mEq/L',
            'Cl': '95-105 mEq/L',
            'P': '3-4.5 mg/dL',
            'Ca': '8.5-10.5 mg/dL',
            'Mg': '1.5-2.0 mg/dL',
            'BiliT': '0.2-1.2 mg/dL',
            'BiliD': '0.1-0.4 mg/dL',
            'BiliI': '0.2-0.8 mg/dL',
            'GOT': '10-40 U/L',
            'GPT': '7-40 U/L',
            'GGT': '6-50 U/L',
            'FA': '60-300 U/L',
            'Prot': '6.0-7.8 g/dL',
            'Alb': '3.5-5.5 g/dL',
            'Prealb': '20-40 mg/dL',
            'INR': '0.8-1.2',
            'PT': '11-15 seg',
            'PTT': '25-40 seg',
            'pH': '7.35-7.45',
            'pCO2': '35-45 mmHg',
            'HCO3': '22-28 mmol/L',
            'SatO2': '95-100%'
        };
    }
    
    // Función para detectar el sexo del paciente en el texto
    detectPatientSex(text) {
        // Buscar patrones más específicos para el formato del laboratorio
        const sexPatterns = [
            // Patrón específico para el formato del laboratorio (línea independiente)
            /Sexo:\s*\n?\s*(Hombre|Masculino|Male|M)\b/i,
            /Sexo:\s*\n?\s*(Mujer|Femenino|Female|F)\b/i,
            // Patrones más generales
            /Sexo:\s*(Hombre|Masculino|Male|M)/i,
            /Sexo:\s*(Mujer|Femenino|Female|F)/i,
            /Género:\s*(Hombre|Masculino|Male|M)/i,
            /Género:\s*(Mujer|Femenino|Female|F)/i,
            /Sex:\s*(Male|M)/i,
            /Sex:\s*(Female|F)/i,
            // Buscar simplemente "Mujer" o "Hombre" como palabras independientes en el contexto
            /\b(Mujer)\b/i,
            /\b(Hombre)\b/i
        ];
        
        for (const pattern of sexPatterns) {
            const match = text.match(pattern);
            if (match) {
                const sexValue = match[1].toLowerCase();
                if (['hombre', 'masculino', 'male', 'm'].includes(sexValue)) {
                    return 'male';
                } else if (['mujer', 'femenino', 'female', 'f'].includes(sexValue)) {
                    // Verificar si es embarazada
                    if (this.detectPregnancy(text)) {
                        return 'pregnant';
                    }
                    return 'female';
                }
            }
        }
        
        // Si no se detecta, retornar null para usar valores genéricos
        return null;
    }
    
    // Función para detectar embarazo
    detectPregnancy(text) {
        const pregnancyPatterns = [
            /embaraza(da|zo)/i,
            /gestante/i,
            /pregnant/i,
            /pregnancy/i,
            /semanas de gestación/i,
            /sdg/i // semanas de gestación
        ];
        
        return pregnancyPatterns.some(pattern => pattern.test(text));
    }
    
    // Función para parsear rangos normales a valores numéricos
    parseNormalRange(rangeString) {
        if (!rangeString || typeof rangeString !== 'string') {
            return null;
        }
        
        // Remover unidades y espacios
        const cleanRange = rangeString.replace(/[^0-9.,<>≤≥-]/g, '');
        
        // Patrones para diferentes tipos de rangos
        const patterns = [
            // Rango estándar: "2.500-7.000" o "2,500-7,000"
            /^([0-9.,]+)-([0-9.,]+)$/,
            // Valor máximo: "≤20" o "<20"
            /^[≤<]([0-9.,]+)$/,
            // Valor mínimo: "≥95" o ">95"
            /^[≥>]([0-9.,]+)$/
        ];
        
        for (const pattern of patterns) {
            const match = cleanRange.match(pattern);
            if (match) {
                if (match[2]) {
                    // Rango con min y max
                    const min = parseFloat(match[1].replace(/,/g, ''));
                    const max = parseFloat(match[2].replace(/,/g, ''));
                    return { min, max, type: 'range' };
                } else {
                    // Solo valor máximo o mínimo
                    const value = parseFloat(match[1].replace(/,/g, ''));
                    if (cleanRange.includes('≤') || cleanRange.includes('<')) {
                        return { min: 0, max: value, type: 'max' };
                    } else {
                        return { min: value, max: Infinity, type: 'min' };
                    }
                }
            }
        }
        
        return null;
    }
    
    // Función para verificar si un valor está fuera del rango normal
    isValueOutOfRange(value, normalRange) {
        const parsedRange = this.parseNormalRange(normalRange);
        if (!parsedRange) return false;
        
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return false;
        
        return numValue < parsedRange.min || numValue > parsedRange.max;
    }
    
    // Función para procesar valores alterados y agregar tooltips
    processAlteredValues(text) {
        const normalValues = MedicalDataExtractor.getNormalValues();
        const patientSex = this.detectPatientSex(this.copyPasteText || text);
        
        // Buscar todos los valores numéricos con sus parámetros
        return text.replace(/(\w+):\s*(\*?)([0-9.,]+)/g, (match, param, asterisk, value) => {
            let normalRange = normalValues[param];
            let displayRange = normalRange;
            
            // Si el parámetro tiene valores específicos por sexo
            if (normalRange && typeof normalRange === 'object') {
                if (patientSex && normalRange[patientSex]) {
                    normalRange = normalRange[patientSex];
                    displayRange = normalRange;
                } else if (normalRange['male']) {
                    // Si no se detectó el sexo, usar el rango masculino para comparación
                    normalRange = normalRange['male'];
                    
                    // Mostrar ambos valores en el tooltip
                    const maleRange = normalRange;
                    const femaleRange = normalRange['female'] || normalRange;
                    const pregnantRange = normalRange['pregnant'];
                    
                    if (pregnantRange) {
                        displayRange = `Hombres: ${maleRange}, Mujeres: ${femaleRange}, Embarazadas: ${pregnantRange}`;
                    } else {
                        displayRange = `Hombres: ${maleRange}, Mujeres: ${femaleRange}`;
                    }
                }
            }
            
            if (!normalRange || typeof normalRange === 'object') {
                normalRange = null;
                displayRange = 'Valor de referencia no disponible';
            }
            
            // Verificar si el valor está fuera del rango normal
            const isOutOfRange = normalRange ? this.isValueOutOfRange(value, normalRange) : false;
            
            // Determinar las clases CSS
            let classes = [];
            if (asterisk) {
                classes.push('altered-value');
            }
            if (isOutOfRange) {
                classes.push('out-of-range');
            }
            
            // Construir el HTML del resultado
            if (classes.length > 0) {
                const classAttr = classes.join(' ');
                const tooltip = `Valor normal: ${displayRange}`;
                return `${param}: <span class="${classAttr}" data-tooltip="${tooltip}">${asterisk}${value}</span>`;
            } else {
                return match; // No cambiar si no hay asterisco ni está fuera de rango
            }
        });
    }
    
    // Función auxiliar para obtener opciones adicionales del hemograma seleccionadas
    getSelectedHemogramaExtraOptions() {
        try {
            const checkboxes = document.querySelectorAll('.hemograma-extra:checked');
            return Array.from(checkboxes).map(cb => cb.value);
        } catch (error) {
            console.warn('Error al obtener opciones extras del hemograma:', error);
            return [];
        }
    }
    
    // Función para extraer opciones adicionales del hemograma
    extractHemogramaExtraOptions(selectedOptions) {
        let result = '';
        
        // VCM - Buscar patrón: "VCM-Volumen Corpuscular Medio 88.6 fL"
        if (selectedOptions.includes('VCM')) {
            let vcmMatch = this.copyPasteText.match(/VCM[\s\S]*?Corpuscular\s+Medio\s*\*?\s*(\d+\.?\d*)\s*fL/i);
            if (vcmMatch) {
                result += `VCM: ${vcmMatch[1]}, `;
            }
        }
        
        // CHCM - Buscar patrón: "CHCM-Conc.Hb Corpuscular Media 32.6 g / dl"
        if (selectedOptions.includes('CHCM')) {
            let chcmMatch = this.copyPasteText.match(/CHCM[\s\S]*?Corpuscular\s+Media\s*\*?\s*(\d+\.?\d*)\s*g\s*\/\s*dl/i);
            if (chcmMatch) {
                result += `CHCM: ${chcmMatch[1]}, `;
            }
        }
        
        // RDW - Buscar patrón: "RDW 14.1 %"
        if (selectedOptions.includes('RDW')) {
            let rdwMatch = this.copyPasteText.match(/RDW\s*\*?\s*(\d+\.?\d*)\s*%/i);
            if (rdwMatch) {
                result += `RDW: ${rdwMatch[1]}, `;
            }
        }
        
        // Reticulocitos - Buscar patrón: "Reticulocitos * 2.5 %"
        if (selectedOptions.includes('Reticulocitos')) {
            let retMatch = this.copyPasteText.match(/Reticulocitos\s*\*?\s*(\d+\.?\d*)\s*%/i);
            if (retMatch) {
                result += `Retic: ${retMatch[1]}, `;
            }
        }
        
        // RAN - Buscar patrón: "Neutrófilos 11.6 10e3/uL" o "NEUTROFILOS 2.02 10^3/uL" y multiplicar por 1000
        if (selectedOptions.includes('RAN')) {
            let ranMatch = this.copyPasteText.match(/NEUTROFILOS\s*\*?\s*(\d+\.?\d*)\s*(?:10\^3|10e3)\/uL/i);
            if (ranMatch) {
                const ranValue = (parseFloat(ranMatch[1]) * 1000).toFixed(0);
                result += `RAN: ${ranValue}, `;
            }
        }
        
        // RAL - Buscar patrón: "Linfocitos 2.57 10e3/uL" o "LINFOCITOS 3.02 10^3/uL" y multiplicar por 1000
        if (selectedOptions.includes('RAL')) {
            let ralMatch = this.copyPasteText.match(/LINFOCITOS\s*\*?\s*(\d+\.?\d*)\s*(?:10\^3|10e3)\/uL/i);
            if (ralMatch) {
                const ralValue = (parseFloat(ralMatch[1]) * 1000).toFixed(0);
                result += `RAL: ${ralValue}, `;
            }
        }
        
        return result;
    }
    

    // Extracción de Hemograma + PCR (optimizado para formato específico del laboratorio)
    extractHemograma() {
        if (!this.copyPasteText) return '';

        let result = '';
        const selectedExtraOptions = this.getSelectedHemogramaExtraOptions();

        // Hemoglobina - Buscar patrón específico: "Hemoglobina * 9.7 g/dL" o "HEMOGLOBINA 10.00 g/dL"
        let hbMatch = this.copyPasteText.match(/HEMOGLOBINA\s*([hi]?\s*\d+\.?\d*)\s+g\/dL/i);
        // Hematocrito - Buscar patrón: "Hematocrito * 34.1 %" o "HEMATOCRITO 30.00 %"
        let hctoMatch = this.copyPasteText.match(/HEMATOCRITO\s*([hi]?\s*\d+\.?\d*)\s*%/i);
        
        if (hbMatch && hctoMatch && selectedExtraOptions.includes('Hcto')) {
            const hbValue = hbMatch[1].replace(/\s+/g, '');
            const hctoValue = hctoMatch[1].replace(/\s+/g, '');
            const hbFormatted = this.formatValue(hbValue);
            const hctoFormatted = this.formatValue(hctoValue);
            result += `Hb/Hcto: ${hbFormatted}/${hctoFormatted}, `;
        } else if (hbMatch) {
            const value = hbMatch[1].replace(/\s+/g, '');
            const hbFormatted = this.formatValue(value);
            result += `Hb: ${hbFormatted}, `;
        }

        // Leucocitos - Buscar patrón: "Recuento de Leucocitos 5.67 10e3/uL" o "RECUENTO DE LEUCOCITOS 5.81 10^3/uL"
        let gbMatch = this.copyPasteText.match(/RECUENTO DE LEUCOCITOS\s*(?:[hi]\s+)?(\d+\.?\d*)\s+(?:10\^3|10e3)\/uL/i);
        if (gbMatch) {
            // Formatear correctamente (ej: 5.67 → 5.670)
            const gbFormatted = parseFloat(gbMatch[1]).toFixed(3);
            result += `GB: ${gbFormatted} `;
        }

        // % de Neutrófilos - Buscar patrón: "Neutrófilos % * 72.4 %" o "NEUTROFILOS % 34.90 %"
        let neutMatch = this.copyPasteText.match(/NEUTROFILOS\s*%\s*([hi]?\s*\d+\.?\d*)\s*%/i);
        // % de Linfocitos - Buscar patrón: "Linfocitos % * 16.2 %" o "LINFOCITOS % 52.00 %"
        let linfMatch = this.copyPasteText.match(/LINFOCITOS\s*%\s*([hi]?\s*\d+\.?\d*)\s*%/i);
        
        if (neutMatch && linfMatch && selectedExtraOptions.includes('Linfocitos')) {
            const neutRounded = Math.round(parseFloat(neutMatch[1].replace(/\s+/g, '')));
            const linfRounded = Math.round(parseFloat(linfMatch[1].replace(/\s+/g, '')));
            result += `(N: ${neutRounded}%, L: ${linfRounded}%), `;
        } else if (neutMatch) {
            const neutRounded = Math.round(parseFloat(neutMatch[1].replace(/\s+/g, '')));
            result += `(N: ${neutRounded}%), `;
        }

        // Plaquetas - Buscar patrón: "Recuento de Plaquetas 364 10e3/uL" o "RECUENTO DE PLAQUETAS 424 10^3/uL"
        let plqMatch = this.copyPasteText.match(/RECUENTO DE PLAQUETAS\s*(?:[hi]\s+)?(\d+)\s+(?:10\^3|10e3)\/uL/i);
        if (plqMatch) {
            result += `Plq: ${plqMatch[1]}.000, `;
        }

        // Opciones adicionales
        result += this.extractHemogramaExtraOptions(selectedExtraOptions);

        return this.cleanAsterisks(result);
    }

    // Extracción de Función Renal
    extractRenal() {
        if (!this.copyPasteText) return '';

        let values = [];

        // Creatinina (sin redondear)
        const creaMatch = this.extractMatch(this.copyPasteText, /Creatinina[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (creaMatch) {
            const creaValue = this.extractMatch(creaMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            const creaNumber = this.extractMatch(creaValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            values.push(`Crea: ${creaNumber}`);
        }

        // BUN (Nitrógeno Ureico)
        const bunMatch = this.extractMatch(this.copyPasteText, /Nitrógeno Ureico[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg/);
        if (bunMatch) {
            const bunValue = this.extractMatch(bunMatch, /(\*?\s*\d+\.?\d*)\s+mg/);
            const bunNumber = this.extractMatch(bunValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            values.push(`BUN: ${bunNumber}`);
        }

        // Urea (redondear a entero)
        const ureaMatch = this.extractMatch(this.copyPasteText, /Urea[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (ureaMatch) {
            const ureaValue = this.extractMatch(ureaMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            const ureaNumber = this.extractMatch(ureaValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            const ureaRounded = Math.round(parseFloat(ureaNumber)).toString();
            values.push(`Urea: ${ureaRounded}`);
        }

        // ELP: Sodio/Potasio/Cloro (formateo específico para cada uno)
        const naMatch = this.extractMatch(this.copyPasteText, /Sodio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mEq\/L/);
        const kMatch = this.extractMatch(this.copyPasteText, /Potasio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mEq\/L/);
        const clMatch = this.extractMatch(this.copyPasteText, /Cloro[\s\S]*?(\*?\s*\d+\.?\d*)\s+mEq\/L/);
        
        if (naMatch && kMatch && clMatch) {
            const naValue = this.extractMatch(naMatch, /(\*?\s*\d+\.?\d*)\s+mEq\/L/);
            const naNumber = this.extractMatch(naValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            const naRounded = Math.round(parseFloat(naNumber)).toString(); // Sodio a entero
            
            const kValue = this.extractMatch(kMatch, /(\*?\s*\d+\.?\d*)\s+mEq\/L/);
            const kNumber = this.extractMatch(kValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            const kRounded = parseFloat(kNumber).toFixed(1); // Potasio a 1 decimal
            
            const clValue = this.extractMatch(clMatch, /(\*?\s*\d+\.?\d*)\s+mEq\/L/);
            const clNumber = this.extractMatch(clValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            const clRounded = Math.round(parseFloat(clNumber)).toString(); // Cloro a entero
            
            values.push(`ELP: ${naRounded}/${kRounded}/${clRounded}`);
        }

        // Fósforo (sin redondear)
        const pMatch = this.extractMatch(this.copyPasteText, /Fósforo[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (pMatch) {
            const pValue = this.extractMatch(pMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            const pNumber = this.extractMatch(pValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            values.push(`P: ${pNumber}`);
        }

        // Calcio (redondear a 1 decimal)
        const caMatch = this.extractMatch(this.copyPasteText, /Calcio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (caMatch) {
            const caValue = this.extractMatch(caMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            const caNumber = this.extractMatch(caValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            const caRounded = parseFloat(caNumber).toFixed(1);
            values.push(`Ca: ${caRounded}`);
        }

        // Magnesio (sin redondear)
        const mgMatch = this.extractMatch(this.copyPasteText, /Magnesio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (mgMatch) {
            const mgValue = this.extractMatch(mgMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            const mgNumber = this.extractMatch(mgValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            values.push(`Mg: ${mgNumber}`);
        }

        const result = values.length > 0 ? values.join(', ') + ', ' : '';
        return this.cleanAsterisks(result);
    }

    // Extracción de Función Hepática
    extractHepatico() {
        if (!this.copyPasteText) return '';

        let result = '';

        // Bilirrubina Total - NUEVO FORMATO: "BILIRRUBINA TOTAL 0.16 mg/dL"
        const biliTMatch = this.copyPasteText.match(EXTRACTION_PATTERNS.hepatico.bilirrubina_total);
        if (biliTMatch) {
            const biliTValue = biliTMatch[1].replace(/[hi\s]/g, '');
            result += `BiliT: ${biliTValue}, `;
        }

        // GOT/GPT (Transaminasas) con múltiples patrones
        let gotValue = null;
        let gptValue = null;
        
        // Patrón 1: ASPARTATO AMINO TRANSFERASA (ASAT/GOT) 29.20 U/L
        let gotMatch = this.copyPasteText.match(/ASPARTATO AMINO TRANSFERASA[\s\S]*?\(ASAT\/GOT\)[\s\S]*?([\d\.]+)\s*U\/L/i);
        if (gotMatch) {
            gotValue = gotMatch[1];
        }
        
        // Patrón 2: ALANINA AMINO TRANSFERASA (ALAT/GPT) h 50.10 U/L
        let gptMatch = this.copyPasteText.match(/ALANINA AMINO TRANSFERASA[\s\S]*?\(ALAT\/GPT\)[\s\S]*?([\d\.]+)\s*U\/L/i);
        if (gptMatch) {
            gptValue = gptMatch[1];
        }
        
        // Si no encuentra con los patrones anteriores, probar patrones alternativos
        if (!gotValue) {
            // Patrón alternativo: GOT/ASAT 29.20 U/L
            gotMatch = this.copyPasteText.match(/(?:GOT|ASAT)[\s\S]*?([\d\.]+)\s*U\/L/i);
            if (gotMatch) gotValue = gotMatch[1];
        }
        
        if (!gptValue) {
            // Patrón alternativo: GPT/ALT h 50.10 U/L
            gptMatch = this.copyPasteText.match(/(?:GPT|ALT)[\s\S]*?[hi]?\s*([\d\.]+)\s*U\/L/i);
            if (gptMatch) gptValue = gptMatch[1];
        }
        
        // Combinar GOT/GPT si ambos valores se encontraron (aplicar formateo)
        if (gotValue && gptValue) {
            const gotFormatted = this.formatValue(gotValue);
            const gptFormatted = this.formatValue(gptValue);
            result += `GOT/GPT: ${gotFormatted}/${gptFormatted}, `;
        } else if (gotValue) {
            const gotFormatted = this.formatValue(gotValue);
            result += `GOT: ${gotFormatted}, `;
        } else if (gptValue) {
            const gptFormatted = this.formatValue(gptValue);
            result += `GPT: ${gptFormatted}, `;
        }
        
        // Debug: imprimir valores encontrados
        console.log('GOT encontrado:', gotValue);
        console.log('GPT encontrado:', gptValue);

        // Fosfatasa Alcalina - NUEVO FORMATO: "FOSFATASAS ALCALINAS h 174.00 U/L"
        const faMatch = this.copyPasteText.match(EXTRACTION_PATTERNS.hepatico.fosfatasa_alcalina);
        if (faMatch) {
            const faValue = faMatch[1].replace(/[hi\s]/g, '');
            const faFormatted = this.formatValue(faValue);
            result += `FA: ${faFormatted}, `;
        }

        // Albúmina - NUEVO FORMATO: "ALBUMINA 3.63 g/dL"
        const albMatch = this.copyPasteText.match(EXTRACTION_PATTERNS.nutricional.albumina);
        if (albMatch) {
            const albValue = albMatch[1].replace(/[hi\s]/g, '');
            const albFormatted = this.formatValue(albValue);
            result += `Alb: ${albFormatted}, `;
        }

        // Proteínas Totales - NUEVO FORMATO: "PROTEINAS TOTALES i 6.15 g/dL"
        const protMatch = this.copyPasteText.match(EXTRACTION_PATTERNS.nutricional.proteinas);
        if (protMatch) {
            const protValue = protMatch[1].replace(/[hi\s]/g, '');
            const protFormatted = this.formatValue(protValue);
            result += `Prot: ${protFormatted}`;
        }

        return this.cleanAsterisks(result);
    }

    // Extracción de Coagulación
    extractCoagulacion() {
        if (!this.copyPasteText) return '';

        let result = '';

        // INR
        const inrMatch = this.extractMatch(this.copyPasteText, /INR[\s\S]{0,20}(\d+\.?\d*)/);
        if (inrMatch) {
            const inrValue = this.extractMatch(inrMatch, /\d+\.?\d*/);
            result += `INR: ${inrValue}, `;
        }

        // PT (Tiempo de Protrombina)
        const ptMatch = this.extractMatch(this.copyPasteText, /Tiempo de Protrombina[\s\S]*?(\d+\.?\d*)\s+seg/);
        if (ptMatch) {
            const ptValue = this.extractMatch(ptMatch, /\d+\.?\d*/);
            result += `PT: ${ptValue}, `;
        }

        // PTT (TTPA)
        const pttMatch = this.extractMatch(this.copyPasteText, /TTPA[\s\S]*?(\d+\.?\d*)\s+seg/);
        if (pttMatch) {
            const pttValue = this.extractMatch(pttMatch, /\d+\.?\d*/);
            result += `PTT: ${pttValue}`;
        }

        return this.cleanAsterisks(result);
    }

    // Extracción Nutricional
    extractNutricional() {
        if (!this.copyPasteText) return '';

        let result = '';

        // Proteínas
        const protMatch = this.extractMatch(this.copyPasteText, /Proteínas[\s\S]*?(\d+\.?\d*)\s+g\/dL/);
        if (protMatch) {
            const protValue = this.extractMatch(protMatch, /\d+\.?\d*/);
            result += `Prot: ${protValue}, `;
        }

        // Albúmina
        const albMatch = this.extractMatch(this.copyPasteText, /Albúmina[\s\S]*?(\d+\.?\d*)\s+g\/dL/);
        if (albMatch) {
            const albValue = this.extractMatch(albMatch, /\d+\.?\d*/);
            result += `Alb: ${albValue}, `;
        }

        // Prealbúmina
        const prealbMatch = this.extractMatch(this.copyPasteText, /Prealbúmina[\s\S]*?(\d+\.?\d*)/);
        if (prealbMatch) {
            const prealbValue = this.extractMatch(prealbMatch, /\d+\.?\d*/);
            result += `Prealb: ${prealbValue}`;
        }

        return this.cleanAsterisks(result);
    }

    // Extracción de PCR, Proca & VHS
    extractPCR() {
        if (!this.copyPasteText) return '';

        let values = [];

        // PCR - Buscar múltiples patrones: "PROTEINA C REACTIVA (CRP) h 23.30 mg/L" o "Proteína C Reactiva * 156.0 mg/L"
        let pcrMatch = this.copyPasteText.match(/PROTEINA\s+C\s+REACTIVA\s*\(?CRP\)?\s*[hi*]*\s*(\d+\.?\d*)\s+mg\/L/i);
        if (!pcrMatch) {
            pcrMatch = this.copyPasteText.match(/Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i);
        }
        if (pcrMatch) {
            // Redondear PCR a 1 decimal
            const pcrValue = parseFloat(pcrMatch[1]).toFixed(1);
            values.push(`PCR: ${pcrValue}`);
        }

        // Procalcitonina - Buscar patrón: "Procalcitonina * 0.25 ng/mL"
        let procaMatch = this.copyPasteText.match(/Procalcitonina\s*\*?\s*(\d+\.?\d*)\s+ng\/mL/i);
        if (procaMatch) {
            values.push(`Proca: ${procaMatch[1]}`);
        }

        // VHS - Buscar patrón: "VHS * 85 mm/hr" o "Velocidad de Sedimentación"
        let vhsMatch = this.copyPasteText.match(/(?:VHS|Velocidad\s+de\s+Sedimentación)\s*\*?\s*(\d+\.?\d*)\s*mm\/hr?/i);
        if (vhsMatch) {
            values.push(`VHS: ${vhsMatch[1]}`);
        }

        const result = values.length > 0 ? values.join(', ') + ', ' : '';
        return this.cleanAsterisks(result);
    }

    // Extracción de Gases en Sangre
    extractGases() {
        if (!this.copyPasteText) return '';

        let values = [];

        // pH
        const phMatch = this.extractMatch(this.copyPasteText, /pH[\s\S]*?(\d+\.?\d*)/);
        if (phMatch) {
            const phValue = this.extractMatch(phMatch, /\d+\.?\d*/);
            values.push(`pH: ${phValue}`);
        }

        // PCO2
        const pco2Match = this.extractMatch(this.copyPasteText, /PCO2[\s\S]*?(\d+\.?\d*)\s+mmHg/);
        if (pco2Match) {
            const pco2Value = this.extractMatch(pco2Match, /(\d+\.?\d*)\s+mmHg/);
            const pco2Number = this.extractMatch(pco2Value, /\d+\.?\d*/);
            values.push(`pCO2: ${pco2Number}`);
        }

        // HCO3
        const hco3Match = this.extractMatch(this.copyPasteText, /HCO3[\s\S]*?(\d+\.?\d*)\s+mmol\/L/);
        if (hco3Match) {
            const hco3Value = this.extractMatch(hco3Match, /(\d+\.?\d*)\s+mmol\/L/);
            const hco3Number = this.extractMatch(hco3Value, /\d+\.?\d*/);
            values.push(`HCO3: ${hco3Number}`);
        }

        // Saturación O2
        const satO2Match = this.extractMatch(this.copyPasteText, /%\s+Saturación\s+O2[\s\S]*?(\d+\.?\d*)\s+%/);
        if (satO2Match) {
            const satO2Value = this.extractMatch(satO2Match, /(\d+\.?\d*)\s+%/);
            const satO2Number = this.extractMatch(satO2Value, /\d+\.?\d*/);
            values.push(`SatO2: ${satO2Number}`);
        }

        const result = values.length > 0 ? values.join(', ') + ', ' : '';
        return this.cleanAsterisks(result);
    }

    // Funciones de extracción detallada para tabla comparativa
    
    // Extracción detallada de Hemograma
    extractHemogramaDetallado() {
        if (!this.copyPasteText) return {};
        
        const valores = {};
        
        // Hemoglobina
        let hbMatch = this.copyPasteText.match(/Hemoglobina\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i);
        if (hbMatch) {
            const hasAsterisk = hbMatch[1] === '*';
            valores.Hb = hasAsterisk ? `*${hbMatch[2]}` : hbMatch[2];
        }
        
        // Glóbulos Blancos
        let gbMatch = this.copyPasteText.match(/(?:Recuento de )?Leucocitos\s*\*?\s*(\d+\.?\d*)\s+10e3\/uL/i);
        if (gbMatch) {
            valores.GB = parseFloat(gbMatch[1]).toFixed(3);
        }
        
        // % Neutrófilos
        let neutMatch = this.copyPasteText.match(/Neutrófilos\s*%\s*\*?\s*(\d+\.?\d*)\s*%/i);
        if (neutMatch) {
            valores['N%'] = Math.round(parseFloat(neutMatch[1])) + '%';
        }
        
        // Plaquetas
        let plqMatch = this.copyPasteText.match(/(?:Recuento de )?Plaquetas\s*\*?\s*(\d+)\s+10e3\/uL/i);
        if (plqMatch) {
            valores.Plaq = plqMatch[1] + '.000';
        }
        
        return valores;
    }
    
    // Extracción detallada de PCR, Proca & VHS
    extractPCRDetallado() {
        if (!this.copyPasteText) return {};
        
        const valores = {};
        
        // PCR
        let pcrMatch = this.copyPasteText.match(/Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i);
        if (pcrMatch) {
            valores.PCR = pcrMatch[1];
        }
        
        // Procalcitonina
        let procaMatch = this.copyPasteText.match(/Procalcitonina\s*\*?\s*(\d+\.?\d*)\s+ng\/mL/i);
        if (procaMatch) {
            valores.Proca = procaMatch[1];
        }
        
        // VHS
        let vhsMatch = this.copyPasteText.match(/(?:VHS|Velocidad\s+de\s+Sedimentación)\s*\*?\s*(\d+\.?\d*)\s*mm\/hr?/i);
        if (vhsMatch) {
            valores.VHS = vhsMatch[1];
        }
        
        return valores;
    }
    
    // Extracción detallada de Función Renal
    extractRenalDetallado() {
        if (!this.copyPasteText) return {};
        
        const valores = {};
        
        // Creatinina
        const creaMatch = this.extractMatch(this.copyPasteText, /Creatinina[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (creaMatch) {
            const creaValue = this.extractMatch(creaMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            valores.Crea = this.extractMatch(creaValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // BUN
        const bunMatch = this.extractMatch(this.copyPasteText, /Nitrógeno Ureico[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg/);
        if (bunMatch) {
            const bunValue = this.extractMatch(bunMatch, /(\*?\s*\d+\.?\d*)\s+mg/);
            valores.BUN = this.extractMatch(bunValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Urea
        const ureaMatch = this.extractMatch(this.copyPasteText, /Urea[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (ureaMatch) {
            const ureaValue = this.extractMatch(ureaMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            valores.Urea = this.extractMatch(ureaValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Sodio
        const naMatch = this.extractMatch(this.copyPasteText, /Sodio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mEq\/L/);
        if (naMatch) {
            const naValue = this.extractMatch(naMatch, /(\*?\s*\d+\.?\d*)\s+mEq\/L/);
            valores.Na = this.extractMatch(naValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Potasio
        const kMatch = this.extractMatch(this.copyPasteText, /Potasio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mEq\/L/);
        if (kMatch) {
            const kValue = this.extractMatch(kMatch, /(\*?\s*\d+\.?\d*)\s+mEq\/L/);
            valores.K = this.extractMatch(kValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Cloro
        const clMatch = this.extractMatch(this.copyPasteText, /Cloro[\s\S]*?(\*?\s*\d+\.?\d*)\s+mEq\/L/);
        if (clMatch) {
            const clValue = this.extractMatch(clMatch, /(\*?\s*\d+\.?\d*)\s+mEq\/L/);
            valores.Cl = this.extractMatch(clValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Fósforo
        const pMatch = this.extractMatch(this.copyPasteText, /Fósforo[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (pMatch) {
            const pValue = this.extractMatch(pMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            valores.P = this.extractMatch(pValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Calcio
        const caMatch = this.extractMatch(this.copyPasteText, /Calcio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (caMatch) {
            const caValue = this.extractMatch(caMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            valores.Ca = this.extractMatch(caValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Magnesio
        const mgMatch = this.extractMatch(this.copyPasteText, /Magnesio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (mgMatch) {
            const mgValue = this.extractMatch(mgMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            valores.Mg = this.extractMatch(mgValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        return valores;
    }
    
    // Extracción detallada de Función Hepática
    extractHepaticoDetallado() {
        if (!this.copyPasteText) return {};
        
        const valores = {};
        
        // Bilirrubina Total
        const biliTMatch = this.extractMatch(this.copyPasteText, /Bilirrubina Total[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (biliTMatch) {
            const biliTValue = this.extractMatch(biliTMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            valores.BiliT = this.extractMatch(biliTValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Bilirrubina Directa
        const biliDMatch = this.extractMatch(this.copyPasteText, /Bilirrubina Directa[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (biliDMatch) {
            const biliDValue = this.extractMatch(biliDMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            valores.BiliD = this.extractMatch(biliDValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // GOT
        const gotMatch = this.extractMatch(this.copyPasteText, /Transaminasa GOT\/ASAT[\s\S]*?(\*?\s*\d+\.?\d*)\s+U\/L/);
        if (gotMatch) {
            const gotValue = this.extractMatch(gotMatch, /(\*?\s*\d+\.?\d*)\s+U\/L/);
            valores.GOT = this.extractMatch(gotValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // GPT
        const gptMatch = this.extractMatch(this.copyPasteText, /Transaminasa GPT\/\s?ALT[\s\S]*?(\*?\s*\d+\.?\d*)\s+U\/L/);
        if (gptMatch) {
            const gptValue = this.extractMatch(gptMatch, /(\*?\s*\d+\.?\d*)\s+U\/L/);
            valores.GPT = this.extractMatch(gptValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Fosfatasa Alcalina
        const faMatch = this.extractMatch(this.copyPasteText, /Fosfatasa Alcalina[\s\S]*?(\*?\s*\d+\.?\d*)\s+U\/L/);
        if (faMatch) {
            const faValue = this.extractMatch(faMatch, /(\*?\s*\d+\.?\d*)\s+U\/L/);
            valores.FA = this.extractMatch(faValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // GGT
        const ggtMatch = this.extractMatch(this.copyPasteText, /Gamma Glutamiltranspeptidasa[\s\S]*?(\*?\s*\d+\.?\d*)\s+U\/L/);
        if (ggtMatch) {
            const ggtValue = this.extractMatch(ggtMatch, /(\*?\s*\d+\.?\d*)\s+U\/L/);
            valores.GGT = this.extractMatch(ggtValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        return valores;
    }
    
    // Extracción detallada Nutricional
    extractNutricionalDetallado() {
        if (!this.copyPasteText) return {};
        
        const valores = {};
        
        // Proteínas
        const protMatch = this.extractMatch(this.copyPasteText, /Proteínas[\s\S]*?(\*?\s*\d+\.?\d*)\s+g\/dL/);
        if (protMatch) {
            const protValue = this.extractMatch(protMatch, /(\*?\s*\d+\.?\d*)\s+g\/dL/);
            valores.Prot = this.extractMatch(protValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Albúmina
        const albMatch = this.extractMatch(this.copyPasteText, /Albúmina[\s\S]*?(\*?\s*\d+\.?\d*)\s+g\/dL/);
        if (albMatch) {
            const albValue = this.extractMatch(albMatch, /(\*?\s*\d+\.?\d*)\s+g\/dL/);
            valores.Alb = this.extractMatch(albValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Prealbúmina
        const prealbMatch = this.extractMatch(this.copyPasteText, /Prealbúmina[\s\S]*?(\*?\s*\d+\.?\d*)/);
        if (prealbMatch) {
            valores.Prealb = this.extractMatch(prealbMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        return valores;
    }
    
    // Extracción detallada de Coagulación
    extractCoagulacionDetallado() {
        if (!this.copyPasteText) return {};
        
        const valores = {};
        
        // INR
        const inrMatch = this.extractMatch(this.copyPasteText, /INR[\s\S]{0,20}(\*?\s*\d+\.?\d*)/);
        if (inrMatch) {
            valores.INR = this.extractMatch(inrMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // PT
        const ptMatch = this.extractMatch(this.copyPasteText, /Tiempo de Protrombina[\s\S]*?(\*?\s*\d+\.?\d*)\s+seg/);
        if (ptMatch) {
            const ptValue = this.extractMatch(ptMatch, /(\*?\s*\d+\.?\d*)\s+seg/);
            valores.PT = this.extractMatch(ptValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // PTT
        const pttMatch = this.extractMatch(this.copyPasteText, /TTPA[\s\S]*?(\*?\s*\d+\.?\d*)\s+seg/);
        if (pttMatch) {
            const pttValue = this.extractMatch(pttMatch, /(\*?\s*\d+\.?\d*)\s+seg/);
            valores.PTT = this.extractMatch(pttValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        return valores;
    }
    
    // Extracción detallada de Gases
    extractGasesDetallado() {
        if (!this.copyPasteText) return {};
        
        const valores = {};
        
        // pH
        const phMatch = this.extractMatch(this.copyPasteText, /pH[\s\S]*?(\*?\s*\d+\.?\d*)/);
        if (phMatch) {
            valores.pH = this.extractMatch(phMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // PCO2
        const pco2Match = this.extractMatch(this.copyPasteText, /PCO2[\s\S]*?(\*?\s*\d+\.?\d*)\s+mmHg/);
        if (pco2Match) {
            const pco2Value = this.extractMatch(pco2Match, /(\*?\s*\d+\.?\d*)\s+mmHg/);
            valores.pCO2 = this.extractMatch(pco2Value, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // HCO3
        const hco3Match = this.extractMatch(this.copyPasteText, /HCO3[\s\S]*?(\*?\s*\d+\.?\d*)\s+mmol\/L/);
        if (hco3Match) {
            const hco3Value = this.extractMatch(hco3Match, /(\*?\s*\d+\.?\d*)\s+mmol\/L/);
            valores.HCO3 = this.extractMatch(hco3Value, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        // Saturación O2
        const satO2Match = this.extractMatch(this.copyPasteText, /%\s+Saturación\s+O2[\s\S]*?(\*?\s*\d+\.?\d*)\s+%/);
        if (satO2Match) {
            const satO2Value = this.extractMatch(satO2Match, /(\*?\s*\d+\.?\d*)\s+%/);
            valores.SatO2 = this.extractMatch(satO2Value, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
        }
        
        return valores;
    }

    // Extracción de Fecha
    extractFecha() {
        if (!this.copyPasteText) return '';

        // Buscar varios patrones de fecha
        let fechaMatch = null;
        
        // Patrón 1: "Fecha dd/mm/yyyy"
        fechaMatch = this.extractMatch(this.copyPasteText, /Fecha\s+(\d{2}\/\d{2}\/\d{4})/);
        
        // Patrón 2: "Toma Muestra: dd/mm/yyyy"
        if (!fechaMatch) {
            fechaMatch = this.extractMatch(this.copyPasteText, /Toma Muestra:\s*(\d{2}\/\d{2}\/\d{4})/);
        }
        
        // Patrón 3: NUEVO - "Fecha/Hora de T. muestra : 29/07/2025 15:18:38"
        if (!fechaMatch) {
            fechaMatch = this.extractMatch(this.copyPasteText, /Fecha\/Hora de T\. muestra\s*:\s*(\d{2}\/\d{2}\/\d{4})/);
        }
        
        // Patrón 4: Fecha al inicio de línea "dd/mm/yyyy"
        if (!fechaMatch) {
            fechaMatch = this.extractMatch(this.copyPasteText, /^(\d{2}\/\d{2}\/\d{4})/);
        }
        
        // Patrón 5: Cualquier fecha en formato dd/mm/yyyy
        if (!fechaMatch) {
            fechaMatch = this.extractMatch(this.copyPasteText, /(\d{2}\/\d{2}\/\d{4})/);
        }
        
        if (fechaMatch) {
            const fechaCompleta = this.extractMatch(fechaMatch, /\d{2}\/\d{2}\/\d{4}/);
            // Extraer solo día/mes y agregar dos puntos: dd/mm:
            return fechaCompleta.substring(0, 5) + ':';
        }
        return '';
    }

    // Función para dividir el texto en múltiples exámenes
    splitExamenes(text) {
        // Buscar divisiones por patrones que indiquen inicio de un nuevo examen completo
        const examenes = [];
        const matches = [];
        let match;
        
        // Patrón 1: "F. Registro:" o "F. Informe:" que marca el inicio de un nuevo examen
        const registroPattern = /F\. (?:Registro|Informe): \d{2}\/\d{2}\/\d{4}/g;
        while ((match = registroPattern.exec(text)) !== null) {
            matches.push(match.index);
        }
        
        // Patrón 2: Si no hay "F. Registro:", buscar "LABORATORIO CLÍNICO" + fecha
        if (matches.length === 0) {
            const labPattern = /LABORATORIO[\s\S]*?\d{2}\/\d{2}\/\d{4}/g;
            while ((match = labPattern.exec(text)) !== null) {
                matches.push(match.index);
            }
        }
        
        // Patrón 3: Si no hay divisiones claras, buscar patrones de fecha al inicio de línea
        if (matches.length === 0) {
            // Primero intentar formato corto dd/mm:
            const fechaCortaPattern = /^\d{2}\/\d{2}:/gm;
            while ((match = fechaCortaPattern.exec(text)) !== null) {
                matches.push(match.index);
            }
            
            // Si no encontramos fechas cortas, buscar fechas completas
            if (matches.length === 0) {
                const fechaCompletaPattern = /^\d{2}\/\d{2}\/\d{4}:/gm;
                while ((match = fechaCompletaPattern.exec(text)) !== null) {
                    matches.push(match.index);
                }
            }
        }
        
        // Si aún no hay divisiones, tratar como un solo examen
        if (matches.length <= 1) {
            return [text];
        }
        
        // Dividir el texto en exámenes completos
        for (let i = 0; i < matches.length; i++) {
            const start = matches[i];
            const end = matches[i + 1] || text.length;
            const fragment = text.substring(start, end).trim();
            
            // Solo incluir fragmentos significativos
            if (fragment.length > 50) {
                examenes.push(fragment);
            }
        }
        
        return examenes.length > 0 ? examenes : [text];
    }
    
    // Función para extraer fecha completa para ordenamiento
    extractFechaCompleta(text) {
        // Buscar varios patrones de fecha
        let fechaMatch = null;
        
        // Patrón 1: "Fecha dd/mm/yyyy"
        fechaMatch = this.extractMatch(text, /Fecha\s+(\d{2}\/\d{2}\/\d{4})/);
        
        // Patrón 2: "F. Registro: dd/mm/yyyy"
        if (!fechaMatch) {
            fechaMatch = this.extractMatch(text, /F\. Registro:\s*(\d{2}\/\d{2}\/\d{4})/);
        }
        
        // Patrón 3: "Toma Muestra: dd/mm/yyyy"
        if (!fechaMatch) {
            fechaMatch = this.extractMatch(text, /Toma Muestra:\s*(\d{2}\/\d{2}\/\d{4})/);
        }
        
        // Patrón 4: Cualquier fecha en formato dd/mm/yyyy
        if (!fechaMatch) {
            fechaMatch = this.extractMatch(text, /(\d{2}\/\d{2}\/\d{4})/);
        }
        
        if (fechaMatch) {
            const fechaCompleta = this.extractMatch(fechaMatch, /\d{2}\/\d{2}\/\d{4}/);
            return fechaCompleta;
        }
        return null;
    }
    
    // Función para convertir fecha dd/mm/yyyy a objeto Date para ordenamiento
    parseFecha(fechaString) {
        if (!fechaString) return new Date(0); // Fecha muy antigua si no hay fecha
        
        const parts = fechaString.split('/');
        if (parts.length !== 3) return new Date(0);
        
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Los meses en Date son 0-indexados
        const year = parseInt(parts[2]);
        
        return new Date(year, month, day);
    }
    
    // Función para procesar un solo examen
    processSingleExamen(copyPasteText, selectedOptions, includeFecha = true) {
        this.copyPasteText = copyPasteText;
        this.selectedOptions = selectedOptions;

        let results = [];

        // Agregar la fecha al principio si está seleccionada
        if (selectedOptions.includes('Fecha') && includeFecha) {
            const fecha = this.extractFecha();
            if (fecha) results.push(fecha);
        }

        if (selectedOptions.includes('Hemograma')) {
            const hemograma = this.extractHemograma();
            if (hemograma) results.push(hemograma);
        }

        if (selectedOptions.includes('PCR')) {
            const pcr = this.extractPCR();
            if (pcr) results.push(pcr);
        }

        if (selectedOptions.includes('Renal')) {
            const renal = this.extractRenal();
            if (renal) results.push(renal);
        }

        if (selectedOptions.includes('Hepático')) {
            const hepatico = this.extractHepatico();
            if (hepatico) results.push(hepatico);
        }

        if (selectedOptions.includes('Coagulación')) {
            const coagulacion = this.extractCoagulacion();
            if (coagulacion) results.push(coagulacion);
        }

        if (selectedOptions.includes('Nutricional')) {
            const nutricional = this.extractNutricional();
            if (nutricional) results.push(nutricional);
        }

        if (selectedOptions.includes('Gases')) {
            const gases = this.extractGases();
            if (gases) results.push(gases);
        }

        return results.join('\n');
    }

    // Función para dividir el texto por Nº Petición:
    splitExamenesByRegistro(text) {
        // Buscar todos los números de petición únicos
        const peticionesUnicas = new Set();
        const peticionPattern = /Nº Petición:\s*(\d+)/g;
        let match;
        
        while ((match = peticionPattern.exec(text)) !== null) {
            peticionesUnicas.add(match[1]);
        }
        
        // Si hay múltiples peticiones DIFERENTES, dividir por ellas
        if (peticionesUnicas.size > 1) {
            const examenes = [];
            
            // Dividir el texto por cada ocurrencia de "Nº Petición:"
            const allMatches = [];
            const allPeticionPattern = /Nº Petición:/g;
            let match;
            
            while ((match = allPeticionPattern.exec(text)) !== null) {
                allMatches.push(match.index);
            }
            
            // Crear fragmentos y agrupar por número de petición
            const fragmentosPorPeticion = new Map();
            
            for (let i = 0; i < allMatches.length; i++) {
                const start = allMatches[i];
                const end = allMatches[i + 1] || text.length;
                const fragment = text.substring(start, end).trim();
                
                // Extraer el número de petición de este fragmento
                const numeroMatch = fragment.match(/Nº Petición:\s*(\d+)/);
                if (numeroMatch) {
                    const numeroPeticion = numeroMatch[1];
                    if (!fragmentosPorPeticion.has(numeroPeticion)) {
                        fragmentosPorPeticion.set(numeroPeticion, []);
                    }
                    fragmentosPorPeticion.get(numeroPeticion).push(fragment);
                }
            }
            
            // Unir fragmentos por petición
            fragmentosPorPeticion.forEach((fragments, numeroPeticion) => {
                const contenidoCompleto = fragments.join('\n\n').trim();
                if (contenidoCompleto.length > 100) {
                    examenes.push(contenidoCompleto);
                }
            });
            
            return examenes;
        }
        
        // Si solo hay una petición o ninguna, intentar dividir por "F. Registro:" pero solo si hay múltiples fechas muy separadas
        const registroMatches = [];
        const registroPattern = /F\. Registro:/g;
        while ((match = registroPattern.exec(text)) !== null) {
            registroMatches.push(match.index);
        }
        
        // Solo dividir por F. Registro si hay múltiples registros MUY separados (más de 2000 caracteres)
        if (registroMatches.length > 1) {
            let shouldSplit = false;
            for (let i = 1; i < registroMatches.length; i++) {
                const distance = registroMatches[i] - registroMatches[i-1];
                if (distance > 2000) {
                    shouldSplit = true;
                    break;
                }
            }
            
            if (shouldSplit) {
                const examenes = [];
                for (let i = 0; i < registroMatches.length; i++) {
                    const start = registroMatches[i];
                    const end = registroMatches[i + 1] || text.length;
                    const fragment = text.substring(start, end).trim();
                    
                    if (fragment.length > 100) {
                        examenes.push(fragment);
                    }
                }
                return examenes;
            }
        }
        
        // Si no se debe dividir, devolver el texto completo
        return [text];
    }
    
    // Función para extraer fecha de un examen específico
    extractFechaFromExamen(examenText) {
        if (!examenText) return null;
        
        // Buscar la primera fecha que aparece después de "Nº Petición:"
        const peticionMatch = examenText.match(/Nº Petición:[\s\S]*?F\. Registro:\s*(\d{2}\/\d{2}\/\d{4})/);
        if (peticionMatch) {
            const fechaCompleta = peticionMatch[1];
            return fechaCompleta.substring(0, 5);
        }
        
        // Si no encuentra el patrón con Nº Petición, buscar F. Registro al inicio
        let fechaMatch = this.extractMatch(examenText, /F\. Registro:\s*(\d{2}\/\d{2}\/\d{4})/);
        if (fechaMatch) {
            const fechaCompleta = this.extractMatch(fechaMatch, /\d{2}\/\d{2}\/\d{4}/);
            return fechaCompleta.substring(0, 5);
        }
        
        // Si no encuentra F. Registro, buscar otros patrones
        fechaMatch = this.extractMatch(examenText, /Fecha\s+(\d{2}\/\d{2}\/\d{4})/);
        if (fechaMatch) {
            const fechaCompleta = this.extractMatch(fechaMatch, /\d{2}\/\d{2}\/\d{4}/);
            return fechaCompleta.substring(0, 5);
        }
        
        // Buscar cualquier fecha en formato dd/mm/yyyy
        fechaMatch = this.extractMatch(examenText, /(\d{2}\/\d{2}\/\d{4})/);
        if (fechaMatch) {
            const fechaCompleta = this.extractMatch(fechaMatch, /\d{2}\/\d{2}\/\d{4}/);
            return fechaCompleta.substring(0, 5);
        }
        
        return null;
    }
    
    // Función para extraer valores de fragmentos cortos (formato dd/mm: contenido)
    extractValuesFromShortFragment(fragmentText, selectedOptions) {
        if (!fragmentText || fragmentText.length < 3) return '';
        
        const valoresEncontrados = [];
        
        // Buscar valores directamente en el texto del fragmento usando regex simples
        
        if (selectedOptions.includes('Hemograma')) {
            // Buscar Hemoglobina: Hb: x.x
            const hbMatch = fragmentText.match(/Hb:\s*(\*?\d+\.?\d*)/i);
            if (hbMatch) valoresEncontrados.push(`Hb: ${hbMatch[1]}`);
            
            // Buscar Glóbulos Blancos: GB: x.xxx
            const gbMatch = fragmentText.match(/GB:\s*(\*?\d+\.?\d*)/i);
            if (gbMatch) valoresEncontrados.push(`GB: ${gbMatch[1]}`);
            
            // Buscar % Neutrófilos: (N: xx%)
            const neutMatch = fragmentText.match(/\(N:\s*(\*?\d+)%\)/i);
            if (neutMatch) valoresEncontrados.push(`(N: ${neutMatch[1]}%)`);
            
            // Buscar Plaquetas: Plq: xxx.000
            const plqMatch = fragmentText.match(/Plq:\s*(\*?\d+\.?\d*)/i);
            if (plqMatch) valoresEncontrados.push(`Plq: ${plqMatch[1]}`);
            
            // Buscar PCR: PCR: xx.x
            const pcrMatch = fragmentText.match(/PCR:\s*(\*?\d+\.?\d*)/i);
            if (pcrMatch) valoresEncontrados.push(`PCR: ${pcrMatch[1]}`);
        }
        
        if (selectedOptions.includes('Renal')) {
            // Buscar Creatinina: Crea: x.xx
            const creaMatch = fragmentText.match(/Crea:\s*(\*?\d+\.?\d*)/i);
            if (creaMatch) valoresEncontrados.push(`Crea: ${creaMatch[1]}`);
            
            // Buscar BUN: BUN: xx.x
            const bunMatch = fragmentText.match(/BUN:\s*(\*?\d+\.?\d*)/i);
            if (bunMatch) valoresEncontrados.push(`BUN: ${bunMatch[1]}`);
            
            // Buscar Urea: Urea: xx.x
            const ureaMatch = fragmentText.match(/Urea:\s*(\*?\d+\.?\d*)/i);
            if (ureaMatch) valoresEncontrados.push(`Urea: ${ureaMatch[1]}`);
            
            // Buscar ELP: ELP: xxx/x.x/xxx
            const elpMatch = fragmentText.match(/ELP:\s*(\*?\d+\/\*?\d+\.?\d*\/\*?\d+)/i);
            if (elpMatch) valoresEncontrados.push(`ELP: ${elpMatch[1]}`);
            
            // Buscar Magnesio: Mg: x.x
            const mgMatch = fragmentText.match(/Mg:\s*(\*?\d+\.?\d*)/i);
            if (mgMatch) valoresEncontrados.push(`Mg: ${mgMatch[1]}`);
        }
        
        if (selectedOptions.includes('Nutricional')) {
            // Buscar Albúmina: Alb: x.x
            const albMatch = fragmentText.match(/Alb:\s*(\*?\d+\.?\d*)/i);
            if (albMatch) valoresEncontrados.push(`Alb: ${albMatch[1]}`);
        }
        
        if (selectedOptions.includes('Coagulación')) {
            // Buscar INR: INR: x.xx
            const inrMatch = fragmentText.match(/INR:\s*(\*?\d+\.?\d*)/i);
            if (inrMatch) valoresEncontrados.push(`INR: ${inrMatch[1]}`);
            
            // Buscar PT: PT: xx.x
            const ptMatch = fragmentText.match(/PT:\s*(\*?\d+\.?\d*)/i);
            if (ptMatch) valoresEncontrados.push(`PT: ${ptMatch[1]}`);
            
            // Buscar PTT: PTT: xx.x
            const pttMatch = fragmentText.match(/PTT:\s*(\*?\d+\.?\d*)/i);
            if (pttMatch) valoresEncontrados.push(`PTT: ${pttMatch[1]}`);
        }
        
        return valoresEncontrados.length > 0 ? valoresEncontrados.join(', ') : '';
    }
    
    // Función principal de procesamiento
    processSelection(copyPasteText, selectedOptions) {
        if (selectedOptions.includes('Talcual')) {
            return copyPasteText;
        }

        // Detectar si hay múltiples exámenes por F. Registro:
        const registroMatches = copyPasteText.match(/F\. Registro:/g);
        const peticionMatches = copyPasteText.match(/Nº Petición:/g);
        
        console.log('Registros encontrados:', registroMatches ? registroMatches.length : 0);
        console.log('Peticiones encontradas:', peticionMatches ? peticionMatches.length : 0);
        
        // Si solo hay un examen o ninguno, procesarlo normalmente
        if (!registroMatches || registroMatches.length <= 1) {
            console.log('Procesando como un solo examen');
            return this.processSingleExamen(copyPasteText, selectedOptions);
        }
        
        // CASO ESPECIAL: Múltiples exámenes con F. Registro
        // Dividir por exámenes y procesar cada uno independientemente
        const examenes = this.splitExamenesByRegistro(copyPasteText);
        
        // Procesar cada examen y extraer fecha + valores
        const resultadosPorFecha = new Map();
        
        // Consolidar fragmentos por fecha
        const fragmentosPorFecha = new Map();
        
        examenes.forEach((examen, index) => {
            const fechaExtraida = this.extractFechaFromExamen(examen);
            
            if (fechaExtraida) {
                if (!fragmentosPorFecha.has(fechaExtraida)) {
                    fragmentosPorFecha.set(fechaExtraida, []);
                }
                fragmentosPorFecha.get(fechaExtraida).push(examen);
            }
        });
        
        // Preparar almacenamiento para resultados de tabla comparativa con exámenes específicos
        const mapResultadosPorExamen = new Map();

        // Definir exámenes específicos por parámetro
        const EXAMENES_ESPECIFICOS = {
            'Hemograma': ['Hb', 'GB', 'N%', 'Plaq'],
            'PCR': ['PCR', 'Proca', 'VHS'],
            'Renal': ['Crea', 'BUN', 'Urea', 'Na', 'K', 'Cl', 'P', 'Ca', 'Mg'],
            'Hepático': ['BiliT', 'BiliD', 'GOT', 'GPT', 'FA', 'GGT'],
            'Nutricional': ['Prot', 'Alb', 'Prealb'],
            'Coagulación': ['INR', 'PT', 'PTT'],
            'Gases': ['pH', 'pCO2', 'HCO3', 'SatO2']
        };

        // Inicializar mapa para cada examen específico
        Object.keys(EXAMENES_ESPECIFICOS).forEach(parametro => {
            if (selectedOptions.includes(parametro)) {
                EXAMENES_ESPECIFICOS[parametro].forEach(examen => {
                    mapResultadosPorExamen.set(examen, new Map());
                });
            }
        });

        // Procesar cada fecha consolidando fragmentos
        fragmentosPorFecha.forEach((fragmentos, fechaExtraida) => {
            const textoCompleto = fragmentos.join('\n');
            this.copyPasteText = textoCompleto;

            // Extraer valores específicos por cada tipo de examen
            if (selectedOptions.includes('Hemograma')) {
                const valoresHemo = this.extractHemogramaDetallado();
                Object.keys(valoresHemo).forEach(examen => {
                    if (mapResultadosPorExamen.has(examen) && valoresHemo[examen]) {
                        mapResultadosPorExamen.get(examen).set(fechaExtraida, valoresHemo[examen]);
                    }
                });
            }
            
            if (selectedOptions.includes('PCR')) {
                const valoresPCR = this.extractPCRDetallado();
                Object.keys(valoresPCR).forEach(examen => {
                    if (mapResultadosPorExamen.has(examen) && valoresPCR[examen]) {
                        mapResultadosPorExamen.get(examen).set(fechaExtraida, valoresPCR[examen]);
                    }
                });
            }
            
            if (selectedOptions.includes('Renal')) {
                const valoresRenal = this.extractRenalDetallado();
                Object.keys(valoresRenal).forEach(examen => {
                    if (mapResultadosPorExamen.has(examen) && valoresRenal[examen]) {
                        mapResultadosPorExamen.get(examen).set(fechaExtraida, valoresRenal[examen]);
                    }
                });
            }
            
            if (selectedOptions.includes('Hepático')) {
                const valoresHepatico = this.extractHepaticoDetallado();
                Object.keys(valoresHepatico).forEach(examen => {
                    if (mapResultadosPorExamen.has(examen) && valoresHepatico[examen]) {
                        mapResultadosPorExamen.get(examen).set(fechaExtraida, valoresHepatico[examen]);
                    }
                });
            }
            
            if (selectedOptions.includes('Nutricional')) {
                const valoresNutri = this.extractNutricionalDetallado();
                Object.keys(valoresNutri).forEach(examen => {
                    if (mapResultadosPorExamen.has(examen) && valoresNutri[examen]) {
                        mapResultadosPorExamen.get(examen).set(fechaExtraida, valoresNutri[examen]);
                    }
                });
            }
            
            if (selectedOptions.includes('Coagulación')) {
                const valoresCoag = this.extractCoagulacionDetallado();
                Object.keys(valoresCoag).forEach(examen => {
                    if (mapResultadosPorExamen.has(examen) && valoresCoag[examen]) {
                        mapResultadosPorExamen.get(examen).set(fechaExtraida, valoresCoag[examen]);
                    }
                });
            }
            
            if (selectedOptions.includes('Gases')) {
                const valoresGases = this.extractGasesDetallado();
                Object.keys(valoresGases).forEach(examen => {
                    if (mapResultadosPorExamen.has(examen) && valoresGases[examen]) {
                        mapResultadosPorExamen.get(examen).set(fechaExtraida, valoresGases[examen]);
                    }
                });
            }
        });

        // Construir resultadosPorFecha para la vista de lista (compatibilidad)
        fragmentosPorFecha.forEach((fragmentos, fechaExtraida) => {
            // Unir todos los fragmentos de esta fecha
            const textoCompleto = fragmentos.join('\n\n');
            
            // Procesar el texto completo de esta fecha
            this.copyPasteText = textoCompleto;
            
            const valoresExamen = [];
            
            if (selectedOptions.includes('Hemograma')) {
                const hemo = this.extractHemograma();
                if (hemo && hemo.trim()) {
                    valoresExamen.push(hemo.trim());
                }
            }
            
            if (selectedOptions.includes('PCR')) {
                const pcr = this.extractPCR();
                if (pcr && pcr.trim()) {
                    valoresExamen.push(pcr.trim());
                }
            }
            
            if (selectedOptions.includes('Renal')) {
                const renal = this.extractRenal();
                if (renal && renal.trim()) {
                    valoresExamen.push(renal.trim());
                }
            }
            
            if (selectedOptions.includes('Hepático')) {
                const hepatico = this.extractHepatico();
                if (hepatico && hepatico.trim()) {
                    valoresExamen.push(hepatico.trim());
                }
            }
            
            if (selectedOptions.includes('Nutricional')) {
                const nutri = this.extractNutricional();
                if (nutri && nutri.trim()) {
                    valoresExamen.push(nutri.trim());
                }
            }
            
            if (selectedOptions.includes('Coagulación')) {
                const coag = this.extractCoagulacion();
                if (coag && coag.trim()) {
                    valoresExamen.push(coag.trim());
                }
            }
            
            if (selectedOptions.includes('Gases')) {
                const gases = this.extractGases();
                if (gases && gases.trim()) {
                    valoresExamen.push(gases.trim());
                }
            }
            
            // Agregar resultado consolidado con saltos de línea entre parámetros
            if (valoresExamen.length > 0) {
                // Limpiar comas finales de cada sección individualmente
                const valoresLimpios = valoresExamen.map(valor => valor.replace(/,\s*$/, ''));
                // Unir con saltos de línea para mejor legibilidad
                const contenidoCompleto = valoresLimpios.join('\n');
                resultadosPorFecha.set(fechaExtraida, contenidoCompleto);
            }
        });

        // Generar HTML de la tabla comparativa
        const generarTablaComparativa = () => {
            const fechas = Array.from(fragmentosPorFecha.keys()).sort(); // Ordenar fechas
            
            if (fechas.length === 0 || mapResultadosPorExamen.size === 0) {
                return '<p class="status-text">No hay datos suficientes para generar la tabla comparativa.</p>';
            }
            
            const tablaHTML = [`<table class="comparative-table">`];
            tablaHTML.push(`<thead><tr><th>Parámetro</th>` + fechas.map(fecha => `<th>${fecha}</th>`).join('') + `</tr></thead>`);
            tablaHTML.push('<tbody>');

            mapResultadosPorExamen.forEach((fechaMap, examen) => {
                // Verificar si todos los valores de esta fila están vacíos
                const valoresNoVacios = fechas.some(fecha => {
                    const valor = fechaMap.get(fecha) || '-';
                    return valor !== '-' && valor.trim() !== '';
                });
                
                // Solo agregar la fila si tiene al menos un valor no vacío
                if (valoresNoVacios) {
                    tablaHTML.push(`<tr><td>${examen}</td>`);
                    fechas.forEach(fecha => {
                        const valor = fechaMap.get(fecha) || '-';
                        tablaHTML.push(`<td>${valor}</td>`);
                    });
                    tablaHTML.push('</tr>');
                }
            });

            tablaHTML.push('</tbody></table>');
            return tablaHTML.join('\n');
        };

        // Actualizar contenido de la tabla comparativa
        const tablaComparativaContainer = document.querySelector('#tab-tabla .comparative-table-container');
        const tableActions = document.getElementById('tableActions');
        
        if (tablaComparativaContainer) {
            const tablaHTML = generarTablaComparativa();
            tablaComparativaContainer.innerHTML = tablaHTML;
            tablaComparativaContainer.style.display = 'block';
            tablaComparativaContainer.style.textAlign = 'left';
            tablaComparativaContainer.style.alignItems = 'flex-start';
            
            // Mostrar u ocultar botones de acción según si hay tabla
            if (tableActions) {
                if (tablaHTML.includes('<table')) {
                    tableActions.style.display = 'flex';
                } else {
                    tableActions.style.display = 'none';
                }
            }
        }
        
        // Convertir a array y ordenar por fecha
        const fechasOrdenadas = Array.from(resultadosPorFecha.entries())
            .sort(([fechaA], [fechaB]) => {
                // Convertir fechas dd/mm a números para ordenamiento
                const [diaA, mesA] = fechaA.split('/').map(Number);
                const [diaB, mesB] = fechaB.split('/').map(Number);
                const timestampA = new Date(2024, mesA - 1, diaA).getTime();
                const timestampB = new Date(2024, mesB - 1, diaB).getTime();
                return timestampA - timestampB;
            });
        
        // Construir resultado final
        const resultadosFinales = fechasOrdenadas.map(([fechaCorta, contenido]) => {
            if (contenido) {
                return selectedOptions.includes('Fecha') 
                    ? `${fechaCorta}:\n${contenido}` 
                    : contenido;
            }
            return '';
        }).filter(resultado => resultado);
        
        return resultadosFinales.join('\n\n');
    }
}

// Funciones de utilidad
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function getSelectedOptions() {
    const checkboxes = document.querySelectorAll('.selection-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function downloadAsText(content, filename = 'extraccion-medica.txt') {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Función para actualizar automáticamente los resultados
function autoExtract() {
    const extractor = new MedicalDataExtractor();
    const copyPasteText = document.getElementById('copyPasteText').value.trim();
    const selectedOptions = getSelectedOptions();
    const resultsDiv = document.getElementById('results');
    const resultsStatus = document.getElementById('resultsStatus');
    const copyArea = document.getElementById('copyArea');

    if (!copyPasteText && selectedOptions.length === 0) {
        resultsStatus.style.display = 'block';
        resultsDiv.style.display = 'none';
        copyArea.style.display = 'none';
        resultsStatus.querySelector('.status-text').textContent = 'Selecciona parámetros y pega el texto para ver los resultados automáticamente';
        return;
    }

    if (!copyPasteText) {
        resultsStatus.style.display = 'block';
        resultsDiv.style.display = 'none';
        copyArea.style.display = 'none';
        resultsStatus.querySelector('.status-text').textContent = 'Pega el texto del reporte médico para continuar';
        return;
    }

    if (selectedOptions.length === 0) {
        resultsStatus.style.display = 'block';
        resultsDiv.style.display = 'none';
        copyArea.style.display = 'none';
        resultsStatus.querySelector('.status-text').textContent = 'Selecciona al menos un parámetro para extraer';
        return;
    }

    try {
        const result = extractor.processSelection(copyPasteText, selectedOptions);
        
        if (result.trim()) {
            // Debug: Detectar sexo del paciente
            extractor.copyPasteText = copyPasteText;
            const detectedSex = extractor.detectPatientSex(copyPasteText);
            console.log('Sexo detectado:', detectedSex);
            
            // Procesar valores alterados con tooltips
            const processedResult = extractor.processAlteredValues(result);
            // Convertir saltos de línea a <br> para HTML
            const htmlResult = processedResult.replace(/\n/g, '<br>');
            resultsDiv.innerHTML = htmlResult;
            resultsDiv.style.display = 'block';
            resultsStatus.style.display = 'none';
            copyArea.style.display = 'flex';
        } else {
            resultsStatus.style.display = 'block';
            resultsDiv.style.display = 'none';
            copyArea.style.display = 'none';
            resultsStatus.querySelector('.status-text').textContent = 'No se encontraron datos con los parámetros seleccionados';
        }
    } catch (error) {
        console.error('Error en la extracción:', error);
        resultsStatus.style.display = 'block';
        resultsDiv.style.display = 'none';
        copyArea.style.display = 'none';
        resultsStatus.querySelector('.status-text').textContent = 'Error al procesar el texto';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    const copyPasteTextarea = document.getElementById('copyPasteText');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const copyBtn = document.getElementById('copyBtn');
    const resultsDiv = document.getElementById('results');

    // Event listeners para extracción automática
    // Detectar cambios en checkboxes (incluyendo los del desplegable)
    document.querySelectorAll('.selection-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', autoExtract);
    });
    
    // Agregar listeners específicos para checkboxes del desplegable
    document.querySelectorAll('.hemograma-extra').forEach(checkbox => {
        checkbox.addEventListener('change', autoExtract);
    });
    
    // Detectar cambios en el textarea con debounce
    let extractTimeout;
    copyPasteTextarea.addEventListener('input', function() {
        clearTimeout(extractTimeout);
        extractTimeout = setTimeout(autoExtract, 300); // Esperar 300ms después del último cambio
    });
    
    // Extraer inmediatamente cuando se pega contenido
    copyPasteTextarea.addEventListener('paste', function() {
        setTimeout(autoExtract, 100); // Dar tiempo para que se procese el paste
    });

    // Botón seleccionar todo
    selectAllBtn.addEventListener('click', function() {
        document.querySelectorAll('.selection-checkbox').forEach(cb => {
            // Excluir "Tal cual" y los elementos del submenú de hemograma
            if (cb.value !== 'Talcual' && !cb.classList.contains('hemograma-extra')) {
                cb.checked = true;
            }
        });
        
        // Ejecutar autoExtract para mostrar resultados
        autoExtract();
        
        showNotification('Todos los parámetros seleccionados', 'info');
    });

    // Botón borrar todo (deseleccionar)
    clearAllBtn.addEventListener('click', function() {
        // Deseleccionar todos los checkboxes
        document.querySelectorAll('.selection-checkbox').forEach(cb => cb.checked = false);
        
        // Ejecutar autoExtract para limpiar resultados
        autoExtract();
        
        showNotification('Selección borrada', 'info');
    });

    // Botón copiar resultado
    copyBtn.addEventListener('click', function() {
        const resultText = resultsDiv.textContent;
        
        if (!resultText) {
            showNotification('No hay resultados para copiar', 'error');
            return;
        }

        navigator.clipboard.writeText(resultText).then(() => {
            showNotification('Resultado copiado al portapapeles', 'success');
        }).catch(() => {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = resultText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Resultado copiado al portapapeles', 'success');
        });
    });


    // Atajos de teclado
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'Delete':
                case 'Backspace':
                    if (e.shiftKey) {
                        e.preventDefault();
                        clearAllBtn.click();
                    }
                    break;
            }
        }
    });
    
    // Funcionalidad de pestañas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remover clase active de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Agregar clase active al botón clickeado y su contenido correspondiente
            this.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
    
    // Ejecutar autoExtract inicial para mostrar el estado por defecto
    autoExtract();
    
    // Inicializar funcionalidad del desplegable de hemograma
    initializeHemogramaDropdown();
    
    // Funcionalidad para botones de acción de la tabla
    const downloadImageBtn = document.getElementById('downloadImageBtn');
    
    // Descargar tabla como imagen
    downloadImageBtn.addEventListener('click', function() {
        const tableContainer = document.querySelector('.comparative-table-container');
        const table = tableContainer.querySelector('.comparative-table');
        
        if (!table) {
            showNotification('No hay tabla para descargar', 'error');
            return;
        }
        
        downloadImageBtn.disabled = true;
        downloadImageBtn.innerHTML = '<span class="copy-icon">⏳</span><span class="copy-text">Generando...</span>';
        
        // Configurar html2canvas para mejor calidad
        html2canvas(table, {
            scale: 2, // Mayor resolución
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            width: table.scrollWidth,
            height: table.scrollHeight
        }).then(canvas => {
            // Crear enlace de descarga
            const link = document.createElement('a');
            link.download = `tabla-comparativa-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png');
            
            // Descargar
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Tabla descargada como imagen', 'success');
        }).catch(error => {
            console.error('Error al generar imagen:', error);
            showNotification('Error al generar la imagen', 'error');
        }).finally(() => {
            downloadImageBtn.disabled = false;
            downloadImageBtn.innerHTML = '<span class="copy-icon">📸</span><span class="copy-text">Descargar como Imagen</span>';
        });
    });
    
    // Descargar tabla como PDF
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    downloadPdfBtn.addEventListener('click', function() {
        const tableContainer = document.querySelector('.comparative-table-container');
        const table = tableContainer.querySelector('.comparative-table');
        
        if (!table) {
            showNotification('No hay tabla para descargar', 'error');
            return;
        }
        
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.innerHTML = '<span class="copy-icon">⏳</span><span class="copy-text">Generando PDF...</span>';
        
        // Configurar html2canvas para mejor calidad
        html2canvas(table, {
            scale: 2, // Mayor resolución
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            width: table.scrollWidth,
            height: table.scrollHeight
        }).then(canvas => {
            // Crear PDF con jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait', // Orientación vertical
                unit: 'mm',
                format: 'a4'
            });
            
            // Dimensiones del PDF (A4 vertical)
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Márgenes de 15 mm por lado
            const margin = 15;
            const availableWidth = pdfWidth - (margin * 2);
            const availableHeight = pdfHeight - (margin * 2);
            
            // Dimensiones del canvas
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            // Calcular escala para ajustar la imagen al área disponible (con márgenes)
            const scaleX = availableWidth / canvasWidth;
            const scaleY = availableHeight / canvasHeight;
            const scale = Math.min(scaleX, scaleY);
            
            // Dimensiones finales de la imagen en el PDF
            const imgWidth = canvasWidth * scale;
            const imgHeight = canvasHeight * scale;
            
            // Centrar la imagen en el área disponible (considerando márgenes)
            const x = margin + (availableWidth - imgWidth) / 2;
            const y = margin + (availableHeight - imgHeight) / 2;
            
            // Convertir canvas a imagen y añadirla al PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            
            // Abrir el PDF en una nueva ventana
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            // Crear nombre del archivo
            const fileName = `tabla-comparativa-${new Date().toISOString().split('T')[0]}.pdf`;
            
            // Abrir en nueva pestaña
            const newWindow = window.open(pdfUrl, '_blank');
            
            // Verificar si la ventana se abrió correctamente
            if (newWindow) {
                // Opcional: limpiar la URL después de un tiempo
                setTimeout(() => {
                    URL.revokeObjectURL(pdfUrl);
                }, 1000);
                showNotification('PDF abierto en nueva pestaña', 'success');
            } else {
                // Si el navegador bloqueó la ventana emergente, ofrecer descarga como alternativa
                const link = document.createElement('a');
                link.download = fileName;
                link.href = pdfUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(pdfUrl);
                showNotification('PDF descargado (ventana emergente bloqueada)', 'success');
            }
        }).catch(error => {
            console.error('Error al generar PDF:', error);
            showNotification('Error al generar el PDF', 'error');
        }).finally(() => {
            downloadPdfBtn.disabled = false;
            downloadPdfBtn.innerHTML = '<span class="copy-icon">📄</span><span class="copy-text">Generar PDF</span>';
        });
    });
    
    // Frases aleatorias para el footer
    const footerPhrases = [
        "Así como que rápido no sé...",
        "Solo las pulgas están incorporadas",
        "I'm not a very good dogtor, but I can",
        "Quejas y amenazas a a.vasquez080@ufromail.cl",
        "No estoi ni ahi con anotar Toxo",
        "Me llamo... el Marto",
        "Ánimo, tenedor, cuchillo",
        "Dr. Sáez"
    ];
    
    const footerIcon = document.getElementById('footerIcon');
    if (footerIcon) {
        footerIcon.addEventListener('mouseenter', () => {
            const randomIndex = Math.floor(Math.random() * footerPhrases.length);
            const randomPhrase = footerPhrases[randomIndex];
            footerIcon.setAttribute('title', randomPhrase);
        });
    }
    
});

// Función para crear enlace online usando servicios de hosting temporal
async function createOnlineLink(htmlContent) {
    // Intentar múltiples servicios de hosting temporal
    
    // Servicio 1: tmpfiles.org (sin CORS)
    try {
        const response = await fetch('https://tmpfiles.org/api/v1/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                file: btoa(unescape(encodeURIComponent(htmlContent))),
                name: `tabla-comparativa-${Date.now()}.html`
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.url) {
                return result.data.url;
            }
        }
    } catch (error) {
        console.log('tmpfiles.org no disponible:', error);
    }
    
    // Servicio 2: 0x0.st (minimalista)
    try {
        const formData = new FormData();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        formData.append('file', blob, `tabla-${Date.now()}.html`);
        
        const response = await fetch('https://0x0.st', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const url = await response.text();
            if (url && url.trim().startsWith('http')) {
                return url.trim();
            }
        }
    } catch (error) {
        console.log('0x0.st no disponible:', error);
    }
    
    // Servicio 3: file.io
    try {
        const formData = new FormData();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        formData.append('file', blob);
        
        const response = await fetch('https://file.io/', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.link) {
                return result.link;
            }
        }
    } catch (error) {
        console.log('file.io no disponible:', error);
    }
    
    return null; // Si ningún servicio funcionó
}

// Función para mostrar opciones de hosting cuando falla la generación automática
function showHostingOptions(htmlContent) {
    // Descargar el HTML automáticamente
    downloadHTMLFallback(htmlContent);
    
    // Mostrar modal con instrucciones
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 32px;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80%;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        text-align: left;
        animation: slideIn 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin: 0 0 16px 0; color: #1a1a1a; text-align: center;">📂 Archivo HTML Descargado</h3>
        <p style="margin: 0 0 20px 0; color: #6b7280; text-align: center;">El archivo HTML se ha descargado. Para crear un enlace compartible, súbelo a cualquiera de estos servicios <strong>gratuitos</strong>:</p>
        
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #3b82f6;">
            <h4 style="margin: 0 0 12px 0; color: #1f2937;">🚀 Opciones Recomendadas (Gratuitas):</h4>
            
            <div style="margin: 12px 0;">
                <strong>1. GitHub Pages</strong> (Permanente)
                <ul style="margin: 4px 0 0 16px; color: #6b7280;">
                    <li>Crear repositorio en <a href="https://github.com" target="_blank" style="color: #3b82f6;">github.com</a></li>
                    <li>Subir el archivo HTML</li>
                    <li>Activar GitHub Pages en Settings</li>
                    <li>Obtienes: <code>https://tuusuario.github.io/repo/archivo.html</code></li>
                </ul>
            </div>
            
            <div style="margin: 12px 0;">
                <strong>2. Netlify Drop</strong> (Muy fácil)
                <ul style="margin: 4px 0 0 16px; color: #6b7280;">
                    <li>Ir a <a href="https://netlify.com/drop" target="_blank" style="color: #3b82f6;">netlify.com/drop</a></li>
                    <li>Arrastrar el archivo HTML</li>
                    <li>Obtienes enlace inmediato</li>
                </ul>
            </div>
            
            <div style="margin: 12px 0;">
                <strong>3. Surge.sh</strong> (Solo terminal)
                <ul style="margin: 4px 0 0 16px; color: #6b7280;">
                    <li>Instalar: <code>npm install -g surge</code></li>
                    <li>Ejecutar: <code>surge</code></li>
                    <li>Seleccionar el archivo HTML</li>
                </ul>
            </div>
        </div>
        
        <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #ef4444;">
            <h4 style="margin: 0 0 8px 0; color: #dc2626;">💡 Consejos:</h4>
            <ul style="margin: 0 0 0 16px; color: #7f1d1d;">
                <li>El enlace será público y accesible por cualquier persona</li>
                <li>GitHub Pages es la opción más permanente</li>
                <li>Netlify Drop es la más rápida (solo arrastra y listo)</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin-top: 24px;">
            <button onclick="closeHostingModal()" style="padding: 12px 24px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">✕ Cerrar</button>
            <button onclick="window.open('https://netlify.com/drop', '_blank')" style="padding: 12px 24px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; margin-left: 12px;">🚀 Ir a Netlify Drop</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Agregar función para cerrar modal
    window.closeHostingModal = function() {
        modal.remove();
    };
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeHostingModal();
        }
    });
}

// Función para generar HTML simplificado (más compacto)
function generateSimplifiedTableHTML(table) {
    const tableHTML = table.outerHTML;
    
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tabla Comparativa</title><style>body{font-family:sans-serif;margin:20px;background:#f5f5f5}table{width:100%;border-collapse:collapse;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.1)}th,td{padding:8px 12px;border:1px solid #ddd;text-align:left}th{background:#4E80EE;color:white;font-weight:bold}th:first-child{background:#4E80EE}td:first-child{background:#f8f9fa;font-weight:600}td:not(:first-child){text-align:center;font-family:monospace}tr:hover{background:#f8faff}</style></head><body><h2>🩺 Tabla Comparativa de Laboratorio</h2>${tableHTML}<p style="text-align:center;color:#666;margin-top:20px;">Generado por Extractor HIS - ${new Date().toLocaleDateString()}</p></body></html>`;
}

// Función fallback para descargar HTML
function downloadHTMLFallback(htmlContent) {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `tabla-comparativa-${timestamp}.html`;
    link.href = URL.createObjectURL(blob);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Función para mostrar modal con el enlace compartible
function showShareModal(url) {
    // Crear modal dinámicamente
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 32px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin: 0 0 16px 0; color: #1a1a1a;">🎉 ¡Enlace generado exitosamente!</h3>
        <p style="margin: 0 0 20px 0; color: #6b7280;">Tu tabla comparativa está disponible en:</p>
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin: 16px 0; border: 1px solid #e5e7eb;">
            <input type="text" value="${url}" readonly style="width: 100%; border: none; background: none; text-align: center; color: #3b82f6; font-family: monospace; font-size: 14px;" id="shareUrl">
        </div>
        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 20px;">
            <button onclick="window.open('${url}', '_blank')" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">🔗 Abrir enlace</button>
            <button onclick="copyShareUrl()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">📋 Copiar URL</button>
            <button onclick="closeShareModal()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">✕ Cerrar</button>
        </div>
        <p style="margin: 20px 0 0 0; font-size: 12px; color: #9ca3af;">⚠️ Nota: El enlace puede expirar en 30 días</p>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeShareModal();
        }
    });
    
    // Funciones globales para el modal
    window.closeShareModal = function() {
        modal.remove();
        style.remove();
    };
    
    window.copyShareUrl = function() {
        const urlInput = document.getElementById('shareUrl');
        urlInput.select();
        navigator.clipboard.writeText(url).then(() => {
            showNotification('URL copiada al portapapeles', 'success');
        });
    };
}

// Función para generar HTML autónomo de la tabla
function generateStandaloneTableHTML(table) {
    const tableHTML = table.outerHTML;
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabla Comparativa - Extractor HIS</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif;
            background: #fafafa;
            margin: 0;
            padding: 20px;
            line-height: 1.5;
            color: #1a1a1a;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #1a1a1a;
            margin-bottom: 24px;
            font-size: 1.75rem;
            font-weight: 600;
            text-align: center;
        }
        .comparative-table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
        }
        .comparative-table thead {
            background: #f8fafc;
            border-bottom: 2px solid #e5e7eb;
        }
        .comparative-table th {
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            font-size: 0.875rem;
            border-right: 1px solid #e5e7eb;
        }
        .comparative-table th:first-child {
            background: #4E80EE;
            color: #ffffff;
            font-weight: 700;
            min-width: 120px;
        }
        .comparative-table th:last-child {
            border-right: none;
        }
        .comparative-table tbody tr {
            border-bottom: 1px solid #f1f5f9;
            transition: background-color 0.15s ease;
        }
        .comparative-table tbody tr:hover {
            background: #f8faff;
        }
        .comparative-table tbody tr:last-child {
            border-bottom: none;
        }
        .comparative-table td {
            padding: 10px 16px;
            color: #374151;
            font-size: 0.8rem;
            border-right: 1px solid #f1f5f9;
            vertical-align: top;
            line-height: 1.4;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        }
        .comparative-table td:first-child {
            font-weight: 600;
            background: #f8fafc;
            color: #1f2937;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            border-right: 2px solid #e5e7eb;
        }
        .comparative-table td:last-child {
            border-right: none;
        }
        .comparative-table td:not(:first-child) {
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.875rem;
        }
        @media (max-width: 768px) {
            .container {
                padding: 16px;
                margin: 10px;
            }
            .comparative-table {
                font-size: 0.75rem;
            }
            .comparative-table th,
            .comparative-table td {
                padding: 8px 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🩺 Tabla Comparativa de Laboratorio</h1>
        ${tableHTML}
        <div class="footer">
            <p>Generado por Extractor de Valores de Laboratorio HIS</p>
            <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>
    </div>
</body>
</html>`;
}

// Funcionalidad del desplegable de hemograma
function initializeHemogramaDropdown() {
    console.log('=== INICIANDO DESPLEGABLE DE HEMOGRAMA ===');
    
    const dropdownToggle = document.querySelector('.dropdown-toggle-inline');
    const dropdownContent = document.getElementById('hemograma-dropdown');
    
    console.log('Botón desplegable encontrado:', !!dropdownToggle);
    console.log('Contenido desplegable encontrado:', !!dropdownContent);
    
    if (dropdownToggle) {
        console.log('Elemento del botón:', dropdownToggle);
        console.log('Atributos del botón:', dropdownToggle.attributes);
    }
    
    if (dropdownContent) {
        console.log('Elemento del contenido:', dropdownContent);
        console.log('Clases del contenido:', dropdownContent.classList);
    }
    
    if (!dropdownToggle || !dropdownContent) {
        console.error('FALLA: No se encontraron elementos del desplegable');
        console.log('Todos los elementos con clase dropdown-toggle-inline:', document.querySelectorAll('.dropdown-toggle-inline'));
        console.log('Todos los elementos con ID hemograma-dropdown:', document.querySelectorAll('#hemograma-dropdown'));
        return;
    }
    
    console.log('Agregando event listener al botón desplegable...');
    
    // Evento para abrir/cerrar desplegable
    dropdownToggle.addEventListener('click', function(e) {
        console.log('=== CLIC EN BOTÓN DESPLEGABLE ===');
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = dropdownContent.classList.contains('show');
        console.log('Estado actual - isOpen:', isOpen);
        console.log('Clases del contenido antes:', Array.from(dropdownContent.classList));
        
        if (isOpen) {
            dropdownContent.classList.remove('show');
            dropdownToggle.classList.remove('active');
            console.log('✓ Desplegable cerrado');
        } else {
            dropdownContent.classList.add('show');
            dropdownToggle.classList.add('active');
            console.log('✓ Desplegable abierto');
        }
        
        console.log('Clases del contenido después:', Array.from(dropdownContent.classList));
        console.log('Clases del botón después:', Array.from(dropdownToggle.classList));
    });
    
    // Test adicional: agregar un listener simple para verificar que funciona
    dropdownToggle.addEventListener('mouseenter', function() {
        console.log('Mouse entró en el botón desplegable');
    });
    
    // Cerrar desplegable al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!dropdownToggle.contains(e.target) && !dropdownContent.contains(e.target)) {
            dropdownContent.classList.remove('show');
            dropdownToggle.classList.remove('active');
            console.log('Desplegable cerrado por clic fuera');
        }
    });
    
    // Prevenir cierre del desplegable al hacer clic dentro
    dropdownContent.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Clic dentro del desplegable - propagación detenida');
    });
    
    // Agregar event listeners a las opciones adicionales
    const hemogramaExtraCheckboxes = document.querySelectorAll('.hemograma-extra');
    console.log('Checkboxes extras encontrados:', hemogramaExtraCheckboxes.length);
    hemogramaExtraCheckboxes.forEach((checkbox, index) => {
        console.log(`Checkbox ${index}:`, checkbox.value);
        checkbox.addEventListener('change', autoExtract);
    });
    
    // Agregar funcionalidad a los botones del dropdown
    const selectAllHemogramaBtn = document.getElementById('selectAllHemogramaBtn');
    const clearAllHemogramaBtn = document.getElementById('clearAllHemogramaBtn');
    
    if (selectAllHemogramaBtn) {
        selectAllHemogramaBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Seleccionando todos los parámetros adicionales de hemograma');
            
            hemogramaExtraCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            
            autoExtract();
        });
    }
    
    if (clearAllHemogramaBtn) {
        clearAllHemogramaBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Borrando todos los parámetros adicionales de hemograma');
            
            hemogramaExtraCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            autoExtract();
        });
    }
    
    console.log('=== INICIALIZACIÓN COMPLETA ===');
}

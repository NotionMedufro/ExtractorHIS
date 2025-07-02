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

    // Función auxiliar para extraer usando regex con lookbehind y lookahead
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

    // Función auxiliar para reemplazar asteriscos
    cleanAsterisks(text) {
        return text.replace(/\* /g, '*');
    }

    // Extracción de Hemograma + PCR (basado en tu fórmula de Notion)
    extractHemograma() {
        if (!this.copyPasteText) return '';

        let result = '';

        // Hemoglobina
        const hbMatch = this.extractMatch(this.copyPasteText, /Hemoglobina[\s\S]*?(\d+\.?\d*)\s+g\/dL/);
        if (hbMatch) {
            const hbValue = this.extractMatch(hbMatch, /(\d+\.?\d*)\s+g\/dL/);
            const hbNumber = this.extractMatch(hbValue, /\d+\.?\d*/);
            result += `Hb: ${hbNumber}, `;
        }

        // Leucocitos
        const gbMatch = this.extractMatch(this.copyPasteText, /Recuento de Leucocitos[\s\S]*?(\d+\.?\d*)\s+10e3\/uL/);
        if (gbMatch) {
            const gbValue = this.extractMatch(gbMatch, /(\d+\.?\d*)\s+10e3\/uL/);
            const gbNumber = this.extractMatch(gbValue, /\d+\.?\d*/);
            result += `GB: ${gbNumber}0 `;
        }

        // % de Neutrófilos
        const neutMatch = this.extractMatch(this.copyPasteText, /Neutrófilos %[\s\S]*?(\d+\.?\d*)\s+%/);
        if (neutMatch) {
            const neutValue = this.extractMatch(neutMatch, /(\d+\.?\d*)\s+%/);
            const neutNumber = this.extractMatch(neutValue, /\d+\.?\d*/);
            const neutRounded = Math.round(parseFloat(neutNumber));
            result += `(N: ${neutRounded}%), `;
        }

        // Plaquetas
        const plqMatch = this.extractMatch(this.copyPasteText, /Recuento de Plaquetas[\s\S]*?(\d+\.?\d*)\s+10e3\/uL/);
        if (plqMatch) {
            const plqValue = this.extractMatch(plqMatch, /(\d+\.?\d*)\s+10e3\/uL/);
            const plqNumber = this.extractMatch(plqValue, /\d+\.?\d*/);
            result += `Plq: ${plqNumber}.000, `;
        }

        // PCR
        const pcrMatch = this.extractMatch(this.copyPasteText, /Proteína C Reactiva[\s\S]*?(\d+\.?\d*)\s+mg\/L/);
        if (pcrMatch) {
            const pcrValue = this.extractMatch(pcrMatch, /(\d+\.?\d*)\s+mg\/L/);
            const pcrNumber = this.extractMatch(pcrValue, /\d+\.?\d*/);
            result += `PCR: ${pcrNumber}, `;
        }

        // Procalcitonina
        const procaMatch = this.extractMatch(this.copyPasteText, /Procalcitonina[\s\S]*?(\d+\.?\d*)\s+ng\/mL/);
        if (procaMatch) {
            const procaValue = this.extractMatch(procaMatch, /(\d+\.?\d*)\s+ng\/mL/);
            const procaNumber = this.extractMatch(procaValue, /\d+\.?\d*/);
            result += `Proca: ${procaNumber}, `;
        }

        return this.cleanAsterisks(result);
    }

    // Extracción de Función Renal
    extractRenal() {
        if (!this.copyPasteText) return '';

        let values = [];

        // Creatinina
        const creaMatch = this.extractMatch(this.copyPasteText, /Creatinina[\s\S]*?(\d+\.?\d*)\s+mg\/dL/);
        if (creaMatch) {
            const creaValue = this.extractMatch(creaMatch, /(\d+\.?\d*)\s+mg\/dL/);
            const creaNumber = this.extractMatch(creaValue, /\d+\.?\d*/);
            values.push(`Crea: ${creaNumber}`);
        }

        // BUN (Nitrógeno Ureico)
        const bunMatch = this.extractMatch(this.copyPasteText, /Nitrógeno Ureico[\s\S]*?(\d+\.?\d*)\s+mg/);
        if (bunMatch) {
            const bunValue = this.extractMatch(bunMatch, /(\d+\.?\d*)\s+mg/);
            const bunNumber = this.extractMatch(bunValue, /\d+\.?\d*/);
            values.push(`BUN: ${bunNumber}`);
        }

        // ELP: Sodio/Potasio/Cloro
        const naMatch = this.extractMatch(this.copyPasteText, /Sodio[\s\S]*?(\d+\.?\d*)\s+mEq\/L/);
        const kMatch = this.extractMatch(this.copyPasteText, /Potasio[\s\S]*?(\d+\.?\d*)\s+mEq\/L/);
        const clMatch = this.extractMatch(this.copyPasteText, /Cloro[\s\S]*?(\d+\.?\d*)\s+mEq\/L/);
        
        if (naMatch && kMatch && clMatch) {
            const naValue = this.extractMatch(naMatch, /(\d+\.?\d*)\s+mEq\/L/);
            const naNumber = this.extractMatch(naValue, /\d+\.?\d*/);
            
            const kValue = this.extractMatch(kMatch, /(\d+\.?\d*)\s+mEq\/L/);
            const kNumber = this.extractMatch(kValue, /\d+\.?\d*/);
            
            const clValue = this.extractMatch(clMatch, /(\d+\.?\d*)\s+mEq\/L/);
            const clNumber = this.extractMatch(clValue, /\d+\.?\d*/);
            
            values.push(`ELP: ${naNumber}/${kNumber}/${clNumber}`);
        }

        // Fósforo
        const pMatch = this.extractMatch(this.copyPasteText, /Fósforo[\s\S]*?(\d+\.?\d*)\s+mg\/dL/);
        if (pMatch) {
            const pValue = this.extractMatch(pMatch, /(\d+\.?\d*)\s+mg\/dL/);
            const pNumber = this.extractMatch(pValue, /\d+\.?\d*/);
            values.push(`P: ${pNumber}`);
        }

        // Calcio
        const caMatch = this.extractMatch(this.copyPasteText, /Calcio[\s\S]*?(\d+\.?\d*)\s+mg\/dL/);
        if (caMatch) {
            const caValue = this.extractMatch(caMatch, /(\d+\.?\d*)\s+mg\/dL/);
            const caNumber = this.extractMatch(caValue, /\d+\.?\d*/);
            values.push(`Ca: ${caNumber}`);
        }

        const result = values.length > 0 ? values.join(', ') + ', ' : '';
        return this.cleanAsterisks(result);
    }

    // Extracción de Función Hepática
    extractHepatico() {
        if (!this.copyPasteText) return '';

        let result = '';

        // Bilirrubina Total/Directa
        const biliTMatch = this.extractMatch(this.copyPasteText, /Bilirrubina Total[\s\S]*?(\d+\.?\d*)\s+mg\/dL/);
        const biliDMatch = this.extractMatch(this.copyPasteText, /Bilirrubina Directa[\s\S]*?(\d+\.?\d*)\s+mg\/dL/);
        
        if (biliTMatch && biliDMatch) {
            const biliTValue = this.extractMatch(biliTMatch, /\d+\.?\d*/);
            const biliDValue = this.extractMatch(biliDMatch, /\d+\.?\d*/);
            result += `BiliT/D: ${biliTValue}/${biliDValue}, `;
        }

        // GOT/GPT (Transaminasas)
        const gotMatch = this.extractMatch(this.copyPasteText, /Transaminasa GOT\/ASAT[\s\S]*?(\d+\.?\d*)\s+U\/L/);
        const gptMatch = this.extractMatch(this.copyPasteText, /Transaminasa GPT\/\s?ALT[\s\S]*?(\d+\.?\d*)\s+U\/L/);
        
        if (gotMatch && gptMatch) {
            const gotValue = this.extractMatch(gotMatch, /\d+\.?\d*/);
            const gptValue = this.extractMatch(gptMatch, /\d+\.?\d*/);
            result += `GOT/GPT: ${gotValue}/${gptValue}, `;
        }

        // Fosfatasa Alcalina
        const faMatch = this.extractMatch(this.copyPasteText, /Fosfatasa Alcalina[\s\S]*?(\d+\.?\d*)\s+U\/L/);
        if (faMatch) {
            const faValue = this.extractMatch(faMatch, /\d+\.?\d*/);
            result += `FA: ${faValue}, `;
        }

        // GGT
        const ggtMatch = this.extractMatch(this.copyPasteText, /Gamma Glutamiltranspeptidasa[\s\S]*?(\d+\.?\d*)\s+U\/L/);
        if (ggtMatch) {
            const ggtValue = this.extractMatch(ggtMatch, /\d+\.?\d*/);
            result += `GGT: ${ggtValue}`;
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
        
        // Patrón 3: Fecha al inicio de línea "dd/mm/yyyy"
        if (!fechaMatch) {
            fechaMatch = this.extractMatch(this.copyPasteText, /^(\d{2}\/\d{2}\/\d{4})/);
        }
        
        // Patrón 4: Cualquier fecha en formato dd/mm/yyyy
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
        // Dividir por patrones que indican inicio de nuevo examen
        const examenes = [];
        
        // Buscar patrones que indican inicio de examen
        const patterns = [
            /Fecha \d{2}\/\d{2}\/\d{4}/g,
            /F\. Registro: \d{2}\/\d{2}\/\d{4}/g,
            /SERVICIO DE SALUD ARAUCANIA SUR(?=.*HOSPITAL)/g
        ];
        
        // Encontrar todas las posiciones de inicio de examen
        let splits = [];
        patterns.forEach(pattern => {
            let match;
            const regex = new RegExp(pattern.source, 'g');
            while ((match = regex.exec(text)) !== null) {
                splits.push(match.index);
            }
        });
        
        // Ordenar posiciones y eliminar duplicados
        splits = [...new Set(splits)].sort((a, b) => a - b);
        
        // Si no hay divisiones claras, tratar como un solo examen
        if (splits.length <= 1) {
            return [text];
        }
        
        // Dividir el texto en fragmentos
        for (let i = 0; i < splits.length; i++) {
            const start = splits[i];
            const end = splits[i + 1] || text.length;
            const fragment = text.substring(start, end).trim();
            if (fragment.length > 100) { // Solo incluir fragmentos significativos
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

    // Función principal de procesamiento
    processSelection(copyPasteText, selectedOptions) {
        if (selectedOptions.includes('Talcual')) {
            return copyPasteText;
        }

        // Dividir el texto en múltiples exámenes
        const examenes = this.splitExamenes(copyPasteText);
        
        // Si solo hay un examen, procesarlo normalmente
        if (examenes.length === 1) {
            return this.processSingleExamen(copyPasteText, selectedOptions);
        }
        
        // Procesar múltiples exámenes
        const examenesConFecha = examenes.map(examen => {
            const fechaCompleta = this.extractFechaCompleta(examen);
            const resultado = this.processSingleExamen(examen, selectedOptions, selectedOptions.includes('Fecha'));
            
            return {
                fecha: fechaCompleta,
                fechaObj: this.parseFecha(fechaCompleta),
                resultado: resultado.trim()
            };
        }).filter(examen => examen.resultado); // Solo incluir exámenes con resultados
        
        // Ordenar por fecha
        examenesConFecha.sort((a, b) => a.fechaObj - b.fechaObj);
        
        // Combinar resultados
        const resultadosFinales = examenesConFecha.map(examen => examen.resultado);
        
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
            resultsDiv.textContent = result;
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
    // Detectar cambios en checkboxes
    document.querySelectorAll('.selection-checkbox').forEach(checkbox => {
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
            if (cb.value !== 'Talcual') { // No seleccionar "Tal cual" automáticamente
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
    
    // Ejecutar autoExtract inicial para mostrar el estado por defecto
    autoExtract();
});

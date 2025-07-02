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
    

    // Extracción de Hemograma + PCR (optimizado para formato específico del laboratorio)
    extractHemograma() {
        if (!this.copyPasteText) return '';

        let result = '';

        // Hemoglobina - Buscar patrón específico: "Hemoglobina * 9.7 g/dL"
        let hbMatch = this.copyPasteText.match(/Hemoglobina\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i);
        if (hbMatch) {
            const hasAsterisk = hbMatch[1] === '*';
            const value = hasAsterisk ? `*${hbMatch[2]}` : hbMatch[2];
            result += `Hb: ${value}, `;
        }

        // Leucocitos - Buscar patrón: "Recuento de Leucocitos 5.67 10e3/uL"
        let gbMatch = this.copyPasteText.match(/(?:Recuento de )?Leucocitos\s*\*?\s*(\d+\.?\d*)\s+10e3\/uL/i);
        if (gbMatch) {
            // Formatear correctamente (ej: 5.67 → 5.670)
            const gbFormatted = parseFloat(gbMatch[1]).toFixed(3);
            result += `GB: ${gbFormatted} `;
        }

        // % de Neutrófilos - Buscar patrón: "Neutrófilos % * 72.4 %"
        let neutMatch = this.copyPasteText.match(/Neutrófilos\s*%\s*\*?\s*(\d+\.?\d*)\s*%/i);
        if (neutMatch) {
            const neutRounded = Math.round(parseFloat(neutMatch[1]));
            result += `(N: ${neutRounded}%), `;
        }

        // Plaquetas - Buscar patrón: "Recuento de Plaquetas 364 10e3/uL"
        let plqMatch = this.copyPasteText.match(/(?:Recuento de )?Plaquetas\s*\*?\s*(\d+)\s+10e3\/uL/i);
        if (plqMatch) {
            result += `Plq: ${plqMatch[1]}.000, `;
        }

        // PCR - Buscar patrón: "Proteína C Reactiva * 156.0 mg/L"
        let pcrMatch = this.copyPasteText.match(/Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i);
        if (pcrMatch) {
            result += `PCR: ${pcrMatch[1]}, `;
        }

        // Procalcitonina
        let procaMatch = this.copyPasteText.match(/Procalcitonina\s*\*?\s*(\d+\.?\d*)\s+ng\/mL/i);
        if (procaMatch) {
            result += `Proca: ${procaMatch[1]}, `;
        }

        return this.cleanAsterisks(result);
    }

    // Extracción de Función Renal
    extractRenal() {
        if (!this.copyPasteText) return '';

        let values = [];

        // Creatinina
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

        // ELP: Sodio/Potasio/Cloro
        const naMatch = this.extractMatch(this.copyPasteText, /Sodio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mEq\/L/);
        const kMatch = this.extractMatch(this.copyPasteText, /Potasio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mEq\/L/);
        const clMatch = this.extractMatch(this.copyPasteText, /Cloro[\s\S]*?(\*?\s*\d+\.?\d*)\s+mEq\/L/);
        
        if (naMatch && kMatch && clMatch) {
            const naValue = this.extractMatch(naMatch, /(\*?\s*\d+\.?\d*)\s+mEq\/L/);
            const naNumber = this.extractMatch(naValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            
            const kValue = this.extractMatch(kMatch, /(\*?\s*\d+\.?\d*)\s+mEq\/L/);
            const kNumber = this.extractMatch(kValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            
            const clValue = this.extractMatch(clMatch, /(\*?\s*\d+\.?\d*)\s+mEq\/L/);
            const clNumber = this.extractMatch(clValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            
            values.push(`ELP: ${naNumber}/${kNumber}/${clNumber}`);
        }

        // Fósforo
        const pMatch = this.extractMatch(this.copyPasteText, /Fósforo[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (pMatch) {
            const pValue = this.extractMatch(pMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            const pNumber = this.extractMatch(pValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            values.push(`P: ${pNumber}`);
        }

        // Calcio
        const caMatch = this.extractMatch(this.copyPasteText, /Calcio[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        if (caMatch) {
            const caValue = this.extractMatch(caMatch, /(\*?\s*\d+\.?\d*)\s+mg\/dL/);
            const caNumber = this.extractMatch(caValue, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
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
        const biliTMatch = this.extractMatch(this.copyPasteText, /Bilirrubina Total[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        const biliDMatch = this.extractMatch(this.copyPasteText, /Bilirrubina Directa[\s\S]*?(\*?\s*\d+\.?\d*)\s+mg\/dL/);
        
        if (biliTMatch && biliDMatch) {
            const biliTValue = this.extractMatch(biliTMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            const biliDValue = this.extractMatch(biliDMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            result += `BiliT/D: ${biliTValue}/${biliDValue}, `;
        } else if (biliTMatch) {
            // Solo Bilirrubina Total
            const biliTValue = this.extractMatch(biliTMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            result += `BiliT: ${biliTValue}, `;
        } else if (biliDMatch) {
            // Solo Bilirrubina Directa
            const biliDValue = this.extractMatch(biliDMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            result += `BiliD: ${biliDValue}, `;
        }

        // GOT/GPT (Transaminasas)
        const gotMatch = this.extractMatch(this.copyPasteText, /Transaminasa GOT\/ASAT[\s\S]*?(\*?\s*\d+\.?\d*)\s+U\/L/);
        const gptMatch = this.extractMatch(this.copyPasteText, /Transaminasa GPT\/\s?ALT[\s\S]*?(\*?\s*\d+\.?\d*)\s+U\/L/);
        
        if (gotMatch && gptMatch) {
            const gotValue = this.extractMatch(gotMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            const gptValue = this.extractMatch(gptMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            result += `GOT/GPT: ${gotValue}/${gptValue}, `;
        }

        // Fosfatasa Alcalina
        const faMatch = this.extractMatch(this.copyPasteText, /Fosfatasa Alcalina[\s\S]*?(\*?\s*\d+\.?\d*)\s+U\/L/);
        if (faMatch) {
            const faValue = this.extractMatch(faMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
            result += `FA: ${faValue}, `;
        }

        // GGT
        const ggtMatch = this.extractMatch(this.copyPasteText, /Gamma Glutamiltranspeptidasa[\s\S]*?(\*?\s*\d+\.?\d*)\s+U\/L/);
        if (ggtMatch) {
            const ggtValue = this.extractMatch(ggtMatch, /\*?\s*\d+\.?\d*/).replace(/\s+/g, '');
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
        
        // PCR
        let pcrMatch = this.copyPasteText.match(/Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i);
        if (pcrMatch) {
            valores.PCR = pcrMatch[1];
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

    // Función para dividir el texto por F. Registro:
    splitExamenesByRegistro(text) {
        // Dividir por el patrón "F. Registro:"
        const examenes = [];
        const matches = [];
        let match;
        
        // Buscar todas las ocurrencias de "F. Registro:"
        const registroPattern = /F\. Registro:/g;
        while ((match = registroPattern.exec(text)) !== null) {
            matches.push(match.index);
        }
        
        // Si no hay "F. Registro:", devolver el texto completo
        if (matches.length === 0) {
            return [text];
        }
        
        // Dividir el texto en fragmentos
        for (let i = 0; i < matches.length; i++) {
            const start = matches[i];
            const end = matches[i + 1] || text.length;
            const fragment = text.substring(start, end).trim();
            
            if (fragment.length > 100) { // Solo incluir fragmentos significativos
                examenes.push(fragment);
            }
        }
        
        return examenes.length > 0 ? examenes : [text];
    }
    
    // Función para extraer fecha de un examen específico
    extractFechaFromExamen(examenText) {
        if (!examenText) return null;
        
        // Buscar fecha en "F. Registro: dd/mm/yyyy"
        let fechaMatch = this.extractMatch(examenText, /F\. Registro:\s*(\d{2}\/\d{2}\/\d{4})/);
        
        if (fechaMatch) {
            const fechaCompleta = this.extractMatch(fechaMatch, /\d{2}\/\d{2}\/\d{4}/);
            // Devolver formato dd/mm
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
            
            // Buscar ELP: ELP: xxx/x.x/xxx
            const elpMatch = fragmentText.match(/ELP:\s*(\*?\d+\/\*?\d+\.?\d*\/\*?\d+)/i);
            if (elpMatch) valoresEncontrados.push(`ELP: ${elpMatch[1]}`);
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
        
        // Si solo hay un examen o ninguno, procesarlo normalmente
        if (!registroMatches || registroMatches.length <= 1) {
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
            'Hemograma': ['Hb', 'GB', 'N%', 'Plaq', 'PCR'],
            'Renal': ['Crea', 'BUN', 'Na', 'K', 'Cl', 'P', 'Ca'],
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
                tablaHTML.push(`<tr><td>${examen}</td>`);
                fechas.forEach(fecha => {
                    const valor = fechaMap.get(fecha) || '-';
                    tablaHTML.push(`<td>${valor}</td>`);
                });
                tablaHTML.push('</tr>');
            });

            tablaHTML.push('</tbody></table>');
            return tablaHTML.join('\n');
        };

        // Actualizar contenido de la tabla comparativa
        const tablaComparativaContainer = document.querySelector('#tab-tabla .comparative-table-container');
        if (tablaComparativaContainer) {
            tablaComparativaContainer.innerHTML = generarTablaComparativa();
            tablaComparativaContainer.style.display = 'block';
            tablaComparativaContainer.style.textAlign = 'left';
            tablaComparativaContainer.style.alignItems = 'flex-start';
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
});

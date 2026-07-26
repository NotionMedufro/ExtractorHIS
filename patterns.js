// PATRONES DE EXTRACCIÓN MÉDICA HHHA

// ==========================================
// PATRONES BASE COMPARTIDOS
// ==========================================
const BASE_PATTERNS = {
    // ============== HEMOGRAMA ==============
    hemograma: {
        hemoglobina: /HEMOGLOBINA\s*[hi]*\s*(\d+\.?\d*)\s*g\/dL/i,
        hematocrito: /HEMATOCRITO\s*[hi]*\s*(\d+\.?\d*)\s*%/i,
        leucocitos: /RECUENTO DE LEUCOCITOS\s*[hi]*\s*(\d+\.?\d*)\s*10\^3\/uL/i,
        neutrofilos_porcentaje: /NEUTR[OÓ]FILOS\s*%\s*[hi]*\s*(\d+\.?\d*)\s*%/i,
        linfocitos_porcentaje: /LINFOCITOS\s*%\s*[hi]*\s*(\d+\.?\d*)\s*%/i,
        plaquetas: /RECUENTO DE PLAQUETAS\s*[hi]*\s*(\d+)\s*10\^3\/uL/i,
        vcm: /VCM-?\s*VOLUMEN\s+CO(?:R|S)PUSCULAR\s+MEDIO\s\D*(\d+\.?\d*)\s*fL/i,
        chcm: /CHCM\s*-\s*CONC\.\s*Hb\s*CORPUSCULAR\s*MEDIA\s\D*(\d+\.?\d*)\s*g\/dL/i,
        rdw: /RDW\s*[i]?\s\D*(\d+\.?\d*)\s*%/i,
        reticulocitos: /RETICULOCITOS\s\D*(\d+\.?\d*)\s*%/i,
        neutrofilos_absoluto: /NEUTR[OÓ]FILOS\s\D*(\d+\.?\d*)\s*10\^3\/uL/i,
        linfocitos_absoluto: /LINFOCITOS\s\D*(\d+\.?\d*)\s*10\^3\/uL/i
    },

    // ============== FUNCIÓN RENAL ==============
    renal: {
        creatinina: /CREATININA\s*[hi]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        vfg: /VFG\s\D*(\d+\.?\d*)\s*mL\/min/i,
        bun: /NITR[OÓ]GENO\s+UREICO(?:\s+SANGRE)?(?:\s*\(BUN\))?\s*[hi*]*\s*(\d+\.?\d*)\s*mg(?:%|\/dL)?/i,
        urea: /UREA\s*[hi]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        sodio: /ELECTROLITO SODIO\s*[hi]*\s*(\d+\.?\d*)\s*mEq\/L/i,
        potasio: /ELECTROLITO POTASIO\s*[hi]*\s*(\d+\.?\d*)\s*mEq\/L/i,
        cloro: /ELECTROLITO CLORO\s*[hi]*\s*(\d+\.?\d*)\s*mEq\/L/i,
        glucosa: /(?:GLUCOSA|GLICEMIA)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        fosforo: /F[OÓ]SFORO(?:\s+SERICO)?\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        calcio: /CALCIO\s*[hi]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        magnesio: /MAGNESIO\s*[hi]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        acido_urico: /[ÁA]CIDO\s+[ÚU]RICO\s\D*(\d+\.?\d*)\s*mg\/dL/i,
        rac: /RELACI[ÓO]N\s+MICROALBUMINURIA\s*\/\s*CREATINURIA\s*[hi*]*\s*(\d+(?:[.,]\d+)?)/i
    },

    // ============== FUNCIÓN HEPÁTICA ==============
    hepatico: {
        bilirrubina_total: /(?:Bilirrubina Total|BILIRRUBINA TOTAL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        bilirrubina_directa: /(?:Bilirrubina Directa|BILIRRUBINA DIRECTA)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        got_asat: [
            /ASPARTATO AMINO TRANSFERASA[\s\S]*?\(ASAT\/GOT\)[\s\S]*?(\d+\.?\d*)\s*U\/L/i,
            /Transaminasa GOT\/ASAT\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /(?:GOT|ASAT)\s*\*?\s*(\d+\.?\d*)\s*U\/L/i
        ],
        gpt_alt: [
            /ALANINA AMINO TRANSFERASA[\s\S]*?\(ALAT\/GPT\)[\s\S]*?[hi]*\s*(\d+\.?\d*)\s*U\/L/i,
            /Transaminasa GPT\/\s?ALT\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /(?:GPT|ALT)\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
        ],
        fosfatasa_alcalina: /(?:Fosfatasa Alcalina|FOSFATASAS ALCALINAS)\s*[hi*]*\s*(\d+\.?\d*)\s*U\/L/i,
        ggt: [
            /Gamma Glutamiltranspeptidasa\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /GAMAGLUTAMIL TRANSFERASA \(GGT\)\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
        ],
        amilasa: /AMILASA\s*[hi*]*\s*(\d+\.?\d*)\s*U\/L/i,
        lipasa: /LIPASA\s*[hi*]*\s*(\d+\.?\d*)\s*U\/L/i
    },

    // ============== NUTRICIONAL ==============
    nutricional: {
        proteinas: /PROTE[IÍ]NAS(?:\s+TOTALES)?\s*[hi*]*\s*(\d+\.?\d*)\s*g\/dL/i,
        albumina: /(?:Albúmina|ALBUMINA)(?:\s+sangre)?\s*[hi*]*\s*(\d+\.?\d*)\s*g\/dL/i,
        prealbumin: /(?:Prealbúmina|Prealbumina|PRE-ALBUMINA)\s*[hi*]*\s*(\d+\.?\d*)/i,
        colesterol_total: /(?:Colesterol Total|COLESTEROL TOTAL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        ldl: /(?:Colesterol LDL|LDL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        hdl: /(?:Colesterol HDL|HDL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        trigliceridos: /TRIGLIC[ÉE]RIDOS\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        hba1c: /HEMOGLOBINA\s+GLICADA\s*\(HBA1C\)\s*[hi*]*\s*(\d+(?:[.,]\d+)?)\s*%/i
    },

    // ============== PCR Y MARCADORES ==============
    pcr: {
        pcr: /PROTE[IÍ]NA\s+C\s+REACTIVA(?:\s*\(CRP\))?\s*[hi*]*\s*(\d+\.?\d*)\s+mg\/L/i,
        procalcitonina: /Procalcitonina\s*\*?\s*(\d+\.?\d*)\s+ng\/mL/i,
        vhs: /(?:VHS|Velocidad\s+de\s+Sedimentación)\s*\*?\s*(\d+\.?\d*)\s*mm\/hr?/i
    },

    // ============== COAGULACIÓN ==============
    coagulacion: {
        inr: /(?:[ÍI]NDICE\s+INTERNACIONAL\s+NORMALIZADO\s*\(INR\)|INR)\s*[hi*]*\s*(\d+\.?\d*)/i,
        tiempo_protrombina: /TIEMPO DE PROTROMBINA\s*[hi]*\s*(\d+\.?\d*)\s*Segundos/i,
        porcentaje_tp: /%\s*TP\s*[hi]*\s*(\d+\.?\d*)\s*%/i,
        ttpa: /TIEMPO\s+(?:DE\s+)?TROMBOPLASTINA\s+PARCIAL\s+ACTIVADO\s*[hi*]*\s*(\d+\.?\d*)\s*Segundos/i
    },

    // ============== MARCADORES CARDIACOS ==============
    cardiacos: {
        troponina: /TROPONINA(?:\s+[TI])?\s*[hi*]*\s*(\d+\.?\d*)\s*ng\/L/i,
        dimero_d: /(?:D[IÍ]MERO\s+D|D-D[IÍ]MERO)\s*[hi*]*\s*([<>]?\s*\d+(?:[.,]\d+)?)/i,
        probnp: /(?:PRO\s*P[ÉE]PTIDO\s+NATRIUR[ÉE]TICO\s+TIPO\s+B\s*\(NTPROBNP\)|NT-?PROBNP|PROBNP)\s*[hi*]*\s*(\d+\.?\d*)\s*pg\/mL/i
    },

    // ============== HORMONAS ==============
    hormonas: {
        bhcg: /(?:BETA\s+GONADOTROFINA\s+CORI[ÓO]NICA\s*\(BHCG\)(?:\s+HUMANA)?|BETA[-\s]?HCG|BHCG)\s*[hi*]*\s*([<>]?\s*\d+(?:[.,]\d+)?)\s*mUI\/mL/i,
        tsh: /(?:HORMONA\s+TIROESTIMULANTE\s*\(TSH\)|\bTSH)\s*[hi*]*\s*(\d+(?:[.,]\d+)?)\s*(?:u|µ|μ)?UI\/mL/i,
        t4l: /(?:TIROXINA\s+LIBRE\s*\(T4L\)|\bT4L)\s*[hi*]*\s*(\d+(?:[.,]\d+)?)\s*ng\/dL/i
    },

    // ============== GASES ==============
    gases: {
        ph: /\bpH\s*[hi]*\s*(\d+\.?\d*)/i,
        pco2: /\bPCO2\s*[hi*]*\s*(-?\d+\.?\d*)\s+mm\/?Hg/i,
        po2: /\bPO2\s*[hi*]*\s*(-?\d+\.?\d*)\s+mm\/?Hg/i,
        hco3: /HCO3[\s\S]*?(\d+\.?\d*)\s+mmol\/L/i,
        beb: /\bBEB\s*[hi*]*\s*(-?\d+\.?\d*)\s+mmol\/L/i,
        lactato: /[ÁA]CIDO\s+L[ÁA]CTICO\s*[hi*]*\s*(\d+\.?\d*)\s+mmol\/L/i,
        saturacion_o2: /%\s+Saturación\s+O2[\s\S]*?(\d+\.?\d*)\s+%/i
    },

    // ============== FECHAS ==============
    fechas: {
        patrones: [
            /Recepcion\s+muestra\s*:\s*(\d{2}[-\/]\d{2}[-\/]\d{4})/i,
            /Fecha\s+(\d{2}\/\d{2}\/\d{4})/i,
            /Toma Muestra:\s*(\d{2}\/\d{2}\/\d{4})/i,
            /Fecha\/Hora de T\. muestra\s*:\s*(\d{2}\/\d{2}\/\d{4})/i,
            /^(\d{2}\/\d{2}\/\d{4})/m,
            /(\d{2}\/\d{2}\/\d{4})/
        ]
    }
};


// ==========================================
// EXTRACTOR HHHA
// ==========================================
const HHHA_PATTERNS = {
    modelo: 'HHHA',

    // ============== HEMOGRAMA ==============
    hemograma: {
        hemoglobina: /HEMOGLOBINA\s*[hi*]*\s*(\d+\.?\d*)\s*g\/dL/i,
        hematocrito: /HEMATOCRITO\s*[hi*]*\s*(\d+\.?\d*)\s*%/i,
        leucocitos: /RECUENTO\s+(?:DE\s+)?LEUCOCITOS\s*[hi*]*\s*(\d+\.?\d*)\s*(?:10\^3|10e3)\/uL/i,
        neutrofilos_porcentaje: /NEUTR[OÓ]FILOS\s*%\s*[hi*]*\s*(\d+\.?\d*)\s*%/i,
        linfocitos_porcentaje: /LINFOCITOS\s*%\s*[hi*]*\s*(\d+\.?\d*)\s*%/i,
        plaquetas: /RECUENTO\s+(?:DE\s+)?PLAQUETAS\s*[hi*]*\s*(\d+)\s*(?:10\^3|10e3)\/uL/i,
        vcm: /VCM-?\s*VOLUMEN\s+CO(?:R|S)PUSCULAR\s+MEDIO\s\D*(\d+\.?\d*)\s*fL/i,
        chcm: /CHCM\s*-\s*CONC\.\s*Hb\s*CORPUSCULAR\s*MEDIA\s\D*(\d+\.?\d*)\s*g\/dL/i,
        rdw: /RDW\s*[i]?\s\D*(\d+\.?\d*)\s*%/i,
        reticulocitos: /RETICULOCITOS\s\D*(\d+\.?\d*)\s*%/i,
        neutrofilos_absoluto: /NEUTR[OÓ]FILOS\s*[hi*]*\s*(\d+\.?\d*)\s*(?:10\^3|10e3)\/uL/i,
        linfocitos_absoluto: /LINFOCITOS\s*[hi*]*\s*(\d+\.?\d*)\s*(?:10\^3|10e3)\/uL/i
    },

    // ============== FUNCIÓN RENAL ==============
    renal: {
        creatinina: /CREATININA\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        vfg: /VFG\s\D*(\d+\.?\d*)\s*mL\/min/i,
        bun: /NITR[OÓ]GENO\s+UREICO(?:\s+SANGRE)?(?:\s*\(BUN\))?\s*[hi*]*\s*(\d+\.?\d*)\s*mg(?:%|\/dL)?/i,
        urea: /UREA\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        sodio: /(?:ELECTROLITO\s+)?SODIO\s*[hi*]*\s*(\d+\.?\d*)\s*mEq\/L/i,
        potasio: /(?:ELECTROLITO\s+)?POTASIO\s*[hi*]*\s*(\d+\.?\d*)\s*mEq\/L/i,
        cloro: /(?:ELECTROLITO\s+)?CLORO\s*[hi*]*\s*(\d+\.?\d*)\s*mEq\/L/i,
        glucosa: /(?:GLUCOSA|GLICEMIA)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        fosforo: /F[OÓ]SFORO\s*(?:SERICO)?\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        calcio: /CALCIO\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        magnesio: /MAGNESIO\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        acido_urico: /[ÁA]CIDO\s+[ÚU]RICO\s\D*(\d+\.?\d*)\s*mg\/dL/i,
        rac: /RELACI[ÓO]N\s+MICROALBUMINURIA\s*\/\s*CREATINURIA\s*[hi*]*\s*(\d+(?:[.,]\d+)?)/i
    },

    // ============== FUNCIÓN HEPÁTICA ==============
    hepatico: {
        bilirrubina_total: /(?:Bilirrubina Total|BILIRRUBINA TOTAL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        bilirrubina_directa: /(?:Bilirrubina Directa|BILIRRUBINA DIRECTA)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        got_asat: [
            /ASPARTATO AMINO TRANSFERASA[\s\S]*?\(ASAT\/GOT\)[\s\S]*?(\d+\.?\d*)\s*U\/L/i,
            /Transaminasa GOT\/ASAT\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /(?:GOT|ASAT)\s*\*?\s*(\d+\.?\d*)\s*U\/L/i
        ],
        gpt_alt: [
            /ALANINA AMINO TRANSFERASA[\s\S]*?\(ALAT\/GPT\)[\s\S]*?[hi]*\s*(\d+\.?\d*)\s*U\/L/i,
            /ALANINA\s+AMINOTRANSFERASA\s*\(ALAT\/GPT\)\s*[hi*]*\s*(\d+\.?\d*)\s*U\/L/i,
            /Transaminasa GPT\/\s?ALT\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /(?:GPT|ALT)\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
        ],
        fosfatasa_alcalina: /(?:Fosfatasa Alcalina|FOSFATASAS ALCALINAS)\s*[hi*]*\s*(\d+\.?\d*)\s*U\/L/i,
        ggt: [
            /Gamma Glutamiltranspeptidasa\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /GAMAGLUTAMIL TRANSFERASA \(GGT\)\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
        ],
        amilasa: /AMILASA\s*[hi*]*\s*(\d+\.?\d*)\s*U\/L/i,
        lipasa: /LIPASA\s*[hi*]*\s*(\d+\.?\d*)\s*U\/L/i
    },

    // ============== NUTRICIONAL ==============
    nutricional: BASE_PATTERNS.nutricional,

    // ============== PCR Y MARCADORES ==============
    pcr: BASE_PATTERNS.pcr,

    // ============== COAGULACIÓN ==============
    coagulacion: {
        inr: /(?:[ÍI]NDICE\s+INTERNACIONAL\s+NORMALIZADO\s*\(INR\)|INR)\s*[hi*]*\s*(\d+\.?\d*)/i,
        tiempo_protrombina: /TIEMPO DE PROTROMBINA\s*[hi*]*\s*(\d+\.?\d*)\s*Segundos/i,
        porcentaje_tp: /%\s*TP\s*[hi*]*\s*(\d+\.?\d*)\s*%/i,
        ttpa: /TIEMPO\s+(?:DE\s+)?TROMBOPLASTINA\s+PARCIAL\s+ACTIVADO\s*[hi*]*\s*(\d+\.?\d*)\s*Segundos/i
    },

    cardiacos: BASE_PATTERNS.cardiacos,
    hormonas: BASE_PATTERNS.hormonas,

    // ============== GASES ==============
    gases: {
        ph: /\bpH\s*[hi*]*\s*(\d+\.?\d*)/i,
        pco2: /\bPCO2\s*[hi*]*\s*(-?\d+\.?\d*)\s+mm\/?Hg/i,
        po2: /\bPO2\s*[hi*]*\s*(-?\d+\.?\d*)\s+mm\/?Hg/i,
        hco3: /HCO3[\s\S]*?(\d+\.?\d*)\s+mmol\/L/i,
        beb: /\bBEB\s*[hi*]*\s*(-?\d+\.?\d*)\s+mmol\/L/i,
        lactato: /[ÁA]CIDO\s+L[ÁA]CTICO\s*[hi*]*\s*(\d+\.?\d*)\s+mmol\/L/i,
        saturacion_o2: /%\s+Saturación\s+O2[\s\S]*?(\d+\.?\d*)\s+%/i
    },

    // ============== FECHAS ==============
    fechas: BASE_PATTERNS.fechas
};

// ==========================================
// EXTRACTOR CESFAM CHOLCHOL
// ==========================================
// Patrón imposible para exámenes que el informe de Cholchol de referencia
// todavía no contiene. Mantiene la misma interfaz que el modelo HHHA.
const SIN_COINCIDENCIA = /(?!)/;

const CHOLCHOL_PATTERNS = {
    modelo: 'Cholchol',

    hemograma: {
        hemoglobina: /\bHEMOGLOBINA\s*\*?\s*(\d+(?:[.,]\d+)?)\s*g\/dL/i,
        hematocrito: /\bHEMATOCRITO\s*\*?\s*(\d+(?:[.,]\d+)?)\s*%/i,
        leucocitos: /\bRECUENTO\s+DE\s+LEUCOCITOS\s*\*?\s*(\d+(?:[.,]\d+)?)\s*x10\^3\/uL/i,
        neutrofilos_porcentaje: /\b(?:SEGMENTADOS|NEUTR[OÓ]FILOS)\s*\*?\s*(\d+(?:[.,]\d+)?)\s*%/i,
        linfocitos_porcentaje: /\bLINFOCITOS\s*\*?\s*(\d+(?:[.,]\d+)?)\s*%/i,
        plaquetas: /\bRECUENTO\s+DE\s+PLAQUETAS\s*\*?\s*(\d+(?:[.,]\d+)?)\s*x10\^3\/uL/i,
        vcm: /\bVCM\s*\*?\s*(\d+(?:[.,]\d+)?)\s*fL/i,
        chcm: /\bCHCM\s*\*?\s*(\d+(?:[.,]\d+)?)\s*g\/dL/i,
        rdw: /\bRDW\s*\*?\s*(\d+(?:[.,]\d+)?)\s*%/i,
        reticulocitos: /\bRETICULOCITOS\s*\*?\s*(\d+(?:[.,]\d+)?)\s*%/i,
        neutrofilos_absoluto: SIN_COINCIDENCIA,
        linfocitos_absoluto: SIN_COINCIDENCIA
    },

    renal: {
        creatinina: /\bCREATININA,\s*sangre,?\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        vfg: /\bVFG\s+MDRD-4\s*\*?\s*(\d+(?:[.,]\d+)?)/i,
        bun: /\bNITR[ÓO]GENO\s+UREICO\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        urea: /\bUREMIA\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        sodio: /\bSODIO,\s*sangre\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mEq\/L/i,
        potasio: /\bPOTASIO,\s*sangre\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mEq\/L/i,
        cloro: /\bCLORO,\s*sangre\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mEq\/L/i,
        glucosa: /\bGLICEMIA(?:\s+BASAL)?\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        fosforo: /\bFOSFORO\s*\(Fecha Validación:[\s\S]*?Resultado:\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        calcio: /\bCALCIO\s*\(Fecha Validación:[\s\S]*?Resultado:\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        magnesio: SIN_COINCIDENCIA,
        acido_urico: SIN_COINCIDENCIA,
        rac: SIN_COINCIDENCIA
    },

    hepatico: {
        bilirrubina_total: /\bBILIRRUBINA\s+TOTAL\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        bilirrubina_directa: /\bBILIRRUBINA\s+DIRECTA\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        got_asat: /\bTRANSAMINASA\s+GOT\/AST\s*\*?\s*(\d+(?:[.,]\d+)?)\s*UI\/L/i,
        gpt_alt: /\bTRANSAMINASA\s+GPT\/ALT\s*\*?\s*(\d+(?:[.,]\d+)?)\s*UI\/L/i,
        fosfatasa_alcalina: /\bFOSFATASA\s+ALCALINA\s*\*?\s*(\d+(?:[.,]\d+)?)\s*UI\/L/i,
        ggt: SIN_COINCIDENCIA,
        amilasa: SIN_COINCIDENCIA,
        lipasa: SIN_COINCIDENCIA
    },

    nutricional: {
        proteinas: SIN_COINCIDENCIA,
        albumina: /\bALBUMINA\s*\(Fecha Validación:[\s\S]*?Resultado:\s*(\d+(?:[.,]\d+)?)\s*g\/dL/i,
        prealbumin: SIN_COINCIDENCIA,
        colesterol_total: /\bCOLESTEROL\s+TOTAL\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        ldl: /\bCOLESTEROL\s+LDL\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        hdl: /\bCOLESTEROL\s+HDL\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        trigliceridos: /\bTRIGLIC[ÉE]RIDOS\s*\*?\s*(\d+(?:[.,]\d+)?)\s*mg\/dL/i,
        hba1c: SIN_COINCIDENCIA
    },

    pcr: {
        pcr: SIN_COINCIDENCIA,
        procalcitonina: SIN_COINCIDENCIA,
        vhs: /\bVHS\s*\(Fecha Validación:[\s\S]*?Resultado:\s*(\d+(?:[.,]\d+)?)\s*mm\/hr/i
    },

    coagulacion: {
        inr: SIN_COINCIDENCIA,
        tiempo_protrombina: SIN_COINCIDENCIA,
        porcentaje_tp: SIN_COINCIDENCIA,
        ttpa: SIN_COINCIDENCIA
    },

    cardiacos: {
        troponina: SIN_COINCIDENCIA,
        dimero_d: SIN_COINCIDENCIA,
        probnp: SIN_COINCIDENCIA
    },

    hormonas: {
        bhcg: SIN_COINCIDENCIA,
        tsh: SIN_COINCIDENCIA,
        t4l: SIN_COINCIDENCIA
    },

    gases: {
        ph: SIN_COINCIDENCIA,
        pco2: SIN_COINCIDENCIA,
        po2: SIN_COINCIDENCIA,
        hco3: SIN_COINCIDENCIA,
        beb: SIN_COINCIDENCIA,
        lactato: SIN_COINCIDENCIA,
        saturacion_o2: SIN_COINCIDENCIA
    },

    fechas: {
        patrones: [
            /\bIngreso\s*:\s*(\d{2}[/-]\d{2}[/-]\d{4})/i,
            /\bT\.\s*Muestra\s*:\s*(\d{2}[/-]\d{2}[/-]\d{4})/i,
            /\bFecha\s+Validación:\s*(\d{2}[/-]\d{2}[/-]\d{4})/i
        ]
    }
};


// Inicialización global
window.EXTRACTION_PATTERNS = HHHA_PATTERNS;

function setExtractionModel(modelo) {
    window.EXTRACTION_PATTERNS = modelo === 'Cholchol'
        ? CHOLCHOL_PATTERNS
        : HHHA_PATTERNS;
}

// Función para buscar con múltiples patrones (común a ambas versiones)
function buscarConPatrones(texto, patrones) {
    if (patrones instanceof RegExp) {
        patrones = [patrones];
    }
    for (let patron of patrones) {
        let coincidencia = texto.match(patron);
        if (coincidencia) {
            return coincidencia;
        }
    }
    return null;
}

// Función común para extraer valor
function extraerValor(texto, patron) {
    let coincidencia = buscarConPatrones(texto, patron);
    if (!coincidencia) return null;

    const valor = coincidencia[1];
    return typeof valor === 'string' ? valor.replace(',', '.') : valor;
}

// Exportar globalmente
window.buscarConPatrones = buscarConPatrones;
window.extraerValor = extraerValor;
window.setExtractionModel = setExtractionModel;

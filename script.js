// ===== EXTRACTOR MÉDICO SIMPLIFICADO =====
// Este archivo es fácilmente editable para modificar patrones de extracción

// CONFIGURACIÓN DE PATRONES DE EXTRACCIÓN
// Puedes modificar estos patrones según tus necesidades
const PATRONES_EXTRACCION = {
    // Hemograma - patrones corregidos para tu formato específico
    hemoglobina: /HEMOGLOBINA\s\D*(\d+\.?\d*)\s*g\/dL/i,
    leucocitos: /RECUENTO\s+DE\s+LEUCOCITOS\s\D*(\d+\.?\d*)\s*10\^3\/uL/i,
    neutrofilos: /NEUTROFILOS\s*%\s\D*(\d+\.?\d*)\s*%/i,
    plaquetas: /RECUENTO\s+DE\s+PLAQUETAS\s\D*(\d+)\s*10\^3\/uL/i,

    // Hemograma (extras)
    hematocrito_pct: /HEMATOCRITO\s\D*(\d+\.?\d*)\s*%/i,
    vcm: /VCM-?\s*VOLUMEN\s+CORPUSCULAR\s+MEDIO\s\D*(\d+\.?\d*)\s*fL/i,
    chcm: /CHCM\s*-\s*CONC\.\s*Hb\s*CORPUSCULAR\s*MEDIA\s\D*(\d+\.?\d*)\s*g\/dL/i,
    rdw_pct: /RDW\s*[i]?\s\D*(\d+\.?\d*)\s*%/i,
    reticulocitos_pct: /RETICULOCITOS\s\D*(\d+\.?\d*)\s*%/i,
    linfocitos_pct: /LINFOCITOS\s*%\s\D*(\d+\.?\d*)\s*%/i,
    neutrofilos_abs: /NEUTROFILOS\s\D*(\d+\.?\d*)\s*10\^3\/uL/i,
    linfocitos_abs: /LINFOCITOS\s\D*(\d+\.?\d*)\s*10\^3\/uL/i,
    
    // PCR y marcadores - patrones para tu formato específico
    pcr: /PROTEINA\s+C\s+REACTIVA\s*\(CRP\)\s\D*(\d+\.?\d*)\s*mg\/L/i,
    procalcitonina: /PROCALCITONINA\s\D*(\d+\.?\d*)\s*ng\/mL/i,
    
    // Función renal - patrones para tu formato específico
    creatinina: /CREATININA\s\D*(\d+\.?\d*)\s*mg\/dL/i,
    bun: /NITROGENO\s+UREICO\s\D*\(BUN\)\s*(\d+\.?\d*)\s*mg%/i,
    sodio: /ELECTROLITO\s+SODIO\s\D*(\d+\.?\d*)\s*mEq\/L/i,
    potasio: /ELECTROLITO\s+POTASIO\s\D*(\d+\.?\d*)\s*mEq\/L/i,
    cloro: /ELECTROLITO\s+CLORO\s\D*(\d+\.?\d*)\s*mEq\/L/i,
    calcio: /CALCIO\s\D*(\d+\.?\d*)\s*mg\/dL/i,
    fosforo: /FOSFORO\s+SERICO\s\D*(\d+\.?\d*)\s*mg\/dL/i,
    // Nuevos patrones para renal
    vfg: /VFG\s\D*(\d+\.?\d*)\s*mL\/min/i,
    urea: /UREA\s\D*(\d+\.?\d*)\s*mg\/dL/i,
    magnesio: /MAGNESIO\s\D*(\d+\.?\d*)\s*mg\/dL/i,
    acido_urico: /ACIDO\s+URICO\s\D*(\d+\.?\d*)\s*mg\/dL/i,

    // Hepático
    bilirrubina_total: /BILIRRUBINA\s+TOTAL\s\D*(\d+\.?\d*)\s*mg\/dL/i,
    bilirrubina_directa: /BILIRRUBINA\s+DIRECTA\s\D*(\d+\.?\d*)\s*mg\/dL/i,
    gpt: /\(ALAT\/?GPT\)\s\D*(\d+\.?\d*)\s*U\/?L/i,
    got: /\(ASAT\/?GOT\)\s\D*(\d+\.?\d*)\s*U\/?L/i,
    fosfatasa_alcalina: /FOSFATASAS?\s+ALCALINAS\s\D*(\d+\.?\d*)\s*U\/?L/i,
    ggt: /(?:GAM+?A\s*GLUTAMIL\s+TRANSFERASA(?:\s*\(GGT\))?|GGT)\s\D*?(\d+(?:[.,]\d+)?)\s*U\/?L/i,
    ldh: /(?:DESHIDROGENASA\s+LACTICA|LDH)\s\D*(\d+\.?\d*)\s*U\/?L/i,

    // Coagulación
    inr_val: /INR\s*[hi]?\s\D*(\d+\.?\d*)/i,
    tp_seg: /TIEMPO\s+DE\s+PROTROMBINA[\s\w]*?(\d+\.?\d*)\s*Segundos/i,
    tp_pct: /%\s*TP\s*[i]?\s\D*(\d+\.?\d*)\s*%/i,
    ttpa_seg: /TIEMPO\s+DE\s+TROMBOPLASTINA\s+PARCIAL[\s\S]*?(?:ACTIVADO[\s\S]*?)?(\d+\.?\d*)\s*Segundos/i,
    
    // Fecha - busca a partir de "Recepcion muestra"
    fecha: /Recepcion\s+muestra\s*:\s*(\d{2}[-\/]\d{2}[-\/]\d{4})/i,
    
    // Otros patrones comentados para referencia futura
    // hematocrito: /HEMATOCRITO\s*(\*?)\s*(\d+\.?\d*)\s*%\s*\d+\s*-\s*\d+/i,
    // linfocitos: /LINFOCITOS\s*%\s*(\*?)\s*(\d+\.?\d*)\s*%/i,
    
    // Función renal
    // creatinina: /Creatinina\s*(\*?)\s*(\d+\.?\d*)\s+mg\/dL/i,
    // bun: /Nitrógeno\s+Ureico\s*(\*?)\s*(\d+\.?\d*)\s+mg/i,
    // urea: /Urea\s*(\*?)\s*(\d+\.?\d*)\s+mg\/dL/i,
    
    // Electrolitos
    // sodio: /Sodio\s*(\*?)\s*(\d+\.?\d*)\s+mEq\/L/i,
    // potasio: /Potasio\s*(\*?)\s*(\d+\.?\d*)\s+mEq\/L/i,
    // cloro: /Cloro\s*(\*?)\s*(\d+\.?\d*)\s+mEq\/L/i,
    
    // Función hepática
    // bilirrubina_total: /Bilirrubina\s+Total\s*(\*?)\s*(\d+\.?\d*)\s+mg\/dL/i,
    // got: /GOT\s*(\*?)\s*(\d+\.?\d*)\s+U\/L/i,
    // gpt: /GPT\s*(\*?)\s*(\d+\.?\d*)\s+U\/L/i,
    // fosfatasa: /Fosfatasa\s+Alcalina\s*(\*?)\s*(\d+\.?\d*)\s+U\/L/i,
    
    // Nutricional
    // proteinas: /Proteínas\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i,
    // albumina: /Albúmina\s*(\*?)\s*(\d+\.?\d*)\s+g\/dL/i,
    
    // Coagulación
    // inr: /INR\s*(\*?)\s*(\d+\.?\d*)/i,
    // pt: /Tiempo\s+de\s+Protrombina\s*(\*?)\s*(\d+\.?\d*)\s+seg/i,
};

// CLASE PRINCIPAL SIMPLIFICADA - SOLO PARA HCTO
class ExtractorMedico {
    constructor() {
        this.texto = '';
        this.opcionesSeleccionadas = [];
    }
    
    // Función principal de extracción
    extraer(texto, opciones) {
        this.texto = texto;
        this.opcionesSeleccionadas = opciones;
        
        let resultado = [];
        
        // Extraer fecha si está seleccionada
        if (opciones.includes('Fecha')) {
            const fecha = this.extraerFecha();
            if (fecha) resultado.push(fecha);
        }
        
        // Hemograma
        if (opciones.includes('Hemograma')) {
            const hemograma = this.extraerHemograma();
            if (hemograma) resultado.push(hemograma);
        }
        
        // PCR
        if (opciones.includes('PCR')) {
            const pcr = this.extraerPCR();
            if (pcr) resultado.push(pcr);
        }

        // Renal
        if (opciones.includes('Renal')) {
            const renal = this.extraerRenal();
            if (renal) resultado.push(renal);
        }
        
        // Hepático
        if (opciones.includes('Hepatico') || opciones.includes('Hepático')) {
            const hepatico = this.extraerHepatico();
            if (hepatico) resultado.push(hepatico);
        }

        // Coagulación
        if (opciones.includes('Coagulacion') || opciones.includes('Coagulación')) {
            const coagu = this.extraerCoagulacion();
            if (coagu) resultado.push(coagu);
        }
        
        // Si no hay opciones seleccionadas, no extraer nada
        if (opciones.length === 0) {
            return '';
        }
        
        // Si no se encontró nada, devolver mensaje
        if (resultado.length === 0) {
            return 'No se encontraron datos con las opciones seleccionadas';
        }
        
        return resultado.join('\n');
    }
    
    // Función auxiliar para extraer valores con regex
    extraerValor(pattern, formateo = null) {
        const match = this.texto.match(pattern);
        if (!match) return null;
        
        // El primer grupo (match[0]) es la coincidencia completa
        // El segundo grupo (match[1]) es el primer grupo de captura
        const valor = match[1];
        
        if (formateo) {
            return formateo(valor);
        }
        
        return valor;
    }
    
    // Extracción de fecha - busca a partir de "Recepcion muestra"
    extraerFecha() {
        const match = this.texto.match(PATRONES_EXTRACCION.fecha);
        if (match) {
            const fechaCompleta = match[1];
            // Convertir dd/mm/yyyy o dd-mm-yyyy a dd/mm/yy
            const fechaLimpia = fechaCompleta.replace(/-/g, '/'); // Normalizar separadores
            const partes = fechaLimpia.split('/');
            if (partes.length === 3) {
                const dia = partes[0].padStart(2, '0');
                const mes = partes[1].padStart(2, '0');
                const año = partes[2].substring(2); // Solo últimos 2 dígitos del año
                return `${dia}/${mes}/${año}:`;
            }
            // Fallback: extraer solo dd/mm y agregar dos puntos
            return fechaCompleta.substring(0, 5) + ':';
        }
        return null;
    }
    
    // Extracción SOLO de hematocrito
    extraerHematocrito() {
        const hcto = this.extraerValor(PATRONES_EXTRACCION.hematocrito, (valor, asterisco) => {
            return `Hcto: ${asterisco}${parseFloat(valor).toFixed(1)}%`;
        });
        
        return hcto;
    }

    // Extracción de hemograma - formato específico
    extraerHemograma() {
        const partes = [];

        // 1) Hb / Hcto encabezado
        const hb = this.extraerValor(PATRONES_EXTRACCION.hemoglobina, (v) => parseFloat(v).toFixed(1));
        const incluirHcto = this.opcionesSeleccionadas.includes('Hcto') || this.opcionesSeleccionadas.includes('Hematocrito');
        const hcto = incluirHcto ? this.extraerValor(PATRONES_EXTRACCION.hematocrito_pct, (v) => Math.round(parseFloat(v)).toString()) : null;

        if (hb && hcto) {
            // Hb/Hcto + paréntesis de VCM, CHCM, RDW, Ret (según selección)
            let encabezado = `Hb/Hcto: ${hb}/${hcto}`;
            const detalles = [];
            if (this.opcionesSeleccionadas.includes('VCM')) {
                const vcm = this.extraerValor(PATRONES_EXTRACCION.vcm, (v) => Math.round(parseFloat(v)).toString());
                if (vcm) detalles.push(`VCM: ${vcm}`);
            }
            if (this.opcionesSeleccionadas.includes('CHCM')) {
                const chcm = this.extraerValor(PATRONES_EXTRACCION.chcm, (v) => Math.round(parseFloat(v)).toString());
                if (chcm) detalles.push(`CHCM: ${chcm}`);
            }
            if (this.opcionesSeleccionadas.includes('RDW')) {
                const rdw = this.extraerValor(PATRONES_EXTRACCION.rdw_pct, (v) => Math.round(parseFloat(v)).toString());
                if (rdw) detalles.push(`RDW: ${rdw}`);
            }
            if (this.opcionesSeleccionadas.includes('Reticulocitos')) {
                const ret = this.extraerValor(PATRONES_EXTRACCION.reticulocitos_pct, (v) => Math.round(parseFloat(v)).toString());
                if (ret) detalles.push(`Ret: ${ret}`);
            }
            if (detalles.length > 0) encabezado += ` (${detalles.join(', ')})`;
            partes.push(encabezado);
        } else if (hb) {
            partes.push(`Hb: ${hb}`);
        }

        // 2) GB y paréntesis diferenciales: N%, RAN, L%, RAL
        const gb = this.extraerValor(PATRONES_EXTRACCION.leucocitos, (v) => parseFloat(v).toFixed(3));
        if (gb) {
            let bloqueGB = `GB: ${gb}`;
            const difs = [];
            // Neutrófilos % siempre que esté disponible
            const nPct = this.extraerValor(PATRONES_EXTRACCION.neutrofilos, (v) => Math.round(parseFloat(v)).toString());
            if (nPct) difs.push(`N: ${nPct}%`);

            // RAN (si está seleccionada)
            if (this.opcionesSeleccionadas.includes('RAN')) {
                const ran = this.extraerValor(PATRONES_EXTRACCION.neutrofilos_abs, (v) => parseFloat(v).toFixed(3));
                if (ran) difs.push(`RAN: ${ran}`);
            }

            // % Linfocitos
            if (this.opcionesSeleccionadas.includes('%Linfocitos') || this.opcionesSeleccionadas.includes('Linfocitos%')) {
                const lPct = this.extraerValor(PATRONES_EXTRACCION.linfocitos_pct, (v) => Math.round(parseFloat(v)).toString());
                if (lPct) difs.push(`L: ${lPct}%`);
            }

            // RAL (si está seleccionada)
            if (this.opcionesSeleccionadas.includes('RAL')) {
                const ral = this.extraerValor(PATRONES_EXTRACCION.linfocitos_abs, (v) => parseFloat(v).toFixed(3));
                if (ral) difs.push(`RAL: ${ral}`);
            }

            if (difs.length > 0) bloqueGB += ` (${difs.join(', ')})`;
            partes.push(bloqueGB);
        }

        // 3) Plaquetas
        const plq = this.extraerValor(PATRONES_EXTRACCION.plaquetas, (v) => `Plaq: ${v}.000`);
        if (plq) partes.push(plq);

        return partes.length > 0 ? partes.join(', ') : null;
    }
    
    // Extracción de PCR y Procalcitonina - formato específico
    extraerPCR() {
        const valores = [];

        // PCR - formato: PCR: 44 (sin decimales)
        const pcr = this.extraerValor(PATRONES_EXTRACCION.pcr, (valor) => {
            return `PCR: ${Math.round(parseFloat(valor))}`;
        });
        if (pcr) valores.push(pcr);
        
        // Procalcitonina - formato: Proca: 0.02
        const proca = this.extraerValor(PATRONES_EXTRACCION.procalcitonina, (valor) => {
            return `Proca: ${parseFloat(valor).toFixed(2)}`;
        });
        if (proca) valores.push(proca);
        
        return valores.length > 0 ? valores.join(', ') : null;
    }

    // Extracción de coagulación - formato específico
    extraerCoagulacion() {
        const valores = [];

        // INR (1 decimal)
        const inr = this.extraerValor(PATRONES_EXTRACCION.inr_val, (valor) => {
            return `INR: ${parseFloat(valor).toFixed(1)}`;
        });
        if (inr) valores.push(inr);

        // TP en segundos (redondeado) + %TP si existe
        const tpSeg = this.extraerValor(PATRONES_EXTRACCION.tp_seg, (valor) => {
            return Math.round(parseFloat(valor)).toString();
        });
        const tpPct = this.extraerValor(PATRONES_EXTRACCION.tp_pct, (valor) => {
            return Math.round(parseFloat(valor)).toString();
        });
        if (tpSeg || tpPct) {
            const seg = tpSeg ? `${tpSeg}s` : '--';
            const pct = tpPct ? ` (${tpPct}%)` : '';
            valores.push(`TP: ${seg}${pct}`);
        }

        // TTPa en segundos (redondeado)
        const ttpa = this.extraerValor(PATRONES_EXTRACCION.ttpa_seg, (valor) => {
            return `TTPa: ${Math.round(parseFloat(valor)).toString()}s`;
        });
        if (ttpa) valores.push(ttpa);

        return valores.length > 0 ? valores.join(', ') : null;
    }

    // Extracción de perfil hepático - formato específico
    extraerHepatico() {
        const valores = [];

        // Bilirrubinas Total/Directa -> BiliT/D: 0.41/0.16
        const biliT = this.extraerValor(PATRONES_EXTRACCION.bilirrubina_total, (valor) => {
            return parseFloat(valor).toFixed(2);
        });
        const biliD = this.extraerValor(PATRONES_EXTRACCION.bilirrubina_directa, (valor) => {
            return parseFloat(valor).toFixed(2);
        });
        if (biliT || biliD) {
            const bt = biliT ? biliT : '--';
            const bd = biliD ? biliD : '--';
            valores.push(`BiliT/D: ${bt}/${bd}`);
        }

        // GOT/GPT -> GOT/GPT: 17.5/14.3
        const got = this.extraerValor(PATRONES_EXTRACCION.got, (valor) => {
            return parseFloat(valor).toFixed(1);
        });
        const gpt = this.extraerValor(PATRONES_EXTRACCION.gpt, (valor) => {
            return parseFloat(valor).toFixed(1);
        });
        if (got || gpt) {
            const vg = got ? got : '--';
            const vp = gpt ? gpt : '--';
            valores.push(`GOT/GPT: ${vg}/${vp}`);
        }

        // Fosfatasa alcalina -> FA: 107
        const fa = this.extraerValor(PATRONES_EXTRACCION.fosfatasa_alcalina, (valor) => {
            return `FA: ${parseFloat(valor).toFixed(0)}`;
        });
        if (fa) valores.push(fa);

        // GGT (opcional)
        const ggt = this.extraerValor(PATRONES_EXTRACCION.ggt, (valor) => {
            return `GGT: ${parseFloat(valor.replace(',', '.')).toFixed(1)}`;
        });
        if (ggt) valores.push(ggt);

        // LDH
        const ldh = this.extraerValor(PATRONES_EXTRACCION.ldh, (valor) => {
            return `LDH: ${parseFloat(valor).toFixed(0)}`;
        });
        if (ldh) valores.push(ldh);

        return valores.length > 0 ? valores.join(', ') : null;
    }
    
    // Extracción de función renal - formato específico
    extraerRenal() {
        const valores = [];

        // Creatinina - formato: Crea: 0.6 (opcionalmente con VFG)
        let crea = this.extraerValor(PATRONES_EXTRACCION.creatinina, (valor) => {
            return `Crea: ${parseFloat(valor).toFixed(1)}`;
        });
        if (crea) {
            // Si VFG está seleccionado, agregarlo entre paréntesis después de Crea
            if (this.opcionesSeleccionadas.includes('VFG')) {
                const vfgVal = this.extraerValor(PATRONES_EXTRACCION.vfg, (v) => {
                    return Math.round(parseFloat(v)).toString();
                });
                if (vfgVal) {
                    crea = `${crea} (VFG: ${vfgVal})`;
                }
            }
            valores.push(crea);
        }

        // BUN - formato: BUN: 13.7
        const bun = this.extraerValor(PATRONES_EXTRACCION.bun, (valor) => {
            return `BUN: ${parseFloat(valor).toFixed(1)}`;
        });
        if (bun) valores.push(bun);

        // Urea (opcional)
        if (this.opcionesSeleccionadas.includes('Urea')) {
            const urea = this.extraerValor(PATRONES_EXTRACCION.urea, (valor) => {
                return `Urea: ${parseFloat(valor).toFixed(0)}`;
            });
            if (urea) valores.push(urea);
        }

        // Ácido Úrico (opcional) — considerar posibles valores del checkbox
        if (this.opcionesSeleccionadas.includes('AcidoUrico') || this.opcionesSeleccionadas.includes('Ácido Úrico') || this.opcionesSeleccionadas.includes('Acido Úrico')) {
            const au = this.extraerValor(PATRONES_EXTRACCION.acido_urico, (valor) => {
                return `Á. Úrico: ${parseFloat(valor).toFixed(0)}`;
            });
            if (au) valores.push(au);
        }

        // Electrolitos (Sodio/Potasio/Cloro) - formato: ELP: 141/4.1/107
        const na = this.extraerValor(PATRONES_EXTRACCION.sodio, (valor) => {
            return parseFloat(valor).toFixed(0);
        });
        const k = this.extraerValor(PATRONES_EXTRACCION.potasio, (valor) => {
            return parseFloat(valor).toFixed(1);
        });
        const cl = this.extraerValor(PATRONES_EXTRACCION.cloro, (valor) => {
            return parseFloat(valor).toFixed(0);
        });

        if (na && k && cl) {
            valores.push(`ELP: ${na}/${k}/${cl}`);
        }

        // Calcio - formato: Ca: 9.1
        const ca = this.extraerValor(PATRONES_EXTRACCION.calcio, (valor) => {
            return `Ca: ${parseFloat(valor).toFixed(1)}`;
        });
        if (ca) valores.push(ca);

        // Fósforo - formato: P: 3.2
        const p = this.extraerValor(PATRONES_EXTRACCION.fosforo, (valor) => {
            return `P: ${parseFloat(valor).toFixed(1)}`;
        });
        if (p) valores.push(p);

        // Magnesio (opcional) — se agrega al final
        if (this.opcionesSeleccionadas.includes('Magnesio')) {
            const mg = this.extraerValor(PATRONES_EXTRACCION.magnesio, (valor) => {
                return `Mg: ${parseFloat(valor).toFixed(1)}`;
            });
            if (mg) valores.push(mg);
        }

        return valores.length > 0 ? valores.join(', ') : null;
    }
}

// INSTANCIA GLOBAL
const extractor = new SimpleExtractor();

// ===== SISTEMA DE MÚLTIPLES EXÁMENES =====
let examCounter = 1;
let currentExams = new Map(); // ID del examen -> texto del examen

// Función para agregar un nuevo examen
function agregarNuevoExamen() {
    examCounter++;
    const examId = examCounter;
    
    const examItem = document.createElement('div');
    examItem.className = 'exam-item';
    examItem.setAttribute('data-exam-id', examId);
    
    examItem.innerHTML = `
        <div class="exam-header">
            <span class="exam-title">Examen #${examId}</span>
            <div class="exam-controls">
                <button class="exam-paste-btn" title="Pegar texto">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    </svg>
                </button>
                <button class="exam-clear-btn" title="Limpiar texto">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
                <button class="exam-remove-btn" title="Eliminar examen">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
        <div class="exam-input">
            <textarea class="exam-textarea" 
                    placeholder="1. En la página pdf del examen presiona: Ctrl + A para seleccionar todo el texto&#10;2. Copia el texto mediante: Ctrl + C&#10;3. Pega el texto aquí mediante: Ctrl + V"></textarea>
        </div>
    `;
    
    const examsContainer = document.getElementById('examsContainer');
    examsContainer.appendChild(examItem);
    
    // Agregar event listeners para los botones del nuevo examen
    setupExamEventListeners(examItem, examId);
    
    // Mostrar el botón de eliminar en todos los exámenes si hay más de uno
    updateRemoveButtons();
    
    // Enfocar el nuevo textarea
    const textarea = examItem.querySelector('.exam-textarea');
    textarea.focus();
    
    // Registrar el nuevo examen
    currentExams.set(examId, '');
    
    mostrarNotificacion(`Examen #${examId} agregado`, 'success');
}

// Función para configurar event listeners de un examen
function setupExamEventListeners(examItem, examId) {
    const textarea = examItem.querySelector('.exam-textarea');
    const pasteBtn = examItem.querySelector('.exam-paste-btn');
    const clearBtn = examItem.querySelector('.exam-clear-btn');
    const removeBtn = examItem.querySelector('.exam-remove-btn');
    
    // Event listener para cambios en el textarea
    let extractTimeout;
    textarea.addEventListener('input', function() {
        const texto = this.value.trim();
        currentExams.set(examId, texto);
        
        clearTimeout(extractTimeout);
        extractTimeout = setTimeout(extraerAutomaticamente, 300);
    });
    
    // Extraer inmediatamente cuando se pega contenido
    textarea.addEventListener('paste', function() {
        setTimeout(() => {
            currentExams.set(examId, this.value.trim());
            extraerAutomaticamente();
        }, 100);
    });
    
    // Botón pegar
    pasteBtn.addEventListener('click', function() {
        pegarTextoEnExamen(examId, textarea);
    });
    
    // Botón limpiar
    clearBtn.addEventListener('click', function() {
        limpiarTextoExamen(examId, textarea);
    });
    
    // Botón eliminar
    removeBtn.addEventListener('click', function() {
        eliminarExamen(examId, examItem);
    });
}

// Función para pegar texto en un examen específico
function pegarTextoEnExamen(examId, textarea) {
    if (!navigator.clipboard) {
        mostrarNotificacion('Tu navegador no soporta la funcionalidad de portapapeles', 'error');
        return;
    }
    
    navigator.clipboard.readText()
        .then(text => {
            if (text.trim()) {
                textarea.value = text;
                currentExams.set(examId, text.trim());
                extraerAutomaticamente();
                mostrarNotificacion(`Texto pegado en Examen #${examId}`, 'success');
            } else {
                mostrarNotificacion('El portapapeles está vacío', 'error');
            }
        })
        .catch(err => {
            console.error('Error al leer del portapapeles:', err);
            mostrarNotificacion('No se pudo acceder al portapapeles', 'error');
        });
}

// Función para limpiar texto de un examen específico
function limpiarTextoExamen(examId, textarea) {
    textarea.value = '';
    currentExams.set(examId, '');
    extraerAutomaticamente();
    mostrarNotificacion(`Examen #${examId} limpiado`, 'info');
}

// Función para eliminar un examen
function eliminarExamen(examId, examItem) {
    examItem.remove();
    currentExams.delete(examId);
    updateRemoveButtons();
    extraerAutomaticamente();
    mostrarNotificacion(`Examen #${examId} eliminado`, 'info');
}

// Función para actualizar la visibilidad de los botones de eliminar
function updateRemoveButtons() {
    const examItems = document.querySelectorAll('.exam-item');
    const showRemoveButtons = examItems.length > 1;
    
    examItems.forEach(item => {
        const removeBtn = item.querySelector('.exam-remove-btn');
        removeBtn.style.display = showRemoveButtons ? 'flex' : 'none';
    });
}

// Función para limpiar todos los exámenes
function limpiarTodosLosExamenes() {
    const examItems = document.querySelectorAll('.exam-item');
    
    if (examItems.length === 0) {
        mostrarNotificacion('No hay exámenes para limpiar', 'error');
        return;
    }
    
    // Mantener solo el primer examen y limpiarlo
    examItems.forEach((item, index) => {
        if (index === 0) {
            const textarea = item.querySelector('.exam-textarea');
            textarea.value = '';
            const examId = parseInt(item.getAttribute('data-exam-id'));
            currentExams.set(examId, '');
        } else {
            const examId = parseInt(item.getAttribute('data-exam-id'));
            currentExams.delete(examId);
            item.remove();
        }
    });
    
    updateRemoveButtons();
    extraerAutomaticamente();
    mostrarNotificacion('Todos los exámenes limpiados', 'info');
}

// Función para obtener todos los textos de exámenes activos
function obtenerTextosExamenes() {
    const textosExamenes = [];
    currentExams.forEach((texto, examId) => {
        if (texto.trim()) {
            textosExamenes.push({ id: examId, texto });
        }
    });
    return textosExamenes;
}

// ===== FUNCIONES DE INTERFAZ =====

// Función principal de extracción automática para múltiples exámenes
function extraerAutomaticamente() {
    const textosExamenes = obtenerTextosExamenes();
    const opcionesSeleccionadas = obtenerOpcionesSeleccionadas();
    const resultsDiv = document.getElementById('results');
    const resultsStatus = document.getElementById('resultsStatus');
    const copyArea = document.getElementById('copyArea');

    // Validaciones
    if (textosExamenes.length === 0) {
        mostrarEstado('Pega el texto de al menos un examen para continuar');
        return;
    }

    if (opcionesSeleccionadas.length === 0) {
        mostrarEstado('Selecciona al menos un parámetro para extraer');
        return;
    }

    try {
        let resultadosFinales = [];
        
        // Procesar cada examen
        textosExamenes.forEach(examen => {
            // Caso especial: "Tal cual"
            if (opcionesSeleccionadas.includes('Talcual')) {
                resultadosFinales.push(`=== EXAMEN #${examen.id} ===\n${examen.texto}`);
                return;
            }

            // Extraer datos del examen
            const resultado = extractor.procesar(examen.texto, opcionesSeleccionadas);
            
            if (resultado && resultado.trim()) {
                // Agregar encabezado del examen si hay múltiples exámenes
                if (textosExamenes.length > 1) {
                    resultadosFinales.push(`=== EXAMEN #${examen.id} ===\n${resultado}`);
                } else {
                    resultadosFinales.push(resultado);
                }
            } else {
                if (textosExamenes.length > 1) {
                    resultadosFinales.push(`=== EXAMEN #${examen.id} ===\nNo se encontraron datos`);
                }
            }
        });
        
        if (resultadosFinales.length > 0) {
            const resultadoFinal = resultadosFinales.join('\n\n');
            mostrarResultados(resultadoFinal);
        } else {
            mostrarEstado('No se encontraron datos en ningún examen');
        }
    } catch (error) {
        console.error('Error en la extracción:', error);
        mostrarEstado('Error al procesar los exámenes');
    }
}

// Función para obtener opciones seleccionadas
function obtenerOpcionesSeleccionadas() {
    const checkboxes = document.querySelectorAll('.selection-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Función para mostrar estado
function mostrarEstado(mensaje) {
    const resultsStatus = document.getElementById('resultsStatus');
    const resultsDiv = document.getElementById('results');
    const copyArea = document.getElementById('copyArea');
    
    resultsStatus.style.display = 'block';
    resultsDiv.style.display = 'none';
    copyArea.style.display = 'none';
    resultsStatus.querySelector('.status-text').textContent = mensaje;
}

// Función para mostrar resultados
function mostrarResultados(resultado) {
    const resultsDiv = document.getElementById('results');
    const resultsStatus = document.getElementById('resultsStatus');
    const copyArea = document.getElementById('copyArea');
    
    const htmlResult = resultado.replace(/\n/g, '<br>');
    resultsDiv.innerHTML = htmlResult;
    resultsDiv.style.display = 'block';
    resultsStatus.style.display = 'none';
    copyArea.style.display = 'flex';
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.className = `notification show ${tipo}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Función para copiar resultados
function copiarResultado() {
    const resultsDiv = document.getElementById('results');
    const resultText = resultsDiv.textContent;
    
    if (!resultText) {
        mostrarNotificacion('No hay resultados para copiar', 'error');
        return;
    }

    navigator.clipboard.writeText(resultText).then(() => {
        mostrarNotificacion('Resultado copiado al portapapeles', 'success');
    }).catch(() => {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = resultText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        mostrarNotificacion('Resultado copiado al portapapeles', 'success');
    });
}

// Función para seleccionar todo
function seleccionarTodo() {
    document.querySelectorAll('.selection-checkbox').forEach(cb => {
        if (
            cb.value !== 'Talcual' &&
            !cb.classList.contains('hemograma-extra') &&
            !cb.classList.contains('renal-extra') &&
            !cb.classList.contains('hepatico-extra')
        ) {
            cb.checked = true;
        }
    });
    extraerAutomaticamente();
    mostrarNotificacion('Todos los parámetros seleccionados', 'info');
}

// Función para limpiar selección
function limpiarSeleccion() {
    document.querySelectorAll('.selection-checkbox').forEach(cb => cb.checked = false);
    extraerAutomaticamente();
    mostrarNotificacion('Selección borrada', 'info');
}

// Función para pegar texto del portapapeles
function pegarTextoDelPortapapeles() {
    const textarea = document.getElementById('copyPasteText');
    
    if (!navigator.clipboard) {
        mostrarNotificacion('Tu navegador no soporta la funcionalidad de portapapeles', 'error');
        return;
    }
    
    navigator.clipboard.readText()
        .then(text => {
            if (text.trim()) {
                textarea.value = text;
                extraerAutomaticamente();
                mostrarNotificacion('Texto pegado desde el portapapeles', 'success');
            } else {
                mostrarNotificacion('El portapapeles está vacío', 'error');
            }
        })
        .catch(err => {
            console.error('Error al leer del portapapeles:', err);
            mostrarNotificacion('No se pudo acceder al portapapeles', 'error');
        });
}

// Función para limpiar el texto del examen
function limpiarTexto() {
    const textarea = document.getElementById('copyPasteText');
    textarea.value = '';
    extraerAutomaticamente();
    mostrarNotificacion('Texto del examen borrado', 'info');
}

// ===== TEMA OSCURO =====
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Detectar preferencia del sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Obtener tema guardado o usar preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Aplicar tema inicial
    applyTheme(initialTheme);
    
    // Event listener para el botón
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Mostrar notificación - DESHABILITADO
            // const mensaje = newTheme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado';
            // mostrarNotificacion(mensaje, 'info');
        });
    }
    
    // Escuchar cambios en la preferencia del sistema
    prefersDarkScheme.addEventListener('change', function() {
        if (!localStorage.getItem('theme')) {
            applyTheme(prefersDarkScheme.matches ? 'dark' : 'light');
        }
    });
}

function applyTheme(theme) {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    
    // Actualizar meta theme-color para navegadores móviles
    updateThemeColor(theme);
}

function updateThemeColor(theme) {
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    
    if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.name = 'theme-color';
        document.head.appendChild(themeColorMeta);
    }
    
    // Colores para la barra de estado del navegador móvil
    const themeColors = {
        light: '#ffffff',
        dark: '#1f2937'
    };
    
    themeColorMeta.content = themeColors[theme] || themeColors.light;
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    const copyPasteTextarea = document.getElementById('copyPasteText');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Event listeners para extracción automática
    document.querySelectorAll('.selection-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', extraerAutomaticamente);
    });
    
    // Detectar cambios en el textarea con debounce
    let extractTimeout;
    copyPasteTextarea.addEventListener('input', function() {
        clearTimeout(extractTimeout);
        extractTimeout = setTimeout(extraerAutomaticamente, 300);
    });
    
    // Extraer inmediatamente cuando se pega contenido
    copyPasteTextarea.addEventListener('paste', function() {
        setTimeout(extraerAutomaticamente, 100);
    });

    // Botones principales
    selectAllBtn.addEventListener('click', seleccionarTodo);
    clearAllBtn.addEventListener('click', limpiarSeleccion);
    copyBtn.addEventListener('click', copiarResultado);
    
    // Botones del texto
    const pasteTextBtn = document.getElementById('pasteTextBtn');
    const clearTextBtn = document.getElementById('clearTextBtn');
    
    if (pasteTextBtn) {
        pasteTextBtn.addEventListener('click', pegarTextoDelPortapapeles);
    }
    
    if (clearTextBtn) {
        clearTextBtn.addEventListener('click', limpiarTexto);
    }
    
    // Botones de descarga de tabla
    const downloadImageBtn = document.getElementById('downloadImageBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    if (downloadImageBtn) {
        downloadImageBtn.addEventListener('click', descargarTablaComoImagen);
    }
    
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', descargarTablaComoPDF);
    }

    // Atajos de teclado
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                limpiarSeleccion();
            }
        }
    });
    
    // Funcionalidad de pestañas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
            
            // Si se selecciona la pestaña tabla, generar tabla comparativa
            if (targetTab === 'tabla') {
                generarTablaComparativa();
            }
        });
    });
    
    // Activación automática para "Lisis Tumoral"
    const lisisCb = document.querySelector('.selection-checkbox[value="LisisTumoral"]');
    if (lisisCb) {
        lisisCb.addEventListener('change', function() {
            if (this.checked) {
                // Asegurar Renal y Hepático
                const renalCb = document.querySelector('.selection-checkbox[value="Renal"]');
                const hepaticoCb = document.querySelector('.selection-checkbox[value="Hepatico"], .selection-checkbox[value="Hepático"]');
                if (renalCb) renalCb.checked = true;
                if (hepaticoCb) hepaticoCb.checked = true;

                // Asegurar Ácido Úrico (varias variantes de valor)
                const acUricoSelectors = [
                    '.selection-checkbox[value="AcidoUrico"]',
                    '.selection-checkbox[value="Ácido Úrico"]',
                    '.selection-checkbox[value="Acido Úrico"]'
                ];
                acUricoSelectors.forEach(sel => {
                    const cb = document.querySelector(sel);
                    if (cb) cb.checked = true;
                });

                // Re-ejecutar extracción para reflejar los cambios
                extraerAutomaticamente();
                mostrarNotificacion('Activados Renal, Hepático y Ácido Úrico para Lisis Tumoral', 'info');
            }
        });
    }

    // Selección por defecto al iniciar: marca todas las casillas fuera de submenús
    document.querySelectorAll('.selection-checkbox').forEach(cb => {
        if (
            cb.value !== 'Talcual' &&
            !cb.classList.contains('hemograma-extra') &&
            !cb.classList.contains('renal-extra') &&
            !cb.classList.contains('hepatico-extra')
        ) {
            cb.checked = true;
        }
    });

    // Ejecutar extracción inicial
    extraerAutomaticamente();
    
    // Inicializar funcionalidad del desplegable de hemograma
    initializeHemogramaDropdown();
    
    // Inicializar funcionalidad del desplegable de renal
    initializeRenalDropdown();
    
    // ===== INICIALIZACIÓN DE MÚLTIPLES EXÁMENES =====
    // Botones de gestión de exámenes
    const addNewExamBtn = document.getElementById('addNewExamBtn');
    const clearAllExamsBtn = document.getElementById('clearAllExamsBtn');
    
    if (addNewExamBtn) {
        addNewExamBtn.addEventListener('click', agregarNuevoExamen);
    }
    
    if (clearAllExamsBtn) {
        clearAllExamsBtn.addEventListener('click', limpiarTodosLosExamenes);
    }
    
    // Configurar event listeners del primer examen existente
    const firstExamItem = document.querySelector('.exam-item[data-exam-id="1"]');
    if (firstExamItem) {
        setupExamEventListeners(firstExamItem, 1);
        currentExams.set(1, ''); // Registrar el primer examen
    }
    
    // Inicializar tema
    initializeThemeToggle();
});

// ===== FUNCIONES DE DESCARGA =====

// Función para descargar como texto
function descargarComoTexto(contenido, nombreArchivo = 'extraccion-medica.txt') {
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Lista de parámetros para tabla comparativa en orden específico
const PARAMETROS_TABLA = [
    { nombre: 'Leucocitos (10³/uL)', patron: PATRONES_EXTRACCION.leucocitos, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: '% Neutrófilos', patron: PATRONES_EXTRACCION.neutrofilos, formato: (v) => Math.round(parseFloat(v)).toString() },
    { nombre: 'RAN', patron: PATRONES_EXTRACCION.neutrofilos_abs, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'RAL', patron: PATRONES_EXTRACCION.linfocitos_abs, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'Hematocrito (%)', patron: PATRONES_EXTRACCION.hematocrito_pct, formato: (v) => Math.round(parseFloat(v)).toString() },
    { nombre: 'Hemoglobina (g/dL)', patron: PATRONES_EXTRACCION.hemoglobina, formato: (v) => parseFloat(v).toFixed(1) },
    { nombre: 'Plaquetas (10³/uL)', patron: PATRONES_EXTRACCION.plaquetas, formato: (v) => parseInt(v).toString() },
    { nombre: 'VHS', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'PCR', patron: PATRONES_EXTRACCION.pcr, formato: (v) => parseFloat(v).toFixed(1) },
    { nombre: 'PT (%)', patron: PATRONES_EXTRACCION.tp_pct, formato: (v) => Math.round(parseFloat(v)).toString() },
    { nombre: 'INR', patron: PATRONES_EXTRACCION.inr_val, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'TTPA', patron: PATRONES_EXTRACCION.ttpa_seg, formato: (v) => parseFloat(v).toFixed(1) },
    { nombre: 'Glicemia', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'Uremia (mg/dL)', patron: PATRONES_EXTRACCION.urea, formato: (v) => parseFloat(v).toFixed(1) },
    { nombre: 'BUN (mg%)', patron: PATRONES_EXTRACCION.bun, formato: (v) => parseFloat(v).toFixed(1) },
    { nombre: 'Creatinina (mg/dL)', patron: PATRONES_EXTRACCION.creatinina, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'VFG (mL/min)', patron: PATRONES_EXTRACCION.vfg, formato: (v) => parseFloat(v).toFixed(1) },
    { nombre: 'Sodio (mEq/L)', patron: PATRONES_EXTRACCION.sodio, formato: (v) => parseFloat(v).toFixed(1) },
    { nombre: 'Potasio (mEq/L)', patron: PATRONES_EXTRACCION.potasio, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'Cloro (mEq/L)', patron: PATRONES_EXTRACCION.cloro, formato: (v) => parseFloat(v).toFixed(1) },
    { nombre: 'Calcio (mg/dL)', patron: PATRONES_EXTRACCION.calcio, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'Fósforo (mg/dL)', patron: PATRONES_EXTRACCION.fosforo, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'Magnesio (mg/dL)', patron: PATRONES_EXTRACCION.magnesio, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'Albúmina (g/dL)', patron: /ALBUMINA\s\D*(\d+\.?\d*)\s*g\/dL/i, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'Prealbúmina', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'Proteínas', patron: /PROTEINAS\s+TOTALES\s\D*(\d+\.?\d*)\s*g\/dL/i, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'Bilirrubina Total', patron: PATRONES_EXTRACCION.bilirrubina_total, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'Bilirrubina Directa', patron: PATRONES_EXTRACCION.bilirrubina_directa, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'Fosfatasa Alcalina', patron: PATRONES_EXTRACCION.fosfatasa_alcalina, formato: (v) => Math.round(parseFloat(v)).toString() },
    { nombre: 'GGT', patron: PATRONES_EXTRACCION.ggt, formato: (v) => parseFloat(v.replace(',', '.')).toFixed(1) },
    { nombre: 'GOT', patron: PATRONES_EXTRACCION.got, formato: (v) => parseFloat(v).toFixed(1) },
    { nombre: 'GPT', patron: PATRONES_EXTRACCION.gpt, formato: (v) => parseFloat(v).toFixed(1) },
    { nombre: 'Amilasa', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'Lipasa', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'Ácido Úrico (mg/dL)', patron: PATRONES_EXTRACCION.acido_urico, formato: (v) => parseFloat(v).toFixed(2) },
    { nombre: 'LDH', patron: PATRONES_EXTRACCION.ldh, formato: (v) => Math.round(parseFloat(v)).toString() },
    { nombre: 'CK Total', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'CK MB', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'Troponina', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'PO2 (mmHg)', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'PCO2 (mmHg)', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'HCO3 (mmol/L)', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'pH', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'BE (mmol/L)', patron: null, formato: (v) => v }, // No hay patrón definido
    { nombre: 'SatO2 (%)', patron: null, formato: (v) => v } // No hay patrón definido
];

// Función para generar tabla comparativa
function generarTablaComparativa() {
    const textoExamen = document.getElementById('copyPasteText').value.trim();
    const tableContainer = document.querySelector('.comparative-table-container');
    const tableActions = document.getElementById('tableActions');
    
    if (!textoExamen) {
        tableContainer.innerHTML = '<p class="status-text">Pega el texto del reporte médico para generar la tabla comparativa</p>';
        tableActions.style.display = 'none';
        return;
    }
    
    // Crear tabla HTML
    let tableHTML = `
        <table class="comparative-table">
            <thead>
                <tr>
                    <th>Parámetro</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let valoresEncontrados = 0;
    
    // Procesar cada parámetro en orden
    PARAMETROS_TABLA.forEach(parametro => {
        let valor = '-';
        
        if (parametro.patron) {
            const match = textoExamen.match(parametro.patron);
            if (match && match[1]) {
                try {
                    valor = parametro.formato(match[1]);
                    valoresEncontrados++;
                } catch (e) {
                    console.warn(`Error formateando ${parametro.nombre}:`, e);
                    valor = match[1]; // Usar valor sin formatear si hay error
                }
            }
        }
        
        tableHTML += `
            <tr>
                <td>${parametro.nombre}</td>
                <td>${valor}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    // Mostrar tabla o mensaje de estado
    if (valoresEncontrados > 0) {
        tableContainer.innerHTML = tableHTML;
        tableActions.style.display = 'flex';
    } else {
        tableContainer.innerHTML = '<p class="status-text">No se encontraron valores para mostrar en la tabla</p>';
        tableActions.style.display = 'none';
    }
}

// Función para descargar tabla como imagen (requiere html2canvas)
function descargarTablaComoImagen() {
    const tableContainer = document.querySelector('.comparative-table-container');
    const table = tableContainer.querySelector('.comparative-table');
    
    if (!table) {
        mostrarNotificacion('No hay tabla para descargar', 'error');
        return;
    }
    
    // Verificar si html2canvas está disponible
    if (typeof html2canvas === 'undefined') {
        mostrarNotificacion('html2canvas no está disponible', 'error');
        return;
    }
    
    html2canvas(table, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `tabla-comparativa-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        mostrarNotificacion('Tabla descargada como imagen', 'success');
    }).catch(error => {
        console.error('Error al generar imagen:', error);
        mostrarNotificacion('Error al generar la imagen', 'error');
    });
}

// Funcionalidad del desplegable de hemograma
function initializeHemogramaDropdown() {
    console.log('=== INICIANDO DESPLEGABLE DE HEMOGRAMA ===');
    
    const dropdownToggle = document.querySelector('.hemograma-with-dropdown .dropdown-toggle-inline');
    const dropdownContent = document.getElementById('hemograma-dropdown');
    const hemogramaContainer = document.querySelector('.hemograma-with-dropdown');
    
    console.log('Dropdown toggle encontrado:', dropdownToggle);
    console.log('Dropdown content encontrado:', dropdownContent);
    
    if (!dropdownToggle || !dropdownContent || !hemogramaContainer) {
        console.warn('Elementos del desplegable de hemograma no encontrados');
        return;
    }
    
    let hoverTimeout = null;
    let isClickOpen = false;
    
    // Función para abrir dropdown
    function openDropdown() {
        // Cerrar todos los otros desplegables
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            if (dropdown !== dropdownContent) {
                dropdown.classList.remove('show');
                // Remover clase del step-card que contenía el dropdown cerrado
                const otherParentStepCard = dropdown.closest('.step-card');
                if (otherParentStepCard) {
                    otherParentStepCard.classList.remove('dropdown-parent-active');
                }
            }
        });
        
        dropdownContent.classList.add('show');
        document.body.classList.add('dropdown-open');
        
        // Agregar clase al step-card padre para aumentar z-index
        const parentStepCard = dropdownContent.closest('.step-card');
        if (parentStepCard) {
            parentStepCard.classList.add('dropdown-parent-active');
        }
        
        // Rotar el chevron
        const chevron = dropdownToggle.querySelector('svg');
        if (chevron) {
            chevron.style.transform = 'rotate(180deg)';
        }
    }
    
    // Función para cerrar dropdown
    function closeDropdown() {
        if (!isClickOpen) {
            dropdownContent.classList.remove('show');
            document.body.classList.remove('dropdown-open');
            
            // Remover clase del step-card padre para reducir z-index
            const parentStepCard = dropdownContent.closest('.step-card');
            if (parentStepCard) {
                parentStepCard.classList.remove('dropdown-parent-active');
            }
            
            // Resetear chevron
            const chevron = dropdownToggle.querySelector('svg');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        }
    }
    
    // Hover events para el contenedor completo
    hemogramaContainer.addEventListener('mouseenter', function() {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            if (!dropdownContent.classList.contains('show')) {
                openDropdown();
            }
        }, 1000); // 1 segundo de delay
    });
    
    hemogramaContainer.addEventListener('mouseleave', function() {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
        
        // Solo cerrar si no está abierto por click
        setTimeout(() => {
            if (!hemogramaContainer.matches(':hover') && !dropdownContent.matches(':hover')) {
                closeDropdown();
            }
        }, 200);
    });
    
    // Mantener abierto cuando el mouse está sobre el dropdown
    dropdownContent.addEventListener('mouseenter', function() {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
    });
    
    dropdownContent.addEventListener('mouseleave', function() {
        setTimeout(() => {
            if (!hemogramaContainer.matches(':hover') && !dropdownContent.matches(':hover')) {
                closeDropdown();
            }
        }, 200);
    });
    
    // Toggle del desplegable por click
    dropdownToggle.addEventListener('click', function(e) {
        console.log('CLICK EN HEMOGRAMA DROPDOWN');
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = dropdownContent.classList.contains('show');
        console.log('¿Está abierto?', isOpen);
        
        if (isOpen) {
            // Si está abierto, cerrarlo
            isClickOpen = false;
            dropdownContent.classList.remove('show');
            document.body.classList.remove('dropdown-open');
            
            // Resetear chevron
            const chevron = this.querySelector('svg');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        } else {
            // Si está cerrado, abrirlo y marcarlo como abierto por click
            isClickOpen = true;
            openDropdown();
        }
    });
    
    // Botones Todo y Borrar del hemograma
    const selectAllHemogramaBtn = document.getElementById('selectAllHemogramaBtn');
    const clearAllHemogramaBtn = document.getElementById('clearAllHemogramaBtn');
    
    if (selectAllHemogramaBtn) {
        selectAllHemogramaBtn.addEventListener('click', function() {
            document.querySelectorAll('.hemograma-extra').forEach(cb => cb.checked = true);
            extraerAutomaticamente();
            mostrarNotificacion('Todos los parámetros de hemograma seleccionados', 'info');
        });
    }
    
    if (clearAllHemogramaBtn) {
        clearAllHemogramaBtn.addEventListener('click', function() {
            document.querySelectorAll('.hemograma-extra').forEach(cb => cb.checked = false);
            extraerAutomaticamente();
            mostrarNotificacion('Selección de hemograma borrada', 'info');
        });
    }
    
    // Cerrar desplegable al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.selection-item-with-dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                dropdown.classList.remove('show');
                // Remover clase del step-card que contenía el dropdown cerrado
                const parentStepCard = dropdown.closest('.step-card');
                if (parentStepCard) {
                    parentStepCard.classList.remove('dropdown-parent-active');
                }
            });
            document.body.classList.remove('dropdown-open');
            
            // Resetear rotación de chevrons
            document.querySelectorAll('.dropdown-toggle-inline svg').forEach(chevron => {
                chevron.style.transform = 'rotate(0deg)';
            });
        }
    });
    
    console.log('=== DESPLEGABLE DE HEMOGRAMA INICIADO ===');
}

// Funcionalidad del desplegable de renal
function initializeRenalDropdown() {
    console.log('=== INICIANDO DESPLEGABLE DE RENAL ===');
    
    const dropdownToggle = document.querySelector('.renal-with-dropdown .dropdown-toggle-inline');
    const dropdownContent = document.getElementById('renal-dropdown');
    const renalContainer = document.querySelector('.renal-with-dropdown');
    
    if (!dropdownToggle || !dropdownContent || !renalContainer) {
        console.warn('Elementos del desplegable de renal no encontrados');
        return;
    }
    
    let hoverTimeout = null;
    let isClickOpen = false;
    
    // Función para abrir dropdown
    function openDropdown() {
        // Cerrar todos los otros desplegables
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            if (dropdown !== dropdownContent) {
                dropdown.classList.remove('show');
                // Remover clase del step-card que contenía el dropdown cerrado
                const otherParentStepCard = dropdown.closest('.step-card');
                if (otherParentStepCard) {
                    otherParentStepCard.classList.remove('dropdown-parent-active');
                }
            }
        });
        
        dropdownContent.classList.add('show');
        document.body.classList.add('dropdown-open');
        
        // Agregar clase al step-card padre para aumentar z-index
        const parentStepCard = dropdownContent.closest('.step-card');
        if (parentStepCard) {
            parentStepCard.classList.add('dropdown-parent-active');
        }
        
        // Rotar el chevron
        const chevron = dropdownToggle.querySelector('svg');
        if (chevron) {
            chevron.style.transform = 'rotate(180deg)';
        }
    }
    
    // Función para cerrar dropdown
    function closeDropdown() {
        if (!isClickOpen) {
            dropdownContent.classList.remove('show');
            document.body.classList.remove('dropdown-open');
            
            // Remover clase del step-card padre para reducir z-index
            const parentStepCard = dropdownContent.closest('.step-card');
            if (parentStepCard) {
                parentStepCard.classList.remove('dropdown-parent-active');
            }
            
            // Resetear chevron
            const chevron = dropdownToggle.querySelector('svg');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        }
    }
    
    // Hover events para el contenedor completo
    renalContainer.addEventListener('mouseenter', function() {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            if (!dropdownContent.classList.contains('show')) {
                openDropdown();
            }
        }, 1000); // 1 segundo de delay
    });
    
    renalContainer.addEventListener('mouseleave', function() {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
        
        // Solo cerrar si no está abierto por click
        setTimeout(() => {
            if (!renalContainer.matches(':hover') && !dropdownContent.matches(':hover')) {
                closeDropdown();
            }
        }, 200);
    });
    
    // Mantener abierto cuando el mouse está sobre el dropdown
    dropdownContent.addEventListener('mouseenter', function() {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
    });
    
    dropdownContent.addEventListener('mouseleave', function() {
        setTimeout(() => {
            if (!renalContainer.matches(':hover') && !dropdownContent.matches(':hover')) {
                closeDropdown();
            }
        }, 200);
    });
    
    // Toggle del desplegable por click
    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = dropdownContent.classList.contains('show');
        
        if (isOpen) {
            // Si está abierto, cerrarlo
            isClickOpen = false;
            dropdownContent.classList.remove('show');
            document.body.classList.remove('dropdown-open');
            
            // Resetear chevron
            const chevron = this.querySelector('svg');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        } else {
            // Si está cerrado, abrirlo y marcarlo como abierto por click
            isClickOpen = true;
            openDropdown();
        }
    });
    
    // Botones Todo y Borrar del renal
    const selectAllRenalBtn = document.getElementById('selectAllRenalBtn');
    const clearAllRenalBtn = document.getElementById('clearAllRenalBtn');
    
    if (selectAllRenalBtn) {
        selectAllRenalBtn.addEventListener('click', function() {
            document.querySelectorAll('.renal-extra').forEach(cb => cb.checked = true);
            extraerAutomaticamente();
            mostrarNotificacion('Todos los parámetros renales seleccionados', 'info');
        });
    }
    
    if (clearAllRenalBtn) {
        clearAllRenalBtn.addEventListener('click', function() {
            document.querySelectorAll('.renal-extra').forEach(cb => cb.checked = false);
            extraerAutomaticamente();
            mostrarNotificacion('Selección renal borrada', 'info');
        });
    }
    
    console.log('=== DESPLEGABLE DE RENAL INICIADO ===');
}

// Función para descargar tabla como PDF (requiere jsPDF)
function descargarTablaComoPDF() {
    const table = document.querySelector('.comparative-table');
    
    if (!table) {
        mostrarNotificacion('No hay tabla para descargar', 'error');
        return;
    }
    
    // Verificar si jsPDF está disponible
    if (typeof window.jsPDF === 'undefined') {
        mostrarNotificacion('jsPDF no está disponible', 'error');
        return;
    }
    
    try {
        const { jsPDF } = window.jsPDF;
        const pdf = new jsPDF();
        
        // Título del PDF
        pdf.setFontSize(16);
        pdf.text('Tabla Comparativa - Extractor Médico', 20, 20);
        
        // Obtener datos de la tabla
        const rows = table.querySelectorAll('tbody tr');
        let yPosition = 40;
        
        pdf.setFontSize(12);
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const parametro = cells[0].textContent.trim();
                const valor = cells[1].textContent.trim();
                
                // Solo incluir filas con valores (no "-")
                if (valor !== '-') {
                    pdf.text(`${parametro}: ${valor}`, 20, yPosition);
                    yPosition += 8;
                    
                    // Nueva página si es necesario
                    if (yPosition > 280) {
                        pdf.addPage();
                        yPosition = 20;
                    }
                }
            }
        });
        
        // Descargar PDF
        pdf.save(`tabla-comparativa-${new Date().toISOString().split('T')[0]}.pdf`);
        mostrarNotificacion('PDF generado correctamente', 'success');
        
    } catch (error) {
        console.error('Error al generar PDF:', error);
        mostrarNotificacion('Error al generar el PDF', 'error');
    }
}

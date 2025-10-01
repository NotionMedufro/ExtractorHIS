// EXTRACTORES MÉDICOS SIMPLIFICADOS
// Cada función es independiente y fácil de modificar

class SimpleExtractor {
    constructor() {
        this.texto = '';
    }

    // Función auxiliar para limpiar asteriscos
    limpiarAsteriscos(texto) {
        return texto.replace(/\* /g, '*');
    }

    // Función auxiliar para formatear números
    formatearNumero(valor) {
        if (!valor) return valor;
        
        const numero = parseFloat(valor);
        if (isNaN(numero)) return valor;
        
        // Si es menor que 10 y tiene decimales, mantener 1 decimal
        if (numero < 10 && numero % 1 !== 0) {
            return numero.toFixed(1);
        }
        // Si es mayor o igual a 10, redondear a entero
        return Math.round(numero).toString();
    }

    // ============== EXTRACTOR DE HEMOGRAMA ==============
    extraerHemograma() {
        let resultados = [];

        // 1. HEMOGLOBINA
        const hb = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.hemoglobina);
        if (hb) {
            const hbFormateado = parseFloat(hb).toFixed(1);
            resultados.push(`Hb: ${hbFormateado}`);
        }

        // 2. LEUCOCITOS (Glóbulos Blancos)
        const gb = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.leucocitos);
        if (gb) {
            const gbFormateado = parseFloat(gb).toFixed(3);
            resultados.push(`GB: ${gbFormateado}`);
        }

        // 3. NEUTRÓFILOS %
        const neutrofilos = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.neutrofilos_porcentaje);
        if (neutrofilos) {
            const neutRedondeado = Math.round(parseFloat(neutrofilos));
            resultados.push(`(N: ${neutRedondeado}%)`);
        }

        // 4. PLAQUETAS
        const plaquetas = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.plaquetas);
        if (plaquetas) {
            resultados.push(`Plq: ${plaquetas}.000`);
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE FUNCIÓN RENAL ==============
    extraerRenal() {
        let resultados = [];

        // 1. CREATININA (sin redondear)
        const creatinina = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.creatinina);
        if (creatinina) {
            resultados.push(`Crea: ${creatinina}`);
        }

        // 2. BUN (Nitrógeno Ureico)
        const bun = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.bun);
        if (bun) {
            resultados.push(`BUN: ${bun}`);
        }

        // 3. UREA (redondear a entero)
        const urea = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.urea);
        if (urea) {
            const ureaRedondeada = Math.round(parseFloat(urea));
            resultados.push(`Urea: ${ureaRedondeada}`);
        }

        // 4. ELECTROLITOS (Na/K/Cl)
        const sodio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.sodio);
        const potasio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.potasio);
        const cloro = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.cloro);
        
        if (sodio && potasio && cloro) {
            const naRedondeado = Math.round(parseFloat(sodio));
            const kFormateado = parseFloat(potasio).toFixed(1);
            const clRedondeado = Math.round(parseFloat(cloro));
            resultados.push(`ELP: ${naRedondeado}/${kFormateado}/${clRedondeado}`);
        }

        // 5. FÓSFORO (sin redondear)
        const fosforo = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.fosforo);
        if (fosforo) {
            resultados.push(`P: ${fosforo}`);
        }

        // 6. CALCIO (1 decimal)
        const calcio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.calcio);
        if (calcio) {
            const caFormateado = parseFloat(calcio).toFixed(1);
            resultados.push(`Ca: ${caFormateado}`);
        }

        // 7. MAGNESIO (sin redondear)
        const magnesio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.magnesio);
        if (magnesio) {
            resultados.push(`Mg: ${magnesio}`);
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE FUNCIÓN HEPÁTICA ==============
    extraerHepatico() {
        let resultados = [];

        // 1. BILIRRUBINA TOTAL
        const biliTotal = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.bilirrubina_total);
        if (biliTotal) {
            resultados.push(`BiliT: ${biliTotal}`);
        }

        // 2. GOT/GPT (Transaminasas)
        const got = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.got_asat);
        const gpt = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.gpt_alt);
        
        if (got && gpt) {
            const gotFormateado = this.formatearNumero(got);
            const gptFormateado = this.formatearNumero(gpt);
            resultados.push(`GOT/GPT: ${gotFormateado}/${gptFormateado}`);
        } else if (got) {
            const gotFormateado = this.formatearNumero(got);
            resultados.push(`GOT: ${gotFormateado}`);
        } else if (gpt) {
            const gptFormateado = this.formatearNumero(gpt);
            resultados.push(`GPT: ${gptFormateado}`);
        }

        // 3. FOSFATASA ALCALINA
        const fa = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.fosfatasa_alcalina);
        if (fa) {
            const faFormateada = this.formatearNumero(fa);
            resultados.push(`FA: ${faFormateada}`);
        }

        // 4. ALBÚMINA
        const albumina = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.albumina);
        if (albumina) {
            const albFormateada = this.formatearNumero(albumina);
            resultados.push(`Alb: ${albFormateada}`);
        }

        // 5. PROTEÍNAS TOTALES
        const proteinas = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.proteinas);
        if (proteinas) {
            const protFormateadas = this.formatearNumero(proteinas);
            resultados.push(`Prot: ${protFormateadas}`);
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE PCR Y MARCADORES INFLAMATORIOS ==============
    extraerPCR() {
        let resultados = [];

        // 1. PCR (Proteína C Reactiva) - redondear a 1 decimal
        const pcr = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.pcr);
        if (pcr) {
            const pcrFormateada = parseFloat(pcr).toFixed(1);
            resultados.push(`PCR: ${pcrFormateada}`);
        }

        // 2. PROCALCITONINA
        const procalcitonina = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.procalcitonina);
        if (procalcitonina) {
            resultados.push(`Proca: ${procalcitonina}`);
        }

        // 3. VHS (Velocidad de Sedimentación)
        const vhs = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.vhs);
        if (vhs) {
            resultados.push(`VHS: ${vhs}`);
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE COAGULACIÓN ==============
    extraerCoagulacion() {
        let resultados = [];

        // 1. INR
        const inr = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.inr);
        if (inr) {
            resultados.push(`INR: ${inr}`);
        }

        // 2. TIEMPO DE PROTROMBINA
        const pt = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.tiempo_protrombina);
        if (pt) {
            resultados.push(`PT: ${pt}`);
        }

        // 3. TTPA
        const ptt = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.ttpa);
        if (ptt) {
            resultados.push(`PTT: ${ptt}`);
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR NUTRICIONAL ==============
    extraerNutricional() {
        let resultados = [];

        // 1. PROTEÍNAS TOTALES
        const proteinas = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.proteinas);
        if (proteinas) {
            resultados.push(`Prot: ${proteinas}`);
        }

        // 2. ALBÚMINA
        const albumina = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.albumina);
        if (albumina) {
            resultados.push(`Alb: ${albumina}`);
        }

        // 3. PREALBÚMINA
        const prealbumin = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.prealbumin);
        if (prealbumin) {
            resultados.push(`Prealb: ${prealbumin}`);
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE GASES EN SANGRE ==============
    extraerGases() {
        let resultados = [];

        // 1. pH
        const ph = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.ph);
        if (ph) {
            resultados.push(`pH: ${ph}`);
        }

        // 2. PCO2
        const pco2 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.pco2);
        if (pco2) {
            resultados.push(`pCO2: ${pco2}`);
        }

        // 3. HCO3
        const hco3 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.hco3);
        if (hco3) {
            resultados.push(`HCO3: ${hco3}`);
        }

        // 4. SATURACIÓN O2
        const satO2 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.saturacion_o2);
        if (satO2) {
            resultados.push(`SatO2: ${satO2}`);
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE FECHA ==============
    extraerFecha() {
        // Probar todos los patrones de fecha
        for (let patron of EXTRACTION_PATTERNS.fechas.patrones) {
            let coincidencia = this.texto.match(patron);
            if (coincidencia) {
                let fechaCompleta = coincidencia[1];
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
        }
        return '';
    }

    // ============== FUNCIÓN PRINCIPAL ==============
    procesar(texto, opcionesSeleccionadas) {
        this.texto = texto;
        let resultados = [];

        // Agregar fecha si está seleccionada
        if (opcionesSeleccionadas.includes('Fecha')) {
            const fecha = this.extraerFecha();
            if (fecha) resultados.push(fecha);
        }

        // Procesar cada tipo de examen seleccionado
        if (opcionesSeleccionadas.includes('Hemograma')) {
            const hemograma = this.extraerHemograma();
            if (hemograma) resultados.push(hemograma);
        }

        if (opcionesSeleccionadas.includes('PCR')) {
            const pcr = this.extraerPCR();
            if (pcr) resultados.push(pcr);
        }

        if (opcionesSeleccionadas.includes('Renal')) {
            const renal = this.extraerRenal();
            if (renal) resultados.push(renal);
        }

        if (opcionesSeleccionadas.includes('Hepático')) {
            const hepatico = this.extraerHepatico();
            if (hepatico) resultados.push(hepatico);
        }

        if (opcionesSeleccionadas.includes('Coagulación')) {
            const coagulacion = this.extraerCoagulacion();
            if (coagulacion) resultados.push(coagulacion);
        }

        if (opcionesSeleccionadas.includes('Nutricional')) {
            const nutricional = this.extraerNutricional();
            if (nutricional) resultados.push(nutricional);
        }

        if (opcionesSeleccionadas.includes('Gases')) {
            const gases = this.extraerGases();
            if (gases) resultados.push(gases);
        }

        return resultados.join('\n');
    }
}

// Exportar para uso en script.js
window.SimpleExtractor = SimpleExtractor;

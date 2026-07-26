// EXTRACTORES MÉDICOS SIMPLIFICADOS
// Cada función es independiente y fácil de modificar

class SimpleExtractor {
    constructor() {
        this.texto = '';
        this.formatOptions = {
            usarDosPuntos: true,
            usarMayusculas: false,
            usarSaltosLinea: true
        };
    }

    // Configura las opciones de formato
    setFormatOptions(options) {
        this.formatOptions = { ...this.formatOptions, ...options };
    }

    // Formatea una etiqueta con valor según las opciones
    formatearEtiqueta(etiqueta, valor) {
        let label = this.formatOptions.usarMayusculas ? etiqueta.toUpperCase() : etiqueta;
        let separador = this.formatOptions.usarDosPuntos ? ': ' : ' ';
        return `${label}${separador}${valor}`;
    }

    // Formatea etiqueta compuesta (ej: GOT/GPT)
    formatearEtiquetaCompuesta(etiqueta, valor1, valor2) {
        let label = this.formatOptions.usarMayusculas ? etiqueta.toUpperCase() : etiqueta;
        let separador = this.formatOptions.usarDosPuntos ? ': ' : ' ';
        return `${label}${separador}${valor1}/${valor2}`;
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
    extraerHemograma(opcionesSeleccionadas = []) {
        let resultados = [];

        const hb = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.hemoglobina);
        const hcto = opcionesSeleccionadas.includes('Hcto')
            ? extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.hematocrito)
            : null;
        const hbLabel = (this.formatOptions.usarHb !== false) ? 'Hb' : 'Hg';

        if (hb && hcto) {
            resultados.push(
                this.formatearEtiqueta(
                    `${hbLabel}/Hcto`,
                    `${parseFloat(hb).toFixed(1)}/${Math.round(parseFloat(hcto))}`
                )
            );
        } else if (hb) {
            resultados.push(this.formatearEtiqueta(hbLabel, parseFloat(hb).toFixed(1)));
        } else if (hcto) {
            resultados.push(this.formatearEtiqueta('Hcto', Math.round(parseFloat(hcto))));
        }

        // Índices eritrocitarios agrupados después de Hb/Hcto.
        const detallesEritrocitarios = [];
        const vcm = opcionesSeleccionadas.includes('VCM')
            ? extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.vcm)
            : null;
        const chcm = opcionesSeleccionadas.includes('CHCM')
            ? extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.chcm)
            : null;

        if (vcm && chcm) {
            detallesEritrocitarios.push(
                this.formatearEtiqueta(
                    'VCM/CHCM',
                    `${Math.round(parseFloat(vcm))}/${Math.round(parseFloat(chcm))}`
                )
            );
        } else if (vcm) {
            detallesEritrocitarios.push(
                this.formatearEtiqueta('VCM', Math.round(parseFloat(vcm)))
            );
        } else if (chcm) {
            detallesEritrocitarios.push(
                this.formatearEtiqueta('CHCM', Math.round(parseFloat(chcm)))
            );
        }

        if (opcionesSeleccionadas.includes('RDW')) {
            const rdw = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.rdw);
            if (rdw) {
                detallesEritrocitarios.push(
                    this.formatearEtiqueta('RDW', Math.round(parseFloat(rdw)))
                );
            }
        }

        if (opcionesSeleccionadas.includes('Reticulocitos')) {
            const retic = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.reticulocitos);
            if (retic) {
                detallesEritrocitarios.push(this.formatearEtiqueta('Ret', `${retic}%`));
            }
        }

        if (detallesEritrocitarios.length > 0) {
            resultados.push(`(${detallesEritrocitarios.join(', ')})`);
        }

        // Leucocitos y fórmula diferencial en un único bloque.
        const gb = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.leucocitos);
        if (gb) {
            const gbFormateado = parseFloat(gb).toFixed(3);
            const diferencial = [];

            const neutrofilos = extraerValor(
                this.texto,
                EXTRACTION_PATTERNS.hemograma.neutrofilos_porcentaje
            );
            if (neutrofilos) {
                diferencial.push(
                    this.formatearEtiqueta('N', `${Math.round(parseFloat(neutrofilos))}%`)
                );
            }

            if (opcionesSeleccionadas.includes('Linfocitos')) {
                const linf = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.linfocitos_porcentaje);
                if (linf) {
                    diferencial.push(
                        this.formatearEtiqueta('L', `${Math.round(parseFloat(linf))}%`)
                    );
                }
            }

            if (opcionesSeleccionadas.includes('RAN')) {
                let ran = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.neutrofilos_absoluto);
                if (!ran && neutrofilos) {
                    ran = (parseFloat(gb) * parseFloat(neutrofilos) / 100).toString();
                }
                if (ran) {
                    diferencial.push(
                        this.formatearEtiqueta('RAN', parseFloat(ran).toFixed(3))
                    );
                }
            }

            if (opcionesSeleccionadas.includes('RAL')) {
                let ral = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.linfocitos_absoluto);
                const linfocitos = extraerValor(
                    this.texto,
                    EXTRACTION_PATTERNS.hemograma.linfocitos_porcentaje
                );
                if (!ral && linfocitos) {
                    ral = (parseFloat(gb) * parseFloat(linfocitos) / 100).toString();
                }
                if (ral) {
                    diferencial.push(
                        this.formatearEtiqueta('RAL', parseFloat(ral).toFixed(3))
                    );
                }
            }

            let bloqueGB = this.formatearEtiqueta('GB', gbFormateado);
            if (diferencial.length > 0) {
                bloqueGB += ` (${diferencial.join(', ')})`;
            }
            resultados.push(bloqueGB);
        }

        const plaquetas = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.plaquetas);
        if (plaquetas) {
            resultados.push(this.formatearEtiqueta('Plaq', `${plaquetas}.000`));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE FUNCIÓN RENAL ==============
    extraerRenal(opcionesSeleccionadas = []) {
        let resultados = [];

        const creatinina = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.creatinina);
        if (creatinina) {
            let creaFormateada = parseFloat(creatinina).toFixed(1);

            // VFG (Velocidad de Filtración Glomerular)
            if (opcionesSeleccionadas.includes('VFG')) {
                const vfg = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.vfg);
                if (vfg) {
                    const vfgFormateado = Math.round(parseFloat(vfg));
                    const sepVfg = this.formatOptions.usarDosPuntos ? ': ' : ' ';
                    creaFormateada += ` (VFG${sepVfg}${vfgFormateado})`;
                }
            }

            resultados.push(this.formatearEtiqueta('Crea', creaFormateada));
        }

        // 2. BUN (Nitrógeno Ureico) - siempre incluido
        const bun = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.bun);
        if (bun) {
            const bunFormateado = parseFloat(bun).toFixed(1);
            resultados.push(this.formatearEtiqueta('BUN', bunFormateado));
        }

        // 3. UREA (solo si está seleccionada en el submenú)
        if (opcionesSeleccionadas.includes('Urea')) {
            const urea = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.urea);
            if (urea) {
                const ureaRedondeada = Math.round(parseFloat(urea));
                resultados.push(this.formatearEtiqueta('Urea', ureaRedondeada));
            }
        }

        // 4. ELECTROLITOS (Na/K/Cl)
        const sodio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.sodio);
        const potasio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.potasio);
        const cloro = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.cloro);

        if (sodio && potasio && cloro) {
            const naRedondeado = Math.round(parseFloat(sodio));
            const kFormateado = parseFloat(potasio).toFixed(1);
            const clRedondeado = Math.round(parseFloat(cloro));
            resultados.push(this.formatearEtiqueta('ELP', `${naRedondeado}/${kFormateado}/${clRedondeado}`));
        }

        // 5. CALCIO (1 decimal)
        const calcio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.calcio);
        if (calcio) {
            const caFormateado = parseFloat(calcio).toFixed(1);
            resultados.push(this.formatearEtiqueta('Ca', caFormateado));
        }

        // 6. FÓSFORO (sin redondear)
        const fosforo = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.fosforo);
        if (fosforo) {
            resultados.push(this.formatearEtiqueta('P', fosforo));
        }

        // === PARÁMETROS ADICIONALES DEL SUBMENÚ ===

        // 7. MAGNESIO (solo si está seleccionado)
        if (opcionesSeleccionadas.includes('Magnesio')) {
            const magnesio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.magnesio);
            if (magnesio) {
                resultados.push(this.formatearEtiqueta('Mg', magnesio));
            }
        }

        // 8. ÁCIDO ÚRICO (solo si está seleccionado)
        if (opcionesSeleccionadas.includes('AcidoUrico') || opcionesSeleccionadas.includes('Ácido Úrico') || opcionesSeleccionadas.includes('Acido Úrico')) {
            const acidoUrico = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.acido_urico);
            if (acidoUrico) {
                const auFormateado = parseFloat(acidoUrico).toFixed(1);
                resultados.push(this.formatearEtiqueta('A.Ur', auFormateado));
            }
        }

        // 9. RELACIÓN MICROALBUMINURIA / CREATINURIA
        const rac = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.rac);
        if (rac) {
            const racFormateada = parseFloat(rac).toFixed(1);
            resultados.push(this.formatearEtiqueta('RAC', racFormateada));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXÁMENES QUÍMICOS ADICIONALES ==============
    extraerPancreaticos() {
        let resultados = [];

        const amilasa = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.amilasa);
        if (amilasa) {
            resultados.push(this.formatearEtiqueta('Amil', Math.round(parseFloat(amilasa))));
        }

        const lipasa = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.lipasa);
        if (lipasa) {
            resultados.push(this.formatearEtiqueta('Lip', Math.round(parseFloat(lipasa))));
        }

        return resultados.join(', ');
    }

    extraerGlicemia() {
        const glicemia = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.glucosa);
        if (!glicemia) return '';

        return this.formatearEtiqueta('Glic', Math.round(parseFloat(glicemia)));
    }

    // ============== EXTRACTOR DE FUNCIÓN HEPÁTICA ==============
    extraerHepatico() {
        let resultados = [];

        // 1. BILIRRUBINA TOTAL/DIRECTA -> BiliT/D: 0.49/0.38
        const biliT = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.bilirrubina_total);
        const biliD = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.bilirrubina_directa);
        if (biliT && biliD) {
            resultados.push(this.formatearEtiquetaCompuesta('BiliT/D', biliT, biliD));
        } else if (biliT) {
            resultados.push(this.formatearEtiqueta('BiliT', biliT));
        } else if (biliD) {
            resultados.push(this.formatearEtiqueta('BiliD', biliD));
        }

        // 2. GOT/GPT (Transaminasas) - sin decimales
        const got = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.got_asat);
        const gpt = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.gpt_alt);

        if (got && gpt) {
            const gotFormateado = Math.round(parseFloat(got));
            const gptFormateado = Math.round(parseFloat(gpt));
            resultados.push(this.formatearEtiquetaCompuesta('GOT/GPT', gotFormateado, gptFormateado));
        } else if (got) {
            const gotFormateado = Math.round(parseFloat(got));
            resultados.push(this.formatearEtiqueta('GOT', gotFormateado));
        } else if (gpt) {
            const gptFormateado = Math.round(parseFloat(gpt));
            resultados.push(this.formatearEtiqueta('GPT', gptFormateado));
        }

        // 3. FOSFATASA ALCALINA
        const fa = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.fosfatasa_alcalina);
        if (fa) {
            const faFormateada = Math.round(parseFloat(fa));
            resultados.push(this.formatearEtiqueta('FA', faFormateada));
        }

        // 4. GGT
        const ggt = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.ggt);
        if (ggt) {
            const ggtFormateada = Math.round(parseFloat(ggt));
            resultados.push(this.formatearEtiqueta('GGT', ggtFormateada));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE PCR Y MARCADORES INFLAMATORIOS ==============
    extraerPCR() {
        let resultados = [];

        // 1. PCR (Proteína C Reactiva) - conservar decimales significativos
        const pcr = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.pcr);
        if (pcr) {
            const pcrFormateada = Number(parseFloat(pcr).toFixed(1)).toString();
            resultados.push(this.formatearEtiqueta('PCR', pcrFormateada));
        }

        // 2. PROCALCITONINA
        const procalcitonina = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.procalcitonina);
        if (procalcitonina) {
            resultados.push(this.formatearEtiqueta('Proca', procalcitonina));
        }

        // 3. VHS (Velocidad de Sedimentación)
        const vhs = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.vhs);
        if (vhs) {
            resultados.push(this.formatearEtiqueta('VHS', vhs));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE COAGULACIÓN ==============
    extraerCoagulacion() {
        let resultados = [];

        // 1. INR (1 decimal)
        const inr = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.inr);
        if (inr) {
            const inrFormateado = parseFloat(inr).toFixed(1);
            resultados.push(this.formatearEtiqueta('INR', inrFormateado));
        }

        // 2. TTPA (1 decimal)
        const ttpa = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.ttpa);
        if (ttpa) {
            const ttpaFormateado = parseFloat(ttpa).toFixed(1);
            resultados.push(this.formatearEtiqueta('TTPa', ttpaFormateado));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR NUTRICIONAL ==============
    extraerNutricional(opcionesSeleccionadas = [], agruparHHHA = false) {
        const resultadosMetabolicos = [];
        const resultadosProteicos = [];
        const resultadosLipidicos = [];

        const hba1c = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.hba1c);
        if (hba1c) {
            const hba1cFormateada = Number(parseFloat(hba1c).toFixed(1)).toString();
            resultadosMetabolicos.push(this.formatearEtiqueta('HbA1c', `${hba1cFormateada}%`));
        }

        if (agruparHHHA) {
            const glicemia = this.extraerGlicemia();
            if (glicemia) resultadosMetabolicos.push(glicemia);
        }

        // 1. PROTEÍNAS TOTALES
        const proteinas = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.proteinas);
        if (proteinas) {
            const proteinasFormateadas = parseFloat(proteinas).toFixed(1);
            resultadosProteicos.push(this.formatearEtiqueta('Prot', proteinasFormateadas));
        }

        // 2. ALBÚMINA
        const albumina = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.albumina);
        if (albumina) {
            const albuminaFormateada = parseFloat(albumina).toFixed(1);
            resultadosProteicos.push(this.formatearEtiqueta('Alb', albuminaFormateada));
        }

        // 3. PREALBÚMINA (hasta 2 decimales)
        const prealbumin = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.prealbumin);
        if (prealbumin) {
            // Eliminar decimales extra si tiene más de 2, pero mantener si tiene 1 o 2
            const prealbVal = parseFloat(prealbumin);
            // Máximo 2 decimales, pero toString para eliminar ceros innecesarios si es entero
            const prealbFormateado = Number(prealbVal.toFixed(2)).toString();
            resultadosProteicos.push(this.formatearEtiqueta('PreAlb', prealbFormateado));
        }

        // 4. COLESTEROL TOTAL (sin decimales)
        // Verificar si existe la opción en opcionesSeleccionadas, si no, intentar extraerlo igual si está presente en "Nutricional" general
        const colT = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.colesterol_total);
        if (colT && (opcionesSeleccionadas.includes('ColT') || opcionesSeleccionadas.includes('Nutricional'))) {
            const colTFormateado = Math.round(parseFloat(colT));
            resultadosLipidicos.push(this.formatearEtiqueta('ColT', colTFormateado));
        }

        // 5. LDL (sin decimales)
        const ldl = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.ldl);
        if (ldl && (opcionesSeleccionadas.includes('LDL') || opcionesSeleccionadas.includes('Nutricional'))) {
            const ldlFormateado = Math.round(parseFloat(ldl));
            resultadosLipidicos.push(this.formatearEtiqueta('LDL', ldlFormateado));
        }

        // 6. HDL (sin decimales)
        const hdl = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.hdl);
        if (hdl && (opcionesSeleccionadas.includes('HDL') || opcionesSeleccionadas.includes('Nutricional'))) {
            const hdlFormateado = Math.round(parseFloat(hdl));
            resultadosLipidicos.push(this.formatearEtiqueta('HDL', hdlFormateado));
        }

        // 7. TRIGLICÉRIDOS
        const trigliceridos = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.trigliceridos);
        if (trigliceridos && opcionesSeleccionadas.includes('Nutricional')) {
            const tgcFormateado = Math.round(parseFloat(trigliceridos));
            resultadosLipidicos.push(this.formatearEtiqueta('TGC', tgcFormateado));
        }

        if (agruparHHHA) {
            return this.limpiarAsteriscos([
                ...resultadosMetabolicos,
                ...resultadosLipidicos,
                ...resultadosProteicos
            ].join(', '));
        }

        const bloques = [];
        if (resultadosMetabolicos.length > 0) {
            bloques.push(resultadosMetabolicos.join(', '));
        }
        if (resultadosProteicos.length > 0) {
            bloques.push(resultadosProteicos.join(', '));
        }
        if (resultadosLipidicos.length > 0) {
            bloques.push(resultadosLipidicos.join(', '));
        }

        return this.limpiarAsteriscos(bloques.join(', '));
    }

    // ============== MARCADORES CARDIACOS ==============
    extraerCardiacos() {
        let resultados = [];

        const troponina = extraerValor(this.texto, EXTRACTION_PATTERNS.cardiacos.troponina);
        if (troponina) {
            const tropoFormateada = Number(parseFloat(troponina).toFixed(1)).toString();
            resultados.push(this.formatearEtiqueta('Tropo', tropoFormateada));
        }

        const dimeroD = extraerValor(this.texto, EXTRACTION_PATTERNS.cardiacos.dimero_d);
        if (dimeroD) {
            const ddFormateado = this.formatearValorComparativo(dimeroD);
            resultados.push(this.formatearEtiqueta('DD', ddFormateado));
        }

        const probnp = extraerValor(this.texto, EXTRACTION_PATTERNS.cardiacos.probnp);
        if (probnp) {
            const probnpFormateado = Number(parseFloat(probnp).toFixed(1)).toString();
            resultados.push(this.formatearEtiqueta('ProBNP', probnpFormateado));
        }

        return resultados.join(', ');
    }

    // ============== HORMONAS ==============
    extraerHormonas() {
        let resultados = [];

        const tsh = extraerValor(this.texto, EXTRACTION_PATTERNS.hormonas.tsh);
        if (tsh) {
            const tshFormateada = Number(parseFloat(tsh).toFixed(2)).toString();
            resultados.push(this.formatearEtiqueta('TSH', tshFormateada));
        }

        const t4l = extraerValor(this.texto, EXTRACTION_PATTERNS.hormonas.t4l);
        if (t4l) {
            const t4lFormateada = Number(parseFloat(t4l).toFixed(2)).toString();
            resultados.push(this.formatearEtiqueta('T4L', t4lFormateada));
        }

        const bhcg = extraerValor(this.texto, EXTRACTION_PATTERNS.hormonas.bhcg);
        if (bhcg) {
            resultados.push(
                this.formatearEtiqueta('BHCG', this.formatearValorComparativo(bhcg))
            );
        }

        return resultados.join(', ');
    }

    formatearValorComparativo(valor) {
        const valorLimpio = String(valor).replace(/\s+/g, '').replace(',', '.');
        const coincidencia = valorLimpio.match(/^([<>]?)(-?\d+(?:\.\d+)?)$/);
        if (!coincidencia) return valorLimpio;

        return `${coincidencia[1]}${Number(coincidencia[2]).toString()}`;
    }

    // ============== EXTRACTOR DE GASES EN SANGRE ==============
    extraerGases(opcionesSeleccionadas = []) {
        let resultados = [];

        // 1. pH (2 decimales)
        const ph = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.ph);
        if (ph) {
            resultados.push(this.formatearEtiqueta('ph', parseFloat(ph).toFixed(2)));
        }

        // 2. PCO2 (1 decimal)
        const pco2 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.pco2);
        if (pco2) {
            resultados.push(this.formatearEtiqueta('pCO2', parseFloat(pco2).toFixed(1)));
        }

        // 3. PO2 (1 decimal)
        if (opcionesSeleccionadas.includes('GasPO2')) {
            const po2 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.po2);
            if (po2) {
                resultados.push(this.formatearEtiqueta('pO2', parseFloat(po2).toFixed(1)));
            }
        }

        // 4. HCO3 (1 decimal)
        const hco3 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.hco3);
        if (hco3) {
            resultados.push(this.formatearEtiqueta('HCO3', parseFloat(hco3).toFixed(1)));
        }

        // 5. Exceso de base (BEB, 1 decimal)
        if (opcionesSeleccionadas.includes('GasBEB')) {
            const beb = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.beb);
            if (beb) {
                resultados.push(this.formatearEtiqueta('BEB', parseFloat(beb).toFixed(1)));
            }
        }

        // 6. Ácido láctico (1 decimal)
        const lactato = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.lactato);
        if (lactato) {
            resultados.push(this.formatearEtiqueta('Á.Lac', parseFloat(lactato).toFixed(1)));
        }

        if (resultados.length === 0) return '';

        let tipoGas = '';
        if (/GASES\s+SANGRE\s+VENOSA/i.test(this.texto)) {
            tipoGas = 'GSV';
        } else if (/GASES\s+SANGRE\s+ARTERIAL/i.test(this.texto)) {
            tipoGas = 'GSA';
        }

        const gases = this.limpiarAsteriscos(resultados.join(', '));
        return tipoGas ? `${tipoGas}: ${gases}` : gases;
    }

    // ============== EXTRACTOR DE FECHA ==============
    extraerFecha() {
        const formatearFecha = (fechaCompleta) => {
            const partes = fechaCompleta.replace(/-/g, '/').split('/');
            if (partes.length !== 3) return '';

            const dia = partes[0].padStart(2, '0');
            const mes = partes[1].padStart(2, '0');
            let anio = partes[2];
            if (anio.length === 2) anio = '20' + anio;

            const format = this.formatOptions.dateFormat || 'dd/mm/yyyy';
            if (format === 'dd/mm') return `${dia}/${mes}:`;
            if (format === 'dd/mm/yy') return `${dia}/${mes}/${anio.substring(2)}:`;
            return `${dia}/${mes}/${anio}:`;
        };

        // En los PDF del HHHA la fecha de nacimiento suele aparecer primero.
        // La fecha firmada por el responsable corresponde al examen informado.
        const fechaResponsable = this.texto.match(
            /Responsable:[^\r\n]*?(\d{2}[/-]\d{2}[/-]\d{4})/i
        );
        if (fechaResponsable) {
            return formatearFecha(fechaResponsable[1]);
        }

        // Probar todos los patrones de fecha
        for (let patron of EXTRACTION_PATTERNS.fechas.patrones) {
            let coincidencia = this.texto.match(patron);
            if (coincidencia) {
                return formatearFecha(coincidencia[1]);
            }
        }
        return '';
    }

    // ============== FUNCIÓN PRINCIPAL ==============
    procesar(texto, opcionesSeleccionadas) {
        this.texto = texto;
        let lineas = [];

        // Agregar fecha si está seleccionada
        let fecha = '';
        if (opcionesSeleccionadas.includes('Fecha')) {
            fecha = this.extraerFecha();
        }

        // Procesar cada tipo de examen seleccionado
        // Procesar cada tipo de examen seleccionado en el ORDEN EN QUE LLEGAN (DOM Order)
        let secciones = [];

        // Iterar sobre las opciones seleccionadas para respetar el orden visual.
        // PCR comparte línea con el hemograma cuando ambos están seleccionados.
        opcionesSeleccionadas.forEach(opcion => {
            if (opcion === 'Hemograma') {
                let hemograma = this.extraerHemograma(opcionesSeleccionadas);
                if (opcionesSeleccionadas.includes('PCR')) {
                    const pcr = this.extraerPCR();
                    if (pcr) hemograma = hemograma ? `${hemograma}, ${pcr}` : pcr;
                }
                if (hemograma) secciones.push(hemograma);
            } else if (opcion === 'PCR') {
                if (!opcionesSeleccionadas.includes('Hemograma')) {
                    const pcr = this.extraerPCR();
                    if (pcr) secciones.push(pcr);
                }
            } else if (opcion === 'Renal') {
                const renal = this.extraerRenal(opcionesSeleccionadas);
                if (renal) secciones.push(renal);

                const pancreaticos = this.extraerPancreaticos();
                if (pancreaticos) secciones.push(pancreaticos);

                const glicemiaVaEnNutricional = EXTRACTION_PATTERNS.modelo === 'HHHA'
                    && opcionesSeleccionadas.includes('Nutricional');
                if (!glicemiaVaEnNutricional) {
                    const glicemia = this.extraerGlicemia();
                    if (glicemia) secciones.push(glicemia);
                }
            } else if (opcion === 'Hepático' || opcion === 'Hepatico') {
                const hepatico = this.extraerHepatico();
                if (hepatico) secciones.push(hepatico);
            } else if (opcion === 'Coagulación' || opcion === 'Coagulacion') {
                const coagulacion = this.extraerCoagulacion();
                if (coagulacion) secciones.push(coagulacion);
            } else if (opcion === 'Nutricional') {
                const agruparHHHA = EXTRACTION_PATTERNS.modelo === 'HHHA';
                const nutricional = this.extraerNutricional(
                    opcionesSeleccionadas,
                    agruparHHHA
                );
                if (nutricional) secciones.push(nutricional);
            } else if (opcion === 'MarcCV') {
                const cardiacos = this.extraerCardiacos();
                if (cardiacos) secciones.push(cardiacos);
            } else if (opcion === 'Hormonas') {
                const hormonas = this.extraerHormonas();
                if (hormonas) secciones.push(hormonas);
            } else if (opcion === 'Gases') {
                const gases = this.extraerGases(opcionesSeleccionadas);
                if (gases) secciones.push(gases);
            }
        });

        // Formatear el resultado según el patrón esperado
        if (secciones.length === 0) {
            return fecha ? fecha : 'No se encontraron datos';
        }

        // Organizar las secciones en líneas específicas según el patrón esperado
        const resultado = this.formatearResultadoEstructurado(fecha, secciones);
        return resultado;
    }

    // Función auxiliar para formatear el resultado con estructura específica
    formatearResultadoEstructurado(fecha, secciones) {
        // Usar caracter especial que simula Shift+Enter en procesadores de texto
        const SOFT_LINE_BREAK = '\u2028'; // Line Separator Unicode - equivale a Shift+Enter

        // Determinar separador según opción de saltos de línea
        const separadorLineas = this.formatOptions.usarSaltosLinea ? SOFT_LINE_BREAK : ', ';

        let resultado = fecha ? fecha + (this.formatOptions.usarSaltosLinea ? SOFT_LINE_BREAK : ' ') : '';

        // Organizar secciones secuencialmente respetando el orden del array
        const separador = this.formatOptions.usarSaltosLinea ? SOFT_LINE_BREAK : ', ';

        // Si hay saltos de línea, asegurar que cada sección termine con limpieza.
        // Si es una sola línea, unir con comas.

        resultado += secciones.join(separador);

        return resultado;
    }
}

// Exportar para uso en script.js
window.SimpleExtractor = SimpleExtractor;

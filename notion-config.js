// Configuración para la integración con Notion API
// IMPORTANTE: Para uso en producción, configura estas variables en un servidor backend
// o utiliza un proxy para evitar exponer credenciales en el cliente

/**
 * Pasos para configurar la integración con Notion:
 * 
 * 1. Crear una integración en Notion:
 *    - Ve a https://www.notion.so/my-integrations
 *    - Haz clic en "Create new integration"
 *    - Asigna un nombre y selecciona el workspace
 *    - Copia el "Internal Integration Token"
 * 
 * 2. Dar permisos a la integración:
 *    - Ve a tu base de datos de Notion
 *    - Haz clic en el botón "Share" (esquina superior derecha)
 *    - Invita a tu integración y dale permisos de lectura
 * 
 * 3. Configurar el proxy de backend (recomendado para producción):
 *    - Crea un servidor (Node.js, Python, etc.) que actúe como proxy
 *    - El servidor debe hacer las llamadas a Notion API con las credenciales
 *    - Tu frontend hace llamadas al servidor proxy, no directamente a Notion
 */

const NOTION_CONFIG = {
    // ID de tu base de datos (ya configurado correctamente)
    DATABASE_ID: '20492775-959a-817d-a944-d2bba620feb9',
    
    // URL base de la API de Notion
    BASE_URL: 'https://api.notion.com/v1',
    
    // Versión de la API
    API_VERSION: '2022-06-28',
    
    // Para desarrollo local - NO uses esto en producción
    // En su lugar, configura un servidor proxy
    // INTEGRATION_TOKEN: 'tu_token_aqui',
    
    // Configuración del proxy (para producción)
    PROXY_URL: '/api/notion', // Tu endpoint del servidor proxy
    
    // Headers comunes para las peticiones
    getHeaders: (token = null) => ({
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_CONFIG.API_VERSION,
        ...(token && { 'Authorization': `Bearer ${token}` })
    })
};

/**
 * Clase para manejar las llamadas a la API de Notion
 * En desarrollo usa datos simulados, en producción conecta con la API real
 */
class NotionAPIService {
    constructor() {
        this.isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    }

    /**
     * Obtiene todos los registros de la base de datos de Notion
     */
    async fetchDatabase(startCursor = null) {
        if (this.isDevelopment) {
            // En desarrollo, usar datos simulados
            return this.getMockData();
        }

        try {
            const body = {
                page_size: 100,
                ...(startCursor && { start_cursor: startCursor })
            };

            // En producción, usar el proxy del servidor
            const response = await fetch(`${NOTION_CONFIG.PROXY_URL}/database/${NOTION_CONFIG.DATABASE_ID}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching from Notion API:', error);
            // En caso de error, usar datos simulados como fallback
            return this.getMockData();
        }
    }

    /**
     * Obtiene todos los registros de manera paginada
     */
    async fetchAllRecords() {
        const allResults = [];
        let nextCursor = null;

        do {
            const response = await this.fetchDatabase(nextCursor);
            allResults.push(...response.results);
            nextCursor = response.next_cursor;
        } while (nextCursor);

        return { results: allResults };
    }

    /**
     * Datos simulados para desarrollo
     */
    getMockData() {
        return {
            results: [
                {
                    id: '1',
                    last_edited_time: '2025-01-04T15:30:00.000Z',
                    properties: {
                        'Patología': { title: [{ plain_text: 'Influenza' }] },
                        'Definición': { rich_text: [{ plain_text: 'Enfermedad respiratoria viral contagiosa, causada por el virus Influenza. Se caracteriza por inicio abrupto de fiebre, cefalea y mialgias.' }] },
                        'Epidemiología': { rich_text: [{ plain_text: 'Epidemia estacional en invierno (mayo-agosto en Chile). Mayor incidencia en niños menores de 5 años y adultos mayores de 65 años. Transmisión por gotas respiratorias.' }] },
                        'Etiopatogenia': { rich_text: [{ plain_text: 'Virus Influenza A, B y C. Tipo A es más virulento. Mutaciones antigénicas (deriva) y cambios (shift) determinan epidemias y pandemias. Transmisión por gotas respiratorias y contacto.' }] },
                        'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'Inicio abrupto: fiebre >38°C, cefalea intensa, mialgias generalizadas, tos seca, odinofagia, rinorrea. Síntomas sistémicos predominan sobre respiratorios.' }] },
                        'Manejo': { rich_text: [{ plain_text: 'Oseltamivir 75mg c/12h x 5 días si <48h de inicio. Sintomático: paracetamol, abundantes líquidos, reposo. Complicaciones: neumonía viral o bacteriana secundaria.' }] },
                        'Clasificación': { rich_text: [{ plain_text: 'Tipo A: H1N1 (pandémico), H3N2 (estacional). Tipo B: linajes Victoria y Yamagata. Tipo C: menos frecuente, cuadros leves.' }] },
                        'Estudio | Diagnóstico': { rich_text: [{ plain_text: 'Clínico en contexto epidemiológico. PCR o test rápido de antígeno si disponible. Hemograma: leucopenia con linfopenia. RxTx si sospecha complicación.' }] },
                        'D. Diferenciales': { rich_text: [{ plain_text: 'COVID-19, rinovirus, VSR, parainfluenza, adenovirus. Faringitis estreptocócica (más localizada), mononucleosis (adenopatías).' }] },
                        'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                        '📖 Grupo por Reparto': { multi_select: [{ name: 'Infectología' }] }
                    }
                },
                {
                    id: '2',
                    last_edited_time: '2025-01-03T14:20:00.000Z',
                    properties: {
                        'Patología': { title: [{ plain_text: 'Enfermedad por Hantavirus' }] },
                        'Definición': { rich_text: [{ plain_text: 'Zoonosis viral transmitida por roedores silvestres, causada por hantavirus. En Chile produce principalmente síndrome cardiopulmonar por hantavirus (SCPH).' }] },
                        'Epidemiología': { rich_text: [{ plain_text: 'Endémica en Chile, especialmente regiones del sur. Mayor incidencia en primavera-verano. Zonas rurales y periurbanas. Reservorio: ratón colilargo.' }] },
                        'Etiopatogenia': { rich_text: [{ plain_text: 'Hantavirus Andes transmitido por Oligoryzomys longicaudatus (ratón colilargo). Contagio por inhalación de aerosoles de excreta de roedores infectados.' }] },
                        'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'Fase prodrómica: fiebre, mialgias, cefalea (3-6 días). Fase cardiopulmonar: disnea súbita, edema pulmonar no cardiogénico, shock.' }] },
                        'Manejo': { rich_text: [{ plain_text: 'Soporte ventilatorio precoz. Manejo en UCI. Oxigenación por membrana extracorpórea (ECMO) si disponible. No existe tratamiento antiviral específico.' }] },
                        'Estudio | Diagnóstico': { rich_text: [{ plain_text: 'ELISA IgM/IgG para hantavirus. Hematocrito >45%, plaquetopenia <150.000, leucocitosis con desviación izquierda. RxTx: infiltrados intersticiales bilaterales.' }] },
                        'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                        '📖 Grupo por Reparto': { multi_select: [{ name: 'Infectología' }] }
                    }
                },
                {
                    id: '3',
                    last_edited_time: '2025-01-02T16:45:00.000Z',
                    properties: {
                        'Patología': { title: [{ plain_text: 'Vasculitis' }] },
                        'Definición': { rich_text: [{ plain_text: 'Grupo heterogéneo de enfermedades caracterizadas por inflamación de la pared vascular, que puede afectar arterias, venas y capilares de diferentes calibres.' }] },
                        'Clasificación': { rich_text: [{ plain_text: 'Grandes vasos: Arteritis células gigantes, Takayasu. Medianos: Poliarteritis nodosa, Kawasaki. Pequeños: ANCA+ (Wegener, microscópica, eosinofílica), ANCA- (Henoch-Schönlein, crioglobulinemia).' }] },
                        'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'Síntomas constitucionales: fiebre, astenia, pérdida peso. Manifestaciones específicas según territorio vascular afectado: piel, riñón, pulmón, SNC.' }] },
                        'Estudio | Diagnóstico': { rich_text: [{ plain_text: 'VHS y PCR elevadas. ANCA (c-ANCA/PR3, p-ANCA/MPO). Biopsia del órgano afectado. Angiografía si sospecha grandes vasos.' }] },
                        'Manejo': { rich_text: [{ plain_text: 'Corticoides en dosis altas. Inmunosupresores: ciclofosfamida, metotrexato, azatioprina. Rituximab en ANCA+. Plasmaféresis en casos severos.' }] },
                        'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                        '📖 Grupo por Reparto': { multi_select: [{ name: 'Reumatología' }] }
                    }
                },
                {
                    id: '4',
                    last_edited_time: '2025-01-01T12:30:00.000Z',
                    properties: {
                        'Patología': { title: [{ plain_text: 'Artritis Reactiva' }] },
                        'Definición': { rich_text: [{ plain_text: 'Artritis estéril que se desarrolla después de una infección en sitio distante. Forma parte de las espondiloartritis seronegativas.' }] },
                        'Etiopatogenia': { rich_text: [{ plain_text: 'Respuesta inmune aberrante post-infección gastrointestinal (Salmonella, Shigella, Campylobacter) o genitourinaria (Chlamydia). Asociación con HLA-B27.' }] },
                        'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'Artritis oligoarticular asimétrica, predominio miembros inferiores. Tríada de Reiter: artritis, uretritis, conjuntivitis. Entesitis, dactilitis.' }] },
                        'Manejo': { rich_text: [{ plain_text: 'AINEs primera línea. Sulfasalazina si persistente. Corticoides intraarticulares. Antibióticos solo si infección activa documentada.' }] },
                        'D. Diferenciales': { rich_text: [{ plain_text: 'Artritis séptica, espondilitis anquilosante, artritis psoriásica, artritis reumatoide (seronegativa), gota.' }] },
                        'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                        '📖 Grupo por Reparto': { multi_select: [{ name: 'Reumatología' }] }
                    }
                },
                {
                    id: '5',
                    last_edited_time: '2024-12-30T18:15:00.000Z',
                    properties: {
                        'Patología': { title: [{ plain_text: 'Insuficiencia Cardíaca' }] },
                        'Definición': { rich_text: [{ plain_text: 'Síndrome clínico complejo resultante de alteración estructural o funcional del corazón que compromete su capacidad de llenado o eyección.' }] },
                        'Clasificación': { rich_text: [{ plain_text: 'NYHA I-IV según síntomas. Por FE: reducida <40% (ICrFE), preservada ≥50% (ICpFE), levemente reducida 41-49% (ICmrFE).' }] },
                        'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'Disnea progresiva, ortopnea, disnea paroxística nocturna, fatiga, edema bilateral. Galope S3, crepitaciones, hepatomegalia, ingurgitación yugular.' }] },
                        'Estudio | Diagnóstico': { rich_text: [{ plain_text: 'Ecocardiografía (gold standard). BNP/NT-proBNP elevados. RxTx: cardiomegalia, congestión pulmonar. ECG: arritmias, HVI.' }] },
                        'Manejo': { rich_text: [{ plain_text: 'ICrFE: IECA/ARA II, betabloqueadores, espironolactona, diuréticos. Nuevos: sacubitrilo/valsartán, ivabradina, dapagliflozina. ICpFE: control factores de riesgo.' }] },
                        'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                        '📖 Grupo por Reparto': { multi_select: [{ name: 'Cardiología' }] }
                    }
                },
                {
                    id: '6',
                    last_edited_time: '2024-12-28T09:45:00.000Z',
                    properties: {
                        'Patología': { title: [{ plain_text: 'Diabetes Mellitus Tipo 2' }] },
                        'Definición': { rich_text: [{ plain_text: 'Enfermedad metabólica crónica caracterizada por hiperglicemia debido a resistencia insulínica y/o defecto en secreción de insulina.' }] },
                        'Epidemiología': { rich_text: [{ plain_text: 'Prevalencia 8-12% población adulta. Asociada a obesidad, sedentarismo, edad >45 años, antecedentes familiares, síndrome metabólico.' }] },
                        'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'A menudo asintomática. Poliuria, polidipsia, polifagia, pérdida peso, astenia. Complicaciones: retinopatía, nefropatía, neuropatía.' }] },
                        'Estudio | Diagnóstico': { rich_text: [{ plain_text: 'Glicemia ayunas ≥126 mg/dl (2 mediciones) o PTGO ≥200 mg/dl o HbA1c ≥6.5%. Screening anual si factores de riesgo.' }] },
                        'Manejo': { rich_text: [{ plain_text: 'Cambios estilo vida + metformina. Agregar: sulfonilureas, iDPP-4, iSGLT-2, aGLP-1, insulina según meta HbA1c <7%. Control factores CV.' }] },
                        'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                        '📖 Grupo por Reparto': { multi_select: [{ name: 'Endocrinología' }] }
                    }
                }
            ]
        };
    }
}

// Función para transformar datos de Notion al formato de la aplicación
function transformNotionData(results) {
    return results.map(item => ({
        id: item.id,
        title: extractTextContent(item.properties['Patología']?.title || []),
        definicion: extractTextContent(item.properties['Definición']?.rich_text || []),
        epidemiologia: extractTextContent(item.properties['Epidemiología']?.rich_text || []),
        etiopatogenia: extractTextContent(item.properties['Etiopatogenia']?.rich_text || []),
        clinica: extractTextContent(item.properties['Clínica | Manejo Inicial']?.rich_text || []),
        clasificacion: extractTextContent(item.properties['Clasificación']?.rich_text || []),
        diagnostico: extractTextContent(item.properties['Estudio | Diagnóstico']?.rich_text || []),
        manejo: extractTextContent(item.properties['Manejo']?.rich_text || []),
        diferenciales: extractTextContent(item.properties['D. Diferenciales']?.rich_text || []),
        extra: extractTextContent(item.properties['Extra']?.rich_text || []),
        ramos: extractMultiSelectNames(item.properties['Ramo']?.multi_select || []),
        grupos: extractMultiSelectNames(item.properties['📖 Grupo por Reparto']?.multi_select || []),
        lastEdited: item.last_edited_time || new Date().toISOString()
    }));
}

// Funciones auxiliares
function extractTextContent(richText) {
    if (!richText || !Array.isArray(richText)) return '';
    return richText
        .map(text => text.plain_text || text.text?.content || '')
        .join('')
        .trim();
}

function extractMultiSelectNames(multiSelect) {
    if (!multiSelect || !Array.isArray(multiSelect)) return [];
    return multiSelect.map(item => item.name).filter(Boolean);
}

// Exportar para uso en otros archivos
if (typeof window !== 'undefined') {
    window.NOTION_CONFIG = NOTION_CONFIG;
    window.NotionAPIService = NotionAPIService;
    window.transformNotionData = transformNotionData;
}

// Para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NOTION_CONFIG,
        NotionAPIService,
        transformNotionData
    };
}

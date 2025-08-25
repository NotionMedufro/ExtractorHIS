/**
 * Google Sheets Connector
 * Permite cargar datos médicos directamente desde hojas de Google Sheets públicas
 */

class GoogleSheetsConnector {
    constructor() {
        this.baseUrl = 'https://docs.google.com/spreadsheets/d/';
        this.exportSuffix = '/export?format=csv';
    }

    /**
     * Extrae el ID de la hoja de cálculo de una URL de Google Sheets
     * @param {string} url - URL de Google Sheets
     * @returns {string|null} - ID de la hoja o null si no es válido
     */
    extractSheetId(url) {
        try {
            // Patrón para URLs de Google Sheets
            const patterns = [
                /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,  // URL estándar
                /^([a-zA-Z0-9-_]{44})$/,                 // Solo ID
                /id=([a-zA-Z0-9-_]+)/                    // URL con parámetro id
            ];

            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) {
                    return match[1];
                }
            }

            return null;
        } catch (error) {
            console.error('Error extracting sheet ID:', error);
            return null;
        }
    }

    /**
     * Construye la URL de descarga CSV para una hoja de Google Sheets
     * @param {string} sheetId - ID de la hoja de cálculo
     * @param {number} gid - GID de la pestaña específica (opcional)
     * @returns {string} - URL para descargar CSV
     */
    buildCsvUrl(sheetId, gid = 0) {
        let url = `${this.baseUrl}${sheetId}${this.exportSuffix}`;
        if (gid !== 0) {
            url += `&gid=${gid}`;
        }
        return url;
    }

    /**
     * Extrae el GID de una URL de Google Sheets (si especifica una pestaña)
     * @param {string} url - URL de Google Sheets
     * @returns {number} - GID de la pestaña
     */
    extractGid(url) {
        const gidMatch = url.match(/gid=([0-9]+)/);
        return gidMatch ? parseInt(gidMatch[1]) : 0;
    }

    /**
     * Valida si una URL es de Google Sheets
     * @param {string} url - URL a validar
     * @returns {boolean} - True si es una URL válida de Google Sheets
     */
    isValidSheetsUrl(url) {
        const sheetPatterns = [
            /docs\.google\.com\/spreadsheets/,
            /^[a-zA-Z0-9-_]{44}$/  // Solo ID
        ];

        return sheetPatterns.some(pattern => pattern.test(url));
    }

    /**
     * Carga datos desde Google Sheets usando CORS proxy
     * @param {string} url - URL de Google Sheets
     * @returns {Promise<string>} - Datos CSV como string
     */
    async loadFromSheets(url) {
        try {
            // Extraer ID y GID
            const sheetId = this.extractSheetId(url);
            if (!sheetId) {
                throw new Error('No se pudo extraer el ID de la hoja de cálculo');
            }

            const gid = this.extractGid(url);
            const csvUrl = this.buildCsvUrl(sheetId, gid);
            
            console.log('Intentando cargar desde:', csvUrl);

            // Intentar múltiples métodos de acceso
            const accessMethods = [
                // Método 1: Acceso directo
                async () => {
                    const response = await fetch(csvUrl);
                    if (response.ok) {
                        const data = await response.text();
                        console.log('Acceso directo exitoso');
                        return data;
                    }
                    throw new Error('Acceso directo falló');
                },
                
                // Método 2: AllOrigins proxy
                async () => {
                    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(csvUrl)}`;
                    const response = await fetch(proxyUrl);
                    if (response.ok) {
                        const data = await response.json();
                        console.log('AllOrigins proxy exitoso');
                        return data.contents;
                    }
                    throw new Error('AllOrigins proxy falló');
                },
                
                // Método 3: CORS proxy alternativo
                async () => {
                    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(csvUrl)}`;
                    const response = await fetch(proxyUrl);
                    if (response.ok) {
                        const data = await response.text();
                        console.log('CORS proxy alternativo exitoso');
                        return data;
                    }
                    throw new Error('CORS proxy alternativo falló');
                },
                
                // Método 4: Usando jsonp approach (para hojas públicas)
                async () => {
                    const jsonpUrl = `https://spreadsheets.google.com/feeds/cells/${sheetId}/${gid + 1}/public/full?alt=json`;
                    const response = await fetch(jsonpUrl);
                    if (response.ok) {
                        const jsonData = await response.json();
                        console.log('JSONP approach exitoso');
                        return this.convertJsonToCSV(jsonData);
                    }
                    throw new Error('JSONP approach falló');
                }
            ];

            // Intentar cada método secuencialmente
            for (let i = 0; i < accessMethods.length; i++) {
                try {
                    const result = await accessMethods[i]();
                    if (result && result.trim().length > 0) {
                        console.log(`Método ${i + 1} exitoso, datos obtenidos:`, result.substring(0, 200));
                        return result;
                    }
                } catch (methodError) {
                    console.log(`Método ${i + 1} falló:`, methodError.message);
                    continue;
                }
            }

            throw new Error('No se pudo acceder a la hoja de cálculo con ningún método. Verifica que la hoja sea pública y accesible.');

        } catch (error) {
            console.error('Error loading from Google Sheets:', error);
            throw error;
        }
    }
    
    /**
     * Convierte datos JSON de Google Sheets API a CSV
     * @param {Object} jsonData - Datos JSON de Google Sheets
     * @returns {string} - Datos en formato CSV
     */
    convertJsonToCSV(jsonData) {
        try {
            const entries = jsonData.feed.entry;
            if (!entries || entries.length === 0) {
                throw new Error('No hay datos en la hoja');
            }
            
            // Crear matriz para almacenar los datos
            const maxRow = Math.max(...entries.map(entry => parseInt(entry.gs$cell.row)));
            const maxCol = Math.max(...entries.map(entry => parseInt(entry.gs$cell.col)));
            
            const matrix = Array(maxRow).fill().map(() => Array(maxCol).fill(''));
            
            // Llenar la matriz con los datos
            entries.forEach(entry => {
                const row = parseInt(entry.gs$cell.row) - 1;
                const col = parseInt(entry.gs$cell.col) - 1;
                const value = entry.gs$cell.$t || '';
                matrix[row][col] = value;
            });
            
            // Convertir matriz a CSV
            return matrix.map(row => 
                row.map(cell => 
                    cell.includes(',') || cell.includes('"') || cell.includes('\n') 
                        ? `"${cell.replace(/"/g, '""')}"` 
                        : cell
                ).join(',')
            ).join('\n');
            
        } catch (error) {
            console.error('Error converting JSON to CSV:', error);
            throw new Error('Error procesando datos JSON de Google Sheets');
        }
    }

    /**
     * Convierte CSV a formato tabular compatible con el parser médico
     * @param {string} csvData - Datos en formato CSV
     * @returns {string} - Datos en formato tabular (separados por tabs)
     */
    convertCsvToTabular(csvData) {
        try {
            // Dividir en líneas y procesar cada una
            const lines = csvData.trim().split('\n');
            const tabularLines = [];

            for (let line of lines) {
                // Manejar CSV con comas y comillas
                const cells = this.parseCsvLine(line);
                // Convertir a formato tabular (separado por tabs)
                tabularLines.push(cells.join('\t'));
            }

            return tabularLines.join('\n');
        } catch (error) {
            console.error('Error converting CSV to tabular:', error);
            // Si falla el parsing avanzado, usar split simple
            return csvData.replace(/,/g, '\t');
        }
    }

    /**
     * Parsea una línea CSV manejando comillas y comas dentro de campos
     * @param {string} line - Línea CSV
     * @returns {Array} - Array de campos
     */
    parseCsvLine(line) {
        const cells = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Comillas escapadas
                    current += '"';
                    i++; // Saltar la siguiente comilla
                } else {
                    // Cambiar estado de comillas
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Separador de campo
                cells.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        // Agregar el último campo
        cells.push(current.trim());
        
        // Limpiar comillas de los campos
        return cells.map(cell => {
            if (cell.startsWith('"') && cell.endsWith('"')) {
                return cell.slice(1, -1);
            }
            return cell;
        });
    }

    /**
     * Valida que los datos cargados tengan formato médico válido
     * @param {string} tabularData - Datos en formato tabular
     * @returns {Object} - Resultado de validación
     */
    validateMedicalData(tabularData) {
        console.log('Validando datos tabulares:', tabularData.substring(0, 200));
        
        const lines = tabularData.trim().split('\n').filter(line => line.trim().length > 0);
        const issues = [];
        const warnings = [];

        console.log('Líneas encontradas:', lines.length);
        console.log('Primeras 3 líneas:', lines.slice(0, 3));

        // Verificar que haya suficientes líneas (ser más flexible)
        if (lines.length < 1) {
            issues.push('No se encontraron datos en la hoja');
        } else if (lines.length < 2) {
            warnings.push('Solo se encontró la cabecera, se necesitan datos');
        }

        // Verificar cabecera con fechas (ser más flexible)
        if (lines.length > 0) {
            const headerLine = lines[0];
            const hasDatePattern = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(headerLine);
            const hasExamHeader = /exámenes|examenes|test|fecha/i.test(headerLine);
            
            if (!hasDatePattern && !hasExamHeader) {
                warnings.push('La primera fila no contiene fechas reconocibles');
            }
        }

        // Verificar que haya datos médicos (ser más flexible)
        let validDataLines = 0;
        if (lines.length > 1) {
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                const cells = line.split('\t').filter(cell => cell.trim().length > 0);
                
                // Aceptar líneas con al menos nombre + 1 valor
                if (cells.length >= 2) {
                    validDataLines++;
                }
            }

            if (validDataLines === 0) {
                // Solo es error crítico si no hay NINGUNA línea válida
                warnings.push('No se encontraron filas de datos médicos válidas');
            }
        }

        // Solo marcar como inválido si hay errores críticos
        const isValid = issues.length === 0 && (lines.length >= 1);

        console.log('Validación completada:', { isValid, issues, warnings, validDataLines });

        return {
            isValid,
            issues,
            warnings,
            linesFound: lines.length,
            validDataLines,
            summary: `${lines.length} filas, ${validDataLines} con datos válidos`
        };
    }

    /**
     * Genera instrucciones para hacer pública una hoja de Google Sheets
     * @returns {string} - HTML con instrucciones
     */
    getInstructions() {
        return `
            <div class="sheets-instructions">
                <h4>📋 Cómo usar Google Sheets</h4>
                <ol>
                    <li><strong>Hacer la hoja pública:</strong>
                        <ul>
                            <li>Abre tu Google Sheet</li>
                            <li>Haz clic en "Compartir" (esquina superior derecha)</li>
                            <li>Cambia a "Cualquier persona con el enlace puede ver"</li>
                            <li>Copia el enlace</li>
                        </ul>
                    </li>
                    <li><strong>Formato de datos:</strong>
                        <ul>
                            <li>Primera fila: fechas (DD/MM/YYYY)</li>
                            <li>Primera columna: nombres de parámetros médicos</li>
                            <li>Celdas: valores de exámenes (usar ↑ ↓ para anormales)</li>
                        </ul>
                    </li>
                    <li><strong>Pegar el enlace</strong> en el campo de arriba</li>
                </ol>
                
                <div class="example-formats">
                    <p><strong>Formatos de enlace aceptados:</strong></p>
                    <code>https://docs.google.com/spreadsheets/d/ID_DE_LA_HOJA/edit...</code><br>
                    <code>ID_DE_LA_HOJA</code> (solo el ID)
                </div>
            </div>
        `;
    }

    /**
     * Genera un enlace de ejemplo para testing
     * @returns {string} - URL de ejemplo
     */
    getExampleSheet() {
        // Este sería un ejemplo público que podrías crear
        return 'https://docs.google.com/spreadsheets/d/EJEMPLO_ID/edit#gid=0';
    }
}

// Exportar la clase
if (typeof window !== 'undefined') {
    window.GoogleSheetsConnector = GoogleSheetsConnector;
}

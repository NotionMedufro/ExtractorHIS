/**
 * Parser para datos médicos tabulares
 * Convierte texto pegado en estructuras de datos organizadas
 */

class MedicalDataParser {
    constructor() {
        this.data = new MedicalDashboardData();
    }

    /**
     * Parsea texto tabular pegado desde el portapapeles
     * @param {string} text - Texto con formato tabular
     * @returns {MedicalDashboardData} - Datos estructurados
     */
    parseTabularData(text) {
        try {
            const lines = text.trim().split('\n');
            if (lines.length < 2) {
                throw new Error('Datos insuficientes. Se necesitan al menos 2 líneas (cabecera y una fila de datos).');
            }

            // Limpiar líneas y filtrar las vacías
            const cleanLines = lines.map(line => line.trim()).filter(line => line.length > 0);
            
            // Primera línea es la cabecera con fechas
            const headerLine = cleanLines[0];
            const dates = this.parseHeaderDates(headerLine);
            
            if (dates.length === 0) {
                throw new Error('No se pudieron extraer fechas válidas de la cabecera.');
            }

            // Procesar cada línea de parámetros
            for (let i = 1; i < cleanLines.length; i++) {
                const line = cleanLines[i];
                this.parseParameterLine(line, dates);
            }

            return this.data;
        } catch (error) {
            console.error('Error parsing tabular data:', error);
            throw error;
        }
    }

    /**
     * Extrae las fechas de la línea de cabecera
     * @param {string} headerLine - Primera línea con fechas
     * @returns {Array} - Array de fechas formateadas
     */
    parseHeaderDates(headerLine) {
        const dates = [];
        
        // Dividir por tabulaciones o múltiples espacios
        const columns = headerLine.split(/\t|\s{2,}/);
        
        for (let i = 1; i < columns.length; i++) { // Omitir primera columna (nombre de examen)
            const col = columns[i].trim();
            if (col && this.isValidDateFormat(col)) {
                dates.push(this.standardizeDateFormat(col));
            }
        }

        return dates;
    }

    /**
     * Verifica si un string parece una fecha válida
     * @param {string} str - String a verificar
     * @returns {boolean} - True si parece una fecha
     */
    isValidDateFormat(str) {
        // Patrones comunes de fecha
        const datePatterns = [
            /^\d{2}\/\d{2}\/\d{4}/, // DD/MM/YYYY
            /^\d{1,2}\/\d{1,2}\/\d{4}/, // D/M/YYYY
            /^\d{2}\/\d{2}\/\d{2}/, // DD/MM/YY
            /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
            /^\d{2}-\d{2}-\d{4}/, // DD-MM-YYYY
            /^\d{2}\/\d{2}\/\d{4}\s+(AM|PM|MN)/, // Con sufijos AM/PM/MN
        ];

        return datePatterns.some(pattern => pattern.test(str));
    }

    /**
     * Estandariza el formato de fecha
     * @param {string} dateStr - Fecha en string
     * @returns {string} - Fecha estandarizada
     */
    standardizeDateFormat(dateStr) {
        // Limpiar sufijos como AM, PM, MN
        let cleanDate = dateStr.replace(/\s+(AM|PM|MN).*$/i, '').trim();
        
        // Si tiene formato DD/MM/YYYY, mantenerlo
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleanDate)) {
            return cleanDate;
        }
        
        // Convertir otros formatos a DD/MM/YYYY
        if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
            const [year, month, day] = cleanDate.split('-');
            return `${day}/${month}/${year}`;
        }
        
        if (/^\d{2}-\d{2}-\d{4}$/.test(cleanDate)) {
            const [day, month, year] = cleanDate.split('-');
            return `${day}/${month}/${year}`;
        }

        return cleanDate;
    }

    /**
     * Parsea una línea de parámetro médico
     * @param {string} line - Línea con datos del parámetro
     * @param {Array} dates - Array de fechas de las columnas
     */
    parseParameterLine(line, dates) {
        // Dividir la línea por tabulaciones o múltiples espacios
        const columns = line.split(/\t|\s{2,}/).map(col => col.trim());
        
        if (columns.length < 2) return; // Necesitamos al menos nombre + un valor
        
        const parameterName = columns[0];
        if (!parameterName || parameterName.length === 0) return;
        
        // Extraer unidad del nombre si existe
        const unitMatch = parameterName.match(/\(([^)]+)\)$/);
        const cleanParameterName = parameterName.replace(/\s*\([^)]+\)$/, '');
        const unit = unitMatch ? unitMatch[1] : '';
        
        // Procesar valores para cada fecha
        for (let i = 1; i < Math.min(columns.length, dates.length + 1); i++) {
            const value = columns[i];
            const dateIndex = i - 1;
            
            if (dateIndex < dates.length) {
                const date = dates[dateIndex];
                this.data.addValue(cleanParameterName, date, value, unit);
            }
        }
    }

    /**
     * Obtiene estadísticas del parsing realizado
     * @returns {Object} - Estadísticas de los datos parseados
     */
    getParsingStats() {
        return {
            totalParameters: this.data.parameters.size,
            totalDates: this.data.dates.length,
            parametersWithData: Array.from(this.data.parameters.values())
                .filter(param => param.values.size > 0).length,
            dateRange: this.getDateRange()
        };
    }

    /**
     * Obtiene el rango de fechas de los datos
     * @returns {Object} - Objeto con fechas mínima y máxima
     */
    getDateRange() {
        const sortedDates = this.data.getSortedDates();
        return {
            startDate: sortedDates.length > 0 ? sortedDates[0] : null,
            endDate: sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null,
            totalDays: sortedDates.length
        };
    }

    /**
     * Genera datos de ejemplo para testing
     * @returns {MedicalDashboardData} - Datos de ejemplo
     */
    generateSampleData() {
        const sampleText = `Exámenes\t29/07/2025 PM\t30/07/2025\t31/07/2025\t01/08/2025\t02/08/2025\t03/08/2025 MN\t03/08/2025 AM\t04/08/2025 AM\t04/08/2025 PM\t05/08/2025 AM\t06/08/2025 AM\t06/08/2025 PM\t07/08/2025
Leucocitos (10³/uL)\t-\t03.01\t3.42\t3.79 ↓\t4.13\t-\t-\t3.15 ↓\t-\t4.2\t\t3.75\t4.5
% Neutrófilos\t-\t74.1\t67.8\t73.10 ↑\t69.00\t-\t-\t78.10 ↑\t-\t69.8\t\t\t71
Hematocrito (%)\t-\t35.9\t37.6\t32.70 ↓\t32.00 ↓\t-\t-\t26.80 ↓\t-\t29.7\t\t30.9\t28
Hemoglobina (g/dL)\t-\t12.2\t12.9\t11.30 ↓\t11.30 ↓\t-\t-\t9.20 ↓\t-\t10.3\t\t10.8\t10
Plaquetas (10³/uL)\t-\t294\t270\t224\t204\t-\t-\t127 ↓\t-\t121\t\t94\t74
Creatinina (mg/dL)\t1.42\t1.72\t2.00\t2.41 ↑\t2.53 ↑\t2.86 ↑\t2.95 ↑\t2.59 ↑\t3.5\t3.4\t4\t\t4.47
PCR\t-\t-\t-\t-\t6.75 ↑\t-\t-\t22.90 ↑\t-\t24.7\t\t\t`;
        
        return this.parseTabularData(sampleText);
    }

    /**
     * Valida los datos parseados y reporta posibles problemas
     * @returns {Object} - Reporte de validación
     */
    validateParsedData() {
        const issues = [];
        const warnings = [];
        
        if (this.data.parameters.size === 0) {
            issues.push('No se encontraron parámetros médicos');
        }
        
        if (this.data.dates.length === 0) {
            issues.push('No se encontraron fechas válidas');
        }
        
        // Verificar parámetros sin datos
        this.data.parameters.forEach((parameter, name) => {
            if (parameter.values.size === 0) {
                warnings.push(`Parámetro "${name}" no tiene valores`);
            }
        });
        
        // Verificar fechas con pocos datos
        const dateData = new Map();
        this.data.parameters.forEach(parameter => {
            parameter.values.forEach((value, date) => {
                if (!dateData.has(date)) dateData.set(date, 0);
                if (value.isValid()) dateData.set(date, dateData.get(date) + 1);
            });
        });
        
        dateData.forEach((count, date) => {
            if (count < 3) {
                warnings.push(`Fecha "${date}" tiene pocos datos (${count} parámetros)`);
            }
        });
        
        return {
            isValid: issues.length === 0,
            issues,
            warnings,
            summary: {
                parameters: this.data.parameters.size,
                dates: this.data.dates.length,
                totalValues: Array.from(this.data.parameters.values())
                    .reduce((sum, param) => sum + param.values.size, 0)
            }
        };
    }
}

// Exportar la clase
if (typeof window !== 'undefined') {
    window.MedicalDataParser = MedicalDataParser;
}

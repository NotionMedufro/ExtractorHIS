/**
 * Tipos y estructuras de datos para el Dashboard Médico
 */

// Estructura para un valor de examen médico
class MedicalValue {
    constructor(value, isAbnormal = false, trend = 'stable') {
        this.value = value;
        this.isAbnormal = isAbnormal; // true si el valor está fuera del rango normal
        this.trend = trend; // 'up', 'down', 'stable'
        this.rawValue = this.extractNumericValue(value);
    }

    extractNumericValue(value) {
        if (!value || value === '-') return null;
        // Extraer solo el número, ignorando símbolos como ↑ ↓
        const match = value.toString().match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : null;
    }

    isValid() {
        return this.rawValue !== null;
    }
}

// Estructura para una fecha de examen
class ExamDate {
    constructor(dateString) {
        this.original = dateString;
        this.date = this.parseDate(dateString);
    }

    parseDate(dateString) {
        try {
            // Manejar diferentes formatos de fecha
            if (dateString.includes('/')) {
                const parts = dateString.split('/');
                if (parts.length === 3) {
                    // Asumir DD/MM/YYYY
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1; // Los meses en JS van de 0-11
                    const year = parseInt(parts[2]);
                    return new Date(year, month, day);
                }
            }
            return new Date(dateString);
        } catch (error) {
            console.warn('Error parsing date:', dateString);
            return new Date();
        }
    }

    getFormattedDate() {
        return this.date.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    }

    getShortDate() {
        return this.date.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit'
        });
    }
}

// Estructura para un parámetro de examen (fila en la tabla)
class MedicalParameter {
    constructor(name, unit = '') {
        this.name = name;
        this.unit = unit;
        this.values = new Map(); // fecha -> MedicalValue
        this.normalRange = null;
    }

    addValue(date, value) {
        const examDate = new ExamDate(date);
        const medicalValue = new MedicalValue(value, this.isAbnormalValue(value));
        this.values.set(examDate.getFormattedDate(), medicalValue);
    }

    isAbnormalValue(value) {
        // Detectar valores anormales basándose en símbolos ↑ ↓
        return value && (value.includes('↑') || value.includes('↓'));
    }

    getLatestValue() {
        const sortedDates = Array.from(this.values.keys()).sort((a, b) => {
            return new Date(b.split('/').reverse().join('/')) - new Date(a.split('/').reverse().join('/'));
        });
        
        return sortedDates.length > 0 ? this.values.get(sortedDates[0]) : null;
    }

    getTrend() {
        const dates = Array.from(this.values.keys()).sort((a, b) => {
            return new Date(a.split('/').reverse().join('/')) - new Date(b.split('/').reverse().join('/'));
        });

        if (dates.length < 2) return 'stable';

        const firstValue = this.values.get(dates[0]);
        const lastValue = this.values.get(dates[dates.length - 1]);

        if (!firstValue.isValid() || !lastValue.isValid()) return 'stable';

        const change = ((lastValue.rawValue - firstValue.rawValue) / firstValue.rawValue) * 100;
        
        if (Math.abs(change) < 5) return 'stable';
        return change > 0 ? 'up' : 'down';
    }
}

// Estructura principal para todos los datos del dashboard
class MedicalDashboardData {
    constructor() {
        this.parameters = new Map(); // nombre del parámetro -> MedicalParameter
        this.dates = [];
        this.patientInfo = {
            totalExams: 0,
            averageWaitTime: 0,
            averageSatisfactionScore: 0
        };
    }

    addParameter(parameterName, unit = '') {
        if (!this.parameters.has(parameterName)) {
            this.parameters.set(parameterName, new MedicalParameter(parameterName, unit));
        }
        return this.parameters.get(parameterName);
    }

    addValue(parameterName, date, value, unit = '') {
        const parameter = this.addParameter(parameterName, unit);
        parameter.addValue(date, value);
        
        // Agregar fecha si no existe
        if (!this.dates.includes(date)) {
            this.dates.push(date);
        }
    }

    getSortedDates() {
        return this.dates.sort((a, b) => {
            return new Date(a.split('/').reverse().join('/')) - new Date(b.split('/').reverse().join('/'));
        });
    }

    getKeyMetrics() {
        const metrics = {
            totalParameters: this.parameters.size,
            totalDates: this.dates.length,
            abnormalValues: 0,
            trendsUp: 0,
            trendsDown: 0,
            trendsStable: 0
        };

        this.parameters.forEach(parameter => {
            const latestValue = parameter.getLatestValue();
            if (latestValue && latestValue.isAbnormal) {
                metrics.abnormalValues++;
            }

            const trend = parameter.getTrend();
            switch (trend) {
                case 'up': metrics.trendsUp++; break;
                case 'down': metrics.trendsDown++; break;
                default: metrics.trendsStable++; break;
            }
        });

        return metrics;
    }

    // Obtener parámetros críticos (con valores anormales)
    getCriticalParameters() {
        const critical = [];
        this.parameters.forEach(parameter => {
            const latestValue = parameter.getLatestValue();
            if (latestValue && latestValue.isAbnormal) {
                critical.push({
                    name: parameter.name,
                    value: latestValue.value,
                    trend: parameter.getTrend(),
                    unit: parameter.unit
                });
            }
        });
        return critical.sort((a, b) => b.value.length - a.value.length); // Ordenar por "criticidad"
    }
}

// Exportar las clases para uso en otros módulos
if (typeof window !== 'undefined') {
    window.MedicalValue = MedicalValue;
    window.ExamDate = ExamDate;
    window.MedicalParameter = MedicalParameter;
    window.MedicalDashboardData = MedicalDashboardData;
}

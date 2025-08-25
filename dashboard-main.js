/**
 * Dashboard Médico - Script Principal
 * Maneja la funcionalidad principal del dashboard
 */

class MedicalDashboard {
    constructor() {
        this.parser = new MedicalDataParser();
        this.components = new DashboardComponents();
        this.sheetsConnector = new GoogleSheetsConnector();
        this.currentData = null;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeGoogleSheets();
        this.showEmptyState();
    }

    /**
     * Inicializa las referencias a elementos del DOM
     */
    initializeElements() {
        // Input elements
        this.dataInput = document.getElementById('medicalDataInput');
        this.parseBtn = document.getElementById('parseDataBtn');
        this.inputStatus = document.getElementById('inputStatus');
        this.inputInfo = document.getElementById('inputInfo');
        this.dataInputSection = document.getElementById('dataInputSection');
        
        // Dashboard elements
        this.dashboardContent = document.getElementById('dashboardContent');
        this.emptyState = document.getElementById('emptyState');
        this.metricsContainer = document.getElementById('metricsContainer');
        this.lineChartContainer = document.getElementById('lineChartContainer');
        this.criticalParametersContainer = document.getElementById('criticalParametersContainer');
        this.dataTableContainer = document.getElementById('dataTableContainer');
        
        // Action buttons
        this.loadUserDataBtn = document.getElementById('loadUserDataBtn');
        this.loadSampleBtn = document.getElementById('loadSampleBtn');
        this.loadSampleBtn2 = document.getElementById('loadSampleBtn2');
        this.clearDataBtn = document.getElementById('clearDataBtn');
        this.exportTableBtn = document.getElementById('exportTableBtn');
        
        // Overlay elements
        this.notification = document.getElementById('notification');
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }

    /**
     * Vincula eventos a los elementos
     */
    bindEvents() {
        // Input events
        this.dataInput.addEventListener('input', () => this.onDataInputChange());
        this.dataInput.addEventListener('paste', () => {
            setTimeout(() => this.onDataInputChange(), 100);
        });
        
        this.parseBtn.addEventListener('click', () => this.parseData());
        
        // Action buttons
        if (this.loadUserDataBtn) {
            this.loadUserDataBtn.addEventListener('click', () => this.loadUserSheetData());
        }
        this.loadSampleBtn.addEventListener('click', () => this.loadSampleData());
        this.loadSampleBtn2.addEventListener('click', () => this.loadSampleData());
        this.clearDataBtn.addEventListener('click', () => this.clearData());
        this.exportTableBtn.addEventListener('click', () => this.exportTable());
        
        // Auto-parse on input if enough data
        this.dataInput.addEventListener('input', this.debounce(() => {
            if (this.dataInput.value.trim().length > 100) {
                this.autoParseData();
            }
        }, 1000));
    }

    /**
     * Maneja cambios en el input de datos
     */
    onDataInputChange() {
        const inputValue = this.dataInput.value.trim();
        
        if (inputValue.length === 0) {
            this.updateInputStatus('waiting', 'Esperando datos...');
            this.parseBtn.disabled = true;
            return;
        }
        
        if (inputValue.length < 50) {
            this.updateInputStatus('incomplete', 'Datos insuficientes');
            this.parseBtn.disabled = true;
            return;
        }
        
        // Verificar si parece datos tabulares válidos
        if (this.looksLikeValidData(inputValue)) {
            this.updateInputStatus('ready', 'Datos listos para procesar');
            this.parseBtn.disabled = false;
            
            // Auto-parse si los datos parecen completos
            if (inputValue.split('\n').length >= 3) {
                this.autoParseData();
            }
        } else {
            this.updateInputStatus('invalid', 'Formato de datos no reconocido');
            this.parseBtn.disabled = true;
        }
    }

    /**
     * Verifica si los datos parecen válidos
     */
    looksLikeValidData(data) {
        const lines = data.split('\n').filter(line => line.trim().length > 0);
        if (lines.length < 2) return false;
        
        // Verificar que la primera línea tenga fechas
        const headerLine = lines[0];
        const hasDatePattern = /\d{1,2}\/\d{1,2}\/\d{4}/.test(headerLine);
        
        // Verificar que haya al menos una línea con datos
        const hasDataLines = lines.slice(1).some(line => {
            const cells = line.split(/\t|\s{2,}/).filter(cell => cell.trim().length > 0);
            return cells.length >= 3; // Nombre del parámetro + al menos 2 valores
        });
        
        return hasDatePattern && hasDataLines;
    }

    /**
     * Actualiza el estado visual del input
     */
    updateInputStatus(status, message) {
        const indicator = this.inputStatus.querySelector('.status-indicator');
        indicator.className = `status-indicator ${status}`;
        indicator.textContent = message;
        
        // Actualizar info adicional
        const infoText = this.inputInfo.querySelector('.info-text');
        switch (status) {
            case 'ready':
                infoText.textContent = 'Presiona "Procesar Datos" o continúa escribiendo para procesamiento automático';
                break;
            case 'processing':
                infoText.textContent = 'Analizando estructura de datos...';
                break;
            case 'success':
                infoText.textContent = 'Datos procesados correctamente';
                break;
            case 'error':
                infoText.textContent = 'Error en el formato de datos';
                break;
            default:
                infoText.textContent = 'Pega los datos y se procesarán automáticamente';
        }
    }

    /**
     * Procesa los datos médicos
     */
    async parseData() {
        const inputValue = this.dataInput.value.trim();
        
        if (!inputValue) {
            this.showNotification('No hay datos para procesar', 'error');
            return;
        }

        this.showLoading(true);
        this.updateInputStatus('processing', 'Procesando datos...');
        
        try {
            // Crear nuevo parser para evitar datos residuales
            this.parser = new MedicalDataParser();
            this.currentData = this.parser.parseTabularData(inputValue);
            
            // Validar los datos parseados
            const validation = this.parser.validateParsedData();
            
            if (!validation.isValid) {
                throw new Error(`Errores en los datos: ${validation.issues.join(', ')}`);
            }
            
            if (validation.warnings.length > 0) {
                console.warn('Advertencias:', validation.warnings);
            }
            
            // Mostrar estadísticas
            const stats = this.parser.getParsingStats();
            console.log('Estadísticas de parsing:', stats);
            
            // Actualizar dashboard
            await this.updateDashboard();
            
            this.updateInputStatus('success', `${stats.totalParameters} parámetros, ${stats.totalDates} fechas`);
            this.showNotification(`Datos procesados: ${stats.totalParameters} parámetros en ${stats.totalDates} fechas`, 'success');
            
        } catch (error) {
            console.error('Error parsing data:', error);
            this.updateInputStatus('error', error.message);
            this.showNotification('Error al procesar los datos: ' + error.message, 'error');
            
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Procesamiento automático con debounce
     */
    autoParseData() {
        // Solo auto-parse si los datos parecen estar completos
        if (this.looksLikeValidData(this.dataInput.value)) {
            this.parseData();
        }
    }

    /**
     * Actualiza todo el dashboard con los nuevos datos
     */
    async updateDashboard() {
        if (!this.currentData) return;
        
        // Ocultar estado vacío y mostrar dashboard
        this.hideEmptyState();
        this.showDashboard();
        
        // Actualizar métricas
        this.updateMetrics();
        
        // Actualizar gráficos
        this.updateCharts();
        
        // Actualizar parámetros críticos
        this.updateCriticalParameters();
        
        // Actualizar tabla de datos
        this.updateDataTable();
        
        // Scroll hacia el dashboard
        this.dashboardContent.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Actualiza las métricas principales
     */
    updateMetrics() {
        const metricsHTML = this.components.createMetricsCards(this.currentData);
        this.metricsContainer.innerHTML = metricsHTML;
    }

    /**
     * Actualiza los gráficos
     */
    updateCharts() {
        const chartHTML = this.components.createLineChart(this.currentData);
        this.lineChartContainer.innerHTML = chartHTML;
    }

    /**
     * Actualiza la lista de parámetros críticos
     */
    updateCriticalParameters() {
        const criticalParams = this.currentData.getCriticalParameters();
        
        if (criticalParams.length === 0) {
            this.criticalParametersContainer.innerHTML = `
                <div class="no-critical">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p>No hay parámetros críticos</p>
                    <span>Todos los valores están dentro de rangos normales</span>
                </div>
            `;
            return;
        }
        
        const criticalHTML = criticalParams.map(param => `
            <div class="critical-item">
                <div class="critical-info">
                    <span class="critical-name">${param.name}</span>
                    <span class="critical-value">${param.value}</span>
                </div>
                <div class="critical-trend">
                    ${this.getTrendIcon(param.trend)}
                </div>
            </div>
        `).join('');
        
        this.criticalParametersContainer.innerHTML = criticalHTML;
    }

    /**
     * Obtiene el icono de tendencia
     */
    getTrendIcon(trend) {
        switch (trend) {
            case 'up':
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                </svg>`;
            case 'down':
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="blue" stroke-width="2">
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                    <polyline points="17 18 23 18 23 12"></polyline>
                </svg>`;
            default:
                return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>`;
        }
    }

    /**
     * Actualiza la tabla de datos
     */
    updateDataTable() {
        const tableHTML = this.components.createDataTable(this.currentData);
        this.dataTableContainer.innerHTML = tableHTML;
    }

    /**
     * Prueba con los datos específicos del Google Sheet del usuario
     */
    loadUserSheetData() {
        // Estos son los datos COMPLETOS del Google Sheet del usuario decodificados desde base64
        const csvData = `Exámenes,29/07/2025 PM,30/07/2025,31/07/2025,01/08/2025,02/08/2025,03/08/2025 MN,03/08/2025 AM,04/08/2025 AM,04/08/2025 PM,05/08/2025 AM,06/08/2025 AM,06/08/2025 PM,07/08/2025
Leucocitos (10³/uL),-,03.01,3.42,3.79 ↓,4.13,-,-,3.15 ↓,-,4.2,,3.75,4.5
% Neutrófilos,-,74.1,67.8,73.10 ↑,69.00,-,-,78.10 ↑,-,69.8,,,71
RAN,,2.230,,2770,2850,-,-,2470,-,2.950,,2.640,3.230
RAL,,250,,280,320,-,-,220,-,360,,330,330
Hematocrito (%),-,35.9,37.6,32.70 ↓,32.00 ↓,-,-,26.80 ↓,-,29.7,,30.9,28
Hemoglobina (g/dL),-,12.2,12.9,11.30 ↓,11.30 ↓,-,-,9.20 ↓,-,10.3,,10.8,10
Plaquetas (10³/uL),-,294,270,224,204,-,-,127 ↓,-,121,,94,74
VHS,-,-,-,-,-,-,-,-,-,-,,,-
PCR,-,-,-,-,6.75 ↑,-,-,22.90 ↑,-,24.7,,,
PT (%),-,-,-,-,-,-,-,-,-,-,,,
INR,-,-,-,-,-,-,-,-,-,-,,,
TTPA,-,-,-,-,-,-,-,-,-,-,,,
Glicemia,-,-,-,-,-,-,-,-,-,-,,,
Uremia (mg/dL),-,26.5,29.4,41.80,48.50,55.20 ↑,56.80 ↑,47.10,-,60.7,63.6,,67
BUN (mg%),-,12.4,13.7,19.5,22.7 ↑,25.8 ↑,26.5 ↑,22.0,-,28.4,29.7,,31
Creatinina (mg/dL),1.42,1.72,2.00,2.41 ↑,2.53 ↑,2.86 ↑,2.95 ↑,2.59 ↑,3.5,3.4,4,,4.47
VFG (mL/min),58.2,46.6,39.2,31.6,29.9,25.9,25.0,29.1,20.6,19.9,17.4,,15.5
Sodio (mEq/L),137.2,137.4,139.4,140.70,140.20,137.40,138.20,140.80,135,142,,,138
Potasio (mEq/L),4.87,4.51,05.08,4.57,4.75,5.00 ↑,5.13 ↑,3.37 ↓,4.5,4.2,,,4.58
Cloro (mEq/L),109.2,110.4,110.6,112.40 ↑,113.90 ↑,111.40 ↑,112.00 ↑,119.80 ↑,110,112,,,109
Calcio (mg/dL),08.06,8.29,8.68,7.95 ↓,8.02 ↓,7.65 ↓,7.67 ↓,5.06 ↓,7.9,6.8,7.1,,6.8 (7.1)
Fósforo (mg/dL),1.53,1.32,1.30,0.99 ↓,1.06 ↓,2.42 ↓,1.17 ↓,0.82 ↓,1.35,01.04,0.86,,1.29
Magnesio (mg/dL),-,-,2.23,2.23,—,-,-,1.39 ↓,-,1.81,1.86,,1.83
Albúmina (g/dL),-,-,-,3.59,3.56,-,-,-,-,-,,,
Prealbúmina,-,-,-,-,—,-,-,-,-,-,,,
Proteínas,-,-,-,-,—,-,-,-,-,-,,,
Bilirrubina Total,-,-,-,-,0.66,-,-,-,-,-,,1,1
Bilirrubina Directa,-,-,-,-,0.24,-,-,-,-,-,,0.4,0.5
Fosfatasa Alcalina,-,-,-,-,206.00 ↑,-,-,-,-,-,,,354
GGT,-,-,-,-,93.30 ↑,-,-,-,-,-,,,247
GOT,-,-,-,-,57.80 ↑,-,-,-,-,-,,,51
GPT,-,-,-,-,36.50,-,-,-,-,-,,,99
Amilasa,-,-,-,-,-,-,-,-,-,-,,,
Lipasa,-,-,-,-,-,-,-,-,-,-,,,
Ácido úrico (mg/dL),-,-,2.11,2.85 ↓,3.15 ↓,-,3.28 ↓,2.52 ↓,-,3.4,3.9,,04.04
LDH,-,-,-,3081.00 ↑,-,-,-,3104.00 ↑,-,-,,5.930,
CK Total,-,-,-,-,-,-,-,-,-,-,,,
CK MB,-,-,-,-,-,-,-,-,-,-,,,
Troponina,-,-,-,-,-,-,-,-,-,-,,,
PO2 (mmHg),-,44.5,27.4,27.50,75.50 ↑,-,53.80 ↑,48.60,-,46.7,49,,41.7
PCO2 (mmHg),-,29.5,37.5,36.00 ↓,26.00 ↓,-,25.40 ↓,18.00 ↓,-,27,28.2,,29
HCO3 (mmol/L),-,15.45,18.5,18.91 ↓,14.35 ↓,-,13.11 ↓,9.48 ↓,-,16.4,16.4,,15
pH,-,7.32,7.30,7.33,7.35,-,7.32,7.33,-,7.39,7.37,,7.34
BE (mmol/L),-,-8.6,-6.7,-5.80 ↓,-8.90 ↓,-,-10.80 ↓,-13.60 ↓,-,-6.7,-7.2,,-8
SatO2 (%),-,72.0,34.0,41.00,95.00 ↑,-,85.00,82.00,-,75,83,,70`;
        
        try {
            // Convertir CSV a formato tabular
            const tabularData = this.sheetsConnector.convertCsvToTabular(csvData);
            console.log('Datos COMPLETOS convertidos a tabular:', tabularData.substring(0, 300));
            console.log('Total de caracteres en datos completos:', tabularData.length);
            
            // Validar los datos
            const validation = this.sheetsConnector.validateMedicalData(tabularData);
            console.log('Validación de datos completos del usuario:', validation);
            
            // Cargar datos en el textarea independientemente del resultado de validación
            this.dataInput.value = tabularData;
            this.onDataInputChange();
            
            this.showNotification('Datos COMPLETOS del Google Sheet cargados - 37 parámetros médicos', 'success');
            
            // Auto-procesar después de un breve delay
            setTimeout(() => {
                this.parseData();
            }, 500);
            
        } catch (error) {
            console.error('Error procesando datos completos del usuario:', error);
            this.showNotification('Error: ' + error.message, 'error');
        }
    }
    
    /**
     * Carga datos de ejemplo
     */
    loadSampleData() {
        const sampleText = `Exámenes	29/07/2025 PM	30/07/2025	31/07/2025	01/08/2025	02/08/2025	03/08/2025 MN	03/08/2025 AM	04/08/2025 AM	04/08/2025 PM	05/08/2025 AM	06/08/2025 AM	06/08/2025 PM	07/08/2025
Leucocitos (10³/uL)	-	03.01	3.42	3.79 ↓	4.13	-	-	3.15 ↓	-	4.2		3.75	4.5
% Neutrófilos	-	74.1	67.8	73.10 ↑	69.00	-	-	78.10 ↑	-	69.8			71
RAN		2.230		2770	2850	-	-	2470	-	2.950		2.640	3.230
RAL		250		280	320	-	-	220	-	360		330	330
Hematocrito (%)	-	35.9	37.6	32.70 ↓	32.00 ↓	-	-	26.80 ↓	-	29.7		30.9	28
Hemoglobina (g/dL)	-	12.2	12.9	11.30 ↓	11.30 ↓	-	-	9.20 ↓	-	10.3		10.8	10
Plaquetas (10³/uL)	-	294	270	224	204	-	-	127 ↓	-	121		94	74
VHS	-	-	-	-	-	-	-	-	-	-			-
PCR	-	-	-	-	6.75 ↑	-	-	22.90 ↑	-	24.7			
PT (%)	-	-	-	-	-	-	-	-	-	-			
INR	-	-	-	-	-	-	-	-	-	-			
TTPA	-	-	-	-	-	-	-	-	-	-			
Glicemia	-	-	-	-	-	-	-	-	-	-			
Uremia (mg/dL)	-	26.5	29.4	41.80	48.50	55.20 ↑	56.80 ↑	47.10	-	60.7	63.6		67
BUN (mg%)	-	12.4	13.7	19.5	22.7 ↑	25.8 ↑	26.5 ↑	22.0	-	28.4	29.7		31
Creatinina (mg/dL)	1.42	1.72	2.00	2.41 ↑	2.53 ↑	2.86 ↑	2.95 ↑	2.59 ↑	3.5	3.4	4		4.47
VFG (mL/min)	58.2	46.6	39.2	31.6	29.9	25.9	25.0	29.1	20.6	19.9	17.4		15.5
Sodio (mEq/L)	137.2	137.4	139.4	140.70	140.20	137.40	138.20	140.80	135	142			138
Potasio (mEq/L)	4.87	4.51	05.08	4.57	4.75	5.00 ↑	5.13 ↑	3.37 ↓	4.5	4.2			4.58
Cloro (mEq/L)	109.2	110.4	110.6	112.40 ↑	113.90 ↑	111.40 ↑	112.00 ↑	119.80 ↑	110	112			109`;
        
        this.dataInput.value = sampleText;
        this.onDataInputChange();
        this.showNotification('Datos de ejemplo cargados', 'success');
        
        // Auto-procesar después de un breve delay
        setTimeout(() => {
            this.parseData();
        }, 500);
    }

    /**
     * Limpia todos los datos
     */
    clearData() {
        this.dataInput.value = '';
        this.currentData = null;
        this.onDataInputChange();
        this.showEmptyState();
        this.showNotification('Datos eliminados', 'info');
    }

    /**
     * Exporta la tabla a CSV
     */
    exportTable() {
        if (!this.currentData) {
            this.showNotification('No hay datos para exportar', 'warning');
            return;
        }

        try {
            const csv = this.generateCSV();
            this.downloadCSV(csv, 'datos_medicos.csv');
            this.showNotification('Tabla exportada como CSV', 'success');
        } catch (error) {
            this.showNotification('Error al exportar: ' + error.message, 'error');
        }
    }

    /**
     * Genera CSV de los datos
     */
    generateCSV() {
        const dates = this.currentData.getSortedDates();
        const parameters = Array.from(this.currentData.parameters.values());
        
        // Cabecera
        const header = ['Parámetro', 'Unidad', ...dates, 'Estado'].join(',');
        
        // Filas de datos
        const rows = parameters.map(parameter => {
            const values = dates.map(date => {
                const value = parameter.values.get(date);
                return value && value.isValid() ? `"${value.value}"` : '""';
            });
            
            const status = parameter.getLatestValue()?.isAbnormal ? 'Anormal' : 'Normal';
            
            return [
                `"${parameter.name}"`,
                `"${parameter.unit}"`,
                ...values,
                `"${status}"`
            ].join(',');
        });
        
        return [header, ...rows].join('\n');
    }

    /**
     * Descarga un archivo CSV
     */
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    /**
     * Muestra el estado vacío
     */
    showEmptyState() {
        this.emptyState.style.display = 'flex';
        this.dashboardContent.style.display = 'none';
    }

    /**
     * Oculta el estado vacío
     */
    hideEmptyState() {
        this.emptyState.style.display = 'none';
    }

    /**
     * Muestra el dashboard
     */
    showDashboard() {
        this.dashboardContent.style.display = 'block';
    }

    /**
     * Muestra/oculta el overlay de loading
     */
    showLoading(show) {
        this.loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'info') {
        const notification = this.notification;
        const icon = notification.querySelector('.notification-icon');
        const text = notification.querySelector('.notification-text');
        
        // Configurar icono según tipo
        switch (type) {
            case 'success':
                icon.textContent = '✓';
                break;
            case 'error':
                icon.textContent = '✗';
                break;
            case 'warning':
                icon.textContent = '⚠';
                break;
            default:
                icon.textContent = 'ℹ';
        }
        
        text.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'flex';
        
        // Auto-ocultar después de 4 segundos
        setTimeout(() => {
            notification.style.display = 'none';
        }, 4000);
    }

    /**
     * Inicializa la funcionalidad de Google Sheets
     */
    initializeGoogleSheets() {
        // Elementos de Google Sheets
        this.toggleSheetsBtn = document.getElementById('toggleSheetsBtn');
        this.sheetsInputContent = document.getElementById('sheetsInputContent');
        this.sheetsUrlInput = document.getElementById('sheetsUrlInput');
        this.loadFromSheetsBtn = document.getElementById('loadFromSheetsBtn');
        this.sheetsStatus = document.getElementById('sheetsStatus');
        this.sheetsInstructions = document.getElementById('sheetsInstructions');
        
        // Eventos de Google Sheets
        this.toggleSheetsBtn.addEventListener('click', () => this.toggleSheetsSection());
        this.loadFromSheetsBtn.addEventListener('click', () => this.loadFromGoogleSheets());
        this.sheetsUrlInput.addEventListener('input', () => this.onSheetsUrlChange());
        this.sheetsUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadFromGoogleSheets();
        });
        
        // Cargar instrucciones iniciales
        this.sheetsInstructions.innerHTML = this.sheetsConnector.getInstructions();
    }
    
    /**
     * Alterna la visibilidad de la sección de Google Sheets
     */
    toggleSheetsSection() {
        const isVisible = this.sheetsInputContent.style.display !== 'none';
        
        if (isVisible) {
            this.sheetsInputContent.style.display = 'none';
            this.toggleSheetsBtn.classList.remove('active');
        } else {
            this.sheetsInputContent.style.display = 'block';
            this.toggleSheetsBtn.classList.add('active');
        }
    }
    
    /**
     * Maneja cambios en la URL de Google Sheets
     */
    onSheetsUrlChange() {
        const url = this.sheetsUrlInput.value.trim();
        
        if (url.length === 0) {
            this.updateSheetsStatus('default', 'Pega el enlace de tu Google Sheet pública');
            this.loadFromSheetsBtn.disabled = true;
            return;
        }
        
        if (this.sheetsConnector.isValidSheetsUrl(url)) {
            this.updateSheetsStatus('ready', 'URL válida - Listo para cargar');
            this.loadFromSheetsBtn.disabled = false;
        } else {
            this.updateSheetsStatus('error', 'URL no válida - Verifica el enlace de Google Sheets');
            this.loadFromSheetsBtn.disabled = true;
        }
    }
    
    /**
     * Actualiza el estado visual de Google Sheets
     */
    updateSheetsStatus(status, message) {
        const statusText = this.sheetsStatus.querySelector('.sheets-status-text');
        
        this.sheetsStatus.className = `sheets-status ${status}`;
        statusText.textContent = message;
    }
    
    /**
     * Carga datos desde Google Sheets
     */
    async loadFromGoogleSheets() {
        const url = this.sheetsUrlInput.value.trim();
        
        if (!url) {
            this.showNotification('Ingresa una URL de Google Sheets', 'warning');
            return;
        }
        
        if (!this.sheetsConnector.isValidSheetsUrl(url)) {
            this.showNotification('URL de Google Sheets no válida', 'error');
            return;
        }
        
        this.showLoading(true);
        this.updateSheetsStatus('loading', 'Cargando datos desde Google Sheets...');
        this.loadFromSheetsBtn.disabled = true;
        
        try {
            console.log('Iniciando carga desde Google Sheets:', url);
            
            // Cargar datos CSV desde Google Sheets
            const csvData = await this.sheetsConnector.loadFromSheets(url);
            
            console.log('Datos CSV obtenidos:', csvData ? csvData.substring(0, 200) : 'null');
            
            if (!csvData || csvData.trim().length === 0) {
                throw new Error('La hoja de cálculo parece estar vacía');
            }
            
            // Convertir CSV a formato tabular
            const tabularData = this.sheetsConnector.convertCsvToTabular(csvData);
            
            console.log('Datos tabulares convertidos:', tabularData.substring(0, 200));
            
            // Validar datos médicos
            const validation = this.sheetsConnector.validateMedicalData(tabularData);
            
            console.log('Resultado de validación:', validation);
            
            if (!validation.isValid) {
                // Mostrar datos para debugging
                console.warn('Datos considerados inválidos:', {
                    tabularData: tabularData.substring(0, 500),
                    validation
                });
                throw new Error(`Datos no válidos: ${validation.issues.join(', ')}`);
            }
            
            if (validation.warnings.length > 0) {
                console.warn('Advertencias:', validation.warnings);
                // Mostrar advertencias pero continuar
                validation.warnings.forEach(warning => 
                    this.showNotification(warning, 'warning')
                );
            }
            
            // Cargar datos en el textarea
            this.dataInput.value = tabularData;
            this.onDataInputChange();
            
            // Procesar automáticamente
            await this.parseData();
            
            this.updateSheetsStatus('success', `${validation.summary} cargadas correctamente`);
            this.showNotification('Datos cargados desde Google Sheets exitosamente', 'success');
            
        } catch (error) {
            console.error('Error loading from Google Sheets:', error);
            this.updateSheetsStatus('error', error.message);
            this.showNotification('Error al cargar desde Google Sheets: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
            this.loadFromSheetsBtn.disabled = false;
        }
    }
    
    /**
     * Función debounce para evitar múltiples llamadas
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Inicializar el dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new MedicalDashboard();
});

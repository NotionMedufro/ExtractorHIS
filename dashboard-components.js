/**
 * Componentes de visualización para el Dashboard Médico
 * Genera HTML y maneja la visualización de los datos médicos
 */

class DashboardComponents {
    constructor() {
        this.chartColors = {
            normal: '#4CAF50',
            warning: '#FF9800',
            critical: '#F44336',
            neutral: '#9E9E9E',
            background: 'rgba(76, 175, 80, 0.1)'
        };
    }

    /**
     * Crea el HTML para las métricas principales
     * @param {MedicalDashboardData} data - Datos médicos
     * @returns {string} - HTML de las métricas
     */
    createMetricsCards(data) {
        const metrics = data.getKeyMetrics();
        const criticalParams = data.getCriticalParameters();
        const dateRange = this.getDateRange(data);
        
        return `
            <div class="metrics-container">
                <div class="metric-card">
                    <div class="metric-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div class="metric-content">
                        <div class="metric-title">PARÁMETROS</div>
                        <div class="metric-value">${metrics.totalParameters}</div>
                    </div>
                    <div class="metric-trend">
                        ${this.createMiniChart(data, 'parameters')}
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                    </div>
                    <div class="metric-content">
                        <div class="metric-title">TIEMPO PROMEDIO</div>
                        <div class="metric-value">${dateRange.totalDays}<span class="metric-unit">días</span></div>
                    </div>
                    <div class="metric-trend">
                        ${this.createMiniChart(data, 'time')}
                    </div>
                </div>

                <div class="metric-card ${criticalParams.length > 0 ? 'critical' : ''}">
                    <div class="metric-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h1m4 0h1m-6 4h6m6-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                        </svg>
                    </div>
                    <div class="metric-content">
                        <div class="metric-title">VALORES CRÍTICOS</div>
                        <div class="metric-value">${criticalParams.length}<span class="metric-unit">/${metrics.totalParameters}</span></div>
                    </div>
                    <div class="metric-trend">
                        ${this.createMiniChart(data, 'critical')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Crea mini gráficos para las métricas
     * @param {MedicalDashboardData} data - Datos médicos
     * @param {string} type - Tipo de gráfico
     * @returns {string} - SVG del mini gráfico
     */
    createMiniChart(data, type) {
        const width = 60;
        const height = 30;
        
        switch (type) {
            case 'parameters':
                return this.createParametersTrendSVG(data, width, height);
            case 'time':
                return this.createTimeTrendSVG(data, width, height);
            case 'critical':
                return this.createCriticalTrendSVG(data, width, height);
            default:
                return `<svg width="${width}" height="${height}"></svg>`;
        }
    }

    /**
     * Crea SVG de tendencia para parámetros
     */
    createParametersTrendSVG(data, width, height) {
        const dates = data.getSortedDates();
        const points = dates.map((date, index) => {
            const x = (index / (dates.length - 1 || 1)) * width;
            const y = height * 0.3 + Math.sin(index * 0.5) * (height * 0.2);
            return `${x},${y}`;
        }).join(' ');

        return `
            <svg width="${width}" height="${height}" class="mini-chart">
                <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
                <circle cx="${width * 0.8}" cy="${height * 0.4}" r="2" fill="currentColor"/>
            </svg>
        `;
    }

    /**
     * Crea SVG de tendencia temporal
     */
    createTimeTrendSVG(data, width, height) {
        return `
            <svg width="${width}" height="${height}" class="mini-chart">
                <defs>
                    <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:currentColor;stop-opacity:0.1"/>
                        <stop offset="100%" style="stop-color:currentColor;stop-opacity:0.8"/>
                    </linearGradient>
                </defs>
                <rect x="0" y="${height*0.6}" width="${width}" height="${height*0.4}" fill="url(#timeGradient)"/>
                <line x1="0" y1="${height*0.6}" x2="${width}" y2="${height*0.3}" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
    }

    /**
     * Crea SVG para valores críticos
     */
    createCriticalTrendSVG(data, width, height) {
        const criticalCount = data.getCriticalParameters().length;
        const severity = criticalCount / data.parameters.size;
        
        const color = severity > 0.3 ? '#F44336' : severity > 0.1 ? '#FF9800' : '#4CAF50';
        
        return `
            <svg width="${width}" height="${height}" class="mini-chart">
                <path d="M5,${height*0.7} Q${width/2},${height*0.2} ${width-5},${height*0.5}" 
                      fill="none" stroke="${color}" stroke-width="2"/>
                ${criticalCount > 0 ? `<circle cx="${width-10}" cy="${height*0.5}" r="3" fill="${color}"/>` : ''}
            </svg>
        `;
    }

    /**
     * Crea la tabla de datos detallados
     * @param {MedicalDashboardData} data - Datos médicos
     * @returns {string} - HTML de la tabla
     */
    createDataTable(data) {
        const dates = data.getSortedDates();
        const parameters = Array.from(data.parameters.values());

        const headerCells = dates.map(date => {
            const shortDate = this.formatShortDate(date);
            return `<th class="table-date-header" title="${date}">${shortDate}</th>`;
        }).join('');

        const dataRows = parameters.map(parameter => {
            const cells = dates.map(date => {
                const value = parameter.values.get(date);
                const cellClass = this.getCellClass(value);
                const displayValue = this.formatCellValue(value);
                
                return `<td class="table-cell ${cellClass}" title="${date}: ${displayValue}">${displayValue}</td>`;
            }).join('');

            const parameterClass = this.getParameterClass(parameter);
            const latestValue = parameter.getLatestValue();
            const parameterTitle = `${parameter.name}${parameter.unit ? ` (${parameter.unit})` : ''}`;
            
            return `
                <tr class="table-row">
                    <td class="table-parameter ${parameterClass}" title="${parameterTitle}">
                        <span class="parameter-name">${parameter.name}</span>
                        ${parameter.unit ? `<span class="parameter-unit">${parameter.unit}</span>` : ''}
                    </td>
                    ${cells}
                    <td class="table-status" title="Estado: ${latestValue && latestValue.isAbnormal ? 'Anormal' : 'Normal'}">
                        ${this.createStatusIndicator(parameter)}
                    </td>
                </tr>
            `;
        }).join('');

        return `
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th class="table-parameter-header">Parámetro</th>
                            ${headerCells}
                            <th class="table-status-header">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataRows}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Obtiene la clase CSS para una celda basada en el valor
     */
    getCellClass(value) {
        if (!value || !value.isValid()) return 'cell-empty';
        if (value.isAbnormal) return 'cell-abnormal';
        return 'cell-normal';
    }

    /**
     * Obtiene la clase CSS para un parámetro
     */
    getParameterClass(parameter) {
        const latestValue = parameter.getLatestValue();
        if (latestValue && latestValue.isAbnormal) return 'parameter-critical';
        return 'parameter-normal';
    }

    /**
     * Formatea el valor para mostrar en la celda
     */
    formatCellValue(value) {
        if (!value || !value.isValid()) return '—';
        return value.value.toString();
    }

    /**
     * Crea indicador de estado para un parámetro
     */
    createStatusIndicator(parameter) {
        const trend = parameter.getTrend();
        const latestValue = parameter.getLatestValue();
        
        let icon = '';
        let status = '';
        
        if (latestValue && latestValue.isAbnormal) {
            icon = '⚠️';
            status = 'Anormal';
        } else {
            switch (trend) {
                case 'up':
                    icon = '📈';
                    status = 'Subiendo';
                    break;
                case 'down':
                    icon = '📉';
                    status = 'Bajando';
                    break;
                default:
                    icon = '✅';
                    status = 'Estable';
                    break;
            }
        }
        
        return `
            <div class="status-indicator">
                <span class="status-icon">${icon}</span>
                <span class="status-text">${status}</span>
            </div>
        `;
    }

    /**
     * Crea los tres gráficos de categorías (Inflamatorio, Renal, Hepático)
     * @param {MedicalDashboardData} data - Datos médicos
     * @returns {string} - HTML de los tres gráficos en fila
     */
    createLineChart(data) {
        const dates = data.getSortedDates();
        const dateRange = this.getDateRange(data);
        
        // Definir parámetros para cada categoría
        const categories = [
            {
                id: 'inflammatory',
                title: 'Marcadores Inflamatorios',
                parameters: ['Leucocitos (10³/uL)', '% Neutrófilos', 'PCR']
            },
            {
                id: 'renal',
                title: 'Función Renal',
                parameters: ['Creatinina (mg/dL)', 'BUN (mg%)', 'Sodio (mEq/L)', 'Potasio (mEq/L)', 'Calcio (mg/dL)', 'Fósforo (mg/dL)']
            },
            {
                id: 'hepatic',
                title: 'Función Hepática',
                parameters: ['Bilirrubina Total', 'Bilirrubina Directa', 'GOT', 'GPT', 'Fosfatasa Alcalina', 'GGT']
            }
        ];
        
        // Generar los tres gráficos
        const charts = categories.map(category => {
            return this.createCategoryChart(data, category, dates, dateRange);
        }).join('');
        
        return `
            <div class="category-charts">
                ${charts}
            </div>
        `;
    }
    
    /**
     * Crea un gráfico de categoría individual
     */
    createCategoryChart(data, category, dates, dateRange) {
        const chartId = 'chart_' + category.id;
        
        // Filtrar los parámetros disponibles para esta categoría
        const availableParams = category.parameters.filter(paramName => {
            // Buscar coincidencias exactas o parciales
            return Array.from(data.parameters.keys()).some(key => {
                return key === paramName || key.includes(paramName) || paramName.includes(key);
            });
        });
        
        // Obtener los nombres reales de los parámetros en los datos
        const matchedParams = availableParams.map(paramName => {
            const exactMatch = data.parameters.get(paramName);
            if (exactMatch) return paramName;
            
            // Buscar coincidencia parcial
            const partialMatch = Array.from(data.parameters.keys()).find(key => {
                return key.includes(paramName) || paramName.includes(key);
            });
            
            return partialMatch || null;
        }).filter(Boolean); // Eliminar nulls
        
        // Preparar datos para el gráfico
        const chartData = this.prepareChartData(data, dates, matchedParams);
        const trendInfo = this.calculateTrendInfo(chartData);
        
        // Crear etiquetas para valores actuales
        const valueLabels = this.createValueLabels(data, matchedParams);
        
        return `
            <div class="category-chart">
                <div class="chart-card">
                    <div class="chart-card-header">
                        <div class="chart-card-title">
                            <h3>${category.title}</h3>
                            <p class="chart-card-description">${this.formatDateRange(dateRange)}</p>
                        </div>
                    </div>
                    <div class="chart-card-content">
                        <div class="chart-container-recharts">
                            <div id="${chartId}" class="line-chart-recharts">
                                ${chartData.length > 0 ? 
                                    this.createRechartsStyleLineChart(chartData, dates, 240) : 
                                    `<div class="no-chart-data">No hay datos suficientes</div>`
                                }
                            </div>
                        </div>
                        <div class="current-values-grid">
                            ${valueLabels}
                        </div>
                    </div>
                    <div class="chart-card-footer">
                        <div class="chart-trend-info">
                            <div class="trend-main">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="trend-icon ${trendInfo.type === 'down' ? 'trend-down' : trendInfo.type === 'up' ? 'trend-up' : ''}">
                                    <path d="m22 7-8.5 8.5-5-5L2 17"/>
                                    <path d="M16 7h6v6"/>
                                </svg>
                                <span class="trend-text">${trendInfo.message}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Crea etiquetas de valores actuales para cada parámetro
     */
    createValueLabels(data, parameterNames) {
        const labels = parameterNames.map(paramName => {
            const parameter = data.parameters.get(paramName);
            if (!parameter) return '';
            
            const latestValue = parameter.getLatestValue();
            if (!latestValue || !latestValue.isValid()) return '';
            
            const valueClass = latestValue.isAbnormal ? 'value-abnormal' : 'value-normal';
            const shortName = this.getShortParameterName(paramName);
            
            return `
                <div class="value-label ${valueClass}">
                    <div class="value-name">${shortName}</div>
                    <div class="value-number">${latestValue.value}</div>
                </div>
            `;
        }).join('');
        
        return labels;
    }
    
    /**
     * Obtiene un nombre corto para el parámetro
     */
    getShortParameterName(paramName) {
        // Mapa de abreviaturas
        const abbrevMap = {
            'Leucocitos (10³/uL)': 'GB',
            'Leucocitos': 'GB',
            '% Neutrófilos': '%N',
            'PCR': 'PCR',
            'Creatinina (mg/dL)': 'Crea',
            'Creatinina': 'Crea',
            'BUN (mg%)': 'BUN',
            'Uremia (mg/dL)': 'Urem',
            'Uremia': 'Urem',
            'Sodio (mEq/L)': 'Na',
            'Sodio': 'Na',
            'Potasio (mEq/L)': 'K',
            'Potasio': 'K',
            'Calcio (mg/dL)': 'Ca',
            'Calcio': 'Ca',
            'Fósforo (mg/dL)': 'P',
            'Fósforo': 'P',
            'Bilirrubina Total': 'BiliT',
            'Bilirrubina Directa': 'BiliD',
            'Fosfatasa Alcalina': 'FA',
            'GGT': 'GGT',
            'GOT': 'GOT',
            'GPT': 'GPT'
        };
        
        // Buscar abreviatura o extraer las primeras 4 letras
        return abbrevMap[paramName] || paramName.substring(0, 4);
    }

    /**
     * Selecciona parámetros interesantes para graficar
     */
    selectInterestingParameters(data) {
        const parameters = Array.from(data.parameters.values());
        
        // Priorizar parámetros con valores anormales
        const criticalParams = parameters
            .filter(p => {
                const latest = p.getLatestValue();
                return latest && latest.isAbnormal;
            })
            .slice(0, 3);
        
        // Si no hay suficientes críticos, agregar otros con buena data
        if (criticalParams.length < 3) {
            const normalParams = parameters
                .filter(p => !criticalParams.includes(p) && p.values.size > 2)
                .sort((a, b) => b.values.size - a.values.size)
                .slice(0, 3 - criticalParams.length);
            
            criticalParams.push(...normalParams);
        }
        
        return criticalParams.map(p => p.name);
    }

    /**
     * Prepara los datos para el gráfico
     */
    prepareChartData(data, dates, parameterNames) {
        return parameterNames.map(paramName => {
            const parameter = data.parameters.get(paramName);
            if (!parameter) return null;
            
            const values = dates.map(date => {
                const value = parameter.values.get(date);
                return value && value.isValid() ? value.rawValue : null;
            });
            
            return {
                name: paramName,
                values: values,
                unit: parameter.unit,
                color: this.getParameterColor(paramName, parameterNames.indexOf(paramName))
            };
        }).filter(item => item !== null);
    }

    /**
     * Obtiene color para un parámetro específico
     */
    getParameterColor(paramName, index) {
        const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'];
        return colors[index % colors.length];
    }

    /**
     * Crea la leyenda del gráfico
     */
    createChartLegend(parameterNames) {
        return parameterNames.map((name, index) => {
            const color = this.getParameterColor(name, index);
            return `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${color}"></div>
                    <span class="legend-text">${name}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Crea el SVG del gráfico de línea
     */
    createSVGLineChart(chartData, dates) {
        const width = 600;
        const height = 300;
        const padding = { top: 20, right: 30, bottom: 40, left: 60 };
        
        // Calcular rangos
        const allValues = chartData.flatMap(series => 
            series.values.filter(v => v !== null)
        );
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        const valueRange = maxValue - minValue || 1;
        
        // Crear líneas
        const lines = chartData.map(series => {
            const points = series.values.map((value, index) => {
                if (value === null) return null;
                
                const x = padding.left + (index / (dates.length - 1 || 1)) * (width - padding.left - padding.right);
                const y = padding.top + (1 - (value - minValue) / valueRange) * (height - padding.top - padding.bottom);
                
                return `${x},${y}`;
            }).filter(p => p !== null);
            
            return `
                <polyline 
                    points="${points.join(' ')}" 
                    fill="none" 
                    stroke="${series.color}" 
                    stroke-width="2"
                    opacity="0.8"
                />
            `;
        }).join('');
        
        // Crear ejes
        const xAxis = this.createXAxis(dates, width, height, padding);
        const yAxis = this.createYAxis(minValue, maxValue, width, height, padding);
        
        return `
            <svg width="${width}" height="${height}" class="svg-chart">
                <defs>
                    <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e0e0e0" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.3"/>
                ${yAxis}
                ${xAxis}
                ${lines}
            </svg>
        `;
    }

    /**
     * Crea el eje X del gráfico
     */
    createXAxis(dates, width, height, padding) {
        const ticks = dates.map((date, index) => {
            const x = padding.left + (index / (dates.length - 1 || 1)) * (width - padding.left - padding.right);
            const shortDate = this.formatShortDate(date);
            
            return `
                <line x1="${x}" y1="${height - padding.bottom}" x2="${x}" y2="${height - padding.bottom + 5}" stroke="#666"/>
                <text x="${x}" y="${height - padding.bottom + 20}" text-anchor="middle" font-size="10" fill="#666">
                    ${shortDate}
                </text>
            `;
        }).join('');
        
        return `<g class="x-axis">${ticks}</g>`;
    }

    /**
     * Crea el eje Y del gráfico
     */
    createYAxis(minValue, maxValue, width, height, padding) {
        const tickCount = 5;
        const ticks = [];
        
        for (let i = 0; i <= tickCount; i++) {
            const value = minValue + (maxValue - minValue) * (i / tickCount);
            const y = padding.top + (1 - i / tickCount) * (height - padding.top - padding.bottom);
            
            ticks.push(`
                <line x1="${padding.left - 5}" y1="${y}" x2="${padding.left}" y2="${y}" stroke="#666"/>
                <text x="${padding.left - 10}" y="${y + 3}" text-anchor="end" font-size="10" fill="#666">
                    ${value.toFixed(1)}
                </text>
            `);
        }
        
        return `<g class="y-axis">${ticks.join('')}</g>`;
    }

    /**
     * Obtiene el rango de fechas
     */
    getDateRange(data) {
        const dates = data.getSortedDates();
        return {
            startDate: dates[0] || null,
            endDate: dates[dates.length - 1] || null,
            totalDays: dates.length
        };
    }

    /**
     * Crea gráfico estilo Recharts con líneas suaves y puntos
     */
    createRechartsStyleLineChart(chartData, dates, customHeight = null) {
        const width = 500;
        const height = customHeight || 240;
        const padding = { top: 40, right: 40, bottom: 60, left: 80 };
        
        if (chartData.length === 0) {
            return `<div class="no-chart-data">No hay datos suficientes para mostrar el gráfico</div>`;
        }
        
        // Calcular rangos de datos
        const allValues = chartData.flatMap(series => 
            series.values.filter(v => v !== null && !isNaN(v))
        );
        
        if (allValues.length === 0) {
            return `<div class="no-chart-data">No hay valores válidos para graficar</div>`;
        }
        
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        const valueRange = maxValue - minValue || 1;
        const padding10 = valueRange * 0.1;
        const adjustedMin = minValue - padding10;
        const adjustedMax = maxValue + padding10;
        const adjustedRange = adjustedMax - adjustedMin;
        
        // Crear grid horizontal
        const horizontalGrid = this.createHorizontalGrid(width, height, padding, 5);
        
        // Crear ejes estilo Recharts
        const xAxis = this.createRechartsXAxis(dates, width, height, padding);
        const yAxis = this.createRechartsYAxis(adjustedMin, adjustedMax, width, height, padding);
        
        // Crear líneas con curvas suaves y puntos
        const lines = chartData.map((series, seriesIndex) => {
            const validPoints = series.values.map((value, index) => {
                if (value === null || isNaN(value)) return null;
                
                const x = padding.left + (index / (dates.length - 1 || 1)) * (width - padding.left - padding.right);
                const y = padding.top + (1 - (value - adjustedMin) / adjustedRange) * (height - padding.top - padding.bottom);
                
                return { x, y, value, index };
            }).filter(p => p !== null);
            
            if (validPoints.length === 0) return '';
            
            // Crear path suave
            const pathData = this.createSmoothPath(validPoints);
            
            // Crear puntos
            const dots = validPoints.map(point => `
                <circle 
                    cx="${point.x}" 
                    cy="${point.y}" 
                    r="4" 
                    fill="${series.color}" 
                    stroke="#ffffff" 
                    stroke-width="2"
                    class="chart-dot"
                    data-value="${point.value}"
                    data-date="${dates[point.index]}"
                    data-parameter="${series.name}"
                />
            `).join('');
            
            // Puntos activos (más grandes)
            const activeDots = validPoints.map(point => `
                <circle 
                    cx="${point.x}" 
                    cy="${point.y}" 
                    r="6" 
                    fill="${series.color}" 
                    opacity="0" 
                    class="chart-active-dot"
                    data-value="${point.value}"
                    data-date="${dates[point.index]}"
                    data-parameter="${series.name}"
                />
            `).join('');
            
            return `
                <g class="line-series" data-series="${seriesIndex}">
                    <path 
                        d="${pathData}" 
                        fill="none" 
                        stroke="${series.color}" 
                        stroke-width="2"
                        class="chart-line"
                    />
                    ${dots}
                    ${activeDots}
                </g>
            `;
        }).join('');
        
        // Tooltip invisible
        const tooltip = `
            <g class="chart-tooltip" style="opacity: 0;">
                <rect x="0" y="0" width="120" height="60" fill="#1f2937" stroke="#374151" rx="4"/>
                <text x="8" y="16" fill="#ffffff" font-size="11" class="tooltip-parameter"></text>
                <text x="8" y="32" fill="#ffffff" font-size="11" class="tooltip-value"></text>
                <text x="8" y="48" fill="#9ca3af" font-size="10" class="tooltip-date"></text>
            </g>
        `;
        
        return `
            <div class="recharts-wrapper">
                <svg width="${width}" height="${height}" class="recharts-surface">
                    <defs>
                        <clipPath id="chartClip">
                            <rect x="${padding.left}" y="${padding.top}" width="${width - padding.left - padding.right}" height="${height - padding.top - padding.bottom}"/>
                        </clipPath>
                    </defs>
                    
                    <!-- Grid -->
                    ${horizontalGrid}
                    
                    <!-- Ejes -->
                    ${yAxis}
                    ${xAxis}
                    
                    <!-- Líneas y puntos -->
                    <g clip-path="url(#chartClip)">
                        ${lines}
                    </g>
                    
                    <!-- Tooltip -->
                    ${tooltip}
                </svg>
                
                <!-- Leyenda -->
                <div class="recharts-legend">
                    ${this.createRechartsLegend(chartData)}
                </div>
            </div>
        `;
    }
    
    /**
     * Crea path suave para las líneas
     */
    createSmoothPath(points) {
        if (points.length === 0) return '';
        if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
        
        let path = `M ${points[0].x},${points[0].y}`;
        
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            
            // Usar curvas suaves (quadratic)
            if (i === 1) {
                path += ` Q ${(prev.x + curr.x) / 2},${prev.y} ${curr.x},${curr.y}`;
            } else {
                const prev2 = points[i - 2];
                const cp1x = prev.x + (curr.x - prev2.x) / 6;
                const cp1y = prev.y;
                const cp2x = curr.x - (points[Math.min(i + 1, points.length - 1)].x - prev.x) / 6;
                const cp2y = curr.y;
                
                path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
            }
        }
        
        return path;
    }
    
    /**
     * Crea grid horizontal estilo Recharts
     */
    createHorizontalGrid(width, height, padding, tickCount) {
        const lines = [];
        for (let i = 0; i <= tickCount; i++) {
            const y = padding.top + (i / tickCount) * (height - padding.top - padding.bottom);
            lines.push(`
                <line 
                    x1="${padding.left}" 
                    y1="${y}" 
                    x2="${width - padding.right}" 
                    y2="${y}" 
                    stroke="#374151" 
                    stroke-width="1"
                    opacity="0.3"
                />
            `);
        }
        return `<g class="recharts-cartesian-grid">${lines.join('')}</g>`;
    }
    
    /**
     * Crea eje X estilo Recharts
     */
    createRechartsXAxis(dates, width, height, padding) {
        const ticks = dates.map((date, index) => {
            const x = padding.left + (index / (dates.length - 1 || 1)) * (width - padding.left - padding.right);
            const shortDate = this.formatShortDate(date);
            
            return `
                <g class="recharts-cartesian-axis-tick">
                    <text 
                        x="${x}" 
                        y="${height - padding.bottom + 20}" 
                        text-anchor="middle" 
                        font-size="12" 
                        fill="#9ca3af"
                        class="recharts-text"
                    >
                        ${shortDate}
                    </text>
                </g>
            `;
        }).join('');
        
        return `
            <g class="recharts-cartesian-axis recharts-xAxis">
                <line 
                    x1="${padding.left}" 
                    y1="${height - padding.bottom}" 
                    x2="${width - padding.right}" 
                    y2="${height - padding.bottom}" 
                    stroke="#374151"
                    stroke-width="1"
                />
                ${ticks}
            </g>
        `;
    }
    
    /**
     * Crea eje Y estilo Recharts
     */
    createRechartsYAxis(minValue, maxValue, width, height, padding) {
        const tickCount = 5;
        const ticks = [];
        
        for (let i = 0; i <= tickCount; i++) {
            const value = minValue + (maxValue - minValue) * (i / tickCount);
            const y = padding.top + (1 - i / tickCount) * (height - padding.top - padding.bottom);
            
            ticks.push(`
                <g class="recharts-cartesian-axis-tick">
                    <text 
                        x="${padding.left - 15}" 
                        y="${y + 4}" 
                        text-anchor="end" 
                        font-size="12" 
                        fill="#9ca3af"
                        class="recharts-text"
                    >
                        ${value.toFixed(1)}
                    </text>
                </g>
            `);
        }
        
        return `
            <g class="recharts-cartesian-axis recharts-yAxis">
                ${ticks.join('')}
            </g>
        `;
    }
    
    /**
     * Crea leyenda estilo Recharts
     */
    createRechartsLegend(chartData) {
        return chartData.map(series => `
            <div class="recharts-legend-item">
                <span class="recharts-legend-icon" style="background-color: ${series.color};"></span>
                <span class="recharts-legend-text">${series.name}</span>
                ${series.unit ? `<span class="recharts-legend-unit">(${series.unit})</span>` : ''}
            </div>
        `).join('');
    }
    
    /**
     * Calcula información de tendencia
     */
    calculateTrendInfo(chartData) {
        if (chartData.length === 0) {
            return { message: 'Sin datos suficientes', type: 'neutral' };
        }
        
        let totalTrend = 0;
        let validSeries = 0;
        
        chartData.forEach(series => {
            const validValues = series.values.filter(v => v !== null && !isNaN(v));
            if (validValues.length >= 2) {
                const firstValue = validValues[0];
                const lastValue = validValues[validValues.length - 1];
                const change = ((lastValue - firstValue) / firstValue) * 100;
                totalTrend += change;
                validSeries++;
            }
        });
        
        if (validSeries === 0) {
            return { message: 'Sin tendencia clara', type: 'neutral' };
        }
        
        const avgTrend = totalTrend / validSeries;
        
        if (Math.abs(avgTrend) < 5) {
            return { message: 'Valores estables durante el período', type: 'stable' };
        } else if (avgTrend > 0) {
            return { message: `Tendencia al alza del ${avgTrend.toFixed(1)}% en promedio`, type: 'up' };
        } else {
            return { message: `Tendencia a la baja del ${Math.abs(avgTrend).toFixed(1)}% en promedio`, type: 'down' };
        }
    }
    
    /**
     * Formatea el rango de fechas
     */
    formatDateRange(dateRange) {
        if (!dateRange.startDate || !dateRange.endDate) {
            return 'Sin fechas disponibles';
        }
        
        if (dateRange.startDate === dateRange.endDate) {
            return dateRange.startDate;
        }
        
        return `${dateRange.startDate} - ${dateRange.endDate}`;
    }
    
    /**
     * Formatea fecha corta
     */
    formatShortDate(dateStr) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[0]}/${parts[1]}`;
        }
        return dateStr;
    }
}

// Exportar la clase
if (typeof window !== 'undefined') {
    window.DashboardComponents = DashboardComponents;
}

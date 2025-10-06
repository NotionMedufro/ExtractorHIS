// Configuración de la API
const NOTION_CONFIG = {
    // Por seguridad, la integración debe ser configurada vía proxy
    // En un entorno de producción, usar variables de entorno
    DATABASE_ID: '20492775-959a-817d-a944-d2bba620feb9',
    // La API key debe ser configurada en un servidor proxy por seguridad
    BASE_URL: 'https://api.notion.com/v1'
};

// Estado global de la aplicación
const appState = {
    data: [],
    filteredData: [],
    currentView: 'cards',
    filters: {
        search: '',
        ramo: 'all',
        categoria: 'all',
        hasDefinicion: false,
        hasClinica: false,
        hasManejo: false
    },
    modal: {
        isOpen: false,
        currentData: null,
        currentSection: 'definicion'
    }
};

// Utilidades
const Utils = {
    formatDate(dateString) {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    extractTextContent(richText) {
        if (!richText || !Array.isArray(richText)) return '';
        return richText
            .map(text => text.plain_text || text.text?.content || '')
            .join('')
            .trim();
    },

    extractMultiSelectNames(multiSelect) {
        if (!multiSelect || !Array.isArray(multiSelect)) return [];
        return multiSelect.map(item => item.name).filter(Boolean);
    },

    hasContent(richText) {
        const content = this.extractTextContent(richText);
        return content.length > 0;
    },

    searchInText(text, searchTerm) {
        if (!text || !searchTerm) return false;
        return text.toLowerCase().includes(searchTerm.toLowerCase());
    },

    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    sanitizeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Servicio de datos usando SyncManager
class DataService {
    constructor() {
        this.syncManager = window.syncManager;
    }

    // Usar SyncManager para obtener datos
    async fetchNotionData() {
        try {
            // Simular delay mínimo para mostrar loading
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const result = await this.syncManager.getData();
            console.log(`📊 Datos obtenidos: ${result.records.length} registros (fuente: ${result.source})`);
            
            return { results: result.records };
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    generateMockData() {
        // Datos de ejemplo basados en tu estructura de Notion
        return [
            {
                id: '1',
                properties: {
                    'Patología': { title: [{ plain_text: 'Influenza' }] },
                    'Definición': { rich_text: [{ plain_text: 'Enfermedad respiratoria viral contagiosa, causada por el virus Influenza.' }] },
                    'Epidemiología': { rich_text: [{ plain_text: 'Epidemia estacional en invierno. Mayor incidencia en niños y adultos mayores.' }] },
                    'Etiopatogenia': { rich_text: [{ plain_text: 'Virus Influenza A, B y C. Transmisión por gotas respiratorias.' }] },
                    'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'Fiebre, cefalea, mialgias, tos seca, odinofagia.' }] },
                    'Manejo': { rich_text: [{ plain_text: 'Oseltamivir si <48h de inicio. Sintomático: analgésicos, antitérmicos.' }] },
                    'Clasificación': { rich_text: [{ plain_text: 'Tipo A (H1N1, H3N2), Tipo B (Victoria, Yamagata), Tipo C.' }] },
                    'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                    '📖 Grupo por Reparto': { multi_select: [{ name: 'Infectología' }] }
                }
            },
            {
                id: '2',
                properties: {
                    'Patología': { title: [{ plain_text: 'Enfermedad por Hantavirus' }] },
                    'Definición': { rich_text: [{ plain_text: 'Zoonosis transmitida por roedores, causada por el virus hanta.' }] },
                    'Epidemiología': { rich_text: [{ plain_text: 'Endémica en Chile. Mayor incidencia en zonas rurales.' }] },
                    'Etiopatogenia': { rich_text: [{ plain_text: 'Hantavirus transmitido por ratón colilargo (Oligoryzomys longicaudatus).' }] },
                    'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'Síndrome febril, edema pulmonar no cardiogénico.' }] },
                    'Manejo': { rich_text: [{ plain_text: 'Soporte ventilatorio, manejo en UCI. No hay tratamiento específico.' }] },
                    'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                    '📖 Grupo por Reparto': { multi_select: [{ name: 'Infectología' }] }
                }
            },
            {
                id: '3',
                properties: {
                    'Patología': { title: [{ plain_text: 'Vasculitis' }] },
                    'Definición': { rich_text: [{ plain_text: 'Grupo heterogéneo de enfermedades que se caracterizan por la inflamación de los vasos sanguíneos.' }] },
                    'Clasificación': { rich_text: [{ plain_text: 'De Grandes Vasos: Vasculitis de células gigantes, Vasculitis de Takayasu. De Pequeños Vasos: ANCA asociadas.' }] },
                    'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                    '📖 Grupo por Reparto': { multi_select: [{ name: 'Reumatología' }] }
                }
            },
            {
                id: '4',
                properties: {
                    'Patología': { title: [{ plain_text: 'Artritis Reactiva' }] },
                    'Definición': { rich_text: [{ plain_text: 'Inflamación aséptica de la membrana sinovial, tendones y/o fascias de la articulación, desencadenada por una infección a distancia.' }] },
                    'Etiopatogenia': { rich_text: [{ plain_text: 'Respuesta inmune cruzada post-infección. Asociado a HLA-B27.' }] },
                    'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'Artritis oligoarticular asimétrica, principalmente en miembros inferiores.' }] },
                    'Manejo': { rich_text: [{ plain_text: 'AINEs, sulfasalazina en casos persistentes.' }] },
                    'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                    '📖 Grupo por Reparto': { multi_select: [{ name: 'Reumatología' }] }
                }
            },
            {
                id: '5',
                properties: {
                    'Patología': { title: [{ plain_text: 'Artritis Séptica' }] },
                    'Definición': { rich_text: [{ plain_text: 'Inflamación articular aguda o crónica causada por microorganismos que invaden la membrana sinovial.' }] },
                    'Etiopatogenia': { rich_text: [{ plain_text: 'Invasión directa o hematógena. S. aureus más frecuente.' }] },
                    'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'Dolor articular intenso, tumefacción, limitación funcional, fiebre.' }] },
                    'Estudio | Diagnóstico': { rich_text: [{ plain_text: 'Artrocentesis: >50.000 leucocitos, predominio PMN >90%.' }] },
                    'Manejo': { rich_text: [{ plain_text: 'Antibioticoterapia empírica inmediata, drenaje articular.' }] },
                    'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                    '📖 Grupo por Reparto': { multi_select: [{ name: 'Reumatología' }] }
                }
            },
            {
                id: '6',
                properties: {
                    'Patología': { title: [{ plain_text: 'Insuficiencia Cardíaca' }] },
                    'Definición': { rich_text: [{ plain_text: 'Síndrome clínico caracterizado por la incapacidad del corazón para bombear sangre de manera eficiente.' }] },
                    'Clasificación': { rich_text: [{ plain_text: 'NYHA I-IV. Con FE reducida (<40%), preservada (>50%), limítrofe (40-49%).' }] },
                    'Clínica | Manejo Inicial': { rich_text: [{ plain_text: 'Disnea, ortopnea, edema, fatiga. Galope S3.' }] },
                    'Estudio | Diagnóstico': { rich_text: [{ plain_text: 'Ecocardiografía, BNP/NT-proBNP, RxTx.' }] },
                    'Manejo': { rich_text: [{ plain_text: 'IECA/ARA II, beta-bloqueadores, diuréticos. Espironolactona.' }] },
                    'Ramo': { multi_select: [{ name: 'Medicina Interna' }] },
                    '📖 Grupo por Reparto': { multi_select: [{ name: 'Cardiología' }] }
                }
            }
        ];
    }

    transformNotionData(results) {
        return results.map(item => ({
            id: item.id,
            title: Utils.extractTextContent(item.properties['Patología']?.title || []),
            definicion: Utils.extractTextContent(item.properties['Definición']?.rich_text || []),
            epidemiologia: Utils.extractTextContent(item.properties['Epidemiología']?.rich_text || []),
            etiopatogenia: Utils.extractTextContent(item.properties['Etiopatogenia']?.rich_text || []),
            clinica: Utils.extractTextContent(item.properties['Clínica | Manejo Inicial']?.rich_text || []),
            clasificacion: Utils.extractTextContent(item.properties['Clasificación']?.rich_text || []),
            diagnostico: Utils.extractTextContent(item.properties['Estudio | Diagnóstico']?.rich_text || []),
            manejo: Utils.extractTextContent(item.properties['Manejo']?.rich_text || []),
            diferenciales: Utils.extractTextContent(item.properties['D. Diferenciales']?.rich_text || []),
            extra: Utils.extractTextContent(item.properties['Extra']?.rich_text || []),
            ramos: Utils.extractMultiSelectNames(item.properties['Ramo']?.multi_select || []),
            grupos: Utils.extractMultiSelectNames(item.properties['📖 Grupo por Reparto']?.multi_select || []),
            lastEdited: item.last_edited_time
        }));
    }
}

// Controlador de UI
class UIController {
    constructor() {
        this.dataService = new DataService();
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.elements = {
            loading: document.getElementById('loading'),
            errorState: document.getElementById('errorState'),
            searchInput: document.getElementById('searchInput'),
            searchClear: document.getElementById('searchClear'),
            filterToggle: document.getElementById('filterToggle'),
            filtersPanel: document.getElementById('filtersPanel'),
            cardsGrid: document.getElementById('cardsGrid'),
            listContainer: document.getElementById('listContainer'),
            noResults: document.getElementById('noResults'),
            resultsInfo: document.getElementById('resultsInfo'),
            totalPatologias: document.getElementById('totalPatologias'),
            lastUpdate: document.getElementById('lastUpdate'),
            syncBtn: document.getElementById('syncBtn'),
            modalOverlay: document.getElementById('modalOverlay'),
            modal: document.getElementById('detailModal'),
            modalTitle: document.getElementById('modalTitle'),
            modalClose: document.getElementById('modalClose'),
            modalBody: document.getElementById('modalBody'),
            visibleCount: document.getElementById('visibleCount'),
            totalCount: document.getElementById('totalCount')
        };
    }

    bindEvents() {
        // Búsqueda
        const debouncedSearch = Utils.debounce((e) => this.handleSearch(e), 300);
        this.elements.searchInput.addEventListener('input', debouncedSearch);
        this.elements.searchClear.addEventListener('click', () => this.clearSearch());

        // Filtros
        this.elements.filterToggle.addEventListener('click', () => this.toggleFilters());

        // Modal
        this.elements.modalClose.addEventListener('click', () => this.closeModal());
        this.elements.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.modalOverlay) {
                this.closeModal();
            }
        });

        // Teclas
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && appState.modal.isOpen) {
                this.closeModal();
            }
        });

        // Botones de vista
        document.getElementById('cardsView')?.addEventListener('click', () => this.switchView('cards'));
        document.getElementById('listView')?.addEventListener('click', () => this.switchView('list'));

        // Botones de filtros
        document.getElementById('clearFilters')?.addEventListener('click', () => this.clearAllFilters());
        document.getElementById('applyFilters')?.addEventListener('click', () => this.applyFilters());
        document.getElementById('clearSearch')?.addEventListener('click', () => this.clearSearch());
        document.getElementById('retryLoad')?.addEventListener('click', () => this.loadData());
        
        // Botón de sincronización
        this.elements.syncBtn?.addEventListener('click', () => this.forceSyncData());
    }

    async loadData() {
        try {
            console.log('Iniciando carga de datos...');
            this.showLoading();
            
            const response = await this.dataService.fetchNotionData();
            console.log('Datos recibidos:', response);
            
            // Los datos ya vienen transformados desde SyncManager
            appState.data = response.results;
            console.log('Datos cargados:', appState.data);
            
            appState.filteredData = [...appState.data];
            
            this.updateStats();
            this.renderCards();
            this.populateFilters();
            this.hideLoading();
            
            console.log('Carga completada exitosamente');
            
        } catch (error) {
            console.error('Error en loadData:', error);
            this.showError('Error al cargar los datos: ' + error.message);
        }
    }

    showLoading() {
        this.elements.loading.style.display = 'flex';
        this.elements.errorState.style.display = 'none';
        this.elements.cardsGrid.style.display = 'none';
        this.elements.noResults.style.display = 'none';
    }

    hideLoading() {
        this.elements.loading.style.display = 'none';
        this.elements.cardsGrid.style.display = 'grid';
        this.elements.resultsInfo.style.display = 'flex';
    }

    showError(message) {
        this.elements.loading.style.display = 'none';
        this.elements.errorState.style.display = 'flex';
        this.elements.cardsGrid.style.display = 'none';
        document.getElementById('errorMessage').textContent = message;
    }

    updateStats() {
        this.elements.totalPatologias.textContent = appState.data.length;
        
        if (appState.data.length > 0) {
            const lastEdit = appState.data
                .map(item => new Date(item.lastEdited))
                .sort((a, b) => b - a)[0];
            this.elements.lastUpdate.textContent = Utils.formatDate(lastEdit);
        }
    }

    populateFilters() {
        const ramos = [...new Set(appState.data.flatMap(item => item.ramos))].filter(Boolean).sort();
        const grupos = [...new Set(appState.data.flatMap(item => item.grupos))].filter(Boolean).sort();

        // Filtros de ramos
        const ramoContainer = document.getElementById('ramoFilters');
        ramoContainer.innerHTML = '<button class="filter-btn active" data-filter="all">Todos</button>';
        ramos.forEach(ramo => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-filter', ramo);
            btn.textContent = ramo;
            btn.addEventListener('click', () => this.handleRamoFilter(ramo));
            ramoContainer.appendChild(btn);
        });

        // Filtros de categorías
        const categoryContainer = document.getElementById('categoryFilters');
        categoryContainer.innerHTML = '<button class="filter-btn active" data-filter="all">Todas</button>';
        grupos.forEach(grupo => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-filter', grupo);
            btn.textContent = grupo;
            btn.addEventListener('click', () => this.handleCategoryFilter(grupo));
            categoryContainer.appendChild(btn);
        });

        // Evento para botones "Todos"
        ramoContainer.querySelector('[data-filter="all"]').addEventListener('click', () => this.handleRamoFilter('all'));
        categoryContainer.querySelector('[data-filter="all"]').addEventListener('click', () => this.handleCategoryFilter('all'));
    }

    renderCards() {
        const container = this.elements.cardsGrid;
        
        if (appState.filteredData.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();
        
        container.innerHTML = appState.filteredData.map(item => this.createCardHTML(item)).join('');
        
        // Bind click events
        container.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = card.getAttribute('data-id');
                const data = appState.data.find(item => item.id === id);
                this.openModal(data);
            });
        });

        this.updateResultsCount();
    }

    createCardHTML(item) {
        const ramos = item.ramos.map(ramo => `<span class="badge badge-ramo">${ramo}</span>`).join('');
        const grupos = item.grupos.map(grupo => `<span class="badge badge-grupo">${grupo}</span>`).join('');
        
        const sections = [
            { key: 'definicion', icon: 'book', has: item.definicion },
            { key: 'epidemiologia', icon: 'chart-bar', has: item.epidemiologia },
            { key: 'etiopatogenia', icon: 'dna', has: item.etiopatogenia },
            { key: 'clinica', icon: 'user-md', has: item.clinica },
            { key: 'clasificacion', icon: 'sitemap', has: item.clasificacion },
            { key: 'diagnostico', icon: 'microscope', has: item.diagnostico },
            { key: 'manejo', icon: 'pills', has: item.manejo },
            { key: 'diferenciales', icon: 'balance-scale', has: item.diferenciales }
        ];

        const sectionIndicators = sections.map(section => 
            `<span class="section-indicator ${section.has ? 'has-content' : ''}">
                <i class="fas fa-${section.icon}"></i>
            </span>`
        ).join('');

        return `
            <div class="card" data-id="${item.id}">
                <div class="card-header">
                    <h3 class="card-title">${Utils.sanitizeHtml(item.title)}</h3>
                    <div class="card-badges">
                        ${ramos}
                        ${grupos}
                    </div>
                </div>
                <div class="card-content">
                    <p class="card-definition">${Utils.sanitizeHtml(item.definicion || 'Sin definición disponible')}</p>
                    <div class="card-sections">
                        ${sectionIndicators}
                    </div>
                </div>
            </div>
        `;
    }

    openModal(data) {
        appState.modal.isOpen = true;
        appState.modal.currentData = data;
        
        this.elements.modalTitle.textContent = data.title;
        this.renderModalContent(data);
        this.elements.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        appState.modal.isOpen = false;
        this.elements.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    renderModalContent(data) {
        const sections = [
            { key: 'definicion', title: 'Definición', icon: 'book', content: data.definicion },
            { key: 'epidemiologia', title: 'Epidemiología', icon: 'chart-bar', content: data.epidemiologia },
            { key: 'etiopatogenia', title: 'Etiopatogenia', icon: 'dna', content: data.etiopatogenia },
            { key: 'clinica', title: 'Clínica', icon: 'user-md', content: data.clinica },
            { key: 'clasificacion', title: 'Clasificación', icon: 'sitemap', content: data.clasificacion },
            { key: 'diagnostico', title: 'Diagnóstico', icon: 'microscope', content: data.diagnostico },
            { key: 'manejo', title: 'Manejo', icon: 'pills', content: data.manejo },
            { key: 'diferenciales', title: 'Diagnósticos Diferenciales', icon: 'balance-scale', content: data.diferenciales }
        ];

        const navButtons = sections.map(section => 
            `<button class="nav-btn ${section.key === 'definicion' ? 'active' : ''}" data-section="${section.key}">
                <i class="fas fa-${section.icon}"></i>
                ${section.title}
            </button>`
        ).join('');

        const contentSections = sections.map(section => 
            `<div class="content-section ${section.key === 'definicion' ? 'active' : ''}" data-section="${section.key}">
                <h3><i class="fas fa-${section.icon}"></i> ${section.title}</h3>
                <p>${section.content || 'No hay información disponible para esta sección.'}</p>
            </div>`
        ).join('');

        this.elements.modalBody.innerHTML = `
            <div class="modal-navigation">
                ${navButtons}
            </div>
            <div class="modal-content-sections">
                ${contentSections}
            </div>
        `;

        // Bind navigation events
        this.elements.modalBody.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.switchModalSection(section);
            });
        });
    }

    switchModalSection(section) {
        // Update navigation
        this.elements.modalBody.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-section') === section);
        });

        // Update content
        this.elements.modalBody.querySelectorAll('.content-section').forEach(content => {
            content.classList.toggle('active', content.getAttribute('data-section') === section);
        });
    }

    handleSearch(e) {
        appState.filters.search = e.target.value;
        this.applyFiltersToData();
        this.toggleSearchClear(e.target.value);
    }

    toggleSearchClear(value) {
        this.elements.searchClear.style.display = value ? 'block' : 'none';
    }

    clearSearch() {
        this.elements.searchInput.value = '';
        appState.filters.search = '';
        this.toggleSearchClear('');
        this.applyFiltersToData();
    }

    toggleFilters() {
        this.elements.filtersPanel.classList.toggle('active');
    }

    handleRamoFilter(ramo) {
        appState.filters.ramo = ramo;
        this.updateFilterButtons('ramoFilters', ramo);
    }

    handleCategoryFilter(categoria) {
        appState.filters.categoria = categoria;
        this.updateFilterButtons('categoryFilters', categoria);
    }

    updateFilterButtons(containerId, activeFilter) {
        const container = document.getElementById(containerId);
        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === activeFilter);
        });
    }

    clearAllFilters() {
        appState.filters = {
            search: '',
            ramo: 'all',
            categoria: 'all',
            hasDefinicion: false,
            hasClinica: false,
            hasManejo: false
        };
        
        this.elements.searchInput.value = '';
        this.toggleSearchClear('');
        
        document.getElementById('ramoFilters').querySelector('[data-filter="all"]').classList.add('active');
        document.getElementById('categoryFilters').querySelector('[data-filter="all"]').classList.add('active');
        
        document.getElementById('hasDefinicion').checked = false;
        document.getElementById('hasClinica').checked = false;
        document.getElementById('hasManejo').checked = false;
        
        this.applyFiltersToData();
    }

    applyFilters() {
        // Get checkbox states
        appState.filters.hasDefinicion = document.getElementById('hasDefinicion').checked;
        appState.filters.hasClinica = document.getElementById('hasClinica').checked;
        appState.filters.hasManejo = document.getElementById('hasManejo').checked;
        
        this.applyFiltersToData();
        this.toggleFilters(); // Close filter panel
    }

    applyFiltersToData() {
        appState.filteredData = appState.data.filter(item => {
            // Search filter
            if (appState.filters.search) {
                const searchTerm = appState.filters.search.toLowerCase();
                const searchableText = [
                    item.title,
                    item.definicion,
                    item.clinica,
                    item.manejo,
                    ...item.ramos,
                    ...item.grupos
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchTerm)) return false;
            }

            // Ramo filter
            if (appState.filters.ramo !== 'all') {
                if (!item.ramos.includes(appState.filters.ramo)) return false;
            }

            // Category filter
            if (appState.filters.categoria !== 'all') {
                if (!item.grupos.includes(appState.filters.categoria)) return false;
            }

            // Content filters
            if (appState.filters.hasDefinicion && !item.definicion) return false;
            if (appState.filters.hasClinica && !item.clinica) return false;
            if (appState.filters.hasManejo && !item.manejo) return false;

            return true;
        });

        this.renderCards();
    }

    switchView(view) {
        appState.currentView = view;
        
        document.getElementById('cardsView').classList.toggle('active', view === 'cards');
        document.getElementById('listView').classList.toggle('active', view === 'list');
        
        if (view === 'cards') {
            this.elements.cardsGrid.style.display = 'grid';
            this.elements.listContainer.style.display = 'none';
        } else {
            this.elements.cardsGrid.style.display = 'none';
            this.elements.listContainer.style.display = 'block';
            this.renderListView();
        }
    }

    renderListView() {
        // Implementation for list view would go here
        // For now, just show a message
        this.elements.listContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p>Vista de lista - En desarrollo</p>
            </div>
        `;
    }

    showNoResults() {
        this.elements.noResults.style.display = 'flex';
        this.elements.cardsGrid.style.display = 'none';
        this.elements.resultsInfo.style.display = 'none';
    }

    hideNoResults() {
        this.elements.noResults.style.display = 'none';
        this.elements.cardsGrid.style.display = 'grid';
        this.elements.resultsInfo.style.display = 'flex';
    }

    updateResultsCount() {
        this.elements.visibleCount.textContent = appState.filteredData.length;
        this.elements.totalCount.textContent = appState.data.length;
    }
    
    async forceSyncData() {
        try {
            console.log('🔄 Forzando sincronización manual...');
            
            // Mostrar estado de sincronización
            this.setSyncButtonState(true);
            
            // Forzar sincronización
            const result = await this.dataService.syncManager.forceSync();
            
            // Actualizar datos en la aplicación
            appState.data = result.records;
            appState.filteredData = [...appState.data];
            
            // Actualizar UI
            this.updateStats();
            this.renderCards();
            this.populateFilters();
            
            console.log('✅ Sincronización manual completada');
            this.showSyncSuccessMessage();
            
        } catch (error) {
            console.error('❌ Error en sincronización manual:', error);
            this.showSyncErrorMessage(error.message);
        } finally {
            this.setSyncButtonState(false);
        }
    }
    
    setSyncButtonState(syncing) {
        if (!this.elements.syncBtn) return;
        
        if (syncing) {
            this.elements.syncBtn.classList.add('syncing');
            this.elements.syncBtn.querySelector('span').textContent = 'Sincronizando...';
        } else {
            this.elements.syncBtn.classList.remove('syncing');
            this.elements.syncBtn.querySelector('span').textContent = 'Sincronizar';
        }
    }
    
    showSyncSuccessMessage() {
        // Mostrar mensaje temporal de éxito
        this.showTemporaryMessage('✅ Base de datos sincronizada', 'success');
    }
    
    showSyncErrorMessage(message) {
        // Mostrar mensaje temporal de error
        this.showTemporaryMessage(`❌ Error: ${message}`, 'error');
    }
    
    showTemporaryMessage(message, type = 'info') {
        // Crear elemento de notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#2563eb'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    const app = new UIController();
    app.loadData();
    
    // Configurar service worker para cache (opcional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(console.error);
    }
});

// Exportar para debugging
window.appState = appState;

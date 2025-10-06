/**
 * Sistema de Sincronización Inteligente para Resúmenes Clínicos
 * 
 * Características:
 * - Base de datos local persistente
 * - Sincronización incremental (solo registros modificados)
 * - Funcionamiento offline
 * - Detección automática de cambios por fecha
 */

class SyncManager {
    constructor() {
        this.DATABASE_PATH = './data/resumenes-database.json';
        this.localDatabase = null;
        this.notionAPI = new NotionAPIService();
        this.isOnline = navigator.onLine;
        
        // Detectar cambios de conectividad
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Conexión restaurada');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📴 Modo offline');
        });
    }

    /**
     * Carga la base de datos local
     */
    async loadLocalDatabase() {
        try {
            const response = await fetch(this.DATABASE_PATH);
            if (!response.ok) {
                throw new Error(`Error al cargar base de datos local: ${response.status}`);
            }
            
            this.localDatabase = await response.json();
            console.log(`📚 Base de datos local cargada: ${this.localDatabase.records.length} registros`);
            
            return this.localDatabase;
        } catch (error) {
            console.error('❌ Error cargando base de datos local:', error);
            
            // Crear base de datos vacía si no existe
            this.localDatabase = {
                metadata: {
                    lastSync: null,
                    version: '1.0.0',
                    totalRecords: 0
                },
                records: []
            };
            
            return this.localDatabase;
        }
    }

    /**
     * Obtiene todos los datos (local + sincronización si es necesaria)
     */
    async getData(forceSync = false) {
        // Cargar base de datos local primero
        await this.loadLocalDatabase();

        // Si estamos offline, usar solo datos locales
        if (!this.isOnline) {
            console.log('📴 Modo offline: usando datos locales');
            return {
                records: this.localDatabase.records,
                source: 'local',
                lastSync: this.localDatabase.metadata.lastSync
            };
        }

        // Verificar si necesitamos sincronizar
        const needsSync = this.shouldSync() || forceSync;
        
        if (needsSync) {
            console.log('🔄 Iniciando sincronización...');
            await this.syncWithNotion();
        } else {
            console.log('✅ Base de datos está actualizada');
        }

        return {
            records: this.localDatabase.records,
            source: needsSync ? 'synced' : 'local',
            lastSync: this.localDatabase.metadata.lastSync
        };
    }

    /**
     * Determina si es necesario sincronizar
     */
    shouldSync() {
        if (!this.localDatabase) return true;
        if (!this.localDatabase.metadata.lastSync) return true;
        
        const lastSync = new Date(this.localDatabase.metadata.lastSync);
        const now = new Date();
        const hoursElapsed = (now - lastSync) / (1000 * 60 * 60);
        
        // Sincronizar si han pasado más de 6 horas
        return hoursElapsed > 6;
    }

    /**
     * Sincronización inteligente con Notion
     * Solo actualiza registros que han cambiado
     */
    async syncWithNotion() {
        try {
            console.log('🔍 Consultando cambios en Notion...');
            
            // Obtener todos los registros de Notion
            const notionData = await this.notionAPI.fetchAllRecords();
            const notionRecords = transformNotionData(notionData.results);
            
            console.log(`📥 Recibidos ${notionRecords.length} registros de Notion`);

            // Crear mapa de registros locales por ID
            const localRecordsMap = new Map();
            this.localDatabase.records.forEach(record => {
                localRecordsMap.set(record.id, record);
            });

            let updatedCount = 0;
            let newCount = 0;
            const updatedRecords = [];

            // Procesar cada registro de Notion
            for (const notionRecord of notionRecords) {
                const localRecord = localRecordsMap.get(notionRecord.id);
                
                if (!localRecord) {
                    // Registro nuevo
                    console.log(`➕ Nuevo registro: ${notionRecord.title}`);
                    updatedRecords.push(notionRecord);
                    newCount++;
                } else {
                    // Comparar fechas de última edición
                    const notionDate = new Date(notionRecord.lastEdited);
                    const localDate = new Date(localRecord.lastEdited);
                    
                    if (notionDate > localDate) {
                        // Registro actualizado
                        console.log(`🔄 Actualizado: ${notionRecord.title}`);
                        updatedRecords.push(notionRecord);
                        updatedCount++;
                    } else {
                        // Registro sin cambios, mantener el local
                        updatedRecords.push(localRecord);
                    }
                }
                
                // Remover del mapa para identificar registros eliminados
                localRecordsMap.delete(notionRecord.id);
            }

            // Registros eliminados (quedaron en el mapa local)
            const deletedCount = localRecordsMap.size;
            if (deletedCount > 0) {
                console.log(`🗑️ ${deletedCount} registros eliminados en Notion`);
            }

            // Actualizar base de datos local
            this.localDatabase = {
                metadata: {
                    lastSync: new Date().toISOString(),
                    version: this.localDatabase.metadata.version,
                    totalRecords: updatedRecords.length
                },
                records: updatedRecords
            };

            // Guardar en localStorage como backup
            this.saveToLocalStorage();

            console.log(`✅ Sincronización completada:`);
            console.log(`   📊 Total de registros: ${updatedRecords.length}`);
            console.log(`   ➕ Nuevos: ${newCount}`);
            console.log(`   🔄 Actualizados: ${updatedCount}`);
            console.log(`   🗑️ Eliminados: ${deletedCount}`);

            return true;

        } catch (error) {
            console.error('❌ Error en sincronización:', error);
            
            // En caso de error, usar datos locales si existen
            if (this.localDatabase.records.length > 0) {
                console.log('⚠️ Usando datos locales debido a error en sincronización');
                return false;
            } else {
                throw error;
            }
        }
    }

    /**
     * Guarda una copia en localStorage como backup
     */
    saveToLocalStorage() {
        try {
            const compressed = {
                ...this.localDatabase,
                records: this.localDatabase.records.map(record => ({
                    ...record,
                    // Comprimir campos vacíos para ahorrar espacio
                    definicion: record.definicion || undefined,
                    epidemiologia: record.epidemiologia || undefined,
                    etiopatogenia: record.etiopatogenia || undefined,
                    clinica: record.clinica || undefined,
                    clasificacion: record.clasificacion || undefined,
                    diagnostico: record.diagnostico || undefined,
                    manejo: record.manejo || undefined,
                    diferenciales: record.diferenciales || undefined,
                    extra: record.extra || undefined
                }))
            };

            localStorage.setItem('resumenes_database', JSON.stringify(compressed));
            console.log('💾 Backup guardado en localStorage');
        } catch (error) {
            console.warn('⚠️ Error guardando backup en localStorage:', error);
        }
    }

    /**
     * Carga desde localStorage como fallback
     */
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('resumenes_database');
            if (stored) {
                const parsed = JSON.parse(stored);
                console.log('🔄 Datos cargados desde localStorage backup');
                return parsed;
            }
        } catch (error) {
            console.warn('⚠️ Error cargando desde localStorage:', error);
        }
        return null;
    }

    /**
     * Fuerza una sincronización completa
     */
    async forceSync() {
        console.log('🔄 Forzando sincronización completa...');
        return await this.getData(true);
    }

    /**
     * Obtiene estadísticas de la base de datos
     */
    getStats() {
        if (!this.localDatabase) return null;

        const records = this.localDatabase.records;
        const ramos = [...new Set(records.flatMap(r => r.ramos))].filter(Boolean);
        const grupos = [...new Set(records.flatMap(r => r.grupos))].filter(Boolean);
        
        return {
            totalRecords: records.length,
            lastSync: this.localDatabase.metadata.lastSync,
            ramos: ramos.length,
            grupos: grupos.length,
            withDefinition: records.filter(r => r.definicion).length,
            withClinica: records.filter(r => r.clinica).length,
            withManejo: records.filter(r => r.manejo).length,
            isOnline: this.isOnline
        };
    }

    /**
     * Busca un registro por ID
     */
    getRecordById(id) {
        if (!this.localDatabase) return null;
        return this.localDatabase.records.find(record => record.id === id);
    }

    /**
     * Obtiene registros filtrados
     */
    getFilteredRecords(filters = {}) {
        if (!this.localDatabase) return [];

        return this.localDatabase.records.filter(record => {
            // Filtro de búsqueda
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const searchableText = [
                    record.title,
                    record.definicion,
                    record.clinica,
                    record.manejo,
                    ...record.ramos,
                    ...record.grupos
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchTerm)) return false;
            }

            // Filtro por ramo
            if (filters.ramo && filters.ramo !== 'all') {
                if (!record.ramos.includes(filters.ramo)) return false;
            }

            // Filtro por categoría
            if (filters.categoria && filters.categoria !== 'all') {
                if (!record.grupos.includes(filters.categoria)) return false;
            }

            // Filtros de contenido
            if (filters.hasDefinicion && !record.definicion) return false;
            if (filters.hasClinica && !record.clinica) return false;
            if (filters.hasManejo && !record.manejo) return false;

            return true;
        });
    }
}

// Inicializar singleton
window.syncManager = new SyncManager();

// Exportar para Node.js si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyncManager;
}

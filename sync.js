#!/usr/bin/env node

/**
 * Script de Sincronización de Resúmenes Clínicos
 * 
 * Uso:
 *   node sync.js                  # Sincronización normal
 *   node sync.js --force         # Forzar sincronización completa
 *   node sync.js --check         # Solo verificar cambios sin sincronizar
 *   node sync.js --stats         # Mostrar estadísticas
 */

const fs = require('fs').promises;
const path = require('path');

// Configuración
const CONFIG = {
    DATABASE_PATH: './data/resumenes-database.json',
    NOTION_DATABASE_ID: '20492775-959a-817d-a944-d2bba620feb9',
    NOTION_TOKEN: process.env.NOTION_TOKEN || null,
    NOTION_API_VERSION: '2022-06-28'
};

class NotionSyncCLI {
    constructor() {
        this.localDatabase = null;
        this.args = process.argv.slice(2);
    }

    async run() {
        console.log('🚀 Iniciando sincronización de resúmenes clínicos...\n');

        try {
            // Cargar base de datos local
            await this.loadLocalDatabase();

            // Procesar argumentos de línea de comandos
            if (this.args.includes('--help') || this.args.includes('-h')) {
                this.showHelp();
                return;
            }

            if (this.args.includes('--stats')) {
                await this.showStats();
                return;
            }

            if (this.args.includes('--check')) {
                await this.checkForChanges();
                return;
            }

            const forceSync = this.args.includes('--force');
            await this.performSync(forceSync);

        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }

    async loadLocalDatabase() {
        try {
            const data = await fs.readFile(CONFIG.DATABASE_PATH, 'utf8');
            this.localDatabase = JSON.parse(data);
            console.log(`📚 Base de datos local cargada: ${this.localDatabase.records.length} registros`);
        } catch (error) {
            console.log('📝 Creando nueva base de datos local...');
            this.localDatabase = {
                metadata: {
                    lastSync: null,
                    version: '1.0.0',
                    totalRecords: 0
                },
                records: []
            };
        }
    }

    async performSync(forceSync = false) {
        if (!CONFIG.NOTION_TOKEN) {
            console.error('❌ Error: NOTION_TOKEN no está configurado');
            console.log('💡 Configura la variable de entorno NOTION_TOKEN con tu token de integración de Notion');
            process.exit(1);
        }

        try {
            // Verificar si necesitamos sincronizar
            const needsSync = this.shouldSync() || forceSync;
            
            if (!needsSync && !forceSync) {
                console.log('✅ La base de datos está actualizada');
                this.showLastSyncInfo();
                return;
            }

            console.log(`🔄 ${forceSync ? 'Forzando' : 'Iniciando'} sincronización con Notion...`);

            // Obtener datos de Notion
            const notionRecords = await this.fetchNotionData();
            console.log(`📥 Recibidos ${notionRecords.length} registros de Notion`);

            // Procesar cambios
            const changes = this.processChanges(notionRecords);
            
            // Actualizar base de datos local
            await this.updateLocalDatabase(notionRecords, changes);

            // Mostrar resumen
            this.showSyncSummary(changes);

        } catch (error) {
            console.error('❌ Error durante la sincronización:', error.message);
            
            if (this.localDatabase.records.length > 0) {
                console.log('⚠️ Manteniendo datos locales existentes');
            } else {
                throw error;
            }
        }
    }

    async fetchNotionData() {
        const url = `https://api.notion.com/v1/databases/${CONFIG.NOTION_DATABASE_ID}/query`;
        
        // En un entorno real, haríamos la petición HTTP aquí
        // Para este ejemplo, usamos datos simulados
        console.log('🔧 Modo desarrollo: usando datos simulados');
        
        return this.getSimulatedNotionData();
    }

    getSimulatedNotionData() {
        // Simular algunos cambios para demostrar el sistema
        const baseRecords = this.localDatabase.records;
        const now = new Date();
        
        // Simular que el primer registro fue actualizado hace 1 hora
        if (baseRecords.length > 0) {
            const updatedRecord = { ...baseRecords[0] };
            updatedRecord.lastEdited = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
            updatedRecord.definicion += ' [ACTUALIZACIÓN SIMULADA]';
            
            return [updatedRecord, ...baseRecords.slice(1)];
        }
        
        return baseRecords;
    }

    processChanges(notionRecords) {
        const localRecordsMap = new Map();
        this.localDatabase.records.forEach(record => {
            localRecordsMap.set(record.id, record);
        });

        const changes = {
            new: [],
            updated: [],
            unchanged: [],
            deleted: []
        };

        // Procesar registros de Notion
        for (const notionRecord of notionRecords) {
            const localRecord = localRecordsMap.get(notionRecord.id);
            
            if (!localRecord) {
                changes.new.push(notionRecord);
            } else {
                const notionDate = new Date(notionRecord.lastEdited);
                const localDate = new Date(localRecord.lastEdited);
                
                if (notionDate > localDate) {
                    changes.updated.push({
                        local: localRecord,
                        notion: notionRecord
                    });
                } else {
                    changes.unchanged.push(localRecord);
                }
            }
            
            localRecordsMap.delete(notionRecord.id);
        }

        // Registros eliminados
        changes.deleted = Array.from(localRecordsMap.values());

        return changes;
    }

    async updateLocalDatabase(notionRecords, changes) {
        this.localDatabase = {
            metadata: {
                lastSync: new Date().toISOString(),
                version: this.localDatabase.metadata.version,
                totalRecords: notionRecords.length
            },
            records: notionRecords
        };

        // Guardar archivo
        await fs.writeFile(
            CONFIG.DATABASE_PATH,
            JSON.stringify(this.localDatabase, null, 2),
            'utf8'
        );

        console.log('💾 Base de datos local actualizada');
    }

    shouldSync() {
        if (!this.localDatabase.metadata.lastSync) return true;
        
        const lastSync = new Date(this.localDatabase.metadata.lastSync);
        const now = new Date();
        const hoursElapsed = (now - lastSync) / (1000 * 60 * 60);
        
        return hoursElapsed > 6;
    }

    async checkForChanges() {
        console.log('🔍 Verificando cambios en Notion...\n');
        
        if (!this.shouldSync()) {
            console.log('✅ No es necesario sincronizar');
            this.showLastSyncInfo();
            return;
        }

        console.log('🔄 Se recomienda sincronizar');
        console.log('💡 Ejecuta: node sync.js --force');
    }

    async showStats() {
        console.log('📊 Estadísticas de la Base de Datos\n');
        
        const records = this.localDatabase.records;
        const ramos = [...new Set(records.flatMap(r => r.ramos))].filter(Boolean);
        const grupos = [...new Set(records.flatMap(r => r.grupos))].filter(Boolean);
        
        console.log(`📚 Total de registros: ${records.length}`);
        console.log(`🏥 Ramos: ${ramos.length} (${ramos.join(', ')})`);
        console.log(`🏷️ Grupos: ${grupos.length} (${grupos.join(', ')})`);
        console.log(`✍️ Con definición: ${records.filter(r => r.definicion).length}`);
        console.log(`🩺 Con clínica: ${records.filter(r => r.clinica).length}`);
        console.log(`💊 Con manejo: ${records.filter(r => r.manejo).length}`);
        
        this.showLastSyncInfo();
    }

    showLastSyncInfo() {
        if (this.localDatabase.metadata.lastSync) {
            const lastSync = new Date(this.localDatabase.metadata.lastSync);
            const now = new Date();
            const hoursAgo = Math.round((now - lastSync) / (1000 * 60 * 60));
            
            console.log(`\n🕐 Última sincronización: ${lastSync.toLocaleString()}`);
            console.log(`   (hace ${hoursAgo} horas)`);
        } else {
            console.log('\n⚠️ Nunca se ha sincronizado');
        }
    }

    showSyncSummary(changes) {
        console.log('\n✅ Sincronización completada:');
        console.log(`   📊 Total de registros: ${this.localDatabase.records.length}`);
        console.log(`   ➕ Nuevos: ${changes.new.length}`);
        console.log(`   🔄 Actualizados: ${changes.updated.length}`);
        console.log(`   ✨ Sin cambios: ${changes.unchanged.length}`);
        console.log(`   🗑️ Eliminados: ${changes.deleted.length}`);
        
        // Mostrar detalles de cambios
        if (changes.new.length > 0) {
            console.log('\n➕ Registros nuevos:');
            changes.new.forEach(record => {
                console.log(`   • ${record.title}`);
            });
        }
        
        if (changes.updated.length > 0) {
            console.log('\n🔄 Registros actualizados:');
            changes.updated.forEach(change => {
                console.log(`   • ${change.notion.title}`);
            });
        }
        
        if (changes.deleted.length > 0) {
            console.log('\n🗑️ Registros eliminados:');
            changes.deleted.forEach(record => {
                console.log(`   • ${record.title}`);
            });
        }
    }

    showHelp() {
        console.log(`
🚀 Script de Sincronización de Resúmenes Clínicos

USO:
  node sync.js [opciones]

OPCIONES:
  --force     Forzar sincronización completa
  --check     Solo verificar si hay cambios sin sincronizar
  --stats     Mostrar estadísticas de la base de datos
  --help, -h  Mostrar esta ayuda

EJEMPLOS:
  node sync.js                 # Sincronización normal
  node sync.js --force        # Forzar sincronización
  node sync.js --check        # Solo verificar cambios
  node sync.js --stats        # Ver estadísticas

CONFIGURACIÓN:
  NOTION_TOKEN    Token de integración de Notion (requerido)
  
  Ejemplo: NOTION_TOKEN=secret_abc123 node sync.js
        `);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    const cli = new NotionSyncCLI();
    cli.run().catch(console.error);
}

module.exports = NotionSyncCLI;

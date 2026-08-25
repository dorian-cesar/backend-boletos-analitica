require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const sequelize = require('../config/db');
const TicketEvent = require('../models/TicketEvent');

async function matchTickets() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conectado a MySQL...');

    // Leer el archivo CSV
    const csvPath = path.join(__dirname, '..', 'Liquidacion 01-07 al 11-07 .csv');
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

    const pasajesCSV = [];

    // Omitir cabecera (línea 0) y fila TOTAL
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',');
      const pasaje = columns[0] ? columns[0].trim() : '';

      if (pasaje && pasaje.toUpperCase() !== 'TOTAL' && !isNaN(pasaje)) {
        pasajesCSV.push({
          linea: i + 1,
          pasaje: pasaje,
          rawLine: lines[i]
        });
      }
    }

    console.log(`\n📋 Se encontraron ${pasajesCSV.length} números de pasaje en el CSV.`);

    const pasajeNumbers = pasajesCSV.map(item => item.pasaje);

    // Buscar en la base de datos
    const dbTickets = await TicketEvent.findAll({
      where: {
        ticket_number: {
          [Op.in]: pasajeNumbers
        }
      }
    });

    const dbMap = new Map();
    dbTickets.forEach(t => dbMap.set(t.ticket_number, t));

    const encontrados = [];
    const noEncontrados = [];

    pasajesCSV.forEach(item => {
      if (dbMap.has(item.pasaje)) {
        encontrados.push({
          pasaje: item.pasaje,
          dbRecord: dbMap.get(item.pasaje)
        });
      } else {
        noEncontrados.push(item.pasaje);
      }
    });

    console.log('\n========================================');
    console.log(`✅ ENCONTRADOS (${encontrados.length}):`);
    console.log('========================================');
    if (encontrados.length === 0) {
      console.log('Ningún registro fue encontrado.');
    } else {
      encontrados.forEach(e => {
        console.log(` - Pasaje: ${e.pasaje} | ID DB: ${e.dbRecord.id} | Cliente: ${e.dbRecord.first_name} ${e.dbRecord.last_name} | Origen: ${e.dbRecord.origen_transaccion} | Agencia Delta: ${e.dbRecord.agencia_delta}`);
      });
    }

    console.log('\n========================================');
    console.log(`❌ NO ENCONTRADOS (${noEncontrados.length}):`);
    console.log('========================================');
    if (noEncontrados.length === 0) {
      console.log('Todos los registros se encontraron en la base de datos.');
    } else {
      noEncontrados.forEach(p => console.log(` - Pasaje: ${p}`));
    }

    console.log('\n========================================');
    console.log(`RESUMEN: Total CSV: ${pasajesCSV.length} | Encontrados: ${encontrados.length} | No Encontrados: ${noEncontrados.length}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error realizando la comparación:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

matchTickets();

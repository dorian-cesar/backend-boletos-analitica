require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const sequelize = require('../config/db');
const TicketEvent = require('../models/TicketEvent');

function parseMonto(val) {
  if (!val) return 0;
  // Eliminar puntos de miles y espacios, ej: "130.000" -> 130000
  const clean = val.toString().replace(/\./g, '').replace(/,/g, '.').trim();
  return parseFloat(clean) || 0;
}

function parseAsiento(val) {
  if (!val) return '';
  return val.toString().trim();
}

async function matchDetailed() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conectado a MySQL...');

    const csvPath = path.join(__dirname, '..', 'Liquidacion 01-07 al 11-07 .csv');
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

    const pasajesCSV = [];

    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',');
      const pasaje = columns[0] ? columns[0].trim() : '';

      if (pasaje && pasaje.toUpperCase() !== 'TOTAL' && !isNaN(pasaje)) {
        const tarifa = parseMonto(columns[4]);
        const importe = parseMonto(columns[6]);
        const asiento = parseAsiento(columns[10]);

        pasajesCSV.push({
          linea: i + 1,
          pasaje: pasaje,
          tarifa: tarifa,
          importe: importe,
          asiento: asiento,
          rawLine: lines[i]
        });
      }
    }

    const pasajeNumbers = pasajesCSV.map(item => item.pasaje);

    const dbTickets = await TicketEvent.findAll({
      where: {
        ticket_number: {
          [Op.in]: pasajeNumbers
        }
      }
    });

    const dbMap = new Map();
    dbTickets.forEach(t => dbMap.set(t.ticket_number, t));

    const concuerdanTodo = [];
    const discrepancias = [];

    pasajesCSV.forEach(csvItem => {
      if (dbMap.has(csvItem.pasaje)) {
        const dbRec = dbMap.get(csvItem.pasaje);

        const dbAsiento = parseAsiento(dbRec.seat_number);
        // Comparar con seat_price, total_booking_price o payment_amount
        const dbMontoSeat = parseFloat(dbRec.seat_price) || 0;
        const dbMontoTotal = parseFloat(dbRec.total_booking_price) || 0;
        const dbMontoPayment = parseFloat(dbRec.payment_amount) || 0;

        const coincideAsiento = (csvItem.asiento === dbAsiento);
        const coincideMonto = (csvItem.importe === dbMontoSeat || csvItem.importe === dbMontoTotal || csvItem.importe === dbMontoPayment);

        if (coincideAsiento && coincideMonto) {
          concuerdanTodo.push({
            pasaje: csvItem.pasaje,
            asiento: csvItem.asiento,
            monto: csvItem.importe,
            dbRec
          });
        } else {
          discrepancias.push({
            pasaje: csvItem.pasaje,
            csvItem,
            dbRec,
            coincideAsiento,
            coincideMonto,
            dbAsiento,
            dbMontoSeat,
            dbMontoTotal,
            dbMontoPayment
          });
        }
      }
    });

    console.log('\n========================================');
    console.log(`✅ COINCIDENCIA EXACTA (Pasaje + Monto + Asiento): ${concuerdanTodo.length}`);
    console.log('========================================');
    concuerdanTodo.forEach(item => {
      console.log(` - Pasaje: ${item.pasaje} | Asiento: ${item.asiento} | Monto: ${item.monto.toLocaleString('es-PY')} Gs.`);
    });

    if (discrepancias.length > 0) {
      console.log('\n========================================');
      console.log(`⚠️ COINCIDE PASAJE PERO HAY DIFERENCIAS (${discrepancias.length}):`);
      console.log('========================================');
      discrepancias.forEach(d => {
        console.log(`\n 📍 Pasaje: ${d.pasaje}`);
        console.log(`    CSV -> Asiento: "${d.csvItem.asiento}" | Monto Importe: ${d.csvItem.importe.toLocaleString('es-PY')} Gs.`);
        console.log(`    DB  -> Asiento: "${d.dbAsiento}" | seat_price: ${d.dbMontoSeat.toLocaleString('es-PY')} Gs. | total_booking_price: ${d.dbMontoTotal.toLocaleString('es-PY')} Gs.`);
        console.log(`    Coincide Asiento? ${d.coincideAsiento ? 'SI ✅' : 'NO ❌'}`);
        console.log(`    Coincide Monto?   ${d.coincideMonto ? 'SI ✅' : 'NO ❌'}`);
      });
    } else {
      console.log('\n🎉 ¡Todos los 14 registros encontrados coinciden perfectamente en Monto y Asiento!');
    }

    console.log('\n========================================\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

matchDetailed();

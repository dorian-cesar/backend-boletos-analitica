require('dotenv').config();
const { Op } = require('sequelize');
const sequelize = require('../config/db');
const TicketEvent = require('../models/TicketEvent');

async function updateAgenciaDelta() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conectado a la base de datos MySQL...');

    // 1. Actualizar a 'B02' si origen_transaccion es 'WEB' (insensible a mayúsculas/minúsculas)
    const [updatedWeb] = await TicketEvent.update(
      { agencia_delta: 'B02' },
      {
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('origen_transaccion')),
          'web'
        ),
      }
    );
    console.log(`✅ ${updatedWeb} registros actualizados a 'B02' (origen_transaccion = 'web')`);

    // 2. Actualizar a 'B01' si origen_transaccion empieza con 'totem' (insensible a mayúsculas/minúsculas)
    const [updatedTotem] = await TicketEvent.update(
      { agencia_delta: 'B01' },
      {
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('origen_transaccion')),
          { [Op.like]: 'totem%' }
        ),
      }
    );
    console.log(`✅ ${updatedTotem} registros actualizados a 'B01' (origen_transaccion empieza con 'totem')`);

    console.log('🎉 Proceso completado con éxito.');
  } catch (error) {
    console.error('❌ Error al actualizar los registros:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

updateAgenciaDelta();

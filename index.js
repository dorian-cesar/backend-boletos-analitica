// Importar dependencias
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde otros dominios
app.use(express.json()); // Permite que tu app entienda JSON

// Ruta de ejemplo (Endpoint)
app.get('/', (req, res) => {
  res.json({ mensaje: "¡Backend funcionando con Node y Express!" });
});

app.use('/api/tickets', ticketRoutes);

// Probar conexión y sincronizar
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tablas sincronizadas y conectado a MySQL');
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch(err => console.log('Error al sincronizar la DB:', err));
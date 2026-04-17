const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TicketEvent = sequelize.define('TicketEvent', {
  booking_reference: { type: DataTypes.STRING(20), allowNull: false },
  connection_id: DataTypes.STRING(20),
  trip_type: DataTypes.ENUM('one-way', 'round-trip'),
  direction: DataTypes.ENUM('outbound', 'return'),
  first_name: DataTypes.STRING(100),
  last_name: DataTypes.STRING(100),
  document_number: DataTypes.STRING(50),
  document_type_code: DataTypes.STRING(10),
  document_type_name: DataTypes.STRING(50),
  email: DataTypes.STRING(150),
  phone: DataTypes.STRING(50),
  seat_id: DataTypes.STRING(20),
  seat_number: { type: DataTypes.STRING(10) },
  seat_row: DataTypes.INTEGER,
  seat_column: DataTypes.INTEGER,
  seat_floor: DataTypes.INTEGER,
  seat_type: DataTypes.STRING(20),
  seat_status: DataTypes.STRING(20),
  quality_code: DataTypes.STRING(10),
  trip_id: { type: DataTypes.STRING(20) },
  origin_id: DataTypes.STRING(10),
  destination_id: DataTypes.STRING(10),
  origin_title: DataTypes.STRING(150),
  destination_title: DataTypes.STRING(150),
  departure_date: DataTypes.DATEONLY,
  departure_time: DataTypes.TIME,
  arrival_time: DataTypes.TIME,
  bus_type: DataTypes.STRING(50),
  company: DataTypes.STRING(50),
  seat_price: DataTypes.INTEGER,
  total_booking_price: DataTypes.INTEGER,
  payment_status: DataTypes.ENUM('pending', 'completed', 'failed')
}, {
  tableName: 'ticket_events',
  timestamps: false // 'created_at' lo maneja la DB por defecto
});

module.exports = TicketEvent;


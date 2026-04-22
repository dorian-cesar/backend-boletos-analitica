const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const TicketEvent = sequelize.define(
  "TicketEvent",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    // 🧾 Identificación
    ticket_number: {
      type: DataTypes.STRING(20),
      unique: "unique_ticket",
    },
    connection_id: DataTypes.STRING(20),

    // 👤 Pasajero
    first_name: DataTypes.STRING(100),
    last_name: DataTypes.STRING(100),
    document_number: DataTypes.STRING(50),
    document_type_code: DataTypes.STRING(50),
    document_type_name: DataTypes.STRING(50),
    email: DataTypes.STRING(150),
    phone: DataTypes.STRING(50),
    occupation: DataTypes.STRING(100),
    birth_date: DataTypes.DATEONLY,
    gender: DataTypes.STRING(10),
    nationality: DataTypes.STRING(10),
    country: DataTypes.STRING(10),

    // 🪑 Asiento
    seat_number: DataTypes.STRING(10),
    seat_type: DataTypes.STRING(20),
    seat_status: DataTypes.STRING(20),
    quality_code: DataTypes.STRING(10),

    // 🚌 Viaje
    trip_id: DataTypes.STRING(20),
    origin_id: DataTypes.STRING(10),
    destination_id: DataTypes.STRING(10),
    origin_title: DataTypes.STRING(150),
    destination_title: DataTypes.STRING(150),

    departure_date: DataTypes.DATEONLY,
    departure_time: DataTypes.TIME,
    arrival_date: DataTypes.DATEONLY,
    arrival_time: DataTypes.TIME,
    duration: DataTypes.STRING(20),

    bus_type: DataTypes.STRING(50),
    company: DataTypes.STRING(50),

    // 💰 Precios
    seat_price: DataTypes.INTEGER,
    total_booking_price: DataTypes.INTEGER,

    // 💳 Pago
    payment_status: DataTypes.ENUM("pending", "completed", "failed"),
    payment_amount: DataTypes.DECIMAL(10, 2),
    payment_paid: DataTypes.BOOLEAN,
    payment_token: DataTypes.STRING(100),
    payment_hash: DataTypes.STRING(100),

    // 🧠 Metadata
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "ticket_events",
    timestamps: false,
    indexes: [
      {
        name: "unique_seat_trip",
        unique: true,
        fields: ["trip_id", "seat_number"],
      },
    ],
  },
);

module.exports = TicketEvent;

const TicketEvent = require('../models/TicketEvent');

exports.getAll = async (req, res) => {
  try {
    const tickets = await TicketEvent.findAll();
    res.json(tickets);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const ticket = await TicketEvent.findByPk(req.params.id);
    ticket ? res.json(ticket) : res.status(404).json({ error: "No encontrado" });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const ticket = await TicketEvent.create(req.body);
    res.status(201).json(ticket);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await TicketEvent.update(req.body, { where: { id: req.params.id } });
    updated ? res.json({ msg: "Actualizado" }) : res.status(404).json({ error: "No encontrado" });
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await TicketEvent.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ msg: "Eliminado" }) : res.status(404).json({ error: "No encontrado" });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

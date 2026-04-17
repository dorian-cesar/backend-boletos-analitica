const express = require('express');
const router = express.Router();
const ticketCtrl = require('../controllers/ticketController');

router.get('/', ticketCtrl.getAll);
router.get('/:id', ticketCtrl.getOne);
router.post('/', ticketCtrl.create);
router.put('/:id', ticketCtrl.update);
router.delete('/:id', ticketCtrl.delete);

module.exports = router;


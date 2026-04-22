const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", authCtrl.login);
router.get("/validate", authMiddleware, authCtrl.validateToken);

module.exports = router;

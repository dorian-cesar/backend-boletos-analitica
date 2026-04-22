const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }

  res.status(401).json({ error: "Credenciales inválidas" });
};

exports.validateToken = (req, res) => {
  // Si llega aquí, es porque authMiddleware ya validó el token exitosamente
  res.json({ 
    valid: true, 
    user: req.user 
  });
};

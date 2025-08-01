const jwt = require("jsonwebtoken");
const JWT_SECRET = "NITT@123"; 

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided or invalid format." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token." });
  }
}

module.exports = verifyToken;


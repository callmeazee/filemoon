const jwt = require("jsonwebtoken");

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7);
  return req.body.token;
};

const verifyToken = async (req, res) => {
  try {
    const payload = await jwt.verify(getTokenFromRequest(req), process.env.JWT_SECRET);
    res.status(200).json(payload);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const requireAuth = async (req, res, next) => {
  try {
    req.user = await jwt.verify(getTokenFromRequest(req), process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  verifyToken,
  requireAuth,
};

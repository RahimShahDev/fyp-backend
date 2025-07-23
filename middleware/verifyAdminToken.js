const jwt = require('jsonwebtoken');

function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Incoming Authorization Header:", req.headers.authorization);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // const decoded = jwt.verify(token, 'admin_secret_key'); // must match the one used during login
    const decoded = jwt.verify(token, 'your_admin_secret');
    req.admin = decoded; // attach decoded info to request
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json(
      { 
        error: 'Invalid or expired token.',
        msg: err.message,
      }
  );
  }
}

module.exports = verifyAdminToken;

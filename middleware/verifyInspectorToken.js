// const jwt = require('jsonwebtoken');

// function verifyInspectorToken(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Access denied. No token provided.' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, 'inspector_secret_key');
//     req.inspector = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: 'Invalid or expired token.' });
//   }
// }

// module.exports = verifyInspectorToken;


// const jwt = require("jsonwebtoken");


// module.exports = function verifyInspectorToken(req, res, next) {
//   const authHeader = req.headers.authorization || "";
//   const token = authHeader.split(" ")[1];

//   if (!token) return res.status(401).json({ error: "No token provided" });

//   try {
//     // ↓ use the SAME secret that you used when signing
//     const decoded = jwt.verify(token, "inspector_secret_key");
//     req.inspectorId = decoded.id;
//     next();
//   } catch (err) {
//     console.error("JWT verification failed:", err.message);
//     return res.status(403).json({ error: "Invalid or expired token." });
//   }
// };



// middleware/verifyInspectorToken.js
const jwt = require("jsonwebtoken");
const INSPECTOR_JWT_SECRET = "inspector_secret_key"; // identical

module.exports = (req, res, next) => {
  const token = (req.headers.authorization || "").split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, INSPECTOR_JWT_SECRET);
    req.inspectorId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

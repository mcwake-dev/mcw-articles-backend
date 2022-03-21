const jwt = require("jsonwebtoken");

module.exports = (subject) =>
  jwt.sign({ username: subject }, process.env.JWT_PRIVATE_KEY, {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    subject,
    expiresIn: process.env.JWT_EXPIRES,
    algorithm: process.env.JWT_ALGORITHM,
  });


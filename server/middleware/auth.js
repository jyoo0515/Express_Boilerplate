const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user, password) => {
  if (user.validatePassword(password)) {
    const token = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return token;
  }
};

const verifyToken = (req, res, next) => {
  const token = req.cookies["access_token"];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
    if (err) return res.status(403);

    req.user = authData;
    next();
  });
};

const auth = { generateToken, verifyToken };
module.exports = auth;

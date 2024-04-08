const jwt = require("jsonwebtoken");

// Checks if token is valid - if it is, it returns a verified tokens which contains payload of the user - if not, it returns null.
function verifyToken(res, req) {
  try {
    if (req.cookies.token != null) {
      return jwt.verify(req.cookies.token, process.env.JWTSECRET);
    }
  } catch (error) {
    res.clearCookie("token");
    return null;
  }
}

module.exports = { verifyToken };

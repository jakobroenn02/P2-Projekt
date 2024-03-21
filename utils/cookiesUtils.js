const jwt = require("jsonwebtoken");
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

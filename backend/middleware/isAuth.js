const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  const token = req.session?.token || req.cookies?.token;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      res.clearCookie("token");
      if (req.session) {
        req.session.token = null;
      }
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired!" });
    }
    return res.status(401).json({ message: "Invalid token!" });
  }
};

module.exports = isAuth;

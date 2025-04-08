import jwt from "jsonwebtoken";
import AuthenticationError from "../exceptions/AuthenthicationError.js";
import AuthorizationError from "../exceptions/AuthorizationError.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    throw new AuthenticationError("Invalid token");
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      throw new AuthorizationError("Invalid token or token has expired");
    }
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  const userRole = req.role;
  if (userRole != "admin") {
    throw new AuthorizationError("Access Forbidden");
  }

  next();
};

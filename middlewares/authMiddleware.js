import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  const userRole = req.role;
  if (userRole != "admin") {
    return res
      .status(403)
      .json({ message: "You don't have permission to access this resource" });
  }

  next();
};

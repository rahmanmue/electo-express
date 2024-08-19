export const verifyAdmin = (req, res, next) => {
  const userRole = req.role;
  if (userRole != "admin") {
    return res
      .status(403)
      .json({ message: "You don't have permission to access this resource" });
  }

  next();
};

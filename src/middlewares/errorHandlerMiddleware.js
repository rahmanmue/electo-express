import logger from "../utils/logger.js";
import ClientError from "../exceptions/ClientError.js";

const handleErrorMiddleware = (err, req, res, next) => {
  if (err instanceof ClientError) {
    logger.warn(err.message);
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  logger.error(err.message);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};

export default handleErrorMiddleware;

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import db from "../config/database.js";
import router from "../routes/index.js";
import User from "../models/UserModel.js";
import Dapil from "../models/DapilModel.js";
import SuaraParpol from "../models/SuaraParpolModel.js";
import Profile from "../models/ProfileModel.js";
import PasswordResetToken from "../models/ResetPasswordToken.js";
import "../models/Association.js";
import logger from "../utils/logger.js";
import handleErrorMiddleware from "../middlewares/errorHandlerMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(cookieParser());
app.use(morgan("combined"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is where it all begins 🚀🚀");
});

app.use(router);

app.use(handleErrorMiddleware);

(async () => {
  try {
    await db.sync();
    logger.info("Database connected");
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error(err.message);
  }
})();

export default app;

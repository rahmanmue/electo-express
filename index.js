import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./src/config/database.js";
import User from "./src/models/UserModel.js";
import Dapil from "./src/models/DapilModel.js";
import SuaraParpol from "./src/models/SuaraParpolModel.js";
import Profile from "./src/models/ProfileModel.js";
import PasswordResetToken from "./src/models/ResetPasswordToken.js";
import "./src/models/Association.js";
import router from "./src/routes/index.js";
import handleErrorMiddleware from "./src/middlewares/errorHandlerMiddleware.js";
import morgan from "morgan";
import logger from "./src/utils/logger.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());
app.use(morgan("combined"));
app.use(express.json());
app.use(router);
app.use(handleErrorMiddleware);

const main = async () => {
  try {
    // await db.sync();
    logger.info("Database connected");
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error(err.message);
  }
};

main();

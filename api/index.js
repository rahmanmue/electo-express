import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./src/config/database.js";
import router from "./src/routes/index.js";
import User from "./src/models/UserModel.js";
import Dapil from "./src/models/DapilModel.js";
import SuaraParpol from "./src/models/SuaraParpolModel.js";
import Profile from "./src/models/ProfileModel.js";
import PasswordResetToken from "./src/models/ResetPasswordToken.js";
import "./src/models/Association.js";
import logger from "../src/utils/logger.js";
import handleErrorMiddleware from "../src/middlewares/errorHandlerMiddleware.js";
import morgan from "morgan";

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
app.use(handleErrorMiddleware);

app.get("/", (req, res) => {
  res.send("This is where it all begins 🚀🚀");
});

app.use(router);

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

import express from "express";
import db from "../config/database.js";
import router from "../routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import User from "../models/UserModel.js";
import Dapil from "../models/DapilModel.js";
import SuaraParpol from "../models/SuaraParpolModel.js";
import Profile from "../models/ProfileModel.js";
import PasswordResetToken from "../models/ResetPasswordToken.js";
import "../models/Association.js";

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
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is where it all begins 🚀🚀");
});

app.use(router);

(async () => {
  try {
    await db.sync();
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
})();

export default app;

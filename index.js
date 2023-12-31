import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import Users from "./models/UserModel.js";
import Dapil from "./models/DapilModel.js";
import SuaraParpol from "./models/SuaraParpolModel.js";

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log("Database Connected....");

  //   menggenerate otomatis db
  //   karena sudah dibuat komenkan lagi
  //   await Users.sync();
  // await Dapil.sync();
  // await SuaraParpol.sync();
} catch (error) {
  console.error(error);
}

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () => console.log("Server running at port 5000"));

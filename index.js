import express from "express";
import db from "./config/database.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import User from "./models/UserModel.js";
import Dapil from "./models/DapilModel.js";
import SuaraParpol from "./models/SuaraParpolModel.js";
import Profile from "./models/ProfileModel.js";
import PasswordResetToken from "./models/ResetPasswordToken.js";

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
app.use(express.json());
app.use(router);

const checkAndCreateTable = async (model) => {
  const tableName = model.getTableName();
  const tableExists = await db
    .getQueryInterface()
    .showAllSchemas({ where: { table_name: tableName } });
  if (!tableExists.length) {
    await model.sync({ alter: true });
    console.log(`Table ${tableName} created.`);
  } else {
    console.log(`Table ${tableName} already exists.`);
  }
};

(async () => {
  try {
    await db.authenticate();
    // await checkAndCreateTable(User);
    // await checkAndCreateTable(Dapil);
    // await checkAndCreateTable(SuaraParpol);
    // await checkAndCreateTable(Profile);
    // await checkAndCreateTable(PasswordResetToken);
    console.log("Database Connected...");
    app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
})();

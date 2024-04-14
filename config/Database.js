import { Sequelize } from "sequelize";

const db = new Sequelize("db_sl_refresh_token", "postgres", "postgres123", {
  host: "localhost",
  dialect: "postgres",
});

export default db;

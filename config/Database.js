import { Sequelize } from "sequelize";

const db = new Sequelize("be-sl", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;

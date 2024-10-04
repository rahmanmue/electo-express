import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

// Local
// const db = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//   }
// );

// Clever Cloud
const db = new Sequelize(process.env.POSTGRESQL_URI, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true, // Menentukan apakah SSL diperlukan atau tidak
      rejectUnauthorized: false, // Biasanya diatur ke false di beberapa host
    },
  },
  pool: {
    max: 10, // Maksimal 10 koneksi bersamaan
    min: 2, // Minimal 2 koneksi
    acquire: 30000, // Timeout 30 detik untuk mendapatkan koneksi
    idle: 10000, // Timeout 10 detik untuk koneksi idle
  },
});

export default db;

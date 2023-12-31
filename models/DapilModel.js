import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Dapil = db.define(
  "dapil",
  {
    daerah_pemilihan: {
      type: DataTypes.STRING,
    },
    kabupaten_kota: {
      type: DataTypes.STRING,
    },
    provinsi: {
      type: DataTypes.STRING,
    },
    tahun: {
      type: DataTypes.INTEGER,
    },
    alokasi_kursi: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Dapil;

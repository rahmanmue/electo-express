import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const SuaraParpol = db.define(
  "suara_parpol",
  {
    nama_parpol: {
      type: DataTypes.STRING,
    },
    total_suara_sah: {
      type: DataTypes.INTEGER,
    },
    daerah_pemilihan_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

export default SuaraParpol;

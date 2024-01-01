import { Sequelize } from "sequelize";
import Dapil from "./DapilModel.js";
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
      references: {
        model: Dapil,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Dapil.hasMany(SuaraParpol, {
  foreignKey: "daerah_pemilihan_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default SuaraParpol;

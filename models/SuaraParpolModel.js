import { Sequelize } from "sequelize";
import Dapil from "./DapilModel.js";
import db from "../config/database.js";

const SuaraParpol = db.define(
  "suara_parpol",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    },
    nama_parpol: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    total_suara_sah: {
      type: Sequelize.INTEGER,
    },
    daerah_pemilihan_id: {
      type: Sequelize.UUID,
      references: {
        model: Dapil,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Dapil.hasMany(SuaraParpol, {
  foreignKey: "daerah_pemilihan_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default SuaraParpol;

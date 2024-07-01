import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";

const Dapil = db.define(
  "dapil",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    },
    daerah_pemilihan: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    kabupaten_kota: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    provinsi: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tahun: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    alokasi_kursi: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Dapil;

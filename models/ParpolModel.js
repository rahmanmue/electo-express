import { Sequelize } from "sequelize";
import db from "../config/database";

const Parpol = db.define(
  "parpol",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Parpol;

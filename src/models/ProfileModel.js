import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";

const Profile = db.define(
  "profile",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    },
    user_id: {
      type: Sequelize.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    full_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    avatar: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Profile;

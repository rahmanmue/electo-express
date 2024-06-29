import { Sequelize } from "sequelize";
import db from "../config/Database.js";
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
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

User.hasOne(Profile, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Profile.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Profile;

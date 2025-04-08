import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";

const ResetPasswordToken = db.define(
  "password_reset_tokens",
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
      allowNull: false,
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    expires_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

User.hasOne(ResetPasswordToken, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ResetPasswordToken.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default ResetPasswordToken;

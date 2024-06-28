import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import validator from "validator";

const User = db.define(
  "user",
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
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: "Password minimal 6 karakter",
        },
        isValidPassword(value) {
          if (!validator.isStrongPassword(value)) {
            throw new Error(
              "Password harus mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus"
            );
          }
        },
      },
    },
    role: {
      type: Sequelize.ENUM("user", "admin"),
      defaultValue: "user",
    },
    refreshToken: {
      type: Sequelize.TEXT,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "user_email_index", // Nama indeks
      },
    ],
  }
);

export default User;

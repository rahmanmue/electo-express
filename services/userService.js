import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const findAllUsers = async () => {
  return await User.findAll({
    attributes: ["id", "name", "email"],
  });
};

export const findUserById = async (userId) => {
  return await User.findOne({
    attributes: ["id", "name", "email"],
    where: { id: userId },
  });
};

export const updateUser = async (userId, data) => {
  if (data.password) {
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
  }

  return await User.update(data, {
    where: { id: userId },
  });
};

export const deleteUser = async (userId) => {
  return await User.destroy({
    where: { id: userId },
  });
};

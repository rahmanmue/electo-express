import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const findAllUsers = async () => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role"],
  });

  return {
    status: 200,
    data: users,
  };
};

export const findUserById = async (userId) => {
  const user = await User.findOne({
    attributes: ["id", "name", "email", "role"],
    where: { id: userId },
  });

  return {
    status: 200,
    data: user,
  };
};

export const updateUser = async (userId, data) => {
  if (data.password) {
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
  }

  await User.update(data, {
    where: { id: userId },
  });

  return {
    status: 200,
    message: "User updated successfully",
  };
};

export const deleteUser = async (userId) => {
  await User.destroy({
    where: { id: userId },
  });

  return {
    status: 204,
    message: "User deleted successfully",
  };
};

import User from "../models/UserModel.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

export const findAllUsers = async (page = 1, pageSize = 5) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role"],
    offset: offset,
    limit: limit,
  });

  const totalItems = await User.count();

  return {
    status: 200,
    data: users,
    currentPage: page,
    pageSize: pageSize,
    totalItems: totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
};

export const filterUserByKeyword = async (keyword, page = 1, pageSize = 5) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const query = {
    attributes: ["id", "name", "email", "role"],
    offset: offset,
    limit: limit,
    where: {
      [Op.or]: {
        name: {
          [Op.iLike]: `%${keyword}%`,
        },
      },
    },
  };

  const users = await User.findAll(query);
  const totalItems = await User.count({ where: query.where });

  return {
    status: 200,
    data: users,
    currentPage: page,
    pageSize: pageSize,
    totalItems: totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
};

export const findUserByRToken = async (refreshToken) => {
  const user = await User.findOne({
    attributes: ["id", "name", "email", "role"],
    where: { refreshToken: refreshToken },
  });

  return {
    status: 200,
    data: user,
  };
};

export const updateUser = async (data) => {
  if (data.password) {
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
  }

  await User.update(data, {
    where: { id: data.id },
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

import User from "../models/UserModel.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import NotFoundError from "../exceptions/NotFoundError.js";
import logger from "../utils/logger.js";

export const findAllUsers = async (page = 1, pageSize = 5) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role"],
    offset: offset,
    limit: limit,
  });

  const totalItems = await User.count();

  logger.info("success get all users");

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

  logger.info("success get user by keyword");

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

  if (!user) throw new NotFoundError("User not found");

  logger.info("success get user");

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

  const user = await User.findOne({
    where: { id: data.id },
  });

  if (!user) throw new NotFoundError("User not found");

  await user.update(data);

  logger.info("success updated user");

  return {
    status: 200,
    message: "User updated successfully",
  };
};

export const deleteUser = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
  });

  if (!user) throw new NotFoundError("User not found");

  await user.destroy();

  logger.info("success deleted user");

  return {
    status: 204,
    message: "User deleted successfully",
  };
};

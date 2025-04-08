import {
  findAllUsers,
  findUserByRToken,
  filterUserByKeyword,
  updateUser,
  deleteUser,
} from "../services/UserService.js";
import AuthValidator from "../validator/AuthValidator.js";
import UserValidator from "../validator/UserValidator.js";

export const getAllUsers = async (req, res, next) => {
  try {
    UserValidator.validateQuery(req.query);
    const { refreshToken } = req.cookies;
    const { page, pageSize } = req.query;
    const users = await findAllUsers(page, pageSize);
    res.status(users.status).json(users);
  } catch (error) {
    next(error);
  }
};

export const searchUser = async (req, res, next) => {
  try {
    UserValidator.validateQuery(req.query);
    const { page, pageSize, keyword } = req.query;
    const users = await filterUserByKeyword(keyword, page, pageSize);
    res.status(users.status).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserByToken = async (req, res, next) => {
  try {
    AuthValidator.validateRefreshToken(req.cookies);
    const user = await findUserByRToken(req.cookies.refreshToken);
    res.status(user.status).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    UserValidator.validateParams(req.body.id);
    UserValidator.validateUser(req.body);
    const updated = await updateUser(req.body);
    res.status(updated.status).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    UserValidator.validateParams(req.params.id);
    const deleted = await deleteUser(req.params.id);
    res.sendStatus(deleted.status);
  } catch (error) {
    next(error);
  }
};

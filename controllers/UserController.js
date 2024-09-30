import {
  findAllUsers,
  findUserByRToken,
  filterUserByKeyword,
  updateUser,
  deleteUser,
} from "../services/UserService.js";

export const getAllUsers = async (req, res) => {
  try {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const users = await findAllUsers(page, pageSize);
    res.status(users.status).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUser = async (req, res) => {
  try {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const keyword = req.query.keyword;
    const users = await filterUserByKeyword(keyword, page, pageSize);
    res.status(users.status).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserByToken = async (req, res) => {
  try {
    const user = await findUserByRToken(req.cookies.refreshToken);
    res.status(user.status).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const updated = await updateUser(req.body);
    res.status(updated.status).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    res.sendStatus(deleted.status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

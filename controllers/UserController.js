import {
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
} from "../services/UserService.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    res.status(users.status).json(users.data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    res.status(user.status).json(user.data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const updated = await updateUser(req.body.id, req.body);
    res.status(updated.status).json(updated.message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    res.status(deleted.status).json(deleted.message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

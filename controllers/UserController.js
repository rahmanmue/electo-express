import {
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
} from "../services/userService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = findUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateUserById = async (req, res) => {
  const { name, email, password } = req.body;
  let data = { name, email, password };

  try {
    await updateUser(req.params.id, data);
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

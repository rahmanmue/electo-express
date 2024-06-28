import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/UserController.js";
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/authController.js";
import {
  createDapil,
  getAllDapil,
  getDapilById,
  updateDapilById,
  deleteDapilById,
} from "../controllers/DapilController.js";
import {
  createBulkSuaraParpol,
  getSuaraParpolByDapilId,
  getSuaraParpolById,
  updateSuaraParpolById,
  deleteSuaraParpolById,
  getCalculationSuaraParpolByDapilId,
} from "../controllers/SuaraParpolController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh-token", refreshToken);
router.delete("/logout", logout);

router.get("/users", getAllUsers);
router.get("/users/:id", verifyToken, getUserById);
router.patch("/users/:id", verifyToken, updateUserById);
router.delete("/users/:id", verifyToken, deleteUserById);

router.get("/dapil/:user_id", getAllDapil);
router.get("/detail-dapil/:id", getDapilById);
router.post("/dapil", verifyToken, createDapil);
router.put("/dapil/:id", verifyToken, updateDapilById);
router.delete("/dapil/:id", verifyToken, deleteDapilById);

router.get("/parpol/dapil/:dapil_id", getSuaraParpolByDapilId);
router.get("/parpol/suara/:id", getSuaraParpolById);
router.put("/parpol/suara/:id", verifyToken, updateSuaraParpolById);
router.delete("/parpol/suara/:id", verifyToken, deleteSuaraParpolById);
router.post("/parpol", verifyToken, createBulkSuaraParpol);

router.post("/hitung/:kursi", getCalculationSuaraParpolByDapilId);

export default router;

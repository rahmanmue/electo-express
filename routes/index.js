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
  getCalculationSuaraParpol,
} from "../controllers/SuaraParpolController.js";
import {
  updateProfileUser,
  getImageAvatar,
} from "../controllers/ProfileController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/refresh-token", refreshToken);
router.delete("/auth/logout", logout);

router.get("/users", getAllUsers);
router.get("/users/:id", verifyToken, getUserById);
router.patch("/users", verifyToken, updateUserById);
router.delete("/users/:id", verifyToken, deleteUserById);

router.get("/dapil", getAllDapil);
router.get("/dapil/:id", verifyToken, getDapilById);
router.post("/dapil", verifyToken, createDapil);
router.put("/dapil", verifyToken, updateDapilById);
router.delete("/dapil/:id", verifyToken, deleteDapilById);

router.post("/calculation/:seatCount", verifyToken, getCalculationSuaraParpol);

router.get("/parpol/dapil/:dapil_id", verifyToken, getSuaraParpolByDapilId);
router.get("/parpol/vote/:id", verifyToken, getSuaraParpolById);
router.put("/parpol/vote", verifyToken, updateSuaraParpolById);
router.delete("/parpol/vote/:id", verifyToken, deleteSuaraParpolById);
router.post("/parpol/vote", verifyToken, createBulkSuaraParpol);

router.put("/update-profile", upload.single("avatar"), updateProfileUser);
router.get("/avatar/:avatar", getImageAvatar);

export default router;

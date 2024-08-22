import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/UserController.js";
import {
  loginGoogle,
  loginGoogleCallback,
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/AuthController.js";
import {
  createDapil,
  getAllDapil,
  searchDapil,
  getDapilById,
  updateDapilById,
  deleteDapilById,
} from "../controllers/DapilController.js";
import {
  getAllParpol,
  getParpolById,
  createParpol,
  updateParpolById,
  deleteParpolById,
} from "../controllers/ParpolController.js";
import {
  importFromExcel,
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
  getProfileUser,
} from "../controllers/ProfileController.js";
import {
  forgetPasswordUser,
  resetPasswordUser,
} from "../controllers/ResetPasswordController.js";

import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import uploadExcel from "../middlewares/uploadExcelMiddleware.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/refresh-token", refreshToken);
router.delete("/auth/logout", logout);

router.get("/users", getAllUsers);
router.get("/users/:id", verifyToken, getUserById);
router.patch("/users", verifyToken, updateUserById);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUserById);

router.get("/dapil", getAllDapil);
router.get("/dapil/search", verifyToken, searchDapil);
router.get("/dapil/:id", verifyToken, getDapilById);
router.post("/dapil", verifyToken, createDapil);
router.put("/dapil", verifyToken, updateDapilById);
router.delete("/dapil/:id", verifyToken, deleteDapilById);

// router.get("/parpol", getAllParpol);
// router.get("/parpol/:id", verifyToken, getParpolById);
// router.post("/parpol", verifyToken, verifyAdmin, createParpol);
// router.put("/parpol", verifyToken, updateParpolById);
// router.delete("/parpol/:id", verifyToken, deleteParpolById);

router.get("/calculation/:dapil_id", verifyToken, getCalculationSuaraParpol);

router.get("/parpol/dapil/:dapil_id", verifyToken, getSuaraParpolByDapilId);
router.get("/parpol/vote/:id", verifyToken, getSuaraParpolById);
router.put("/parpol/vote", verifyToken, updateSuaraParpolById);
router.delete("/parpol/vote/:id", verifyToken, deleteSuaraParpolById);
router.post("/parpol/vote", verifyToken, createBulkSuaraParpol);

router.put(
  "/update-profile",
  upload.single("avatar"),
  verifyToken,
  updateProfileUser
);

router.post("/import-excel", uploadExcel.single("document"), importFromExcel);

router.get("/avatar/:avatar", getImageAvatar);
router.get("/profile", verifyToken, getProfileUser);

router.post("/forget-password", forgetPasswordUser);
router.post("/reset-password/:token", resetPasswordUser);

router.get("/google", loginGoogle);

router.get("/google/callback", loginGoogleCallback);

export default router;

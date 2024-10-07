import express from "express";
import {
  getAllUsers,
  getUserByToken,
  searchUser,
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
  getAllDapilForHome,
  searchDapil,
  getDapilById,
  updateDapilById,
  deleteDapilById,
} from "../controllers/DapilController.js";
import {
  getAllParpol,
  getParpolById,
  createParpol,
  searchParpol,
  updateParpolById,
  deleteParpolById,
  downloadParpol,
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
  updateProfileFirebase,
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
import { uploadMemory } from "../middlewares/uploadMemoryMiddleware.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/refresh-token", refreshToken);
router.delete("/auth/logout", logout);

// router.get("/users", getAllUsers);
// router.get("/users/search", searchUser);
// router.get("/user", getUserByToken);
// router.patch("/users", updateUserById);
// router.delete("/users/:id", deleteUserById);

router.get("/users", verifyToken, getAllUsers);
router.get("/users/search", verifyToken, verifyAdmin, searchUser);
router.get("/user", verifyToken, getUserByToken);
router.patch("/users", verifyToken, updateUserById);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUserById);

// router.get("/dapil", getAllDapil);
// router.get("/dapil/search", searchDapil);
// router.get("/dapil/:id", getDapilById);
// router.post("/dapil", createDapil);
// router.put("/dapil", updateDapilById);
// router.delete("/dapil/:id", deleteDapilById);

router.get("/dapil", getAllDapil);
router.get("/dapil/search", verifyToken, searchDapil);
router.get("/dapil/:id", verifyToken, getDapilById);
router.post("/dapil", verifyToken, createDapil);
router.put("/dapil", verifyToken, updateDapilById);
router.delete("/dapil/:id", verifyToken, deleteDapilById);

// router.get("/parpol", getAllParpol);
// router.get("/parpol/search", searchParpol);
// router.get("/download-parpol", downloadParpol);
// router.get("/parpol/:id", getParpolById);
// router.post("/parpol", createParpol);
// router.put("/parpol", updateParpolById);
// router.delete("/parpol/:id", deleteParpolById);

router.get("/download-parpol", downloadParpol);
router.get("/parpol", getAllParpol);
router.get("/parpol/search", searchParpol);
router.get("/parpol/:id", verifyToken, verifyAdmin, getParpolById);
router.post("/parpol", verifyToken, verifyAdmin, createParpol);
router.put("/parpol", verifyToken, verifyAdmin, updateParpolById);
router.delete("/parpol/:id", verifyToken, verifyAdmin, deleteParpolById);

// router.get("/parpol/dapil/:dapil_id", getSuaraParpolByDapilId);
// router.get("/parpol/vote/:id", getSuaraParpolById);
// router.put("/parpol/vote", updateSuaraParpolById);
// router.delete("/parpol/vote/:id", deleteSuaraParpolById);
// router.post("/parpol/vote", createBulkSuaraParpol);

router.get("/parpol/dapil/:dapil_id", verifyToken, getSuaraParpolByDapilId);
router.get("/parpol/vote/:id", verifyToken, getSuaraParpolById);
router.put("/parpol/vote", verifyToken, updateSuaraParpolById);
router.delete("/parpol/vote/:id", verifyToken, deleteSuaraParpolById);
router.post("/parpol/vote", verifyToken, createBulkSuaraParpol);

router.get("/all-dapil", getAllDapilForHome);
router.get("/calculation/:dapil_id", getCalculationSuaraParpol);

// router.put("/update-profile", upload.single("avatar"), updateProfileUser);

router.put(
  "/update-profile",
  upload.single("avatar"),
  verifyToken,
  updateProfileUser
);

router.put(
  "/update-profile-firebase",
  uploadMemory.single("avatar"),
  verifyToken,
  updateProfileFirebase
);

router.post("/import-excel", uploadExcel.single("document"), importFromExcel);

// router.get("/profile", getProfileUser);
router.get("/profile", verifyToken, getProfileUser);
router.get("/avatar/:avatar", getImageAvatar);

router.post("/forget-password", forgetPasswordUser);
router.post("/reset-password/:token", resetPasswordUser);

router.get("/google", loginGoogle);
router.get("/google/callback", loginGoogleCallback);

export default router;
